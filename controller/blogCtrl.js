const Blog =require("../models/blogModel");
const cloudinaryUploading = require("../utils/cloudinary");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
const fs = require("fs");


const createBlog = asyncHandler(async(req,res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);

    }catch(err){
        throw new Error(err);

    }

})

const updateBlog= asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    
    
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateBlog);

    }catch(err){
        throw new Error(err)
    }
})


const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes")
         const updateView=  await Blog.findByIdAndUpdate(id, { $inc: { numView:1 }},{new:true});
        res.json(getBlog);
    }
    catch(err){ 
        throw new Error(err);
    }

})

const getAllBlogs = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
         const getBlogs=  await Blog.find();
        res.json(getBlogs);
    }
    catch(err){ 
        throw new Error(err);
    }

})

const deleteBlog= asyncHandler(async(req,res)=>{
    const {id} = req.params;
    
    
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);

    }catch(err){
        throw new Error(err)
    }
})

const liketheBlog  = asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?._id;

    const isLiked = blog?.isLiked;

    const alreadyDisliked  = blog?.dislikes?.find((userId) => userId?.toString()===loginUserId?.toString());

    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,{ $pull: {dislikes:loginUserId},isDisLiked:false},{new:true});
        res.json(blog)

    } 
    
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{ $pull: {likes:loginUserId},isLiked:false},{new:true});
        res.json(blog)

    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push: {likes:loginUserId},isLiked:true},
            {new:true}

            )
            res.json(blog);
    }

})


const disliketheBlog  = asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?._id;

    const isDisLiked = blog?.isDisLiked;

    const alreadyLiked  = blog?.likes?.find((userId) => userId?.toString()===loginUserId?.toString());

    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{ $pull: {likes:loginUserId},isLiked:false},{new:true});
        res.json(blog)

    } 
    
    if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{ $pull: {dislikes:loginUserId},isDisLiked:false},{new:true});
        res.json(blog)

    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push: {dislikes:loginUserId},isDisLiked:true},
            {new:true}

            )
            res.json(blog);
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
        const findBlog = await Blog.findByIdAndUpdate(id,{
            images: urls.map((file)=>{
                return file;
            })
        },{
            new:true,
        })
      res.json(findBlog);

    }catch(err){
        throw new Error(err)
    }
    
})






module.exports ={createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,liketheBlog,disliketheBlog,uploadImages};
