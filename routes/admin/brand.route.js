const express = require("express");
const brandController = require("../../controllers/admin/brand.controller");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get(
  "/admin/brands",
  authAdminController.checkExistUser,
  brandController.getBrand
);

router.post(
  "/admin/brands",
  authAdminController.checkExistUser,
  brandController.postBrand
);

router.post(
  "/admin/brands/update/:id",
  authAdminController.checkExistUser,
  brandController.updateBrand
);

router.get(
  "/admin/brands/lock/:id",
  authAdminController.checkExistUser,
  brandController.lockBrand
);

router.get(
  "/admin/brands/delete/:id",
  authAdminController.checkExistUser,
  brandController.deleteBrand
);

module.exports = router;
