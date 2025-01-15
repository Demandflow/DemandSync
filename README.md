# DemandSync

A modern task management system that synchronizes with ClickUp, providing a streamlined client portal experience.

## Features

- 🎯 Real-time task synchronization with ClickUp
- 📊 Kanban board interface
- 🔒 Secure authentication with Clerk
- 🚀 Built with Next.js 14
- 💾 PostgreSQL database
- 🔄 Real-time updates with Socket.io

## Tech Stack

- **Frontend:** Next.js 14, React, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma
- **Authentication:** Clerk
- **Real-time:** Socket.io
- **Deployment:** Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Database
DATABASE_URL=

# Redis
REDIS_URL=

# ClickUp
CLICKUP_API_KEY=
CLICKUP_WEBHOOK_SECRET=
NEXT_PUBLIC_CLICKUP_LIST_ID=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Socket.io
NEXT_PUBLIC_SOCKET_URL=
SOCKET_PORT=

# App URL
NEXT_PUBLIC_APP_URL=
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint 