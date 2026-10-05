# Local Listing Audit Tool

Private internal tool for FMR Web Design. Audits a local business's Google
Business Profile and website, scores it, and drafts fixes with Claude.
Only one user (me), behind login.

## Scope (locked)
Build only what's listed here. If I or you think of a new feature, don't
build it. Suggest adding it to the Later list instead.

### Pages
- /login: sign in (Auth.js, one allowed account)
- /: dashboard, list of past audits, "New audit" button (SSR)
- /audit/new: business name + city form (Client Component)
- /audit/search?q=: Places search results (Server Component)
- /audit/[id]: scored report + AI chat assistant (SSR)
- /guide: what each check means and how it's scored (SSG)

### Audit checks
- Google Business Profile data via Places API: categories, hours, photos,
  reviews, website, phone

### AI chat assistant
Chat panel on the report page. Ask questions about the audit; Claude streams
answers and can draft fixes (profile description, category suggestions,
review replies). Every draft needs my approval. Nothing is published
automatically.

## Stack
- Next.js App Router (15+), TypeScript, Tailwind
- TanStack Query for client-side data fetching and mutations
- AWS: Lambda + API Gateway (audit and AI calls), DynamoDB, Amplify hosting
- Docker, GitHub Actions CI
- Jest + React Testing Library

## Conventions
- Server Components by default; "use client" only when needed (forms,
  interactivity)
- The Audit type in lib/types.ts is the contract between frontend and Lambdas
- Google Places calls live in lib/places.ts (server-only). Never import it
  from a Client Component.
- lib/build-audit.ts turns Places data into an Audit
- /audit/sample uses lib/sample-audit.ts, for UI work without API calls
- Places quotas are capped to stay in the free tier: search requests use only
  id, displayName, formattedAddress; don't add fields without asking me

## How to work with me
- Use plan mode for new features; wait for my approval before writing code.
- After implementing, summarize what changed and why, and explain any
  Next.js concept I should know for interviews.

## Later
- Website audit (PageSpeed, NAP match, schema)
- Pushing changes through the Google Business Profile API
- Writing changes to client websites
- Rank tracking
- Google Posts drafts