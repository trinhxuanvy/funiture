const Customer = require("../../models/customer.model");
const { CUSTOMER_MODEL } = require("../../constants/modal");
const { ITEM_PAGE } = require("../../constants/variables");

exports.getCustomer = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let customers = [];

  if (search) {
    customers = await Customer.find({
      cusName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    customers = await Customer.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(customers.length / ITEM_PAGE);
  const totalPage = customers.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = customers.length ? page : 0;
  customers = customers.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/customers", {
    pageName: "customer",
    customers,
    customerModel: CUSTOMER_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.postCustomer = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let customers = [];

  if (!req.body.page) {
    const customer = {
      cusName: req.body.cusName,
      phone: req.body.phone,
      email: req.body.email,
      username: req.body.username,
      password: "Cus@" + req.body.phone,
    };

    const newCustomer = new Customer(customer);
    await newCustomer.save();
  }

  if (search) {
    customers = await Customer.find({
      cusName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    customers = await Customer.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(customers.length / ITEM_PAGE);
  const totalPage = customers.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = customers.length ? page : 0;
  customers = customers.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/customers", {
    pageName: "customer",
    customers,
    customerModel: CUSTOMER_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const cusId = req.params.id || "";
    let update;

    switch (Object.keys(req.body)[0]) {
      default:
        let cusProperty = { $set: {} };
        cusProperty["$set"][Object.keys(req.body)[0]] =
          req.body[Object.keys(req.body)[0]] || "";

        update = await Customer.updateOne({ _id: cusId }, cusProperty);
        break;
    }

    if (update?.modifiedCount != 0) {
      const cusNew = await Customer.findById({ _id: cusId });
      res.send({ cusNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.deleteCustomer = async (req, res, next) => {
  const cusId = req.params.id;
  Customer.findByIdAndDelete({ _id: cusId }, (err) => {
    if (!err) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
};

exports.lockCustomer = (req, res, next) => {
  const cusId = req.params.id;
  Customer.findById({ _id: cusId }, async (err, data) => {
    const update = await Customer.updateOne(
      { _id: cusId },
      { $set: { status: !data.status } }
    );

    if (update?.modifiedCount != 0) {
      res.send({ status: !data.status, success: true });
    } else {
      res.send({ success: false });
    }
  });
};

exports.getCustomerbyUsername = async (req, res, next) => {
  try {
    const username = req.params.username;

    Customer.findOne({ username: username }, (err, data) => {
      if (!err) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  } catch (error) {}
};
