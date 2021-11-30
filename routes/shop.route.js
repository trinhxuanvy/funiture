const express = require("express");
const shopController = require("../controllers/shop.controller")

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/index", shopController.getIndex);

router.get("/login", (req, res, next) => {
    res.render("login");
});

router.get("/categories/:page?", shopController.categories);

router.get("/cart", (req, res, next) => {
    res.render("cart");
});

// router.get("/single-product", (req, res, next) => {
//     res.render("single-product");
// });

router.get("/products/:id", shopController.getProduct);

router.get("/checkout", (req, res, next) => {
    res.render("checkout");
});

router.get("/admin/profile", (req, res, next) => {
    res.render("admin/profile", { pageName: " profile " });
});

router.get("/admin/users", (req, res, next) => {
    res.render("admin/users", { pageName: " users " });
});

module.exports = router;