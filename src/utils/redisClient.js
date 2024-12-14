const Redis = require("ioredis");

const redisClient = new Redis({
  host: "pumped-possum-29949.upstash.io", // Upstash Redis Host
  port: 6379, // Upstash Redis Port
  password: "AXT9AAIjcDE5NDRiNjM0ZDY1OWE0MDc3ODBmNDlmNDcwZDFhNmU0M3AxMA", // Upstash Redis Password
  tls: {}, // Ensure TLS is enabled for secure communication
});

redisClient.on("connect", () => {
  console.log("Connected to Redis Cloud (Upstash) successfully!");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis Cloud (Upstash):", err.message);
});

module.exports = redisClient;
