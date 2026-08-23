import streamifier from "streamifier";
import { getCloudinary } from "./Cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "hrm-documents") => {
  const cloudinary = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};