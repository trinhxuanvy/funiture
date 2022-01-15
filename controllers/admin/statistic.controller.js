const Order = require("../../models/order.model");
const Customer = require("../../models/customer.model");
const customService = require("../../services/custom");
const Product = require("../../models/product.model");
const googleapis = require("../../services/googleapis");

exports.getStatistic = async (req, res, next) => {
  const orders = await Order.find();
  const totalCustomer = await Customer.find().countDocuments();
  const totalOrder = orders.length;
  const access = await googleapis.getData();
  const totalAccess = access[1]["ga:pageviews"].value || 0;
  let totalProfit = 0;

  orders.forEach(item => {
    totalProfit += item.subTotalPrice;
  });

  res.render("admin/statistic", {
    pageName: "statistic",
    totalCustomer,
    totalOrder,
    totalProfit,
    totalAccess
  });
};

exports.postStatistic = async (req, res, next) => {
  res.send(data);
};

exports.getStatisticProfit = async (req, res, next) => {
  const type = req.params?.time;
  const start = req.params?.start;
  const end = req.params?.end;
  let startTemp, endTemp;
  let result = new Array();
  let data = new Array();
  let titleY = "USD";
  let titleX = "";

  switch (type) {
    case "day":
      startTemp = new Date(start);
      endTemp = new Date(end);
      startTemp.setHours(0, 0, 0, 0); // Begin time trong ngày
      endTemp.setHours(23, 59, 59, 999); // Final time trong ngày

      data = await Order.find({
        createdAt: { $gte: startTemp, $lt: endTemp },
        status: "paid",
      }).sort({ createdAt: "asc" });

      endTemp.getHours(0, 0, 0, 0); // Reset time về 0 chỉ lấy ngày/tháng/năm

      result = customService.statisticWithDaily(data, startTemp, endTemp);
      titleX = "Daily Profit Data";

      break;
    case "month":
      const startMonth = start.slice(0, start.indexOf("-"));
      const startYear = start.slice(start.indexOf("-") + 1, start.length);
      const endMonth = end.slice(0, end.indexOf("-"));
      const endYear = end.slice(end.indexOf("-") + 1, end.length);
      startTemp = new Date(startYear, startMonth - 1, 1, 0, 0, 0, 0);
      endTemp = new Date(endYear, endMonth, 1, 23, 59, 59, 999);
      endTemp.setDate(endTemp.getDate() - 1);

      data = await Order.find({
        createdAt: { $gte: startTemp, $lt: endTemp },
        status: "paid",
      }).sort({ createdAt: "asc" });

      result = customService.statisticWithMonthly(data, startTemp, endTemp);
      titleX = "Monthly Profit Data";

      break;
    case "year":
      startTemp = new Date(start, 1, 1, 0, 0, 0, 0);
      endTemp = new Date(end, 12, 31, 23, 59, 59, 999);

      data = await Order.find({
        createdAt: { $gte: startTemp, $lt: endTemp },
        status: "paid",
      }).sort({ createdAt: "asc" });

      result = customService.statisticWithYearly(data, startTemp, endTemp);
      titleX = "Yearly Profit Data";

      break;
    default:
      break;
  }
  res.send({
    data: result,
    titleX: titleX,
    titleY: titleY,
    success: true,
    start: start,
    end: end,
  });
};

exports.getStatisticTopSale = async (req, res, next) => {
  let result = new Array();
  let titleY = "Quantity";
  let titleX = "Top 10 Sale Products";
  const topSale = await Product.find().sort({ soldQuantity: "desc" }).limit(10).exec();
  
  topSale.forEach(item => {
    result.push({ date: item.prodName, units: item.soldQuantity });
  });

  res.send({
    data: result,
    titleX: titleX,
    titleY: titleY,
    success: true
  })
}

exports.getDemo = async (req, res, next) => {
  console.log(googleapis.getData());
}