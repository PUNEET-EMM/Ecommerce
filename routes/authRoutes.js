const express = require('express');
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser ,updatedUser, blockedUser, unblockedUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetToken, loginAdmin} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { reset } = require('nodemon');
const router = express.Router();




router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin);
router.get("/all-users",getallUser);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);

router.post("/forgot-password-token",forgotPasswordToken);
router.post("/reset-password/:token",resetToken);

router.delete("/:id",deleteaUser);
router.get("/:id",authMiddleware,isAdmin,getaUser);

router.put("/update-password",authMiddleware,updatePassword)
router.put("/edit-user",authMiddleware,updatedUser);
router.put("/blocked-user/:id",authMiddleware,isAdmin,blockedUser);
router.put("/unblocked-user/:id",authMiddleware,isAdmin,unblockedUser);




module.exports= router;