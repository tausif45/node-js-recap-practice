import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log('File uploaded successfully', res.url)
        return res;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { uploadFile }