const express = require("express");
const orderController = require("../../controllers/admin/order.controller");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get(
  "/admin/orders",
  authAdminController.checkExistUser,
  orderController.getOrder
);

router.get(
  "/admin/orders/:id",
  authAdminController.checkExistUser,
  orderController.getOrderById
);

router.post(
  "/admin/orders/update/:id",
  authAdminController.checkExistUser,
  orderController.updateOrder
);

module.exports = router;
