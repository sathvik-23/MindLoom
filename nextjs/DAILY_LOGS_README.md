# MindLoom Daily Logs and Summary Feature

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

Run the migration in `supabase/migrations/001_create_transcripts_table.sql` in your Supabase SQL Editor.

### 3. Features

- **Daily Logs**: View all conversations for a specific date
- **AI Summary**: Generate summaries using Google Gemini Flash 2.0
- **Dashboard**: Access both features at `/dashboard`

### 4. API Endpoints

- `GET /api/daily-logs?date=YYYY-MM-DD`
- `GET /api/daily-summary?date=YYYY-MM-DD`

### 5. Components

- `components/DailyLogs.tsx`
- `components/DailySummary.tsx`
- `app/dashboard/page.tsx`

## Usage

1. Navigate to `/dashboard`
2. Select a date
3. View logs and AI-generated summary
