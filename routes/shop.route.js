const express = require("express");
const shopController = require("../controllers/shop.controller");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/index", shopController.getIndex);

router.get("/signup", shopController.signup);

router.get("/signup/:username", shopController.getUserbyUserName);

router.get("/profile", shopController.profile);

router.post(
    "/signup",
    shopController.postCustomer
  );

//router.get("/categories/:page?", shopController.categories);

router.get("/categories/:page?", shopController.categories);

router.get("/cart", (req, res, next) => {
  res.render("cart");
});

router.get("/products/:id", shopController.getProduct);

router.get("/checkout", shopController.checkout);

module.exports = router;
