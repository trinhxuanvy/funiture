const adminRouter = require("./admin.route");
const couponRouter = require("./coupon.route");
const brandRouter = require("./brand.route");
const orderRouter = require("./order.route");
const statisticRouter = require("./statistic.route");
const productRouter = require("./product.route");
const categoryRouter = require("./category.route");
const customerRouter = require("./customer.route");
const uploadRouter = require("./upload.route");
const authAdminRouter = require("./auth-admin.route");

exports.router = (app) => {
  app.use(adminRouter);
  app.use(couponRouter);
  app.use(brandRouter);
  app.use(orderRouter);
  app.use(statisticRouter);
  app.use(productRouter);
  app.use(categoryRouter);
  app.use(customerRouter);
  app.use(authAdminRouter);
  app.use(uploadRouter);
};
