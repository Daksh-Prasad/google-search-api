require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const { API_KEY, CX, PORT } = process.env;

const GOOGLE_API_URL = "https://www.googleapis.com/customsearch/v1";

// Web Search Endpoint
app.post("/search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await axios.get(GOOGLE_API_URL, {
      params: {
        key: API_KEY,
        cx: CX,
        q: query,
      },
    });

    const results = response.data.items?.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    })) || [];

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Image Search Endpoint
app.post("/image", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await axios.get(GOOGLE_API_URL, {
      params: {
        key: API_KEY,
        cx: CX,
        q: query,
        searchType: "image",
      },
    });

    const results = response.data.items?.map(item => ({
      title: item.title,
      link: item.link,
      image: item.image?.thumbnailLink || item.link,
      context: item.image?.contextLink,
    })) || [];

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT || 3000, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
