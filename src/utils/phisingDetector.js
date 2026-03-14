import fetch from 'node-fetch';

const PHISHING_API = 'https://phishing-api-df4y.onrender.com/analyze';

export const analyzeMessage = async (text) => {
  try {
    const response = await fetch(PHISHING_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    return await response.json();
  } catch (err) {
    console.error('Phishing API error:', err);
    return null;
  }
};