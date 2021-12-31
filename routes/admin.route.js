const express = require("express");
const adminController = require("../controllers/admin.controller");
const multer = require("multer");
const authAdminController = require("../controllers/auth-admin.controller");
const { PRODUCT_MODEL } = require("../constants/modal");

const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

router.get(
  "/admin/categories",
  authAdminController.checkExpired,
  adminController.getCategory
);

router.post(
  "/admin/categories",
  authAdminController.checkExpired,
  adminController.postCategory
);

router.post(
  "/admin/categories/update/:id",
  authAdminController.checkExpired,
  adminController.updateCategory
);

router.get(
  "/admin/categories/delete/:id",
  authAdminController.checkExpired,
  adminController.deleteCategory
);

router.get(
  "/admin/brands",
  authAdminController.checkExpired,
  adminController.getBrand
);

router.post(
  "/admin/brands",
  authAdminController.checkExpired,
  adminController.postBrand
);

router.post(
  "/admin/brands/update/:id",
  authAdminController.checkExpired,
  adminController.updateBrand
);

router.get(
  "/admin/brands/delete/:id",
  authAdminController.checkExpired,
  adminController.deleteBrand
);

router.get(
  "/admin/products",
  authAdminController.checkExpired,
  adminController.getProduct
);

router.post(
  "/admin/products",
  authAdminController.checkExpired,
  Multer.fields([
    { name: "primaryImage", maxCount: 1 },
    { name: "secondaryImage_1", maxCount: 1 },
    { name: "secondaryImage_2", maxCount: 1 },
    { name: "secondaryImage_3", maxCount: 1 },
  ]),
  adminController.postProduct
);

router.get(
  "/admin/products/delete/:id",
  authAdminController.checkExpired,
  adminController.deleteProduct
);

router.get(
  "/admin/products/:id",
  authAdminController.checkExpired,
  adminController.getProductById
);

router.post(
  "/admin/products/update/:id",
  authAdminController.checkExpired,
  adminController.updateProduct
);

router.post(
  "/admin/upload",
  authAdminController.checkExpired,
  Multer.any(),
  adminController.uploadFile
);

router.get(
  "/admin/profile",
  authAdminController.checkExpired,
  adminController.profile
);

router.get(
  "/admin/customers",
  authAdminController.checkExpired,
  adminController.getCustomer
);

router.post(
  "/admin/customers",
  authAdminController.checkExpired,
  adminController.postCustomer
);

router.post(
  "/admin/customers/update/:id",
  authAdminController.checkExpired,
  adminController.updateCustomer
);

router.get(
  "/admin/customers/delete/:id",
  authAdminController.checkExpired,
  adminController.deleteCustomer
);

router.get(
  "/admin/customers/:username",
  authAdminController.checkExpired,
  adminController.getCustomerbyUsername
);

router.get("/admin/customers/:id/reset", adminController.resetPasswordCustomer);

router.get(
  "/admin/admins",
  authAdminController.checkExpired,
  adminController.getAdmin
);

router.post(
  "/admin/admins",
  authAdminController.checkExpired,
  Multer.any(),
  adminController.postAdmin
);

router.post(
  "/admin/admins/update/:id",
  authAdminController.checkExpired,
  adminController.updateAdmin
);

router.get(
  "/admin/admins/delete/:id",
  authAdminController.checkExpired,
  adminController.deleteAdmin
);

router.get(
  "/admin/admins/:username",
  authAdminController.checkExpired,
  adminController.getAdminbyUsername
);

router.get("/admin/admins/:id/reset", adminController.resetPasswordAdmin);

router.post(
  "/admin/profile",
  authAdminController.checkExpired,
  adminController.updateProfile
);

router.post(
  "/admin/profile/update/:id",
  authAdminController.checkExpired,
  adminController.updateImageProfile
);

module.exports = router;
