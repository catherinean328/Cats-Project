# Ventishh Setup Guide

## 🗄️ Database Setup (Neon)

### 1. Create Neon Database

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up/login and create a new project
3. Copy your database connection string

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

Replace with your actual Neon database URL.

### 3. Generate and Run Migrations

```bash
# Generate migration files
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Optional: Open Drizzle Studio to view your database
npm run db:studio
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Platform

### Test Flow:

1. **Open two browser tabs** to http://localhost:3000

2. **Tab 1 - Listener:**
   - Click "I want to listen"
   - Enter Telegram username (e.g., `@testlistener`)
   - Click "Start Listening"

3. **Tab 2 - Venter:**
   - Click "I need to vent"
   - Wait for automatic matching
   - Click "Vent Now" to open Telegram

### Expected Behavior:

- **Immediate matching** when 1 listener + 1 venter
- **Real-time updates** on landing page showing counts
- **Listener usernames** visible on landing page
- **Queue status** with real-time counts
- **Telegram deep linking** for voice calls

## 🏗️ Architecture Overview

### Simplified Stack:
- **Frontend**: Next.js + TypeScript + Tailwind
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Real-time**: Polling every 3 seconds (no WebSockets)
- **Voice Calls**: Telegram integration

### Key Features:
- ✅ No WebSocket complexity
- ✅ Database persistence 
- ✅ Simple API routes
- ✅ Real-time UI updates via polling
- ✅ Anonymous sessions
- ✅ Telegram deep linking

## 📱 Production Deployment

### Vercel (Frontend):
1. Push to GitHub
2. Connect to Vercel
3. Add `DATABASE_URL` environment variable

### Neon (Database):
- Already configured and ready
- Scales automatically
- Built-in connection pooling

No separate server needed! 🎉