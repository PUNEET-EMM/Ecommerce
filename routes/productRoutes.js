const express = require("express");
const router = express.Router();
const {createProduct, getaProduct, getallProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages}=require('../controller/productCtrl');
const {isAdmin,authMiddleware} = require("../middleware/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImages");

router.post("/",createProduct);
router.get("/",getallProduct);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages);

router.put("/wishlist",authMiddleware,isAdmin,addToWishlist);
router.put("/rating",authMiddleware,isAdmin,rating);
router.get("/:id",authMiddleware,isAdmin,getaProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);

router.delete("/:id",authMiddleware,isAdmin,deleteProduct)



module.exports = router;