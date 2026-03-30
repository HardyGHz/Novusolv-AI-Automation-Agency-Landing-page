import { GoogleGenerativeAI } from '@google/generative-ai';

async function testKey() {
  const apiKey = 'AIzaSyAqFHMVwGyLRp1FRW93bivqemOgpE5aEd8';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent('Hi, say "Key is working!"');
    console.log('SUCCESS:', result.response.text());
  } catch (error) {
    console.error('FAILURE:', error.message);
  }
}

testKey();
