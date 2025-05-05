const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json()); // Required to read JSON body

// Load API config from environment
const API_KEY = process.env.API_KEY;
const CX = process.env.CX;

if (!API_KEY || !CX) {
  console.error("❌ Missing API_KEY or CX environment variables.");
  process.exit(1);
}

// /search endpoint for text results
app.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing 'query' field" });

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// /image endpoint for image search
app.post('/image', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing 'query' field" });

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}&searchType=image`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Image Search Error:", error);
    res.status(500).json({ error: 'Failed to fetch image results' });
  }
});

// Root test route
app.get('/', (req, res) => {
  res.send('✅ Google Search API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
