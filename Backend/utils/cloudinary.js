import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config({path:"backend/config/config.env"});


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const upload_file = async (file, folder) => {
    try {
      const result = await cloudinary.v2.uploader.upload(file, {
        resource_type: "auto",
        folder,
      });
      return {
        public_id: result.public_id,
        url: result.url,
      };
    } catch (error) {
      throw new Error(error.message); // Re-throw the error for further handling
    }
  };


export const delete_file = async(file)=>{
const res = await cloudinary.uploader.destroy(file);
if(res?.result === "ok" ) return true;
}
