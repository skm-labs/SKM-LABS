# skm.labs

Engineering & fabrication commissions site for Klutzy.

Built with **Next.js 14**, **Supabase**, and **TypeScript**.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (magic link)
- **Emails**: Supabase Edge Functions + Resend
- **Fonts**: Fraunces + JetBrains Mono (Google Fonts)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/book` | 4-step booking wizard (service → brief → meeting slot) |
| `/commissions` | Detailed commission intake form |
| `/contact` | Simple contact form |
| `/work` | Portfolio gallery with filter + search |
| `/work/[slug]` | Project detail page |
| `/login` | Admin login (magic link) |
| `/admin` | Dashboard — bookings, commissions, contacts, projects |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run SQL files in order in **SQL Editor**:
   - `schema.sql` — contacts + commissions tables
   - `schema_bookings.sql` — bookings table
   - `schema_portfolio.sql` — projects table + seed data
3. Go to **Storage** → create a bucket named `commission-refs` (private)

### 3. Environment variables
```bash
cp .env.local.example .env.local
```
Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally
```bash
npm run dev
```

### 5. Set up email notifications (optional)
```bash
npm install -g supabase
supabase login
supabase functions deploy send-booking-emails
supabase secrets set RESEND_API_KEY=re_your_key
```
Get a free API key at [resend.com](https://resend.com).

## Admin access
Navigate to `/login` and enter `hello.skm.labs@gmail.com`.
A magic link will be emailed to you. Click it to access `/admin`.

## Deploy
Push to GitHub and connect to [Vercel](https://vercel.com). Add your environment variables in the Vercel dashboard.
# SKM-LABS
# SKM-LABS
# SKM-LABS
# SKM-LABS
# SKM-LABS
# SKM-LABS
# SKM-LABS
# SKM-LABS
