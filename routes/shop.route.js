const express = require("express");
const shopController = require("../controllers/shop.controller");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/index", shopController.getIndex);

router.get("/signup", shopController.signup);

router.get("/signup/:username", shopController.getUserbyUserName);

router.get("/cart/delete/product/:productId", shopController.deleteProductCart);

router.get("/cart/change/product/:productId/:productAmount", shopController.getAllPriceByProductId);

router.get("/profile", shopController.profile);

router.post(
    "/signup",
    shopController.postCustomer
  );

//router.get("/categories/:page?", shopController.categories);

router.get("/categories/:page?", shopController.categories);

router.get("/cart", shopController.cart);

router.get("/cart/add/product/:id", shopController.addCard);

router.get("/products/:id", shopController.getProduct);

router.get("/checkout", shopController.checkout);

module.exports = router;
