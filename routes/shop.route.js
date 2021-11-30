const express = require("express");
const shopController = require("../controllers/shop.controller");

const router = express.Router();

router.get("/index", shopController.index);
router.get("/login", shopController.login);
router.get("/categories/:page?", shopController.categories);
router.get("/cart", shopController.cart);
router.get("/single-product", shopController.singleProduct);
router.get("/checkout",shopController.checkout);
router.get("/", shopController.index );

module.exports = router;