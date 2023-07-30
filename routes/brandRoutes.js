const express = require("express");
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const { getallBrand, getBrand, createBrand, updateBrand, deleteBrand } = require("../controller/brandCtrl");
const router = express.Router();


router.get("/",getallBrand);
router.get("/:id",getBrand);
router.post("/",authMiddleware,isAdmin,createBrand);
router.put("/:id",authMiddleware,isAdmin,updateBrand);
router.delete("/:id",authMiddleware,isAdmin,deleteBrand);




module.exports = router;