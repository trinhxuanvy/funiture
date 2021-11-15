const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("index");
});
router.get("/login", (req, res, next) => {
    res.render("login");
});

router.get("/categories", (req, res, next) => {
    res.render("categories");
});

router.get("/cart", (req, res, next) => {
    res.render("cart");
});

router.get("/single-product", (req, res, next) => {
    res.render("single-product");
});

router.get("/checkout", (req, res, next) => {
    res.render("checkout");
});

router.get("/admin/profile", (req, res, next) => {
    res.render("admin/profile", { pageName: " profile " });
});

router.get("/admin/users", (req, res, next) => {
    res.render("admin/users", { pageName: " users " });
});

router.get("/admin/products", (req, res, next) => {
    res.render("admin/products", { pageName: " products " });
});

router.get("/admin/category", (req, res, next) => {
    res.render("admin/category", { pageName: " category " });
});

module.exports = router;