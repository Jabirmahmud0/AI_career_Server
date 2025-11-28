const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Load multiple API keys from environment variables
const API_KEYS = [
  process.env.GOOGLE_AI_API_KEY,
  process.env.GOOGLE_AI_API_KEY_2,
  process.env.GOOGLE_AI_API_KEY_3,
  process.env.GOOGLE_AI_API_KEY_4,
  process.env.GOOGLE_AI_API_KEY_5,
  process.env.GOOGLE_AI_API_KEY_6
].filter(key => key); // Filter out undefined keys

console.log(`Loaded ${API_KEYS.length} Google AI API Keys:`);
API_KEYS.forEach((key, index) => {
  console.log(`Key ${index + 1}: ${key ? `${key.substring(0, 10)}...${key.substring(key.length - 5)}` : 'MISSING'}`);
});

if (API_KEYS.length === 0) {
  console.error('No API keys found! Please check your .env file.');
  process.exit(1);
}

// Test each API key
async function testApiKeys() {
  console.log('\nTesting each API key:');
  
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      console.log(`\nTesting Key ${i + 1}...`);
      const genAI = new GoogleGenerativeAI(API_KEYS[i]);
      const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_AI_MODEL || 'gemini-2.5-flash' });
      
      // Simple test prompt
      const prompt = "Say 'Hello, World!' in 5 different languages.";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ Key ${i + 1} is working:`);
      console.log(text.substring(0, 100) + (text.length > 100 ? '...' : ''));
    } catch (error) {
      console.log(`❌ Key ${i + 1} failed:`, error.message);
    }
  }
}

// Run the test
testApiKeys().then(() => {
  console.log('\nAPI key testing completed.');
}).catch(err => {
  console.error('Test failed:', err);
});