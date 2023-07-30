const express = require("express");
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getCategory, getallCategory } = require("../controller/prodcategoryCtrl");
const router = express.Router();


router.get("/",getallCategory);
router.get("/:id",getCategory);
router.post("/",authMiddleware,isAdmin,createCategory);
router.put("/:id",authMiddleware,isAdmin,updateCategory);
router.delete("/:id",authMiddleware,isAdmin,deleteCategory);




module.exports = router;