import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(file, {
      folder: "blog",
      unique_filename: true,
    });
    return secure_url;
  } catch (error) {
    console.error(error);
    return null;
  }
};
