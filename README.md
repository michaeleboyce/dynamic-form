# Emergency Rental Assistance - Dynamic Forms Demo

AI-powered dynamic forms for emergency rental assistance applications using Next.js, Neon Postgres, Drizzle ORM, and OpenAI.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd dynamic-form

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Neon DB and OpenAI API credentials

# Push database schema
export NEON_DATABASE_URL='your-neon-url' && npx drizzle-kit push

# Run development server
pnpm dev

# Open browser
open http://localhost:3000
```

## 🎯 Features

- **Dynamic AI-Generated Questions**: Follow-up questions adapt based on applicant responses
- **Editable AI Prompts**: Users can customize how questions are generated
- **Complete JSON Export**: View and export the full application data structure
- **Session Persistence**: Cookie-based anonymous sessions
- **PII Protection**: Built-in filtering for sensitive information
- **Real-time Validation**: Form validation with Zod schemas
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon Postgres (Serverless)
- **ORM**: Drizzle
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 (with mock fallback)
- **Analytics**: Vercel Analytics

## 📁 Project Structure

```
dynamic-form/
├── app/
│   ├── actions.ts          # Server actions
│   ├── apply/              # Application wizard pages
│   │   ├── page.tsx        # Applicant info
│   │   ├── housing/        # Housing details
│   │   ├── household/      # Household composition
│   │   ├── eligibility/    # Eligibility attestation
│   │   ├── review/         # Review core data
│   │   ├── dynamic/        # AI-generated questions
│   │   └── submit/         # Final submission
│   └── layout.tsx          # Root layout with analytics
├── components/
│   └── DynamicFormRenderer.tsx  # Dynamic field renderer
├── db/
│   ├── index.ts            # Database connection
│   └── schema.ts           # Drizzle schema
├── lib/
│   ├── session.ts          # Session management
│   └── validation.ts       # Zod schemas
└── drizzle.config.ts       # Drizzle configuration
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEON_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
OPENAI_API_KEY=sk-...  # Optional - uses mock if not provided
```

## 📝 Development Todo List

### ✅ Completed
- [x] Create Next.js project with TypeScript and Tailwind
- [x] Install dependencies (React Hook Form, Zod, Drizzle, Neon)
- [x] Set up environment variables and database configuration
- [x] Create Drizzle schema and run migrations
- [x] Implement validation schemas with Zod
- [x] Create session management helper
- [x] Implement server actions for all operations
- [x] Build core application form steps
- [x] Create dynamic form renderer component
- [x] Implement dynamic questions generation with prompt editor
- [x] Add review and submission pages
- [x] Add Vercel Analytics
- [x] Create comprehensive README

### 🚧 Pending
- [ ] Add unit tests for validation schemas
- [ ] Implement autosave functionality
- [ ] Add progress indicator
- [ ] Create admin dashboard
- [ ] Add export to PDF functionality
- [ ] Implement multi-language support
- [ ] Add accessibility improvements (ARIA labels)
- [ ] Create API documentation
- [ ] Set up CI/CD pipeline
- [ ] Add error boundary components

## 🗄️ Database Schema

The application uses a single `applications` table with JSONB columns:

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  session_id TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  core JSONB NOT NULL,           -- Applicant, housing, household, eligibility
  prompt TEXT,                    -- User-editable AI prompt
  dynamic_spec JSONB,             -- AI-generated form specification
  dynamic_answers JSONB,          -- User's answers to dynamic questions
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔒 Security Features

- **No Real PII**: Demo mode with warnings against entering real data
- **Filtered Fields**: Automatic removal of SSN, bank account fields
- **Session Isolation**: Cookie-based sessions prevent data mixing
- **Secure Storage**: Neon Postgres with SSL required
- **Input Validation**: Comprehensive Zod schemas for all inputs

## 🧪 Testing the Application

1. **Start Application**: Click "Start Application" on homepage
2. **Fill Core Sections**: Complete applicant, housing, household, and eligibility
3. **Review Data**: Check all entered information
4. **Generate Dynamic Questions**: 
   - Edit the AI prompt if desired
   - Click "Generate Questions"
   - Answer the generated questions
5. **View JSON Output**: See complete application structure
6. **Submit**: Final submission marks application as complete

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - NEON_DATABASE_URL
# - OPENAI_API_KEY (optional)
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this demo for your own projects!

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure Neon database URL includes `?sslmode=require`
- Check if database is awake (Neon databases auto-suspend)

### AI Generation Not Working
- Verify OpenAI API key is set correctly
- Check API rate limits
- Application falls back to mock data if no API key

### Session Issues
- Clear cookies if session data seems corrupted
- Check browser accepts cookies

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon Database](https://neon.tech/docs)
- [React Hook Form](https://react-hook-form.com/)
- [OpenAI API](https://platform.openai.com/docs)

## 📧 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ for improving government services through intelligent form design.
