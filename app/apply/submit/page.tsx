"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFromLocalStorage, clearLocalStorage } from "@/lib/localStorage";

export default function SubmitStep() {
  const router = useRouter();
  const [application, setApplication] = useState<ReturnType<typeof getFromLocalStorage> | null>(null);

  useEffect(() => {
    const data = getFromLocalStorage();
    setApplication(data);
  }, []);

  if (!application?.applicant) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">No application data found. Please start from the beginning.</p>
        <button
          onClick={() => router.push("/apply")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Start Application
        </button>
      </div>
    );
  }

  const handleStartNew = () => {
    clearLocalStorage();
    router.push("/");
  };

  const finalJson = {
    applicationId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "demo_complete",
    core: {
      applicant: application.applicant,
      housing: application.housing,
      household: application.household,
      eligibility: application.eligibility,
    },
    dynamic: {
      prompt: application.prompt,
      spec: application.dynamicSpec,
      answers: application.dynamicAnswers,
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold text-green-900 mb-2">
          Demo Application Complete!
        </h2>
        <p className="text-gray-700 mb-4">
          Your application data is shown below. This is a demonstration only - no data has been saved to any database.
        </p>
        <p className="text-sm text-gray-600">
          Application ID: <code className="bg-gray-100 px-2 py-1 rounded">{finalJson.applicationId}</code>
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-4">
        <h3 className="font-semibold mb-2">🔒 Privacy Notice</h3>
        <p className="text-sm text-gray-700">
          This is a demo application. Your data:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
          <li>Is stored locally in your browser only (localStorage)</li>
          <li>Has NOT been saved to any database</li>
          <li>Will be cleared when you start a new application</li>
          <li>Can be exported using the &quot;Copy JSON&quot; button below</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Final Application JSON</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(finalJson, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `era-application-${finalJson.applicationId}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            >
              Download JSON
            </button>
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
        </div>
        
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-[500px] text-xs">
          {JSON.stringify(finalJson, null, 2)}
        </pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-semibold mb-2">What would happen in production?</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Application would be saved to secure database</li>
          <li>Email confirmation would be sent</li>
          <li>Case would be assigned to a reviewer</li>
          <li>Applicant could track status through a portal</li>
          <li>Documents would be requested if needed</li>
          <li>Funds would be disbursed upon approval</li>
        </ul>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          onClick={() => router.push("/apply/dynamic")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={handleStartNew}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Start New Application
        </button>
      </div>
    </div>
  );
}