const express = require("express");
const productController = require("../../controllers/admin/product.controller");
const multer = require("multer");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

router.get(
  "/admin/products",
  authAdminController.checkExistUser,
  productController.getProduct
);

router.post(
  "/admin/products",
  authAdminController.checkExistUser,
  Multer.fields([
    { name: "primaryImage", maxCount: 1 },
    { name: "secondaryImage_1", maxCount: 1 },
    { name: "secondaryImage_2", maxCount: 1 },
    { name: "secondaryImage_3", maxCount: 1 },
  ]),
  productController.postProduct
);

router.get(
  "/admin/products/lock/:id",
  authAdminController.checkExistUser,
  productController.lockProduct
);

router.get(
  "/admin/products/:id",
  authAdminController.checkExistUser,
  productController.getProductById
);

router.post(
  "/admin/products/update/:id",
  authAdminController.checkExistUser,
  productController.updateProduct
);

router.get(
  "/admin/products/delete/:id",
  authAdminController.checkExistUser,
  productController.deleteProduct
);

module.exports = router;
