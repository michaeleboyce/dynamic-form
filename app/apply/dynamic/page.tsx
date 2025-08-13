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
    "You are assisting a rental assistance screener. Propose up to 6 targeted follow-ups that affect eligibility or award amount based on the applicant's information. Focus on eviction status, utility arrears, priority populations, and documentation needs. Prefer structured fields over free text."
  );
  const [spec, setSpec] = useState<DynamicFormSpec | null>(null);
  const [existingAnswers, setExistingAnswers] = useState<Record<string, unknown> | null>(null);
  const [rawModelResponse, setRawModelResponse] = useState<Record<string, unknown> | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    const data = getFromLocalStorage();
    setApplication(data);
    if (data.prompt) setPrompt(data.prompt);
    if (data.dynamicSpec) setSpec(data.dynamicSpec);
    if (data.dynamicAnswers) setExistingAnswers(data.dynamicAnswers);
  }, []);

  if (!application?.applicant || !application?.housing || !application?.household || !application?.eligibility) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Please complete all previous sections before generating dynamic questions.</p>
        <button
          onClick={() => router.push("/apply")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Start Application
        </button>
      </div>
    );
  }

  const handleGenerateSpec = () => {
    setIsRegenerating(true);
    setGenerationProgress(0);
    
    // Progress to 80% over 10 seconds (100 intervals of 100ms each)
    let intervalCount = 0;
    const maxIntervals = 100;
    const targetProgress = 80;
    
    const progressInterval = setInterval(() => {
      intervalCount++;
      
      if (intervalCount >= maxIntervals) {
        clearInterval(progressInterval);
        setGenerationProgress(targetProgress);
        return;
      }
      
      // Easing function for smoother progress (starts fast, slows down)
      const easedProgress = targetProgress * (1 - Math.pow(1 - (intervalCount / maxIntervals), 2));
      setGenerationProgress(easedProgress);
    }, 100); // 100ms intervals for 10 seconds total
    
    startTransition(async () => {
      try {
        setError(null);
        saveToLocalStorage({ prompt });
        
        const coreData = getFromLocalStorage();
        const { raw, spec, debug } = await generateDynamicSpec(coreData, prompt, 8);
        setRawModelResponse(raw as Record<string, unknown> | null);
        setDebugInfo(debug as Record<string, unknown> | undefined || null);
        
        // Complete the progress
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setSpec(spec);
        if (spec) {
          saveToLocalStorage({ dynamicSpec: spec });
        }
      } catch (err) {
        clearInterval(progressInterval);
        setError("Failed to generate questions. Please try again.");
        console.error(err);
      } finally {
        setIsRegenerating(false);
        setGenerationProgress(0);
      }
    });
  };

  const handleSaveAnswers = (answers: Record<string, unknown>) => {
    saveToLocalStorage({ dynamicAnswers: answers });
    router.push("/apply/submit");
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded p-4">
        <p className="text-sm text-amber-900">
          <strong>Demo Mode:</strong> This data is stored locally only. No database connection is used.
        </p>
      </div>

      <h2 className="text-2xl font-semibold">Review & Dynamic Questions</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-gray-700">
          Please review your information below. You can go back to any section to make changes.
          After reviewing, generate AI-powered follow-up questions based on your application.
        </p>
      </div>

      {/* Review Section - Better Layout from Review Page */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Applicant Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {application.applicant.firstName} {application.applicant.lastName}
          </div>
          <div>
            <span className="font-medium">Date of Birth:</span> {application.applicant.dob}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {application.applicant.phone}
          </div>
          <div>
            <span className="font-medium">Email:</span> {application.applicant.email}
          </div>
          {application.applicant.language && (
            <div>
              <span className="font-medium">Language:</span> {application.applicant.language}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Housing Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span className="font-medium">Address:</span> {application.housing.address1}
            {application.housing.address2 && `, ${application.housing.address2}`}
          </div>
          <div>
            <span className="font-medium">City, State ZIP:</span> {application.housing.city}, {application.housing.state} {application.housing.zip}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Monthly Rent:</span> ${application.housing.monthlyRent}
            </div>
            <div>
              <span className="font-medium">Months Behind:</span> {application.housing.monthsBehind}
            </div>
          </div>
          <div>
            <span className="font-medium">Total Owed:</span> ${application.housing.monthlyRent * application.housing.monthsBehind}
          </div>
          {application.housing.landlordName && (
            <div>
              <span className="font-medium">Landlord:</span> {application.housing.landlordName}
              {application.housing.landlordPhone && ` (${application.housing.landlordPhone})`}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Household Information</h3>
        </div>
        <div className="text-sm">
          <div>
            <span className="font-medium">Household Size:</span> {application.household.size}
          </div>
          {application.household.members && application.household.members.length > 0 && (
            <div className="mt-3">
              <span className="font-medium">Household Members:</span>
              <ul className="mt-2 space-y-1 ml-4">
                {application.household.members.map((member, idx) => (
                  <li key={idx}>
                    • {member.relation} ({member.ageRange}, Income: {member.incomeBand})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Eligibility Attestation</h3>
        </div>
        <div className="text-sm">
          <div>
            <span className="font-medium">COVID-19 Hardship Acknowledged:</span>{" "}
            {application.eligibility.hardship ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Signed By:</span> {application.eligibility.typedSignature}
          </div>
          <div>
            <span className="font-medium">Signed At:</span>{" "}
            {new Date(application.eligibility.signedAtISO).toLocaleString()}
          </div>
        </div>
      </section>

      {/* Dynamic Questions Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-sm text-gray-700">
          Generate AI-powered follow-up questions based on your application. 
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
        
        {/* Loading Animation */}
        {isRegenerating && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-gray-600">Analyzing your application...</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              >
                <div className="h-full bg-white/30 animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              {generationProgress < 30 && "Reading application data..."}
              {generationProgress >= 30 && generationProgress < 60 && "Generating contextual questions..."}
              {generationProgress >= 60 && generationProgress < 90 && "Validating form structure..."}
              {generationProgress >= 90 && "Finalizing questions..."}
            </div>
          </div>
        )}
      </details>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {spec && !isRegenerating && (
        <section 
          className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{
            animation: 'fadeInUp 0.5s ease-out'
          }}
        >
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
          onClick={() => router.push("/apply/eligibility")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          ← Back to Edit
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
    </div>
  );
}