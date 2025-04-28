// utils/redisClient.js
const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis (Upstash) successfully!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

module.exports = redisClient;
