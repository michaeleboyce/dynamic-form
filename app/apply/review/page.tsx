"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFromLocalStorage, type ApplicationData } from "@/lib/localStorage";

export default function ReviewStep() {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationData | null>(null);

  useEffect(() => {
    const data = getFromLocalStorage();
    setApplication(data);
  }, []);

  if (!application?.applicant || !application?.housing || !application?.household || !application?.eligibility) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Please complete all previous sections before reviewing.</p>
        <button
          onClick={() => router.push("/apply")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Start Application
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded p-4">
        <p className="text-sm text-amber-900">
          <strong>Demo Mode:</strong> This data is stored locally only. No database connection is used.
        </p>
      </div>

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

      <div className="flex gap-4 pt-4 border-t">
        <button
          onClick={() => router.push("/apply/eligibility")}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          ← Back to Edit
        </button>
        <button
          onClick={() => router.push("/apply/dynamic")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue to Dynamic Questions →
        </button>
      </div>
    </div>
  );
}