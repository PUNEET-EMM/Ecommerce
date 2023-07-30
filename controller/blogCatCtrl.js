const Category = require("../models/blogCatModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

const createCategory = asyncHandler(async(req,res)=>{
   
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);

    }
    catch(err){
        throw new Error(err);
    }
})

const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCategory);
    }catch(err){
        throw new Error(err);
    }
})

const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    }catch(err){
        throw new Error(err);
    }
})

const getCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getCategory = await Category.findById(id);
        res.json(getCategory);
    }catch(err){
        throw new Error(err);
    }
})

const getallCategory = asyncHandler(async(req,res)=>{
   
    try{
        const getallCategory = await Category.find();
        res.json(getallCategory);
    }catch(err){
        throw new Error(err);
    }
})




module.exports = {createCategory,updateCategory,deleteCategory,getCategory,getallCategory};