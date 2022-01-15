const express = require("express");
const customService = require("../../services/custom");
const multer = require("multer");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

router.post(
  "/admin/upload",
  authAdminController.checkExistUser,
  Multer.any(),
  customService.uploadFile
);

module.exports = router;
