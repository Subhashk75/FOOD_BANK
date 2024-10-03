import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detects the file type (image/video/etc.)
    });

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Attempt to delete the file if something goes wrong
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
