"use server";

import { DynamicSpecZ, type DynamicFormSpec } from "@/lib/validation";
import OpenAI from "openai";

const disallowed = [/ssn/i, /social\s*security/i, /bank/i, /routing/i];

const filterSpec = (spec: DynamicFormSpec): DynamicFormSpec => ({
  ...spec,
  fields: spec.fields.filter((f) => !disallowed.some((rx) => rx.test((f as any).label))),
});

export async function generateDynamicSpec(
  coreData: any,
  prompt: string,
  maxFields = 8
): Promise<{ raw: unknown; spec: DynamicFormSpec | null; debug?: { request: unknown; response: unknown; content: string } }> {
  const system = `Return ONLY JSON matching DynamicFormSpec. No file uploads. Prefer structured fields. Max ${maxFields} fields. Avoid PII (SSN, bank). 8th-grade reading level.`;
  const user = prompt ?? `You are assisting a rental assistance screener. Propose up to ${maxFields} targeted follow-ups that affect eligibility or award amount. Prefer structured fields. Avoid duplicates.`;
  const context = JSON.stringify({ core: coreData });

  const { parsed: specJson, debug } = await callModelReturningJson({ system, user, context });

  // Try to parse; if invalid, return raw with spec=null so UI can show raw response
  const parsed = DynamicSpecZ.safeParse(specJson);
  if (parsed.success) {
    const filtered = filterSpec(parsed.data);
    return { raw: specJson, spec: filtered, debug };
  }

  return { raw: specJson, spec: null, debug };
}

async function callModelReturningJson({ 
  system, 
  user, 
  context 
}: { 
  system: string; 
  user: string; 
  context: string; 
}) {
  // If no API key, proceed and rely on API to error; UI will show failure
  // (No local mock fallback; raw response view is provided client-side.)

  // Real OpenAI call
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const requestPayload = {
    model: "gpt-5",
    messages: [
      { role: "system", content: system },
      { role: "user", content: `${user}\n\nAPPLICANT_CONTEXT:\n${context}` },
    ],
    response_format: { type: "json_object" },
  };

  console.log("[AI REQUEST] /generateDynamicSpec", {
    model: requestPayload.model,
    response_format: requestPayload.response_format,
    max_completion_tokens: requestPayload.max_completion_tokens,
    systemPreview: system.slice(0, 160),
    userPreview: user.slice(0, 160),
    contextPreview: context.slice(0, 200),
  });

  try {
    const completion = await openai.chat.completions.create(requestPayload as any);

    const responseText = completion.choices?.[0]?.message?.content ?? "";

    console.log("[AI RESPONSE] /generateDynamicSpec", {
      hasChoices: Array.isArray(completion.choices),
      firstFinishReason: completion.choices?.[0]?.finish_reason ?? null,
      contentLength: responseText.length,
      contentPreview: responseText.slice(0, 200),
    });

    let parsed: unknown = {};
    try {
      parsed = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("[AI RESPONSE PARSE ERROR]", e);
      parsed = {};
    }

    return {
      parsed,
      debug: {
        request: requestPayload,
        response: {
          id: completion.id,
          created: completion.created,
          model: completion.model,
          choicesMeta: completion.choices?.map((c) => ({ index: c.index, finish_reason: (c as any).finish_reason ?? null })),
        },
        content: responseText,
      },
    };
  } catch (error: any) {
    console.error("[AI ERROR] /generateDynamicSpec", error);
    return {
      parsed: {},
      debug: {
        request: requestPayload,
        response: { error: { message: error?.message ?? String(error), code: error?.code ?? null, param: error?.param ?? null } },
        content: "",
      },
    };
  }
}