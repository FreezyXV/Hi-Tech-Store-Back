// const Redis = require("ioredis");

// const redisClient = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: process.env.REDIS_PORT || 6379,
//   retryStrategy(times) {
//     const delay = Math.min(times * 50, 2000);
//     console.warn(`Retrying Redis connection in ${delay}ms`);
//     return delay;
//   },
// });

// redisClient.on("connect", () => {
//   console.log("Connected to Redis");
// });

// redisClient.on("error", (err) => {
//   console.error("Redis error:", err.message);
// });

// module.exports = redisClient;
