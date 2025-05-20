import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Handle OPTIONS requests first
app.options("/proxy", cors());

app.all("/proxy", async (req, res) => {
  try {
    if (!req.query.url) {
      return res.status(400).json({ error: "Missing target URL" });
    }

    const targetUrl = decodeURIComponent(req.query.url);

    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      redirect: "follow",
    };

    // Only include body for POST requests
    if (req.method === "POST") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      success: false,
      message: "Proxy server error: " + error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
