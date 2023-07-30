const { generateToken } = require("../config/jwnToken");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");




const createUser =asyncHandler(async(req,res)=>{
        const email = req.body.email;
        const findUser = await User.findOne({email:email});
        if(!findUser){
            const newUser = await  User.create(req.body);
            res.json(newUser);
    
        }else{
            throw new Error("User Already Exists");
        }
    
    }
)
// admin login
const loginAdmin = asyncHandler(async(req,res)=>{
    const {email,password}= req.body;
    const findAdmin = await User.findOne({email});
    if(findAdmin.role!='admin') throw new Error("Not Authorised");
    if(findAdmin&&(await findAdmin.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateUser = await User.findByIdAndUpdate(findAdmin.id,{
            refreshToken:refreshToken
        },{new:true})
           res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000,
           })
           res.json({
            _id:findAdmin?._id,
                firstname:findAdmin?.firstname,
                lastname:findAdmin?.lastname,
                email:findAdmin?.email,
                mobile:findAdmin?.mobile,
                token: generateToken(findAdmin?._id)
           });
    }else{
        throw new Error("Invalid Credentials");
    }
})


const loginUserCtrl= asyncHandler(async(req,res)=>{
    const {email,password}= req.body;
    const findUser = await User.findOne({email});
    if(findUser&&(await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(findUser.id,{
            refreshToken:refreshToken
        },{new:true})
           res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000,
           })
           res.json({
            _id:findUser?._id,
                firstname:findUser?.firstname,
                lastname:findUser?.lastname,
                email:findUser?.email,
                mobile:findUser?.mobile,
                token: generateToken(findUser?._id)
           });
    }else{
        throw new Error("Invalid Credentials");
    }
})






const handleRefreshToken = asyncHandler(async(req,res)=>{

    const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error("No Refresh Token In cookies");
  const refreshToken = cookie.refreshToken;
  const user= await User.findOne({refreshToken});
  if(!user) throw new Error("No  Refresh Token present in database or Not Matched");
  jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
    if(err||user.id!==decoded.id){
        throw new Error ("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({accessToken});
  })


})

//LogOut 
const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token In cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        })
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken:"",
    });
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    return res.sendStatus(204);


})

//GET ALL User
const getallUser = asyncHandler(async(req,res)=>{
    try{
        const getUser = await User.find();
        res.json(getUser);
    }catch(err){
        throw new Error(error);
    }

});

// Get a user

const getaUser = asyncHandler(async(req,res)=>{
    const {id } = req.params;
    validateMongoDbId(id);
    try{
        const getaUser = await User.findById(id);
        res.json(getaUser);
    }catch(err){
        throw new Error(error);
    }

})
 //Delete a User
const deleteaUser = asyncHandler(async(req,res)=>{
    const {id } = req.params;
    validateMongoDbId(id);
    try{
        const getaUser = await User.findByIdAndDelete(id);
        res.json(getaUser);
    }catch(err){
        throw new Error(err);
    }

})

// Update a user

const updatedUser = asyncHandler(async(req,res)=>{
    const{_id} = req.user;
    validateMongoDbId(_id);
    
    try{
        const updatedUser = await User.findByIdAndUpdate({_id},{
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile,
        },{new:true})
        res.json(updatedUser);

    }catch(err){
        throw new Error(err)
    }
})

const blockedUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:true,
        },{
            new:true,
        })
        res.json({message:"User Block"});
    }catch(err){
        throw new Error(err);
    }

});

const unblockedUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(id,{
            isBlocked:false,
        },{
            new:true,
        })
        res.json({message:"User UnBlock"});
    }catch(err){
        throw new Error(err);
    }
    
});


const updatePassword = asyncHandler(async(req,res)=>{
    const{_id} = req.user;
    const{password} = req.body;
    validateMongoDbId(_id);
    
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }
    else{
        res.json(user);
    }
})

const forgotPasswordToken = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    
    if(!user) {throw new Error ("User not found with email");}
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        

       
        const resetUrl =`Hey,Please Follow this link to reset Your Password.This link is valid till 10 minute from now. <a href ='http://localhost:3000/api/user/reset-password/${token}'>Click Here</>`;
        const data ={
            to:email,
            text:"Hey User",
            subject:"Forgot Password Link",
            htm:resetUrl
        };
        console.log(data); //test data
        sendEmail(data);
        res.json(token);
    }
    catch(err){
        throw new Error(err);
    }
})


const resetToken = asyncHandler(async(req,res)=>{
    const {password} = req.body;
    const{token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex"); // NOT SURE
    console.log(hashedToken); //test hashToken
    const user= await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt :Date.now()}
    })
    if(!user) throw new Error("Token Expired,Please try again later");
    user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.json(user);



})






module.exports = {createUser,loginUserCtrl,getallUser,getaUser,deleteaUser,updatedUser,unblockedUser,blockedUser,handleRefreshToken,logout,updatePassword,forgotPasswordToken,resetToken,loginAdmin};