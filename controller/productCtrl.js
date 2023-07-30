const Product  = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbid");
const cloudinaryUploading = require("../utils/cloudinary");
const fs = require("fs")

const createProduct =asyncHandler(async(req,res)=>{
    
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
 const newProduct = await Product.create(req.body);
 res.json(newProduct);
    }
    catch(err){
        throw new Error(err);
    }
})
const getaProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }catch(err){
        throw new Error(err);
    }

})

const getallProduct = asyncHandler(async(req,res)=>{

    try{
        const findProduct = await Product.find();
        res.json(findProduct);
    }catch(err){
        throw new Error(err);
    }

})

const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);

        }
            const updateProduct = await Product.findByIdAndUpdate(id,req.body,{new:true});
            res.json(updateProduct);
        

    }catch(err){
        throw new Error(err);
    }
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        
            const deleteProduct = await Product.findByIdAndDelete(id);
            res.json(deleteProduct);
        

    }catch(err){
        throw new Error(err);
    }
})


const addToWishlist = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id)=>id.toString() === prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndDelete(_id,{ $pull: {wishlist:prodId}},{new:true});
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id,{ $push: {wishlist:prodId}},{new:true});
            res.json(user);

        }

    }catch(err){
      throw new Error(err);
    }
})


const rating = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {star,prodId,comment} = req.body;
    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId)=>userId.postedby.toString()===_id.toString());
        if(alreadyRated){
            const updateRating = await Product.updateOne({
                rating:{$elemMatch: alreadyRated}
            },{
                $set: {"ratings.$.star":star,"ratings.$.comment":comment}
            },{
                new:true
            })
            
        }else{
            const rateProduct = await Product.findByIdAndUpdate(prodId,{
                    $push: {
                        ratings:{
                            star:star,
                            postedby:_id,
                            comment:comment
                        }
                    } 
            
            },{new:true});
            

        }

        const getallratings = await Product.findById(prodId);
        let totalrating = getallratings.ratings.length;
        let ratingsum = getallratings.rating.map((item)=>item.star).raduce((prev,curr)=>prev+curr,0);
        let actualRating = Math.round(ratingsum/totalrating);
        let finalproduct = await Product.findByIdAndUpdate(prodId,{totalrating:actualRating},{new:true});
        res.json(finalproduct);

    }catch(err){
        throw new Error(err);
    }
    



})

const uploadImages = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const uploader = (path)=>cloudinaryUploading(path,"images");

     const urls =[];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            console.log(newpath)
            urls.push(newpath);
            fs.unlinkSync(path)
            
        }
        console.log(urls);
        const findProduct = await Product.findByIdAndUpdate(id,{
            images: urls.map((file)=>{
                return file;
            })
        },{
            new:true,
        })
      res.json(findProduct);


    }catch(err){
        throw new Error(err)
    }
    
})



module.exports= {createProduct,getaProduct,getallProduct,updateProduct,deleteProduct,addToWishlist,rating,uploadImages}