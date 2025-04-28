// utils/redisClient.js
const Redis = require("ioredis");
require("dotenv").config(); // Important to load your .env variables

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {}, // Mandatory for Upstash
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis (Upstash) successfully!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

module.exports = redisClient;
