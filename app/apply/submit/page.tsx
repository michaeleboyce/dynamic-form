"use client";

import { useEffect, useState } from "react";
import { getApplication, submitApplication } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function SubmitStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const app = await getApplication();
        setApplication(app);
        if (app?.status === "submitted") {
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitApplication();
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading application data...</div>;
  }

  if (!application) {
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

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold text-green-900 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-700 mb-4">
            Your Emergency Rental Assistance application has been received.
          </p>
          <p className="text-sm text-gray-600">
            Application ID: <code className="bg-gray-100 px-2 py-1 rounded">{application.id}</code>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold mb-2">What Happens Next?</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Your application will be reviewed by our team</li>
            <li>You may be contacted for additional documentation</li>
            <li>Decision will be sent to your email within 5-7 business days</li>
            <li>If approved, funds will be sent directly to your landlord</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Application Summary</h3>
          
          <details className="border rounded p-4">
            <summary className="cursor-pointer text-sm font-medium">View Full Application JSON</summary>
            <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify({
                id: application.id,
                status: application.status,
                core: application.core,
                dynamicSpec: application.dynamicSpec,
                dynamicAnswers: application.dynamicAnswers,
                submittedAt: application.updatedAt,
              }, null, 2)}
            </pre>
          </details>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={() => {
              // Clear session and start new application
              document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              router.push("/");
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start New Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Submit Application</h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> Please review your application one more time before submitting. 
          Once submitted, you cannot make changes.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Application Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Core Sections:</span>{" "}
              <span className="text-green-600">✓ Complete</span>
            </div>
            <div>
              <span className="font-medium">Dynamic Questions:</span>{" "}
              {application.dynamicSpec ? (
                <span className="text-green-600">✓ Complete</span>
              ) : (
                <span className="text-amber-600">Optional</span>
              )}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {application.dynamicSpec && (
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Dynamic Questions Answered</h3>
            <p className="text-sm text-gray-600">
              {application.dynamicSpec.fields.length} additional questions completed
            </p>
            {application.dynamicAnswers && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">View Answers</summary>
                <pre className="mt-2 bg-gray-50 p-3 rounded overflow-auto text-xs">
                  {JSON.stringify(application.dynamicAnswers, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            required
          />
          <span className="text-sm">
            I certify that all information provided in this application is true and accurate to the best 
            of my knowledge. I understand that providing false information may result in denial of 
            assistance and potential legal consequences.
          </span>
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          onClick={() => router.push("/apply/dynamic")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}