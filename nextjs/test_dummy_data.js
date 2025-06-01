// Quick test to verify dummy data is loaded
// Run this in your browser console when on the dashboard page

async function testDummyData() {
  const dates = [
    '2025-05-18', '2025-05-19', '2025-05-22', '2025-05-24', '2025-05-25', '2025-05-31'
  ];
  
  console.log('🧪 Testing MindLoom Dummy Data...\n');
  
  for (const date of dates) {
    try {
      // Test daily logs
      const logsRes = await fetch(`/api/daily-logs?date=${date}`);
      const logs = await logsRes.json();
      
      // Test daily summary
      const summaryRes = await fetch(`/api/daily-summary?date=${date}`);
      const summary = await summaryRes.json();
      
      console.log(`📅 ${date}:`);
      console.log(`  - Messages: ${logs.length || 0}`);
      console.log(`  - Summary: ${summary.summary ? '✅ Generated' : '❌ Failed'}`);
      
      if (date === '2025-05-24') {
        console.log(`  - Special: Weekly Review 🎯`);
      } else if (date === '2025-05-25') {
        console.log(`  - Special: Breakthrough Moment 💡`);
      }
    } catch (error) {
      console.error(`  - Error: ${error.message}`);
    }
  }
  
  console.log('\n✨ Test complete! Check the dates above in your dashboard.');
}

// Run the test
testDummyData();
