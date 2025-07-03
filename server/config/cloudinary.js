// Import the Cloudinary v2 SDK
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Export the configured Cloudinary instance
export default cloudinary;
