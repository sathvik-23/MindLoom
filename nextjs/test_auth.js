// Test authentication with existing user
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fbaqelwyaewcxlsckzpk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYXFlbHd5YWV3Y3hsc2NrenBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc2NDMxNCwiZXhwIjoyMDY0MzQwMzE0fQ.ECEI1dQfo4n2Rn9ml-PIrw88zcsOk55LyjFzP08i3Vo'
);

async function checkUserAuth() {
  const userId = '11644517-399a-4ddf-b872-675d0e7c7354';
  
  // Get user details from auth
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
  
  if (userError) {
    console.error('Error getting user:', userError);
    return;
  }
  
  console.log('User details:');
  console.log({
    id: userData.user?.id,
    email: userData.user?.email,
    created_at: userData.user?.created_at,
    email_confirmed_at: userData.user?.email_confirmed_at,
    last_sign_in_at: userData.user?.last_sign_in_at
  });

  // If user exists but email is not confirmed, confirm it
  if (userData.user && !userData.user.email_confirmed_at) {
    console.log('Email not confirmed, confirming...');
    
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true
    });
    
    if (error) {
      console.error('Error confirming email:', error);
    } else {
      console.log('Email confirmed successfully');
    }
  }
  
  // Update password to a known value for testing
  console.log('Setting password to "password123"...');
  const { data: passwordData, error: passwordError } = await supabase.auth.admin.updateUserById(userId, {
    password: 'password123'
  });
  
  if (passwordError) {
    console.error('Error setting password:', passwordError);
  } else {
    console.log('Password set successfully');
  }
}

checkUserAuth().catch(console.error);
