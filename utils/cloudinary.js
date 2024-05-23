const cloudinary = require("cloudinary");
const path = require("path");
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


//cloudinary upload image 

const cloudinaryUploadImage = async (imagePaths)=>{
        try {
            const uploadedImages = [];
            for (const imagePath of imagePaths) {
                const result = await cloudinary.uploader.upload(imagePath);
                uploadedImages.push(result);
            }
            console.log("Images uploaded successfully:", uploadedImages);
            return uploadedImages;
        } catch (error) {
            console.error("Error uploading images to Cloudinary:", error);
            throw error;
        }
    }



const cloudinaryRemoveImage = async (imagePublicId)=>{
    try{
        const result = await cloudinary.UploadStream.destroy( imagePublicId);
       
        return result;
    } catch( error){
        return error;
    }
}
/////////////////////////////////////////////////////////////////////////////////

const cloudinaryUploadSingleImage = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        console.log("Image uploaded successfully:", result);
        return result;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
}
module.exports ={
    cloudinaryUploadImage,
    cloudinaryUploadSingleImage 
}