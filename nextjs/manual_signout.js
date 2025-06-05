// Manual sign out script
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fbaqelwyaewcxlsckzpk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYXFlbHd5YWV3Y3hsc2NrenBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc2NDMxNCwiZXhwIjoyMDY0MzQwMzE0fQ.ECEI1dQfo4n2Rn9ml-PIrw88zcsOk55LyjFzP08i3Vo'
);

async function signOutUser() {
  const userId = '11644517-399a-4ddf-b872-675d0e7c7354';
  
  console.log('Signing out all sessions for user...');
  const { error } = await supabase.auth.admin.signOut(userId);
  
  if (error) {
    console.error('Error signing out:', error);
  } else {
    console.log('Successfully signed out all sessions');
  }
}

signOutUser().catch(console.error);
