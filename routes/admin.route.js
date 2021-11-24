const express = require("express");
const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/admin/category", adminController.getCategory);

router.post("/admin/category", adminController.postCategory);

router.get("/admin/products", adminController.getProduct);

router.post("/admin/products", adminController.postProduct);

module.exports = router;