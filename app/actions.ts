"use server";

import { DynamicSpecZ, type DynamicFormSpec } from "@/lib/validation";
import OpenAI from "openai";

const disallowed = [/ssn/i, /social\s*security/i, /bank/i, /routing/i];

const filterSpec = (spec: DynamicFormSpec): DynamicFormSpec => ({
  ...spec,
  fields: spec.fields.filter(f => !disallowed.some(rx => rx.test((f as any).label)))
});

export async function generateDynamicSpec(coreData: any, prompt: string, maxFields = 8) {
  const system = `Return ONLY JSON matching DynamicFormSpec. No file uploads. Prefer structured fields. Max ${maxFields} fields. Avoid PII (SSN, bank). 8th-grade reading level.`;
  const user = prompt ?? `You are assisting a rental assistance screener. Propose up to ${maxFields} targeted follow-ups that affect eligibility or award amount. Prefer structured fields. Avoid duplicates.`;
  const context = JSON.stringify({ core: coreData });

  const specJson = await callModelReturningJson({ system, user, context });
  const parsed = DynamicSpecZ.parse(filterSpec(specJson));
  
  return parsed;
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
  // If no API key, use mock data
  if (!process.env.OPENAI_API_KEY) {
    return {
      title: "Follow-ups for Rental Assistance",
      version: "1.0",
      rationale: "Demo mock: ask about eviction and utilities.",
      fields: [
        { 
          id: "eviction_status", 
          type: "radio", 
          label: "Have you received an eviction notice?", 
          required: true, 
          options: [ 
            { value: "none", label: "No" }, 
            { value: "pay_or_quit", label: "Pay or quit" }, 
            { value: "court_date", label: "Court date scheduled" } 
          ] 
        },
        { 
          id: "utilities_arrears", 
          type: "currency", 
          label: "How much do you currently owe for utilities?", 
          validations: { min: 0 } 
        },
        { 
          id: "priority_groups", 
          type: "checkbox-group", 
          label: "Do any of these apply?", 
          options: [ 
            { value: "dv", label: "Experienced domestic violence" }, 
            { value: "disability", label: "Household member has a disability" }, 
            { value: "veteran", label: "Veteran household" } 
          ] 
        }
      ]
    } satisfies DynamicFormSpec;
  }

  // Real OpenAI call
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: `${user}\n\nAPPLICANT_CONTEXT:\n${context}` }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2000,
  });

  const responseText = completion.choices[0].message.content || "{}";
  return JSON.parse(responseText);
}