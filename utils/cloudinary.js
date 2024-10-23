const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, public_id = null) => {
  //public_id gives for updating image in cloudinary
  try {
    if (!localFilePath) return null;
    const option = {
      resource_type: "image",
      public_id: public_id,
      overwrite: true,
    };
    if (!public_id) {
      // when public_id not present means first time we upload image tells me which folder
      option.folder = "airbnb_Dev";
    }
    //upload on cloudinary
    const resposnse = await cloudinary.uploader.upload(localFilePath, option);
    //file uploaded
    return { url: resposnse.secure_url, id: resposnse.public_id };
  } catch (error) {
    console.log(error);
  } finally {
    // delete file from local server
    fs.unlinkSync(localFilePath);
  }
};
const deleteFromCloudinary=async(public_id)=>{
  try{
    const res=await cloudinary.uploader.destroy(public_id);
  }catch(err){
    throw Error(err.massage);
  }
}
module.exports = {uploadOnCloudinary,deleteFromCloudinary};
