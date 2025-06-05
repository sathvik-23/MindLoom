const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fbaqelwyaewcxlsckzpk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYXFlbHd5YWV3Y3hsc2NrenBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc2NDMxNCwiZXhwIjoyMDY0MzQwMzE0fQ.ECEI1dQfo4n2Rn9ml-PIrw88zcsOk55LyjFzP08i3Vo'
);

async function checkDatabaseState() {
  console.log('Checking database state...\n');

  // Check transcripts table
  const { data: transcripts, error: transcriptsError } = await supabase
    .from('transcripts')
    .select('*')
    .limit(5);

  console.log('Transcripts table:');
  if (transcriptsError) {
    console.error('Error:', transcriptsError);
  } else {
    console.log(`Found ${transcripts?.length || 0} records`);
    if (transcripts && transcripts.length > 0) {
      console.log('Sample record:', transcripts[0]);
    }
  }

  // Check users
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  console.log('\nProfiles table:');
  if (profilesError) {
    console.error('Error:', profilesError);
  } else {
    console.log(`Found ${profiles?.length || 0} records`);
    if (profiles && profiles.length > 0) {
      console.log('Sample profile:', profiles[0]);
    }
  }

  // Check auth users (this might not work with service role)
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  
  console.log('\nAuth users:');
  if (authError) {
    console.error('Auth error:', authError);
  } else {
    console.log(`Found ${authData?.users?.length || 0} auth users`);
    if (authData?.users && authData.users.length > 0) {
      console.log('Sample user:', {
        id: authData.users[0].id,
        email: authData.users[0].email,
        created_at: authData.users[0].created_at
      });
    }
  }
}

checkDatabaseState().catch(console.error);
