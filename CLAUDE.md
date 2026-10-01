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
- /audit/[id]: scored report + "Generate fixes" (SSR)
- /guide: what each check means and how it's scored (SSG)

### Audit checks
- Google Business Profile data via Places API: categories, hours, photos,
  reviews, website, phone
- PageSpeed Insights on the business website
- Name/address/phone consistency between listing and website

### Generate fixes
Claude API drafts: profile description, category suggestions, review replies,
LocalBusiness schema (JSON-LD). Every draft is editable and needs my approval.
Nothing is published automatically.

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
- Week 1 uses sample data in lib/sample-audit.ts
- API keys stay server-side only, never in client code
- Use only official Google APIs, no scraping
- Store place IDs and computed scores; don't cache Places content long-term
- WCAG 2.1 AA: semantic HTML, labeled inputs, keyboard support, visible focus,
  aria-live for streamed content

## How to work with me
- I'm learning the App Router for job interviews. Explain Server vs. Client
  decisions and anything that changed in Next.js 15+.
- Make small, reviewable changes, one piece at a time.
- When I write code myself, review it rather than rewriting it.

See @AGENTS.md for Next.js agent guidance.