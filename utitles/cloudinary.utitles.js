import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
    })})

    const uploadOnCloudinary = async (localPath)=>{
        try {
            if(!localPath) return null
           const response = await cloudinary.uploader.upload(
              localPath, {
               resource_type:'auto',
           }
          
       )
          console.log(response.url);
        } catch (error) {
             fs.unlinkSync(localPath);
             return null;
        }
    }

    export {uploadOnCloudinary}