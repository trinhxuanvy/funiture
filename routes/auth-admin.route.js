const express = require("express");
const authAdminController = require("../controllers/auth-admin.controller");

const router = express.Router();

router.get("/admin/login", authAdminController.getLogin);

router.post("/admin/login", authAdminController.postLogin);

router.get("/admin/logout", authAdminController.getLogout);

module.exports = router;
