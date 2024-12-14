const Redis = require("ioredis");

const redisClient = new Redis({
  host: "redis-11637.c339.eu-west-3-1.ec2.reds.redis-cloud.com", // Replace with your Redis host
  port: 11637, // Replace with your Redis port
  password: "6oGYojWpX8lpJ3rJ4CvHqgRTlyLL6C3L", // Replace with your Redis password
});

redisClient.on("connect", () => {
  console.log("Connected to Redis Cloud successfully!");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis Cloud:", err.message);
});

module.exports = redisClient;
