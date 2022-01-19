const express = require("express");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get("/admin/login", authAdminController.getLogin);

router.post("/admin/login", authAdminController.postLogin);

router.get("/admin/logout", authAdminController.getLogout);

router.get(
  "/admin/profile",
  authAdminController.checkExistUser,
  authAdminController.profile
);

router.post(
  "/admin/profile",
  authAdminController.checkExistUser,
  authAdminController.updateProfile
);

router.post(
  "/admin/profile/update/:id",
  authAdminController.checkExistUser,
  authAdminController.updateImageProfile
);

router.get(
  "/admin/reset",
  authAdminController.getResetPage
);

router.post(
  "/admin/reset",
  authAdminController.resetPassword
);

module.exports = router;
