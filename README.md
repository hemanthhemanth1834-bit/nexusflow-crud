# NexusFlow — Premium CRUD Application

A production-quality full-stack CRUD application with a persistent SQLite database, premium glassmorphism UI, 3D effects, and smooth animations.
live link:https://crud-app-sable-alpha.vercel.app
## Features

- **Full CRUD** — Create, Read, Update, Delete records
- **Search** — Debounced full-text search across title and description
- **Filter** — Filter by status, priority, and category
- **Sort** — Sort by newest, oldest, name, or recently updated
- **Persistent Storage** — SQLite database via Prisma ORM (survives refreshes and restarts)
- **Form Validation** — Client-side and server-side validation with Zod
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
- SQLite (portable, no setup required)
- Zod (validation)
- Helmet, CORS, Morgan (security/logging)

## Project Structure

```
crud-app/
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── Header.tsx     # Sticky glass header
│   │   │   ├── Dashboard.tsx  # Dashboard homepage
│   │   │   ├── RecordsList.tsx # Records management
│   │   │   ├── RecordForm.tsx  # Create/Edit modal
│   │   │   ├── DeleteDialog.tsx # Delete confirmation
│   │   │   ├── ViewDialog.tsx  # Record detail view
│   │   │   ├── StatsCard.tsx   # Animated stats card
│   │   │   ├── AnimatedCounter.tsx # Spring-animated number
│   │   │   ├── StatusBadge.tsx # Status pill badge
│   │   │   ├── PriorityBadge.tsx # Priority pill badge
│   │   │   ├── CategoryBadge.tsx # Category pill badge
│   │   │   ├── Toast.tsx       # Toast notification system
│   │   │   ├── Background3D.tsx # Floating gradient blobs
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── hooks/             # React Query hooks
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css          # Tailwind + custom styles
│   └── index.html
├── server/                    # Backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── routes/            # Express routes
│   │   ├── validators/        # Zod schemas
│   │   ├── middleware/         # Error handling
│   │   ├── utils/             # Prisma singleton
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Sample data
│   │   └── dev.db             # SQLite database
│   └── .env
├── .env.example
└── README.md
```

## Installation

```bash
# Navigate to the crud-app directory
cd crud-app

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Environment Setup

```bash
# Server (.env is pre-configured for development)
# Optional: copy and customize
cp .env.example server/.env
```

Required environment variables:
- `DATABASE_URL` — Database connection string (default: `file:./dev.db`)
- `PORT` — Server port (default: `3001`)
- `NODE_ENV` — Environment mode (default: `development`)

## Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data (optional)
npx tsx prisma/seed.ts
```

## Running the Application

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd client
npm run dev
```

Open http://localhost:5173

## Production Build

```bash
# Build the frontend
cd client
npm run build

# The server can run directly
cd ../server
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records` | List records (with search, filter, sort, pagination) |
| GET | `/api/records/stats` | Get dashboard statistics |
| GET | `/api/records/search?q=term` | Search records |
| GET | `/api/records/:id` | Get a single record |
| POST | `/api/records` | Create a record |
| PUT | `/api/records/:id` | Update a record |
| DELETE | `/api/records/:id` | Delete a record |

### Query Parameters (GET /api/records)

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search in title and description |
| `status` | string | Filter: active, archived, draft |
| `priority` | string | Filter: low, medium, high, critical |
| `category` | string | Filter: general, project, task, note, idea |
| `sort` | string | Sort: `field:direction` (e.g., `createdAt:desc`) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 50) |

## Testing

All CRUD operations were tested end-to-end:

- **CREATE** — POST /api/records → 201 Created
- **READ** — GET /api/records/:id → 200 OK
- **UPDATE** — PUT /api/records/:id → 200 OK
- **DELETE** — DELETE /api/records/:id → 200 OK
- **NOT FOUND** — GET deleted record → 404 Not Found
- **LIST** — GET /api/records → 200 OK with pagination
- **STATS** — GET /api/records/stats → 200 OK with real data
