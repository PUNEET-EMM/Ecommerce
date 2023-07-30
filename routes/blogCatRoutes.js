const express = require("express");
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getCategory, getallCategory } = require("../controller/blogCatCtrl");
const router = express.Router();


router.get("/",getallCategory);
router.post("/",authMiddleware,isAdmin,createCategory);
router.get("/:id",getCategory);

router.put("/:id",authMiddleware,isAdmin,updateCategory);
router.delete("/:id",authMiddleware,isAdmin,deleteCategory);




module.exports = router;