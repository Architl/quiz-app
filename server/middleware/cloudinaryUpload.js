import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary"; // Cloudinary instance with credentials

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary, // Cloudinary instance
  params: {
    folder: "quiz_images", // All uploaded files will go to this Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Allowed image formats
    transformation: [
      { width: 600, height: 400, crop: "limit" }, // Resize/crop transformation
    ],
  },
});

// Create multer middleware using the Cloudinary storage config
const upload = multer({ storage });
