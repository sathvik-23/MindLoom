# Supabase Authentication Setup Guide

This guide explains how the Supabase authentication has been implemented in MindLoom and provides instructions for completing the setup.

## What's Been Implemented

1. **User Authentication**
   - Sign-in, sign-up, forgot password, and reset password pages
   - Authentication context provider
   - Protected routes via middleware
   - User profile management

2. **Database Schema Modifications**
   - Added `user_id` columns to all tables
   - Set up Row Level Security (RLS) policies
   - Created a profiles table to store user information
   - Added triggers for user creation

3. **API Updates**
   - Updated API routes to filter data by user ID
   - Added authentication to daily logs and summaries

4. **UI Components**
   - Updated navigation to show auth-specific links
   - Modified homepage to show different CTAs based on auth state
   - Added user profile page

## Setup Instructions

### 1. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 2. Set Environment Variables

Make sure your `.env.local` file has the Supabase URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Migration

Apply the Supabase migration to create the necessary tables and policies. You can do this using the Supabase CLI or by running the SQL statements directly in the Supabase SQL editor.

The migration file is located at:
```
/supabase/migrations/004_add_user_auth.sql
```

### 4. Enable Authentication Providers

In your Supabase dashboard:
1. Go to Authentication → Providers
2. Configure email authentication (and any other providers you want to use)
3. Set up email templates for sign-up, password reset, etc.

### 5. Test the Authentication

Run the application and test the authentication flow:
1. Sign up with a new account
2. Verify email (if enabled)
3. Sign in
4. Access protected routes
5. View and update your profile
6. Test password reset
7. Sign out

## Database Structure

The database now includes user-specific data with the following structure:

- **transcripts**: Conversation messages with `user_id` column
- **conversations**: Conversation metadata with `user_id` column
- **daily_summaries**: AI-generated summaries with `user_id` column
- **profiles**: User profile information linked to `auth.users`

Each table has Row Level Security (RLS) policies that ensure users can only access their own data.

## Additional Customization

You can further customize the authentication:

1. **Email Templates**: Customize the email templates in the Supabase dashboard
2. **Social Login**: Add social login providers like Google, GitHub, etc.
3. **UI Styling**: Update the auth pages to match your design system
4. **User Roles**: Implement different user roles for access control

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify Supabase project configuration
3. Make sure RLS policies are correctly applied
4. Check that environment variables are properly set
5. Review migration status in Supabase dashboard

## API Usage

When making API calls that require user data:

1. Always include the user ID in requests to protected endpoints
2. Use the `useAuth()` hook to get the current user: `const { user } = useAuth()`
3. Include the user ID in API requests: `/api/endpoint?userId=${user.id}`
