# OuluFind — Backend API

Lost & Found platform for University of Oulu. Built with Node.js, Express, PostgreSQL, and Prisma.

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express
- **Language** — TypeScript
- **Database** — PostgreSQL
- **ORM** — Prisma
- **Auth** — JWT
- **File Storage** — Supabase Storage
- **Email** — Resend
- **Validation** — Zod

---

## Project Structure
```
src/
  constants/        — shared enums matching Prisma schema
  controllers/      — request and response handling only
  services/         — core business logic
  repositories/     — all database queries
  middleware/       — auth, role guards, validation, file upload
  routes/           — API route definitions
  schemas/          — Zod validation schemas
  utils/            — Prisma client, Supabase client, pickup code generator
  app.ts            — Express app setup
  index.ts          — server entry point
prisma/
  schema.prisma     — database schema
  seed.ts           — seed data for development
```

---

## Roles

| Role | Access |
|---|---|
| Super Admin | Create events, create admins, view global stats |
| Admin | Manage items and claims for their assigned event |
| Public | Browse found items, upload found items, submit claims |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in your values.

### 3. Start PostgreSQL
```bash
docker-compose up -d
```

### 4. Run migrations and seed
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

### 5. Start the server
```bash
npm run dev
```

Server runs on `http://localhost:5000`


## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled build |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database |

---

## Notes

- Enums are defined in `src/constants/enums.ts` — update this file and `schema.prisma` together
- Photos are stored in Supabase Storage, only the public URL is saved in the database
- Pickup codes are generated on claim approval and sent to the claimer via email
- Public routes require no authentication
- Admin routes are scoped to the admin's assigned event only
