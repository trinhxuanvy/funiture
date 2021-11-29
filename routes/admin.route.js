const express = require("express");
const adminController = require("../controllers/admin.controller");
const multer = require("multer");
const { PRODUCT_MODEL } = require("../constants/modal");

const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

router.get("/admin/category", adminController.getCategory);

router.post("/admin/category", adminController.postCategory);

router.get("/admin/brand", adminController.getBrand);

router.post("/admin/brand", adminController.postBrand);

router.get("/admin/products", adminController.getProduct);

router.post(
  "/admin/products",
  Multer.fields([
    { name: "primaryImage", maxCount: 1 },
    { name: "secondaryImage_1", maxCount: 1 },
    { name: "secondaryImage_2", maxCount: 1 },
    { name: "secondaryImage_3", maxCount: 1 },
  ]),
  adminController.postProduct
);

router.get("/admin/products/delete/:id", adminController.deleteProduct);

router.get("/admin/products/:id", adminController.getProductById);

router.post("/admin/products/update/:id", adminController.updateProduct);

router.post("/admin/upload", Multer.any(), adminController.uploadFile);

module.exports = router;
