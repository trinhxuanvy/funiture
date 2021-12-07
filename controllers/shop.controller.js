const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const Customer = require("../models/customer.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PRODUCT_MODEL, CUSTOMER_MODEL } = require("../constants/modal");
// const passport = require("passport");

exports.index = (req, res, next) => {
  res.render("index");
};

exports.login = (req, res, next) => {
  res.render("login");
};

exports.categories = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  //Biến truyền qua view
  const category = {
    products: 0,
    current: 0,
    pages: 0,
    allCategories: 0,
    allBrands: 0,
    user,
  };

  //Set số sản phẩm trên một trang, và lấy trang hiện tại
  let perPage = 9;
  let page;
  if (Number(req.params.page)) {
    page = page <= 0 ? 1 : req.params.page;
  } else {
    page = 1;
  }

  const allCategories = await Category.find();
  const allBrands = await Brand.find();
  const allProducts = await Product.find();

  category.allCategories = allCategories;

  category.allBrands = allBrands;

  category.products = allProducts.slice(perPage * (page - 1), perPage * page);
  category.current = page;
  category.pages = Math.ceil(allProducts.length / perPage);

  category.user = user;


  res.render("categories", category);
};

exports.cart = async (req, res, next) => {
  res.render("cart");
};

exports.signup = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  res.render("signup", {user});
};

exports.singleProduct = async (req, res, next) => {
  res.render("single-product");
};

exports.checkout = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  res.render("checkout", {user});
};

//render trang chu
exports.getIndex = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const bestSellers = await Product.find()
    .sort({ hasSold: -1 })
    .limit(10)
    .exec();
    
  const awesomeProducts = await Product.find()
    .sort({ viewCount: -1 })
    .limit(10)
    .exec();

  res.render("index", {
    awesomeProducts: awesomeProducts,
    bestSellers: bestSellers,
    user: user
  });
};

exports.getProduct = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  const prodId = req.params.id;
  const product = await Product.findById({ _id: prodId });
  const bestSellers = await Product.find({ status: true }).exec();
  return res.render("products", {
    product: product,
    bestSellers: bestSellers,
    user: user,
  });
};

exports.postAccount = async (req, res, next) => {
  req.session.url = req.url;


  res.render("signup", {
    pageName: " signup ",
  });
};

exports.postCustomer = async (req, res, next) => {
  req.session.url = req.url;
  const newPassword = await bcrypt.hash(req.body.password, 12);

  const newCustomer = {
    cusName: req.body.fullName,
    phone: req.body.phone,
    email: req.body.email,
    username: req.body.username,
    password: newPassword,
    status: true,
  };
  const customer = new Customer(newCustomer);
  await customer.save((err, data) => {
    if (err) console.log(err);
  });
  res.redirect("/login");
};

exports.profile = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return {};
      } else {
        return data;
      }
    }
  );

  const date = new Date(user?.dateOfBirth);
  user.dateOfBirth =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  res.render("profile", {
    pageName: "profile",
    user,
    cusModel: CUSTOMER_MODEL,
  });
};
