# 🚀 MindLoom Dummy Data Setup Guide

## Step 1: Load the Data into Supabase

1. **Open Supabase SQL Editor**
   - I've opened it for you: https://app.supabase.com/project/fbaqelwyaewcxlsckzpk/sql/new
   - Or navigate: Supabase Dashboard → SQL Editor → New Query

2. **Copy and Paste the SQL**
   - Open file: `/supabase/migrations/002_dummy_data_simple.sql`
   - Copy ALL the content
   - Paste into the SQL Editor

3. **Run the Query**
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - You should see: "Success. X rows affected" (around 100+ rows)

## Step 2: Test the Dashboard

1. **Open the Dashboard**
   - Go to: http://localhost:3000/dashboard
   - (I've opened it for you)

2. **Navigate Through Dates**
   - Use the date picker to go to **May 2025**
   - Click through dates: May 18-31

## Step 3: Key Dates to Check

### 📅 May 18 - Starting Strong
- Morning reflection about fitness and Python goals
- Sets intentions for the day

### 📅 May 19 - Goal Adjustment
- Important conversation about making goals more realistic
- Adds meditation goal

### 📅 May 22 - Anxiety Management
- Dealing with presentation anxiety
- Breathing exercises and coping strategies

### 📅 May 24 - Weekly Review
- Comprehensive progress check:
  - Fitness: 100% (4/4 workouts)
  - Python: 67% (2/3 lessons)
  - Work-life: 75% (3/4 days)
  - Meditation: 86% (6/7 days)

### 📅 May 25 - Breakthrough Moment
- Major realization about self-worth and productivity
- Turning point for work-life balance

### 📅 May 31 - Month-End Reflection
- Looking back at progress
- Setting intentions for June

## Step 4: Verify Everything Works

1. **Check Conversations Display**
   - Messages should appear in chat bubbles
   - User messages on right (blue)
   - AI messages on left (gray)

2. **Check AI Summaries**
   - Should extract goal progress
   - Identify key topics and emotions
   - Provide actionable insights

3. **Test Date Navigation**
   - Previous/Next buttons work
   - Can't go beyond today
   - "Today" badge appears correctly

## 🎯 What to Look For

### In Daily Logs:
- Natural conversation flow
- Goal discussions
- Emotional expressions
- Progress updates

### In AI Summaries:
- **Key Topics** section
- **Goal Progress** extracted
- **Emotional Tone** identified
- **Action Items** highlighted

## 🐛 Troubleshooting

If no data appears:
1. Check browser console for errors (F12)
2. Ensure SQL was run successfully
3. Refresh the page
4. Check date is in May 2025 range

If summaries fail:
1. Check Gemini API key in .env.local
2. Look for fallback summaries (still shows basic info)
3. Check browser console for API errors

## ✅ Success Indicators

You'll know it's working when:
- Conversations appear for May 18-31, 2025
- Each day shows realistic journal entries
- AI summaries capture goal progress and emotions
- Weekly review (May 24) shows detailed stats
- Breakthrough moment (May 25) appears impactful

## 🎉 Next Steps

Once data is loaded:
1. Explore different conversation patterns
2. See how AI summarizes different types of days
3. Notice the emotional journey across 2 weeks
4. Start planning Goal Tracking UI based on the data structure

Enjoy exploring your AI journal with realistic conversations! The dummy data provides a solid foundation for building and testing new features.
