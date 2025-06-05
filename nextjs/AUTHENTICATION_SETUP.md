# Supabase Authentication Setup Guide for MindLoom

This guide provides instructions for setting up Supabase authentication in the MindLoom application to ensure each user has their own data.

## 1. Apply Database Migration

First, you need to apply the SQL migration that adds authentication and row-level security to your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Open and run the `/supabase/migrations/004_add_user_auth.sql` file

This migration:
- Adds `user_id` columns to your existing tables
- Sets up Row Level Security (RLS) policies
- Creates a profiles table
- Adds triggers for automatically creating profile entries

## 2. Configure Email Settings

To enable email verification and password reset:

1. In Supabase dashboard, go to Authentication → Email Templates
2. Configure templates for:
   - Email Confirmation
   - Magic Link
   - Recovery (Password Reset)
   - Change Email

3. In Authentication → Providers → Email:
   - Enable "Confirm email" for secure signup
   - Set a secure password policy

## 3. Set up SMTP for Email Delivery

1. In Authentication → Email, configure SMTP settings:
   - Add your SMTP Host (e.g., smtp.gmail.com)
   - Set Port (465 for SSL, 587 for TLS)
   - Enter SMTP Username and Password
   - Set Sender Name and Email

## 4. Environment Variables

Ensure your `.env.local` file has these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Test Authentication Flow

Test the complete authentication flow:

1. Sign up with a new email
2. Verify the email if confirmation is enabled
3. Sign in with the new account
4. Test profile updates in the profile page
5. Test forgot password flow
6. Confirm that Row Level Security works by creating data in one account and verifying it's not visible in another account

## 6. Data Migration (If Needed)

If you have existing data that needs to be associated with users:

1. Create test user accounts
2. Assign existing data to these users using SQL:

```sql
-- Example: Assign transcripts to a user
UPDATE transcripts 
SET user_id = 'user-uuid-here'
WHERE user_id IS NULL;

-- Do the same for other tables
UPDATE conversations SET user_id = 'user-uuid-here' WHERE user_id IS NULL;
UPDATE daily_summaries SET user_id = 'user-uuid-here' WHERE user_id IS NULL;
```

## 7. Common Issues and Solutions

- **Email not sending**: Check SMTP configuration and credentials
- **Authentication not working**: Check browser console for errors and ensure environment variables are correct
- **Cannot see user data**: Confirm RLS policies are correctly applied
- **Multiple redirects**: Check middleware redirect logic

## Next Steps After Setup

Once authentication is working:

1. Add more user preferences in the profile table
2. Implement social login (Google, GitHub, etc.)
3. Add role-based access control if needed
4. Set up analytics to track user engagement

## Security Best Practices

- Keep your Supabase credentials secure
- Use HTTPS in production
- Regularly check for unauthorized access
- Set up monitoring for your Supabase project
- Keep your Supabase project and dependencies updated
