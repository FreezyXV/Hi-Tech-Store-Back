// server.js
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
// const ngrok = require("@ngrok/ngrok"); // Décommenter si nécessaire

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

const allowedOrigins = [
  "https://freezyxv.github.io", // GitHub Pages
  "https://hi-tech-store-front.vercel.app", // Vercel Frontend
  "http://localhost:5173", // Local Development
  "https://js.stripe.com", // Stripe
  "http://localhost:3000"
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

app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
const connectToDB = async () => {
  try {
    mongoose.set("debug", true);
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    console.log("Connected to MongoDB with connection pooling");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/categories/:categoryId/brands", brandRoutes);
app.use("/api/categories/:categoryId/brands/:brandId/models", modelRoutes);

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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hi Tech Store Backend Server" });
});

app.use((req, res) => res.status(404).json({ message: "Not Found" }));

const PORT = process.env.PORT || 5002;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
  await connectToDB();
  console.log(`Server running on port ${PORT}`);

  // if (process.env.NGROK_AUTHTOKEN) {
  //   const tunnel = await ngrok.connect({
  //     addr: PORT,
  //     authtoken: process.env.NGROK_AUTHTOKEN,
  //     proto: "http",
  //   });
  //   console.log(`Ngrok tunnel established at ${tunnel.url}`);
  // }
});
