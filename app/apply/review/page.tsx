"use client";

import { useEffect, useState } from "react";
import { getApplication } from "@/app/actions";
import { useRouter } from "next/navigation";
import type { Core } from "@/lib/validation";

export default function ReviewStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const app = await getApplication();
        setApplication(app);
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading application data...</div>;
  }

  if (!application?.core) {
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

  const core = application.core as Core;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Review Your Application</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-gray-700">
          Please review your information below. You can go back to any section to make changes.
        </p>
      </div>

      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Applicant Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {core.applicant.firstName} {core.applicant.lastName}
          </div>
          <div>
            <span className="font-medium">Date of Birth:</span> {core.applicant.dob}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {core.applicant.phone}
          </div>
          <div>
            <span className="font-medium">Email:</span> {core.applicant.email}
          </div>
          {core.applicant.language && (
            <div>
              <span className="font-medium">Language:</span> {core.applicant.language}
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
            <span className="font-medium">Address:</span> {core.housing.address1}
            {core.housing.address2 && `, ${core.housing.address2}`}
          </div>
          <div>
            <span className="font-medium">City, State ZIP:</span> {core.housing.city}, {core.housing.state} {core.housing.zip}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Monthly Rent:</span> ${core.housing.monthlyRent}
            </div>
            <div>
              <span className="font-medium">Months Behind:</span> {core.housing.monthsBehind}
            </div>
          </div>
          <div>
            <span className="font-medium">Total Owed:</span> ${core.housing.monthlyRent * core.housing.monthsBehind}
          </div>
          {core.housing.landlordName && (
            <div>
              <span className="font-medium">Landlord:</span> {core.housing.landlordName}
              {core.housing.landlordPhone && ` (${core.housing.landlordPhone})`}
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
            <span className="font-medium">Household Size:</span> {core.household.size}
          </div>
          {core.household.members && core.household.members.length > 0 && (
            <div className="mt-3">
              <span className="font-medium">Household Members:</span>
              <ul className="mt-2 space-y-1 ml-4">
                {core.household.members.map((member, idx) => (
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
            {core.eligibility.hardship ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Signed By:</span> {core.eligibility.typedSignature}
          </div>
          <div>
            <span className="font-medium">Signed At:</span>{" "}
            {new Date(core.eligibility.signedAtISO).toLocaleString()}
          </div>
        </div>
      </section>

      <div className="flex gap-4 pt-4 border-t">
        <button
          onClick={() => router.push("/apply/eligibility")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          Back to Edit
        </button>
        <button
          onClick={() => router.push("/apply/dynamic")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue to Dynamic Questions
        </button>
      </div>
    </div>
  );
}