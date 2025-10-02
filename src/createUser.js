const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/user'); // Update with the correct path to your User model

dotenv.config();

// Function to create a new user
const createUser = async () => {
  try {
    const username = "Vanya";
    const email = "test@test.fr";
    const password = "Qwerty123"; // Your original password

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`User with email ${email} already exists.`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create and save the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("New user created successfully:", {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (err) {
    console.error('Error creating user:', err.message || err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createUser();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message || err);
  });
