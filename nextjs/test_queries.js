const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fbaqelwyaewcxlsckzpk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYXFlbHd5YWV3Y3hsc2NrenBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc2NDMxNCwiZXhwIjoyMDY0MzQwMzE0fQ.ECEI1dQfo4n2Rn9ml-PIrw88zcsOk55LyjFzP08i3Vo'
);

async function testQueries() {
  const userId = '11644517-399a-4ddf-b872-675d0e7c7354';
  
  console.log('Testing different date query approaches...\n');

  // Get all records for the user to see dates
  const { data: allRecords, error: allError } = await supabase
    .from('transcripts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (allError) {
    console.error('Error getting all records:', allError);
    return;
  }

  console.log(`Found ${allRecords?.length || 0} total records for user`);
  
  // Show all unique dates
  const uniqueDates = [...new Set(allRecords?.map(r => 
    new Date(r.created_at).toISOString().split('T')[0]
  ) || [])];
  
  console.log('Unique dates found:', uniqueDates);
  
  // Test with the actual date that has data
  const testDate = '2025-06-02';
  console.log(`\nTesting queries for date: ${testDate}`);
  
  // Test 1: Range query
  const startOfDay = `${testDate}T00:00:00.000Z`;
  const endOfDay = `${testDate}T23:59:59.999Z`;
  
  const { data: rangeData, error: rangeError } = await supabase
    .from('transcripts')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)
    .order('created_at', { ascending: true });

  console.log('Range query result:');
  if (rangeError) {
    console.error('Error:', rangeError);
  } else {
    console.log(`Found ${rangeData?.length || 0} records`);
  }

  // Test 2: Text filter
  const { data: textData, error: textError } = await supabase
    .from('transcripts')
    .select('*')
    .eq('user_id', userId)
    .filter('created_at::text', 'ilike', `${testDate}%`)
    .order('created_at', { ascending: true });

  console.log('Text filter result:');
  if (textError) {
    console.error('Error:', textError);
  } else {
    console.log(`Found ${textData?.length || 0} records`);
  }
  
  // Show sample records with their dates
  if (allRecords && allRecords.length > 0) {
    console.log('\nSample records with dates:');
    allRecords.slice(0, 5).forEach((record, idx) => {
      console.log(`Record ${idx + 1}:`);
      console.log(`  ID: ${record.id}`);
      console.log(`  Created: ${record.created_at}`);
      console.log(`  Date part: ${new Date(record.created_at).toISOString().split('T')[0]}`);
      console.log(`  Role: ${record.role}`);
      console.log(`  Message preview: ${record.message.substring(0, 80)}...`);
      console.log('');
    });
  }
}

testQueries().catch(console.error);
