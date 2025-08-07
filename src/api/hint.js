// src/api/hint.js

import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { problemSlug } = req.body;

  if (!problemSlug) {
    return res.status(400).json({ error: 'Missing problemSlug in request body' });
  }

  // Replace with your Hugging Face API token
  const hf_api_token = process.env.HF_API_TOKEN;
  const model = 'google/flan-t5-large'; // Using google/flan-t5-large as the model

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      headers: { Authorization: `Bearer ${hf_api_token}` },
      method: 'POST',
      body: JSON.stringify({ inputs: `Provide a hint for the LeetCode problem: ${problemSlug}` }),
    });

    const result = await response.json();

    // The structure of the response depends on the model.
    // You might need to adjust this based on the chosen model's output.
    const hint = result[0]?.generated_text || 'Could not generate hint.';

    res.status(200).json({ hint });

  } catch (error) {
    console.error('Error fetching from Hugging Face API:', error);
    res.status(500).json({ error: 'Error generating hint' });
  }
};