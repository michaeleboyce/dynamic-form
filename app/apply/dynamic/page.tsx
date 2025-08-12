"use client";

import { useState, useTransition, useEffect } from "react";
import type { DynamicFormSpec } from "@/lib/validation";
import { generateDynamicSpec } from "@/app/actions";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { useRouter } from "next/navigation";
import { saveToLocalStorage, getFromLocalStorage, type ApplicationData } from "@/lib/localStorage";

export default function DynamicStep() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(
    "You are assisting a rental assistance screener. Propose up to 8 targeted follow-ups that affect eligibility or award amount. Focus on eviction status, utility arrears, priority populations, and documentation needs. Prefer structured fields over free text."
  );
  const [spec, setSpec] = useState<DynamicFormSpec | null>(null);
  const [existingAnswers, setExistingAnswers] = useState<Record<string, unknown> | null>(null);
  const [rawModelResponse, setRawModelResponse] = useState<any>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showJsonView, setShowJsonView] = useState(false);
  const [finalJson, setFinalJson] = useState<any>(null);
  const [coreOverview, setCoreOverview] = useState<ApplicationData | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const data = getFromLocalStorage();
    if (data.prompt) setPrompt(data.prompt);
    if (data.dynamicSpec) setSpec(data.dynamicSpec);
    if (data.dynamicAnswers) setExistingAnswers(data.dynamicAnswers);
    setCoreOverview(data);
  }, []);

  const handleGenerateSpec = () => {
    startTransition(async () => {
      try {
        setError(null);
        saveToLocalStorage({ prompt });
        
        const coreData = getFromLocalStorage();
        const { raw, spec, debug } = await generateDynamicSpec(coreData, prompt, 8);
        setRawModelResponse(raw);
        setDebugInfo(debug);
        setSpec(spec);
        if (spec) {
          saveToLocalStorage({ dynamicSpec: spec });
        }
      } catch (err) {
        setError("Failed to generate questions. Please try again.");
        console.error(err);
      }
    });
  };

  const handleSaveAnswers = (answers: Record<string, unknown>) => {
    saveToLocalStorage({ dynamicAnswers: answers });
    
    // Get the complete application data for the final JSON view
    const completeData = getFromLocalStorage();
    const completeForm = {
      core: {
        applicant: completeData.applicant,
        housing: completeData.housing,
        household: completeData.household,
        eligibility: completeData.eligibility,
      },
      dynamicQuestions: spec,
      dynamicAnswers: answers,
      metadata: {
        prompt: completeData.prompt,
        generatedAt: new Date().toISOString(),
      }
    };
    setFinalJson(completeForm);
    setShowJsonView(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded p-4">
        <p className="text-sm text-amber-900">
          <strong>Demo Mode:</strong> No data is saved to database. Your form data is stored locally in browser only.
        </p>
      </div>

      {coreOverview && (
        <details open className="bg-white border rounded-lg shadow-sm">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">
            Current Application Overview
          </summary>
          <div className="px-4 pb-4 pt-2 space-y-6">
            {/* Applicant */}
            {coreOverview.applicant && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Applicant</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <span className="ml-1">
                      {coreOverview.applicant.firstName} {coreOverview.applicant.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">DOB:</span>
                    <span className="ml-1">{coreOverview.applicant.dob}</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <span className="ml-1">{coreOverview.applicant.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-1">{coreOverview.applicant.email}</span>
                  </div>
                  {coreOverview.applicant.language && (
                    <div>
                      <span className="font-medium">Language:</span>
                      <span className="ml-1">{coreOverview.applicant.language}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Housing */}
            {coreOverview.housing && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Housing</h3>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Address:</span>
                    <span className="ml-1">
                      {coreOverview.housing.address1}
                      {coreOverview.housing.address2 ? `, ${coreOverview.housing.address2}` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">City, State ZIP:</span>
                    <span className="ml-1">
                      {coreOverview.housing.city}, {coreOverview.housing.state} {coreOverview.housing.zip}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="font-medium">Monthly Rent:</span>
                      <span className="ml-1">{'$'}{coreOverview.housing.monthlyRent}</span>
                    </div>
                    <div>
                      <span className="font-medium">Months Behind:</span>
                      <span className="ml-1">{coreOverview.housing.monthsBehind}</span>
                    </div>
                    <div>
                      <span className="font-medium">Total Owed:</span>
                      <span className="ml-1">{'$'}{(coreOverview.housing.monthlyRent || 0) * (coreOverview.housing.monthsBehind || 0)}</span>
                    </div>
                  </div>
                  {(coreOverview.housing.landlordName || coreOverview.housing.landlordPhone) && (
                    <div>
                      <span className="font-medium">Landlord:</span>
                      <span className="ml-1">
                        {coreOverview.housing.landlordName}
                        {coreOverview.housing.landlordPhone ? ` (${coreOverview.housing.landlordPhone})` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Household */}
            {coreOverview.household && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Household</h3>
                <div className="text-sm">
                  <div>
                    <span className="font-medium">Household Size:</span>
                    <span className="ml-1">{coreOverview.household.size}</span>
                  </div>
                  {coreOverview.household.members && coreOverview.household.members.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium mb-1">Members:</div>
                      <div className="flex flex-wrap gap-2">
                        {coreOverview.household.members.map((m, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-gray-50"
                          >
                            <span className="font-medium capitalize">{m.relation}</span>
                            <span className="text-gray-600">{m.ageRange}</span>
                            <span className="text-gray-600">{m.incomeBand}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Eligibility */}
            {coreOverview.eligibility && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Eligibility</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Hardship:</span>
                    <span className="ml-1">{coreOverview.eligibility.hardship ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Signed By:</span>
                    <span className="ml-1">{coreOverview.eligibility.typedSignature}</span>
                  </div>
                  {coreOverview.eligibility.signedAtISO && (
                    <div>
                      <span className="font-medium">Signed At:</span>
                      <span className="ml-1">{new Date(coreOverview.eligibility.signedAtISO).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </details>
      )}

      {!showJsonView ? (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-gray-700">
              This section generates AI-powered follow-up questions based on your previous answers. 
              Do not enter sensitive information.
            </p>
          </div>

          <details open className="space-y-2">
            <summary className="cursor-pointer text-sm font-medium">
              AI Prompt (click to expand/collapse)
            </summary>
            <p className="text-sm text-gray-600">
              Customize how the AI generates follow-up questions
            </p>
            <textarea
              className="w-full rounded border p-3 font-mono text-sm"
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onBlur={() => saveToLocalStorage({ prompt })}
            />
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={pending}
              onClick={handleGenerateSpec}
            >
              {pending ? "Generating..." : "Generate Questions"}
            </button>
          </details>

          {/* JSON overview removed in favor of visual, collapsible overview above */}

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

          {rawModelResponse && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                View raw model response
              </summary>
              <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">
                {JSON.stringify(rawModelResponse, null, 2)}
              </pre>
            </details>
          )}

          {debugInfo && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                View model request/response debug
              </summary>
              <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push("/apply/review")}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              ← Back
            </button>
            {spec && existingAnswers && (
              <button
                onClick={() => router.push("/apply/submit")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Continue to Submit →
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-900 mb-2">✓ Dynamic Answers Saved</h3>
            <p className="text-sm text-green-700">
              Your answers have been saved locally. Below is the complete JSON output of your application.
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
              ← Back to Form
            </button>
            <button
              onClick={() => router.push("/apply/submit")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Continue to Submit →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}