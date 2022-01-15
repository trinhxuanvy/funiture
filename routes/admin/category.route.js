const express = require("express");
const categoryController = require("../../controllers/admin/category.controller");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get(
  "/admin/categories",
  authAdminController.checkExistUser,
  categoryController.getCategory
);

router.post(
  "/admin/categories",
  authAdminController.checkExistUser,
  categoryController.postCategory
);

router.post(
  "/admin/categories/update/:id",
  authAdminController.checkExistUser,
  categoryController.updateCategory
);

router.get(
  "/admin/categories/lock/:id",
  authAdminController.checkExistUser,
  categoryController.lockCategory
);

router.get(
  "/admin/categories/delete/:id",
  authAdminController.checkExistUser,
  categoryController.deleteCategory
);

module.exports = router;