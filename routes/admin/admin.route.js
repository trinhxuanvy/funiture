const express = require("express");
const adminController = require("../../controllers/admin/admin.controller");
const multer = require("multer");
const authAdminController = require("../../controllers/admin/auth-admin.controller");

const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

router.get(
  "/admin/admins",
  authAdminController.checkExistUser,
  adminController.getAdmin
);

router.post(
  "/admin/admins",
  authAdminController.checkExistUser,
  Multer.any(),
  adminController.postAdmin
);

router.post(
  "/admin/admins/update/:id",
  authAdminController.checkExistUser,
  adminController.updateAdmin
);

router.get(
  "/admin/admins/lock/:id",
  authAdminController.checkExistUser,
  adminController.lockAdmin
);

router.get(
  "/admin/admins/:username",
  authAdminController.checkExistUser,
  adminController.getAdminbyUsername
);

router.get(
  "/admin/admins/reset/:id",
  authAdminController.checkExistUser,
  adminController.resetPasswordAdmin
);

router.get(
  "/admin/admins/delete/:id",
  authAdminController.checkExistUser,
  adminController.deleteAdmin
);

module.exports = router;
