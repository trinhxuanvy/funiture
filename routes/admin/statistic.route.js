const express = require("express");
const statisticController = require("../../controllers/admin/statistic.controller");
const authAdminController = require("../../controllers/admin/auth-admin.controller");
const router = express.Router();

router.get(
  "/admin/statistic",
  authAdminController.checkExistUser,
  statisticController.getStatistic
);

router.get(
  "/admin/statistic/:time/:start/:end",
  authAdminController.checkExistUser,
  statisticController.getStatisticProfit
);

router.get(
  "/admin/statistic/top/:start",
  authAdminController.checkExistUser,
  statisticController.getStatisticTopSale
);

router.get("/admin/demo", statisticController.getDemo);

module.exports = router;
