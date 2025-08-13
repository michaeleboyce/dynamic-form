"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearLocalStorage } from "@/lib/localStorage";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const steps = [
    { num: 1, name: "Applicant", path: "/apply" },
    { num: 2, name: "Housing", path: "/apply/housing" },
    { num: 3, name: "Household", path: "/apply/household" },
    { num: 4, name: "Eligibility", path: "/apply/eligibility" },
    { num: 5, name: "Review", path: "/apply/review" },
    { num: 6, name: "Dynamic", path: "/apply/dynamic" },
    { num: 7, name: "Submit", path: "/apply/submit" },
  ];

  const handleClearForm = () => {
    if (confirm("Are you sure you want to clear all form data and start over?")) {
      clearLocalStorage();
      router.push("/");
    }
  };

  const isActive = (path: string) => pathname === path;
  const isCompleted = (path: string) => {
    const currentIndex = steps.findIndex(s => s.path === pathname);
    const stepIndex = steps.findIndex(s => s.path === path);
    return stepIndex < currentIndex;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Emergency Rental Assistance Application
            </h1>
            <button
              onClick={handleClearForm}
              className="text-sm text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 px-3 py-1 rounded transition"
            >
              Clear Form & Start Over
            </button>
          </div>
          
          <nav className="flex gap-2 text-sm flex-wrap">
            {steps.map((step, index) => (
              <div key={step.path} className="flex items-center gap-2">
                <Link 
                  href={step.path} 
                  className={`hover:text-blue-600 transition ${
                    isActive(step.path) 
                      ? 'text-blue-600 font-semibold' 
                      : isCompleted(step.path)
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  <span className="inline-flex items-center">
                    {isCompleted(step.path) && (
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {step.num}. {step.name}
                  </span>
                </Link>
                {index < steps.length - 1 && <span className="text-gray-400">→</span>}
              </div>
            ))}
          </nav>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
}