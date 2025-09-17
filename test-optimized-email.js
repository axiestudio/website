console.log('🚀 Testing OPTIMIZED AxieStudio Email System...');
console.log('⏱️  Measuring response times...\n');

// Test Newsletter Subscription
async function testNewsletter() {
  const startTime = Date.now();
  try {
    console.log('📧 Testing Newsletter Subscription...');
    const response = await fetch('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'newsletter-speed-test@example.com'
      }),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;
    console.log(`✅ Newsletter Response: ${response.status} (${duration}ms)`);
    console.log('📊 Data:', data);
    console.log('');
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Newsletter Error (${duration}ms):`, error);
  }
}

// Test Consultation Request
async function testConsultation() {
  const startTime = Date.now();
  try {
    console.log('📋 Testing Consultation Request...');
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Speed Test User',
        email: 'consultation-speed-test@example.com',
        company: 'Performance Testing Co',
        phone: '+1-555-SPEED',
        usecase: 'Testing optimized email performance for AxieStudio',
        timeline: 'ASAP'
      }),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;
    console.log(`✅ Consultation Response: ${response.status} (${duration}ms)`);
    console.log('📊 Data:', data);
    console.log('');
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Consultation Error (${duration}ms):`, error);
  }
}

// Run tests with timing
async function runTests() {
  console.log('🔧 OPTIMIZATIONS APPLIED:');
  console.log('  • Increased rate limiting delay to 2 seconds');
  console.log('  • Added webhook timeout protection (2s)');
  console.log('  • Disabled problematic webhook URL');
  console.log('  • Enhanced error handling\n');
  
  await testNewsletter();
  await testConsultation();
  
  console.log('🎯 EXPECTED IMPROVEMENTS:');
  console.log('  • Newsletter: ~4-6 seconds (was 28+ seconds)');
  console.log('  • Consultation: ~6-8 seconds (was 18+ seconds)');
  console.log('  • No more connection timeout errors');
  console.log('  • Reduced rate limiting failures');
}

runTests();
