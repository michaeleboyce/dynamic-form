import Link from "next/link";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Emergency Rental Assistance Application
          </h1>
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/apply" className="hover:text-blue-600">1. Applicant</Link>
            <span>→</span>
            <Link href="/apply/housing" className="hover:text-blue-600">2. Housing</Link>
            <span>→</span>
            <Link href="/apply/household" className="hover:text-blue-600">3. Household</Link>
            <span>→</span>
            <Link href="/apply/eligibility" className="hover:text-blue-600">4. Eligibility</Link>
            <span>→</span>
            <Link href="/apply/review" className="hover:text-blue-600">5. Review</Link>
            <span>→</span>
            <Link href="/apply/dynamic" className="hover:text-blue-600">6. Dynamic</Link>
            <span>→</span>
            <Link href="/apply/submit" className="hover:text-blue-600">7. Submit</Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
}