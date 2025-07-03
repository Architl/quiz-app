import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary storage options
const storage = new CloudinaryStorage({
  cloudinary, // Cloudinary instance with credentials loaded

  // Additional upload parameters
  params: {
    folder: "quiz-app", // Folder where images will be stored in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Accepted image formats
    transformation: [
      {
        width: 800, // Max width
        height: 600, // Max height
        crop: "limit", // Do not exceed dimensions, but maintain original ratio
      },
    ],
  },
});

// Initialize multer with the configured Cloudinary storage
const upload = multer({ storage });

// Export the configured upload middleware to use in your routes
export default upload;
