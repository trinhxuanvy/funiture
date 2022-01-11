const express = require("express");
const shopController = require("../controllers/shop.controller");
const authUserController = require("../controllers/auth-user.controller");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/index", shopController.getIndex);

router.get("/signup", shopController.signup);

router.get("/signup/:username", shopController.getUserbyUserName);

router.get("/cart/delete/product/:productId", shopController.deleteProductCart);

router.get("/cart/change/product/:productId/:productAmount", shopController.getAllPriceByProductId);

router.get("/profile", shopController.profile);

router.post("/signup", shopController.postCustomer);

router.post("/update/customer", shopController.updateCustomerProfile);


//router.get("/categories/:page?", shopController.categories);

router.get("/categories", shopController.categories);

router.get("/cart", shopController.cart);

router.get("/cart/add/product/:id", shopController.addCard);

router.get("/order/add/coupon/:code", shopController.addCoupon);

router.get("/products/:id", shopController.getProduct);

router.get("/checkout",authUserController.checkExpired, shopController.checkout);

router.post("/checkout",authUserController.checkExpired, shopController.postOrder);

module.exports = router;
