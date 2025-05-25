// Simple test file to debug the agent
// Run with: node test-agent.js

console.log('🧪 Testing Sonic Pi Agent via API...\n');

async function testAgent() {
  try {
    console.log('1. Testing agent via fetch to localhost:3000...');
    
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'create a simple lofi beat', 
        useAgent: true 
      })
    });
    
    const result = await response.json();
    
    console.log('2. API Response:');
    console.log('   Status:', response.status);
    console.log('   Success:', result.success);
    console.log('   Method:', result.method);
    console.log('   Error:', result.error || 'none');
    console.log('   Code length:', result.code?.length || 0);
    
    if (result.code) {
      console.log('3. Generated Code Preview:');
      console.log(result.code.split('\n').slice(0, 8).map(line => `   ${line}`).join('\n'));
      if (result.code.split('\n').length > 8) {
        console.log('   ... (truncated)');
      }
    }
    
    console.log('\n4. Testing traditional method for comparison...');
    
    const traditionalResponse = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'create a simple lofi beat', 
        useAgent: false 
      })
    });
    
    const traditionalResult = await traditionalResponse.json();
    console.log('   Traditional Success:', traditionalResult.success);
    console.log('   Traditional Method:', traditionalResult.method);
    console.log('   Traditional Code length:', traditionalResult.code?.length || 0);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the dev server is running: npm run dev');
  }
}

testAgent(); 