const express = require("express");
const authUserController = require("../controllers/auth-user.controller");

const router = express.Router();

router.get("/login", authUserController.getLogin);

router.post("/login", authUserController.postLogin);

router.get("/logout", authUserController.getLogout);

router.post("/changepassword", authUserController.postChangePassword);

router.get("/reset", authUserController.getResetPage);

router.post("/reset", authUserController.resetPassword);

module.exports = router;
