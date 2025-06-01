#!/bin/bash

# MindLoom Dummy Data Setup Script
# This script helps you load the dummy data into Supabase

echo "🚀 MindLoom Dummy Data Setup"
echo "============================"
echo ""
echo "📋 Steps to load dummy data:"
echo ""
echo "1. Open your Supabase Dashboard:"
echo "   https://app.supabase.com/project/fbaqelwyaewcxlsckzpk"
echo ""
echo "2. Navigate to SQL Editor (left sidebar)"
echo ""
echo "3. Click 'New Query'"
echo ""
echo "4. Copy and paste the contents of:"
echo "   supabase/migrations/002_dummy_journal_data.sql"
echo ""
echo "5. Click 'Run' to execute the query"
echo ""
echo "6. You should see '~112 rows affected' message"
echo ""
echo "📊 After loading data:"
echo ""
echo "- Visit http://localhost:3000/dashboard"
echo "- Use the date picker to navigate to May 18-31, 2025"
echo "- You'll see conversations and AI summaries for each day"
echo ""
echo "🎯 Notable dates to check:"
echo "- May 19: Goal setting conversation"
echo "- May 22: Anxiety management discussion"
echo "- May 24: Weekly review with progress stats"
echo "- May 25: Breakthrough realization about work-life balance"
echo ""
echo "Press Enter to open the SQL file in your default editor..."
read

# Open the SQL file
open /Users/sathvik/Desktop/MindLoom/nextjs/supabase/migrations/002_dummy_journal_data.sql
