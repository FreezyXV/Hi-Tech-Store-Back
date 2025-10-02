# Hi-Tech Store - Backend

This is the backend for the Hi-Tech Store, a full-stack e-commerce application.

## Getting Started

To get the backend server up and running, follow these steps.

### Prerequisites

*   Node.js and npm
*   MongoDB

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
    *   Add the following environment variables:
        ```
        MONGO_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret>
        STRIPE_SECRET_KEY=<your_stripe_secret_key>
        ```
4.  **Start the server**
    ```sh
    npm start
    ```
    The server will be running on `http://localhost:5002`.

## Available Scripts

*   `npm start`: Starts the server.
*   `npm run dev`: Starts the server in development mode with nodemon.
*   `npm test`: Runs the test suite.
*   `npm run seed`: Seeds the database with initial data.

## API Endpoints

The following are the main API routes:

*   `/api/auth`: User authentication (login, register)
*   `/api/categories`: Product categories
*   `/api/brands`: Product brands
*   `/api/models`: Product models
*   `/api/variants`: Product variants
*   `/api/cart`: Shopping cart
*   `/api/orders`: Order processing
*   `/api/reviews`: Product reviews
*   `/api/search`: Search functionality

For more details on the API, please refer to the route files in `src/routes`.

## Technologies Used

*   **Node.js**
*   **Express.js**
*   **MongoDB** with **Mongoose**
*   **JWT** for authentication
*   **Stripe** for payments
*   **Jest** for testing
