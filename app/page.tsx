import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Rental Assistance
          </h1>
          <p className="text-xl text-gray-800">
            AI-Powered Dynamic Forms Demo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome to the ERA Application Portal</h2>
          <p className="text-gray-700 mb-6">
            This demonstration showcases an innovative approach to government benefit applications 
            using AI-generated dynamic questions that adapt based on your specific situation.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="text-sm text-blue-900 space-y-2">
              <p>
                <strong>Demo Notice:</strong> This is a pretend, demonstration-only application. It is not
                connected to any real benefits program or production database.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Do not enter real personal information</strong> (for example: Social Security numbers,
                  bank/credit card numbers, driver’s license, full home address, employer details, or any other PII).
                </li>
                <li>
                  Your responses are stored only in your browser’s local storage for this demo and can be cleared at any time.
                </li>
                <li>
                  The AI may generate example follow‑up questions; treat these as illustrative only—this is not guidance or advice.
                </li>
                <li>
                  Use obviously made‑up data when testing (e.g., John Doe, 01/01/1990, 555‑123‑4567).
                </li>
              </ul>
              <p>
                By continuing, you acknowledge this is a sandbox experience intended for evaluation and usability testing only.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">How It Works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Complete basic application sections (Applicant, Housing, Household, Eligibility)</li>
              <li>Review your core application data</li>
              <li>AI generates targeted follow-up questions based on your situation</li>
              <li>You can edit the AI prompt to customize question generation</li>
              <li>Answer dynamic questions and view complete JSON output</li>
              <li>Submit your completed application</li>
            </ol>
          </div>

          {/* Removed feature and security cards per request */}

          <div className="flex gap-4 justify-center">
            <Link
              href="/apply"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Application
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Technical Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong className="block text-gray-900">Frontend</strong>
              <span className="text-gray-700">Next.js 15</span>
            </div>
            <div>
              <strong className="block text-gray-900">Database</strong>
              <span className="text-gray-700">Neon Postgres</span>
            </div>
            <div>
              <strong className="block text-gray-900">ORM</strong>
              <span className="text-gray-700">Drizzle</span>
            </div>
            <div>
              <strong className="block text-gray-900">AI Model</strong>
              <span className="text-gray-700">OpenAI GPT-5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
