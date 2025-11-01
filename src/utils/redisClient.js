// utils/redisClient.js
const Redis = require("ioredis");

let redisClient = null;

// Only create Redis client if REDIS_URL is configured
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    tls: {
      rejectUnauthorized: false, // Important for Upstash / Vercel
    },
    maxRetriesPerRequest: 3, // Limit retries to avoid infinite loop
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn("⚠️ Redis connection failed after 3 retries. Running without cache.");
        return null; // Stop retrying
      }
      return Math.min(times * 100, 2000); // Exponential backoff
    },
  });

  redisClient.on("connect", () => {
    console.log("✅ Connected to Redis (Upstash) successfully!");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err.message);
  });
} else {
  console.warn("⚠️ REDIS_URL not configured. Running without cache.");
}

module.exports = redisClient;
