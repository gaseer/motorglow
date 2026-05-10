# MotorGlow

**On-demand parking-spot car wash app.**  
"We come to your car."

Stack: Next.js 16 (App Router) · Supabase · Firebase Phone Auth · Resend · Framer Motion · Tailwind CSS v4

---

## 1. Prerequisites

- Node.js 18+
- A Firebase project (free)
- A Supabase project (free)
- A Resend account (free — 3,000 emails/month)

---

## 2. Firebase Project Setup (Phone Auth + OTP)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Create a project**
2. In the sidebar: **Authentication → Sign-in method** → enable **Phone**
3. Go to **Project Settings → General** and copy:
   - **API Key** → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - **Auth Domain** → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - **Project ID** → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - **App ID** → `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 3. Firebase Admin SDK Setup

1. **Project Settings → Service Accounts → Generate new private key**
2. Download the JSON file. Extract:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` *(paste as a single-line string with `\n` for newlines)*

---

## 4. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. **Settings → API → anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Settings → API → service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **SQL Editor** and run the following:

```sql
-- customers
create table customers (
  id           uuid primary key default gen_random_uuid(),
  firebase_uid text unique not null,
  phone        text,
  created_at   timestamptz default now()
);

-- packages
create table packages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  tagline      text,
  price        integer not null,
  features     text[],
  is_popular   boolean default false,
  sort_order   integer,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- bookings
create table bookings (
  id             uuid primary key default gen_random_uuid(),
  firebase_uid   text not null,
  customer_phone text,
  package_id     uuid references packages(id),
  package_name   text not null,
  vehicle        text not null,
  location       text not null,
  notes          text,
  date           date not null,
  time_slot      text not null,
  status         text default 'pending'
                   check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Disable RLS (all access via service role in API routes)
alter table customers disable row level security;
alter table packages  disable row level security;
alter table bookings  disable row level security;
```

---

## 5. Resend Setup

1. Go to [resend.com](https://resend.com) → sign up → **API Keys → Create API Key**
2. Copy key → `RESEND_API_KEY`
3. Add and verify your sending domain in **Domains** (or use the Resend sandbox for testing)

---

## 6. Environment Variables

Copy `.env.local.example` → `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase → Project Settings → General |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase service account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase service account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase service account JSON |
| `RESEND_API_KEY` | Resend → API Keys |

---

## 7. Install Dependencies

```bash
npm install
```

All packages are already declared in `package.json`.

---

## 8. Seed the Database

After creating the Supabase tables and filling in `.env.local`:

```bash
npx tsx scripts/seed.ts
```

This inserts the 3 default packages (Shell Shine, Full Refresh, MotorGlow Premium). It's idempotent — safe to run multiple times, will skip if rows already exist.

---

## 9. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- Landing: `http://localhost:3000`
- Customer login: `http://localhost:3000/login`
- Customer dashboard: `http://localhost:3000/dashboard`
- Admin login: `http://localhost:3000/admin/login` — credentials: `komban` / `k0mb@n`
- Admin panel: `http://localhost:3000/admin/dashboard`

> **Note:** The landing page shows placeholder packages if Supabase is not configured. OTP login requires valid Firebase keys.

---

## 10. Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

Or: push to GitHub and connect the repo in the [Vercel dashboard](https://vercel.com).

**Set all environment variables** in: Vercel → Project → Settings → Environment Variables.

> **Important:** Change the admin credentials in `app/api/admin/auth/route.ts` before production use.
