import cloudinary from "../config/cloudinary.js";

export const uploadImageToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "product_images" },
          (error, result) => {
                if (error) {
                     return reject(error);
                }
                resolve(result.secure_url);
          }
        );
        stream.end(fileBuffer);
    });
};

