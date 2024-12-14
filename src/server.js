//server.js
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const ngrok = require("@ngrok/ngrok");

dotenv.config();

if (
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  !process.env.STRIPE_SECRET_KEY
) {
  console.error(
    "FATAL ERROR: MONGO_URI, JWT_SECRET, and STRIPE_SECRET_KEY must be defined in .env"
  );
  process.exit(1);
}

const app = express();

const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const modelRoutes = require("./routes/modelRoutes");
const variantRoutes = require("./routes/variantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const specRoutes = require("./routes/specRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorHandler = require("./middlewares/errorHandler");

// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:5173", // Allow localhost during development
//   "https://freezyxv.github.io",                       // Allow your GitHub Pages URL
//   "https://js.stripe.com", 'https://hi-tech-store-front.vercel.app'                           // Allow Stripe's API
// ];

const allowedOrigins = [
  process.env.FRONTEND_URL, // GitHub Pages
  process.env.FRONTEND_URL_VERCEL, // Vercel Frontend
  "http://localhost:5173", // Local Development
  "https://js.stripe.com", // Stripe
];


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const connectToDB = async () => {
  try {
    mongoose.set("debug", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/categories/:categoryId/brands", brandRoutes);
app.use("/api/categories/:categoryId/brands", modelRoutes);

app.use(
  "/api/categories/:categoryId/brands/:brandId/models/:modelId/variants",
  variantRoutes
);

app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/specs", specRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);

app.set("trust proxy", true);
app.use(errorHandler);

app.use((req, res) => res.status(404).json({ message: "Not Found" }));

if (require.main === module) {
  const PORT = process.env.PORT || 5002;
  const server = http.createServer(app);

  server.listen(PORT, async () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
    await connectToDB();

    // if (process.env.NGROK_AUTHTOKEN) {
    //   const tunnel = await ngrok.connect({
    //     addr: PORT,
    //     authtoken: process.env.NGROK_AUTHTOKEN,
    //     proto: "http",
    //   });
    //   console.log(`Ngrok tunnel established at ${tunnel.url}`);
    // }
    console.log(`Server running on port ${PORT}`);

  });
}

// module.exports = { app, connectToDB };
module.exports = app;
