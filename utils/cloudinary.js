const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploading = async (fileToUploads)=>{
  
   const res =  cloudinary.uploader.upload(fileToUploads);
  

  
  try{
    const data = await res;
    return data.secure_url;
  }
  catch{
    throw new Error (err);
  }
        
        
        
    
}

module.exports = cloudinaryUploading