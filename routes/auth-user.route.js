const express = require("express");
const authUserController = require("../controllers/auth-user.controller");

const router = express.Router();

router.get("/login", authUserController.getLogin);

router.post("/login", authUserController.postLogin);

router.get("/logout", authUserController.getLogout);

module.exports = router;
