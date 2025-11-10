# Hi-Tech Store - Backend

This is the backend for the Hi-Tech Store, a full-stack e-commerce application designed to showcase a wide variety of electronic products. The backend is built with Node.js and Express, and it provides a RESTful API for managing products, users, orders, and more.


## Table of Contents

*   [About The Project](#about-the-project)
*   [Built With](#built-with)
*   [Architecture](#architecture)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
    *   [Running the server](#running-the-server)
    *   [Running tests](#running-tests)
*   [API Endpoints](#api-endpoints)
*   [Project Structure](#project-structure)
*   [Environment Variables](#environment-variables)
*   [Deployment](#deployment)
*   [Contributing](#contributing)
*   [License](#license)

## About The Project

The Hi-Tech Store backend is a robust and scalable server-side application that powers the e-commerce platform. It handles all the business logic, data storage, and authentication for the application.

### Features

*   **Authentication:** Secure user authentication using JSON Web Tokens (JWT) with 1-hour token expiration.
*   **Product Management:** Full CRUD functionality for products, categories, brands, models, variants, and specifications.
*   **Redis Caching:** Categories are cached with Redis (Upstash) with 5-10 minute TTL for improved performance.
*   **Shopping Cart:** Persistent shopping cart for authenticated users with full CRUD operations.
*   **Wishlist:** Users can add/remove products from their wishlist.
*   **Order Processing:** Secure order processing with Stripe Payment Intents integration.
*   **Product Reviews:** Users can leave reviews and ratings for products with full CRUD functionality.
*   **Search:** Powerful search functionality across products, categories, brands, and models.
*   **User Profile Management:** Users can update their profile and change their password.
*   **Service Layer Architecture:** Dedicated service layer (OrderService, CartService, CheckoutService, SpecService) for business logic.
*   **Error Handling:** Centralized error handling with custom AppError class and 70+ error messages.
*   **Input Validation:** Comprehensive validation using Joi and Express-Validator.

## Built With

*   [Node.js](https://nodejs.org/) - JavaScript runtime
*   [Express.js](https://expressjs.com/) - Web framework
*   [MongoDB](https://www.mongodb.com/) - NoSQL database
*   [Mongoose](https://mongoosejs.com/) - MongoDB ODM
*   [Redis](https://redis.io/) - In-memory caching (Upstash)
*   [JSON Web Token (JWT)](https://jwt.io/) - Authentication
*   [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing (10 salt rounds)
*   [Stripe](https://stripe.com/) - Payment processing
*   [Joi](https://joi.dev/) - Schema validation
*   [Express-Validator](https://express-validator.github.io/) - Request validation
*   [Jest](https://jestjs.io/) - Testing framework

## Architecture

The backend follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────┐
│                   Client Request                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│               Middleware Layer                       │
│  • Authentication (JWT)                              │
│  • Validation (Joi, Express-Validator)              │
│  • Error Handling                                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Controller Layer (13)                   │
│  authController, productController, cartController,  │
│  orderController, categoryController, brandController│
│  modelController, variantController, reviewController│
│  specController, userController, wishlistController, │
│  searchController                                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│               Service Layer (4)                      │
│  • OrderService                                      │
│  • CartService                                       │
│  • CheckoutService                                   │
│  • SpecService                                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                  Data Layer                          │
│  • MongoDB (via Mongoose)                            │
│  • Redis Cache (Upstash - Categories, 5-10min TTL)  │
└─────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Service Layer Pattern**: Business logic is encapsulated in service classes for better reusability and testability.
2. **Redis Caching**: Frequently accessed data (categories) is cached to reduce database load.
3. **JWT Authentication**: Stateless authentication with 1-hour token expiration.
4. **Centralized Error Handling**: Custom AppError class with 70+ predefined error messages.
5. **Input Validation**: Two-layer validation (Joi schemas + Express-Validator) for robust data integrity.
6. **Password Security**: bcryptjs with 10 salt rounds for secure password hashing.
7. **MongoDB Connection Pooling**: Optimized database connections for better performance.

## Getting Started

To get the backend server up and running, follow these steps.

### Prerequisites

*   Node.js and npm
*   MongoDB
*   Redis

### Installation

1.  **Navigate to the `Back` directory**
    ```sh
    cd Back
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**
    *   Create a `.env` file in the `Back` directory.
    *   Add the environment variables listed in the [Environment Variables](#environment-variables) section.

## Usage

### Running the server

*   **Development:**
    ```sh
    npm run dev
    ```
    The server will start in development mode with nodemon, which will automatically restart the server on file changes. The server will be running on `http://localhost:5002`.

*   **Production:**
    ```sh
    npm start
    ```
    The server will start in production mode.

### Running tests

```sh
npm test
```

This will run the test suite using Jest.

## API Endpoints

### Authentication (`/api/auth`)
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login a user and receive JWT token
*   `GET /api/auth/me` - Get current authenticated user profile
*   `PUT /api/auth/profile` - Update user profile
*   `PUT /api/auth/change-password` - Change user password

### Products (`/api/products`)
*   `GET /api/products` - Get all products with filtering and pagination
*   `GET /api/products/:id` - Get a specific product by ID
*   `POST /api/products` - Create a new product (admin)
*   `PUT /api/products/:id` - Update a product (admin)
*   `DELETE /api/products/:id` - Delete a product (admin)

### Categories (`/api/categories`)
*   `GET /api/categories` - Get all categories (Redis cached, 5-10 min TTL)
*   `GET /api/categories/:id` - Get a specific category
*   `POST /api/categories` - Create a category (admin)
*   `PUT /api/categories/:id` - Update a category (admin)
*   `DELETE /api/categories/:id` - Delete a category (admin)

### Brands (`/api/brands`)
*   `GET /api/brands` - Get all brands
*   `GET /api/brands/:id` - Get a specific brand
*   `POST /api/brands` - Create a brand (admin)
*   `PUT /api/brands/:id` - Update a brand (admin)
*   `DELETE /api/brands/:id` - Delete a brand (admin)

### Models (`/api/models`)
*   `GET /api/models` - Get all models with filtering
*   `GET /api/models/:id` - Get a specific model with full details
*   `POST /api/models` - Create a model (admin)
*   `PUT /api/models/:id` - Update a model (admin)
*   `DELETE /api/models/:id` - Delete a model (admin)

### Variants (`/api/variants`)
*   `GET /api/variants` - Get all variants
*   `GET /api/variants/:id` - Get a specific variant
*   `POST /api/variants` - Create a variant (admin)
*   `PUT /api/variants/:id` - Update a variant (admin)
*   `DELETE /api/variants/:id` - Delete a variant (admin)

### Specifications (`/api/specs`)
*   `GET /api/specs/:modelId` - Get specifications for a model
*   `POST /api/specs` - Create specifications (admin)
*   `PUT /api/specs/:id` - Update specifications (admin)
*   `DELETE /api/specs/:id` - Delete specifications (admin)

### Shopping Cart (`/api/cart`)
*   `GET /api/cart` - Get user's shopping cart
*   `POST /api/cart` - Add item to cart
*   `PUT /api/cart/:itemId` - Update cart item quantity
*   `DELETE /api/cart/:itemId` - Remove item from cart
*   `DELETE /api/cart` - Clear entire cart

### Wishlist (`/api/wishlist`)
*   `GET /api/wishlist` - Get user's wishlist
*   `POST /api/wishlist` - Add item to wishlist
*   `DELETE /api/wishlist/:modelId` - Remove item from wishlist

### Orders (`/api/orders`)
*   `GET /api/orders` - Get user's order history
*   `GET /api/orders/:id` - Get a specific order
*   `POST /api/orders` - Create a new order
*   `POST /api/orders/create-payment-intent` - Create Stripe payment intent

### Reviews (`/api/reviews`)
*   `GET /api/reviews/:modelId` - Get all reviews for a model
*   `POST /api/reviews` - Create a review for a model
*   `PUT /api/reviews/:id` - Update own review
*   `DELETE /api/reviews/:id` - Delete own review

### Search (`/api/search`)
*   `GET /api/search?query={query}` - Search across products, categories, brands, and models

For more details on request/response formats, please refer to the route files in `src/routes`.

## Project Structure

```
Back/
├── src/
│   ├── config/          # Configuration files (database, Redis)
│   ├── controllers/     # Request handlers (13 controllers)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   ├── brandController.js
│   │   ├── modelController.js
│   │   ├── variantController.js
│   │   ├── reviewController.js
│   │   ├── specController.js
│   │   ├── userController.js
│   │   ├── wishlistController.js
│   │   └── searchController.js
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Brand.js
│   │   ├── Model.js
│   │   ├── Variant.js
│   │   ├── Specification.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware (auth, validation, error handling)
│   ├── services/        # Business logic layer (4 services)
│   │   ├── OrderService.js
│   │   ├── CartService.js
│   │   ├── CheckoutService.js
│   │   └── SpecService.js
│   ├── utils/           # Utility functions
│   │   ├── AppError.js
│   │   └── errorMessages.js (70+ messages)
│   ├── validators/      # Joi and Express-Validator schemas
│   └── app.js           # Express application setup
├── tests/               # Jest test files
├── .env                 # Environment variables
├── package.json
└── vercel.json          # Vercel deployment config
```

## Environment Variables

The following environment variables are required:

*   `MONGO_URI` - Your MongoDB Atlas connection string
*   `JWT_SECRET` - Secret key for signing JWTs (use a strong random string)
*   `JWT_EXPIRE` - JWT expiration time (default: 1h)
*   `STRIPE_SECRET_KEY` - Your Stripe secret API key
*   `REDIS_URL` - Your Upstash Redis connection URL
*   `PORT` - Server port (default: 5002)
*   `NODE_ENV` - Environment (development/production)
*   `FRONTEND_URL_LOCAL` - Local frontend URL (http://localhost:3000)
*   `FRONTEND_URL_VERCEL` - Production frontend URL
*   `FRONTEND_URL_GITHUB` - GitHub Pages frontend URL

### Example `.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hitech-store
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=1h
STRIPE_SECRET_KEY=sk_test_your_stripe_key
REDIS_URL=redis://default:password@redis-url.upstash.io:6379
PORT=5002
NODE_ENV=development
FRONTEND_URL_LOCAL=http://localhost:3000
FRONTEND_URL_VERCEL=https://your-app.vercel.app
FRONTEND_URL_GITHUB=https://username.github.io/repo
```

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration for deploying the application.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the ISC License. See `LICENSE` for more information.