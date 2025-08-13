# Emergency Rental Assistance - Dynamic Forms Demo

AI-powered dynamic forms for emergency rental assistance applications using Next.js and OpenAI.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd dynamic-form

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your OpenAI API credentials and database URL

# Run development server
pnpm dev

# Open browser
open http://localhost:3001
```

## 🎯 Features

- **Dynamic AI-Generated Questions**: Follow-up questions adapt based on applicant responses
- **Editable AI Prompts**: Users can customize how questions are generated
- **Complete JSON Export**: View and export the full application data structure
- **LocalStorage Persistence**: Demo mode with browser-only data storage
- **PII Protection**: Built-in filtering for sensitive information
- **Real-time Validation**: Form validation with Zod schemas
- **Responsive Design**: Mobile-friendly interface
- **Conditional Field Rendering**: Dynamic fields appear based on previous answers

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Storage**: LocalStorage (Demo Mode - No Database)
- **ORM**: Drizzle (configured but not used in demo)
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-5 / GPT-4o
- **Analytics**: Vercel Analytics

## 📁 Project Structure

```
dynamic-form/
├── app/
│   ├── actions.ts          # Server actions for AI generation
│   ├── apply/              # Application wizard pages
│   │   ├── page.tsx        # Applicant info
│   │   ├── housing/        # Housing details
│   │   ├── household/      # Household composition
│   │   ├── eligibility/    # Eligibility attestation
│   │   ├── review/         # Review core data
│   │   ├── dynamic/        # AI-generated questions with prompt editor
│   │   └── submit/         # Final submission
│   └── layout.tsx          # Root layout with analytics
├── components/
│   └── DynamicFormRenderer.tsx  # Dynamic field renderer with conditional logic
├── db/
│   ├── index.ts            # Database connection (not used in demo)
│   └── schema.ts           # Drizzle schema (not used in demo)
├── lib/
│   ├── localStorage.ts     # Browser storage management
│   └── validation.ts       # Zod schemas with flexible AI response handling
└── drizzle.config.ts       # Drizzle configuration
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Required for AI generation
OPENAI_API_KEY=sk-...

# Optional - configured but not used in demo mode
NEON_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

## 📝 Key Features Explained

### Demo Mode
The application runs entirely in demo mode with localStorage:
- No database connections
- Data persists only in browser
- Clear warnings about not entering real personal information
- Data can be exported as JSON

### AI Question Generation
- Uses OpenAI GPT-5 or GPT-4o models
- Customizable prompts for different question types
- Supports various field types:
  - Text, Number, Currency, Date
  - Select (single choice)
  - Multiselect (multiple choice)
  - Radio buttons
  - Checkbox groups
  - Boolean (yes/no)
  - Textarea

### Conditional Field Rendering
Dynamic fields can appear/hide based on previous answers using:
- `showIf` or `visibleWhen` conditions
- Support for `equals`, `anyOf`, `minSelected`, `anySelected`

### Form Validation
- Comprehensive Zod schemas for type safety
- Real-time validation feedback
- Support for required and optional fields
- Custom validation rules per field type

## 🔒 Security Features

- **No Real Data Storage**: Demo mode with localStorage only
- **PII Warnings**: Multiple warnings against entering real personal data
- **Filtered Fields**: Automatic removal of SSN, bank account fields
- **Input Validation**: Comprehensive Zod schemas for all inputs
- **No Database Connection**: Completely client-side for demo purposes

## 🧪 Testing the Application

1. **Start Application**: Click "Start Application" on homepage
2. **Fill Core Sections**: Complete applicant, housing, household, and eligibility
3. **Review Data**: Check all entered information
4. **Generate Dynamic Questions**: 
   - Edit the AI prompt to customize questions
   - Click "Generate Questions"
   - AI generates 8 targeted follow-up questions
   - Answer the generated questions
5. **View JSON Output**: See complete application structure
6. **Submit**: Final submission shows complete JSON (demo only)

### Sample Test Data
```javascript
// Applicant
firstName: "John"
lastName: "Doe"
dob: "1990-01-01"
phone: "5551234567"
email: "john.doe@example.com"

// Housing
address1: "123 Main St"
address2: "Apt 4B"
city: "Springfield"
state: "CA"
zip: "90001"
monthlyRent: 1800
monthsBehind: 2
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - OPENAI_API_KEY (required)
# - NEON_DATABASE_URL (optional)
```

### Manual Deployment

1. Build the application:
```bash
pnpm build
```

2. Start production server:
```bash
pnpm start
```

## 🛠️ Development

### Running Locally
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Key Implementation Details

- **TypeScript**: Full type safety with strict mode
- **Server Actions**: Used for AI API calls only
- **Client State**: React Hook Form for form state management
- **Storage**: localStorage with TypeScript interfaces
- **AI Integration**: Flexible schema to handle various AI response formats

## 🆘 Troubleshooting

### AI Generation Not Working
- Verify OpenAI API key is set correctly
- Check if using supported model (gpt-5 or gpt-4o)
- Ensure no `max_completion_tokens` parameter is sent
- Check API rate limits

### Form Fields Not Rendering
- AI response must match expected schema structure
- Check browser console for validation errors
- Ensure conditional fields have proper dependencies

### LocalStorage Issues
- Clear browser storage if data seems corrupted
- Check browser storage limits
- Ensure browser allows localStorage

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📧 Support

For issues and questions, please open a GitHub issue.

---

Built with care for improving government services through intelligent form design.