const express = require("express");

const router = express.Router();

router.get("/categories", (req, res, next) => {
    res.render("categories");
});

router.get("/single-product", (req, res, next) => {
    res.render("single-product");
});

router.get("/admin/profile", (req, res, next) => {
    res.render("admin/profile", { pageName: " profile " });
});

module.exports = router;