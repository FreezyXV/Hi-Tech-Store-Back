const mongoose = require("mongoose"); // Ensure mongoose is imported
const request = require("supertest");
const { app } = require("../server");
const Order = require("../models/order");
const User = require("../models/user");
const { Model, Variant } = require("../models/category");

describe("OrderController", () => {
  let token;
  let variantId;
  let userId; // Store the user ID for referencing in tests

  beforeEach(async () => {
    await Order.deleteMany();
    await User.deleteMany();
    await Model.deleteMany();
    await Variant.deleteMany();

    // Create a test user
    const user = new User({
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    });
    await user.save();
    userId = user._id; // Assign the user ID

    // Create a test model
    const model = new Model({
      brandId: new mongoose.Types.ObjectId(),
      brandName: "Test Brand",
      categoryId: new mongoose.Types.ObjectId(),
      categoryName: "Test Category",
      name: "Test Model",
      imageUrls: "https://example.com/image.jpg",
      features: ["Feature 1", "Feature 2"],
    });
    await model.save();

    // Create a test variant
    const variant = new Variant({
      name: "Test Variant",
      sku: "testsku123",
      price: 100,
      stock: 20,
      modelId: model._id,
      imageUrls: ["https://example.com/variant.jpg"],
    });
    await variant.save();
    variantId = variant._id;

    // Authenticate the user
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    token = res.body.token;
  });

  it("should place a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [
          {
            variant: variantId,
            quantity: 1,
          },
        ],
        shippingAddress: {
          fullName: "John Doe",
          address: "123 Street",
          city: "City",
          postalCode: "12345",
          country: "Country",
        },
        totalAmount: 105,
        deliveryMethod: "standard",
        paymentIntentId: "test-payment-intent",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("totalAmount", 105);
  });

  it("should fetch an order by ID", async () => {
    // Create an order linked to the test user
    const order = new Order({
      user: userId, // Use the ObjectId for the user
      items: [{ variant: variantId, quantity: 1, price: 100 }],
      totalAmount: 105,
      shippingAddress: {
        fullName: "John Doe",
        address: "123 Street",
        city: "City",
        postalCode: "12345",
        country: "Country",
      },
      paymentIntentId: "test-payment-intent",
    });
    await order.save();

    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("totalAmount", 105);
  });
});
