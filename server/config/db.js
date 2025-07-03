// Import Mongoose to connect with MongoDB
import mongoose from "mongoose";

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected");
  } catch (err) {
    // Log error and exit the process if connection fails
    console.error(err.message);
    process.exit(1);
  }
};

// Export the connectDB function to be used in the server entry point
export default connectDB;
