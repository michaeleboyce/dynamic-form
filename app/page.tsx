import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Rental Assistance
          </h1>
          <p className="text-xl text-gray-600">
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
            <p className="text-sm text-blue-900">
              <strong>Demo Notice:</strong> This is a demonstration environment. Do not enter real 
              personal information. The AI will generate follow-up questions based on your responses 
              to help determine eligibility and required documentation.
            </p>
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

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">✨ Key Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Editable AI prompts</li>
                <li>• Real-time question generation</li>
                <li>• JSON schema validation</li>
                <li>• Complete data export</li>
                <li>• Session persistence</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">🛡️ Privacy & Security</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PII filtering built-in</li>
                <li>• No SSN/bank info collection</li>
                <li>• Cookie-based sessions</li>
                <li>• Secure data storage</li>
                <li>• Demo mode protection</li>
              </ul>
            </div>
          </div>

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
              <span className="text-gray-600">Next.js 15</span>
            </div>
            <div>
              <strong className="block text-gray-900">Database</strong>
              <span className="text-gray-600">Neon Postgres</span>
            </div>
            <div>
              <strong className="block text-gray-900">ORM</strong>
              <span className="text-gray-600">Drizzle</span>
            </div>
            <div>
              <strong className="block text-gray-900">AI Model</strong>
              <span className="text-gray-600">OpenAI GPT-4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
