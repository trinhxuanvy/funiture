const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const { ORDER_MODEL } = require("../../constants/modal");
const { ITEM_PAGE } = require("../../constants/variables");

exports.getOrder = async (req, res, next) => {
  let page = req.body.page || 1;
  let filterArray = [];
  let orders = [];

  for (let item in req.query) {
    if (req.query[item]) {
      filterArray.push(req.query[item]);
    }
  }

  if (filterArray.length) {
    orders = await Order.find({ status: { $in: filterArray } })
      .sort({ createdAt: -1 })
      .exec();
  } else {
    orders = await Order.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(orders.length / ITEM_PAGE);
  const totalPage = orders.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = orders.length ? page : 0;
  orders = orders.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/orders", {
    pageName: "order",
    orders,
    orderModel: ORDER_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
  });
};

exports.getOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById({ _id: orderId });

  if (order) {
    res.json({ data: order.orderDetails, success: true });
  } else {
    res.json({ success: false });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id || "";
    let product;
    let update = await Order.updateOne(
      { _id: orderId },
      { status: req.body.status }
    );

    if (update?.modifiedCount != 0) {
      const orderNew = await Order.findById({ _id: orderId });
      if (orderNew.isPaid && req.body.status != "paid") {
        update = await Order.findByIdAndUpdate(
          { _id: orderId },
          { isPaid: false }
        );
        for (let i = 0; i < orderNew?.orderDetails.length; i++) {
          product = await Product.findById({
            _id: orderNew?.orderDetails[i].productId,
          });
          update = await Product.findByIdAndUpdate(
            { _id: product._id },
            {
              soldQuantity:
                product.soldQuantity - orderNew?.orderDetails[i].amount,
              amount: product.amount + orderNew?.orderDetails[i].amount,
            }
          );
        }
      }
      if (req.body.status == "paid" && !orderNew.isPaid) {
        update = await Order.findByIdAndUpdate(
          { _id: orderId },
          { isPaid: true }
        );
        for (let i = 0; i < orderNew?.orderDetails.length; i++) {
          product = await Product.findById({
            _id: orderNew?.orderDetails[i].productId,
          });
          update = await Product.findByIdAndUpdate(
            { _id: product._id },
            {
              soldQuantity:
                product.soldQuantity + orderNew?.orderDetails[i].amount,
              amount: product.amount - orderNew?.orderDetails[i].amount,
            }
          );
        }
      }
      res.send({ orderNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.postOrder = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let orders = await Order.find().sort({ createdAt: -1 }).exec();

  const getPage = Math.floor(orders.length / ITEM_PAGE);
  const totalPage = orders.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = orders.length ? page : 0;
  orders = orders.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/orders", {
    pageName: "orders",
    orders,
    orderModel: ORDER_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
  });
}