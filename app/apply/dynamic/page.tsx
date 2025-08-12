"use client";

import { useState, useTransition, useEffect } from "react";
import type { DynamicFormSpec } from "@/lib/validation";
import { savePrompt, generateDynamicSpec, saveDynamicAnswers, getApplication } from "@/app/actions";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { useRouter } from "next/navigation";

export default function DynamicStep() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(
    "You are assisting a rental assistance screener. Propose up to 8 targeted follow-ups that affect eligibility or award amount. Focus on eviction status, utility arrears, priority populations, and documentation needs. Prefer structured fields over free text."
  );
  const [spec, setSpec] = useState<DynamicFormSpec | null>(null);
  const [existingAnswers, setExistingAnswers] = useState<Record<string, unknown> | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showJsonView, setShowJsonView] = useState(false);
  const [finalJson, setFinalJson] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const app = await getApplication();
      if (app) {
        if (app.prompt) setPrompt(app.prompt);
        if (app.dynamicSpec) setSpec(app.dynamicSpec as DynamicFormSpec);
        if (app.dynamicAnswers) setExistingAnswers(app.dynamicAnswers as Record<string, unknown>);
      }
    }
    loadData();
  }, []);

  const handleGenerateSpec = () => {
    startTransition(async () => {
      try {
        setError(null);
        const generatedSpec = await generateDynamicSpec(8);
        setSpec(generatedSpec);
      } catch (err) {
        setError("Failed to generate questions. Please try again.");
        console.error(err);
      }
    });
  };

  const handleSaveAnswers = async (answers: Record<string, unknown>) => {
    try {
      await saveDynamicAnswers(answers);
      
      // Get the complete application data for the final JSON view
      const app = await getApplication();
      if (app) {
        const completeForm = {
          core: app.core,
          dynamicQuestions: spec,
          dynamicAnswers: answers,
          metadata: {
            sessionId: app.sessionId,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
          }
        };
        setFinalJson(completeForm);
        setShowJsonView(true);
      }
    } catch (err) {
      setError("Failed to save answers. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {!showJsonView ? (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-gray-700">
              <strong>Demo Mode:</strong> This section generates AI-powered follow-up questions based on your previous answers. 
              Do not enter sensitive information.
            </p>
          </div>

          <section className="space-y-2">
            <label className="block text-sm font-medium">
              AI Prompt (Editable)
            </label>
            <p className="text-sm text-gray-600">
              Customize how the AI generates follow-up questions
            </p>
            <textarea
              className="w-full rounded border p-3 font-mono text-sm"
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onBlur={() => startTransition(() => savePrompt(prompt))}
            />
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={pending}
              onClick={handleGenerateSpec}
            >
              {pending ? "Generating..." : "Generate Questions"}
            </button>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {spec && (
            <section className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold">{spec.title}</h2>
                {spec.rationale && (
                  <p className="text-sm text-gray-600 mt-1">{spec.rationale}</p>
                )}
                {spec.warnings && spec.warnings.length > 0 && (
                  <div className="mt-2">
                    {spec.warnings.map((warning, idx) => (
                      <p key={idx} className="text-sm text-amber-600">
                        ⚠️ {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <DynamicFormRenderer
                spec={spec}
                onSubmit={handleSaveAnswers}
                initialValues={existingAnswers || {}}
              />

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                  View JSON Schema
                </summary>
                <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">
                  {JSON.stringify(spec, null, 2)}
                </pre>
              </details>
            </section>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push("/apply/review")}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Back
            </button>
            {spec && existingAnswers && (
              <button
                onClick={() => router.push("/apply/submit")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Continue to Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-900 mb-2">✓ Dynamic Answers Saved</h3>
            <p className="text-sm text-green-700">
              Your answers have been saved. Below is the complete JSON output of your application.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Complete Application JSON</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(finalJson, null, 2));
                  alert("JSON copied to clipboard!");
                }}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Copy JSON
              </button>
            </div>
            
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify(finalJson, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowJsonView(false)}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Back to Form
            </button>
            <button
              onClick={() => router.push("/apply/submit")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Continue to Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}