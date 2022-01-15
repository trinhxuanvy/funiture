const express = require("express");
const customerController = require("../../controllers/admin/customer.controller");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get(
  "/admin/customers",
  authAdminController.checkExistUser,
  customerController.getCustomer
);

router.post(
  "/admin/customers",
  authAdminController.checkExistUser,
  customerController.postCustomer
);

router.post(
  "/admin/customers/update/:id",
  authAdminController.checkExistUser,
  customerController.updateCustomer
);

router.get(
  "/admin/customers/lock/:id",
  authAdminController.checkExistUser,
  customerController.lockCustomer
);

router.get(
  "/admin/customers/:username",
  authAdminController.checkExistUser,
  customerController.getCustomerbyUsername
);

router.get(
  "/admin/customers/delete/:id",
  authAdminController.checkExistUser,
  customerController.deleteCustomer
);

module.exports = router;
