# Hi-Tech Store - Backend

This is the backend for the Hi-Tech Store, a full-stack e-commerce application designed to showcase a wide variety of electronic products. The backend is built with Node.js and Express, and it provides a RESTful API for managing products, users, orders, and more.


## Table of Contents

*   [About The Project](#about-the-project)
*   [Built With](#built-with)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
    *   [Running the server](#running-the-server)
    *   [Running tests](#running-tests)
*   [API Endpoints](#api-endpoints)
*   [Environment Variables](#environment-variables)
*   [Deployment](#deployment)
*   [Contributing](#contributing)
*   [License](#license)

## About The Project

The Hi-Tech Store backend is a robust and scalable server-side application that powers the e-commerce platform. It handles all the business logic, data storage, and authentication for the application.

### Features

*   **Authentication:** Secure user authentication using JSON Web Tokens (JWT).
*   **Product Management:** Full CRUD functionality for products, categories, brands, and variants.
*   **Shopping Cart:** Persistent shopping cart for authenticated users.
*   **Order Processing:** Secure order processing with Stripe integration.
*   **Product Reviews:** Users can leave reviews and ratings for products.
*   **Search:** Powerful search functionality to find products easily.

## Built With

*   [Node.js](https://nodejs.org/)
*   [Express.js](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [Mongoose](https://mongoosejs.com/)
*   [JSON Web Token (JWT)](https://jwt.io/)
*   [Stripe](https://stripe.com/)
*   [Jest](https://jestjs.io/)
*   [Redis](https://redis.io/)

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

The following are the main API routes:

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Login a user.
*   `GET /api/categories`: Get all product categories.
*   `GET /api/brands`: Get all product brands.
*   `GET /api/models`: Get all product models.
*   `GET /api/variants`: Get all product variants.
*   `GET /api/cart`: Get the user's shopping cart.
*   `POST /api/cart`: Add an item to the shopping cart.
*   `POST /api/orders`: Create a new order.
*   `GET /api/reviews/:modelId`: Get reviews for a product model.
*   `POST /api/reviews`: Add a review for a product model.
*   `GET /api/search`: Search for products.

For more details on the API, please refer to the route files in `src/routes`.

## Environment Variables

The following environment variables are required:

*   `MONGO_URI`: Your MongoDB connection string.
*   `JWT_SECRET`: A secret key for signing JWTs.
*   `STRIPE_SECRET_KEY`: Your Stripe secret key.
*   `REDIS_URL`: Your Redis connection string.

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