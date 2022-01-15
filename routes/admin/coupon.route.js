const express = require("express");
const couponController = require("../../controllers/admin/coupon.controller");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get(
  "/admin/coupons",
  authAdminController.checkExistUser,
  couponController.getCoupon
);

router.post(
  "/admin/coupons",
  authAdminController.checkExistUser,
  couponController.postCoupon
);

router.post(
  "/admin/coupons/update/:id",
  authAdminController.checkExistUser,
  couponController.updateCoupon
);

router.get(
  "/admin/coupons/lock/:id",
  authAdminController.checkExistUser,
  couponController.lockConpon
);

router.get(
  "/admin/coupons/:code",
  authAdminController.checkExistUser,
  couponController.getCouponbyCode
);

router.get(
  "/admin/coupons/delete/:id",
  authAdminController.checkExistUser,
  couponController.deleteCoupon
);

module.exports = router;
