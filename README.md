# NexusFlow — Premium CRUD Application

A production-quality full-stack CRUD application with a **PostgreSQL** database (via Prisma ORM), a **relational** schema (User → Project → Record), premium glassmorphism UI, 3D effects, and smooth animations.

- **Live application:** [https://crud-app-sable-alpha.vercel.app](https://crud-app-sable-alpha.vercel.app)
- **Repository:** [https://github.com/hemanthhemanth1834-bit/nexusflow-crud](https://github.com/hemanthhemanth1834-bit/nexusflow-crud)

## Features

- **Full CRUD** — Create, Read, Update, Delete records (persisted in PostgreSQL)
- **Search** — Debounced full-text search across title and description
- **Filter** — Filter by status, priority, and category
- **Sort** — Sort by newest, oldest, name, or recently updated
- **Persistent Storage** — PostgreSQL database via Prisma ORM (survives refreshes and server restarts)
- **Server-side Validation** — Zod validation on create/update (tested directly against the API)
- **Loading States** — Skeleton loaders and spinner animations
- **Empty States** — Beautiful empty state messaging
- **Error Handling** — Graceful error states with retry options
- **Toast Notifications** — Success/error/info notifications
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Accessible** — Keyboard navigation, ARIA labels, focus management
- **Premium UI** — Dark glassmorphism theme, 3D effects, micro-interactions

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion (animations)
- TanStack React Query (server state)
- Lucide React (icons)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- **PostgreSQL** (hosted production database)
- Zod (validation)
- Helmet, CORS, Morgan (security/logging)

### Deployment
- **Vercel** (serverless API + static frontend)
- **Neon / Supabase / Vercel Postgres** (hosted PostgreSQL)

## Database — Relational Schema

> The schema defines **3 related tables** as required.

```
User ──1──●── Project ──1──●── Record
```

| Model | Relationships |
|-------|---------------|
| `User` | has many `Project` |
| `Project` | belongs to `User`, has many `Record` |
| `Record` | belongs to `Project` (optional) |

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  projects  Project[]
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String   @default("")
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  records     Record[]
}

model Record {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @default("")
  status      String   @default("active")
  priority    String   @default("medium")
  category    String   @default("general")
  projectId   Int?
  project     Project? @relation(fields: [projectId], references: [id])
}
```

## Project Structure

```
nexusflow-crud/
├── api/
│   └── index.ts              # Vercel serverless handler → Express app → Prisma
├── client/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # React Query hooks
│   │   ├── services/         # API client
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   └── index.html
├── server/                   # Backend
│   ├── src/
│   │   ├── app.ts            # Shared Express app (used by API + local server)
│   │   ├── controllers/      # Route handlers (Prisma)
│   │   ├── routes/           # Express routes
│   │   ├── validators/       # Zod schemas
│   │   ├── middleware/       # Error handling
│   │   ├── utils/prisma.ts   # Prisma singleton
│   │   └── index.ts          # Local server entry point
│   └── prisma/
│       ├── schema.prisma     # Database schema (PostgreSQL)
│       └── seed.ts           # Sample data (User → Project → Records)
├── package.json
├── vercel.json
├── .env.example
└── README.md
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Hosted PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NODE_ENV` | Environment mode | `production` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://crud-app-sable-alpha.vercel.app` |
| `PORT` | Server port (local) | `3001` |
| `VITE_API_URL` | Frontend API base | `/api` |

> **Do not commit your real `DATABASE_URL`.** Set it as a Vercel Environment Variable (Settings → Environment Variables → `DATABASE_URL`) instead.

## Local Development

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure server/.env with your PostgreSQL DATABASE_URL

# 3. Set up the database
cd server
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 4. Run
cd server && npm run dev     # backend  (port 3001)
cd client && npm run dev     # frontend (port 5173)
```

## API Endpoints

All production CRUD operations go through `Prisma → PostgreSQL`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records` | List records (search, filter, sort, pagination) |
| GET | `/api/records/stats` | Dashboard statistics |
| GET | `/api/records/search?q=term` | Search records |
| GET | `/api/records/:id` | Get a single record |
| POST | `/api/records` | Create a record |
| PUT | `/api/records/:id` | Update a record |
| DELETE | `/api/records/:id` | Delete a record |

### Server-side validation (Zod)

- `title` → required, max 200 characters
- `description` → max 2000 characters
- `status` → `active` / `archived` / `draft`
- `priority` → `low` / `medium` / `high` / `critical`
- `category` → `general` / `project` / `task` / `note` / `idea`

Invalid payloads (e.g. `{ "title": "" }`) return **HTTP 400** with `{ "error": "Validation failed", ... }`.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repo in Vercel (Framework Preset: `Other`).
3. Add Environment Variables:
   - `DATABASE_URL` — your hosted PostgreSQL connection string
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = your deployed URL (e.g. `https://crud-app-sable-alpha.vercel.app`)
4. Deploy. The `vercel-build` script generates the Prisma client and builds the frontend.

> The Vercel serverless function (`api/index.ts`) mounts the same Express app used in development — **one API, one Prisma backend** — connected to the hosted PostgreSQL database.
