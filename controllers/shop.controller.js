const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const Customer = require("../models/customer.model");
const Comment = require("../models/comment.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const {
  PRODUCT_MODEL,
  CUSTOMER_MODEL,
  COUPON_MODEL,
} = require("../constants/modal");
// const passport = require("passport");

exports.index = (req, res, next) => {
  res.render("index");
};

exports.login = (req, res, next) => {
  res.render("login");
};

exports.categories = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  var cartTotal = 0;
  if (user != null) {
    cartTotal = user.cart.totalQuantity;
  } else {
    cartTotal = req.session.totalQuantity;
  }

  //Biến truyền qua view
  const category = {
    allProducts: 0,
    products: 0,
    current: 0,
    pages: 0,
    allCategories: 0,
    allBrands: 0,
    user,
    cartTotal: 0,
    bestSellers: 0,
    categories: "",
    brands: "",
    fromPrice: "",
    toPrice: "",
    sortPrice: "",
    search: "",
  };

  //Set số sản phẩm trên một trang, và lấy trang hiện tại
  let perPage = 9;
  let page;

  if (Number(req.query.page)) {
    page = page <= 0 ? 1 : req.query.page;
  } else {
    page = 1;
  }

  const allCategories = await Category.find({ status: true });
  const allBrands = await Brand.find({ status: true });
  const allProducts = await Product.find({ status: true });

  //Product sau khi lọc
  let productsFilter = allProducts;

  //Categories đã chọn
  let categories = "";
  if (!req.query.categories) {
    category.categories = "";
  } else if (req.query.categories != "") {
    categories = req.query.categories || "";
    categories = categories.split("_");
    productsFilter = productsFilter.filter((product) =>
      categories.includes(
        product.prodTypeName.toLowerCase().split(" ").join("-")
      )
    );
    category.categories = req.query.categories || "";
  }

  //Brands đã chọn
  let brands = "";
  if (!req.query.brands) {
    category.brands = "";
  } else if (req.query.brands != "") {
    brands = req.query.brands || "";
    brands = req.query.brands.split("_");
    productsFilter = productsFilter.filter((product) =>
      brands.includes(product.brandName.toLowerCase().split(" ").join("-"))
    );
    category.brands = req.query.brands || "";
  }
  //Khoảng giá đã chọn
  let fromPrice = "";
  let toPrice = "";

  if (req.query.fromPrice == "" || isNaN(Number(req.query.fromPrice))) {
    category.fromPrice = "";
  } else {
    fromPrice = Number(req.query.fromPrice);
    productsFilter = productsFilter.filter(
      (product) => fromPrice <= Number(product.price)
    );
    category.fromPrice = fromPrice;
  }

  if (req.query.toPrice == "" || isNaN(Number(req.query.toPrice))) {
    category.toPrice = "";
  } else {
    toPrice = Number(req.query.toPrice);
    productsFilter = productsFilter.filter(
      (product) => toPrice >= Number(product.price)
    );
    category.toPrice = toPrice;
  }

  //best seller
  const bestSellers = await Product.find({ status: true })
    .sort({ soldQuantity: -1 })
    .limit(10)
    .exec();
  category.bestSellers = bestSellers;

  //sort by price
  category.sortPrice = req.query.sortPrice || "";
  if (category.sortPrice == "increase") {
    productsFilter.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (category.sortPrice == "decrease") {
    productsFilter.sort(function (a, b) {
      return b.price - a.price;
    });
  }

  //search
  let search = req.query.search || "";
  if (search) {
    productsFilter = productsFilter.filter((product) =>
      product.prodName.toLowerCase().includes(search.toLowerCase())
    );
    category.search = search;
  }

  //Lấy sản phẩm được lọc
  category.allProducts = productsFilter;
  category.allCategories = allCategories;
  category.allBrands = allBrands;

  category.products = productsFilter.slice(
    perPage * (page - 1),
    perPage * page
  );
  category.current = page;
  category.pages = Math.ceil(productsFilter.length / perPage);

  category.user = user;

  category.cartTotal = cartTotal;

  res.render("categories", category);
};

exports.cart = async (req, res, next) => {
  res.cookie("oldUrl", "/cart");
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const message = req.cookies?.message || "";
  if (message) {
    res.clearCookie("message");
  }

  if (user != null) {
    if (req.session?.cartDetails) {
      for (let j = 0; j < req.session.cartDetails.length; j++) {
        var flag = false;
        for (let i = 0; i < user.cart.cartDetails.length; i++) {
          if (
            user.cart.cartDetails[i].productId ==
            req.session.cartDetails[j].productId
          ) {
            user.cart.cartDetails[i].amount +=
              req.session.cartDetails[j].amount;
            user.cart.price +=
              req.session.cartDetails[j].price *
              req.session.cartDetails[j].amount;
            flag = true;
            break;
          }
        }
        user.cart.totalQuantity += req.session.cartDetails[j].amount;

        if (!flag) {
          user.cart.cartDetails.push(req.session.cartDetails[j]);
          user.cart.price +=
            req.session.cartDetails[j].price *
            req.session.cartDetails[j].amount;
        }
      }

      var checkUpdate = await Customer.updateOne(
        { _id: user._id },
        { cart: user.cart }
      );

      if (checkUpdate?.modifiedCount) {
        const userToken = {
          _id: user._id,
          cusName: user.cusName,
          phone: user.phone,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          avatarLink: user.avatarLink,
          username: user.username,
          password: user.password,
          cart: user.cart,
          province: user.province,
          district: user.district,
          commune: user.commune,
          address: user.address,
        };

        const token = jwt.sign(userToken, process.env.KEY_JWT, {
          algorithm: "HS256",
          expiresIn: "1h",
        });

        res.cookie("cusToken", token);
      }
    }
    res.render("cart", {
      message: message,
      user: user,
      cartDetails: user.cart.cartDetails,
      cartTotal: user.cart.totalQuantity,
      totalCarts: user.cart.price,
      allTotalCarts: user.cart.price + 20,
    });
  } else {
    var cartDetails = req.session?.cartDetails || [];
    var totalCarts = req.session?.totalCarts || 0;
    res.render("cart", {
      message: message,
      user: user,
      cartDetails: cartDetails,
      cartTotal: req.session.totalQuantity,
      totalCarts: totalCarts,
      allTotalCarts: totalCarts + 20,
    });
  }
};

exports.signup = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var cartTotal = 0;
  if (user != null) {
    cartTotal = user.cart.totalQuantity;
  } else {
    cartTotal = req.session.totalQuantity;
  }
  res.render("signup", { user, cartTotal });
};

exports.singleProduct = async (req, res, next) => {
  res.render("single-product");
};

exports.checkout = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  if (user.cart.totalQuantity > 0) {
    res.render("checkout", {
      cusModel: CUSTOMER_MODEL,
      couponModel: COUPON_MODEL,
      user: user,
      cartDetails: user.cart.cartDetails,
      cartTotal: user.cart.totalQuantity,
      totalCarts: user.cart.price,
      allTotalCarts: user.cart.price + 20,
    });
  } else {
    res.cookie("message", { message: "No Product To Checkout", type: "fail" });
    res.redirect("/cart");
  }
};

//render trang chu
exports.getIndex = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  var cartTotal = 0;
  if (user != null) {
    cartTotal = user.cart.totalQuantity;
  } else {
    cartTotal = req.session.totalQuantity;
  }

  const bestSellers = await Product.find({ status: true })
    .sort({ soldQuantity: -1 })
    .limit(10)
    .exec();

  const awesomeProducts = await Product.find({ status: true })
    .sort({ soldQuantity: -1 })
    .limit(12)
    .exec();

  console.log(bestSellers);

  res.render("index", {
    awesomeProducts: awesomeProducts,
    bestSellers: bestSellers,
    user: user,
    cartTotal: cartTotal,
  });
};

exports.getProduct = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var cartTotal = 0;
  if (user != null) {
    cartTotal = user.cart.totalQuantity;
  } else {
    cartTotal = req.session.totalQuantity;
  }

  const prodId = req.params.id;
  const product = await Product.findById({ _id: prodId });
  const comments = await Comment.find({ productId: prodId });
  const bestSellers = await Product.find({ status: true })
    .sort({ soldQuantity: -1 })
    .limit(10)
    .exec();
  return res.render("products", {
    product,
    comments,
    bestSellers,
    user,
    cartTotal,
  });
};

exports.postComment = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var newComment;

  if (user != null) {
    newComment = {
      content: req.body.commentContent,
      cusName: user.cusName,
      productId: req.params.productId,
      cusId: user._id,
    };
  } else {
    newComment = {
      content: req.body.commentContent,
      cusName: req.body.name,
      productId: req.params.productId,
    };
  }
  console.log(newComment);
  const comment = new Comment(newComment);
  comment.save((err, data) => {
    if (err) console.log(err);
    res.redirect("/products/" + req.params.productId);
  });
};

exports.getOrder = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const orders = await Order.find({ cusId: user._id });
  return res.render("orders", {
    orders: orders,
    user: user,
    cartTotal: user.cart.totalQuantity,
  });
};

exports.postAccount = async (req, res, next) => {
  req.session.url = req.url;

  res.render("signup", {
    pageName: " signup ",
  });
};

exports.getUserbyUserName = async (req, res, next) => {
  const userName = req.params.username;
  const findUser = await Customer.findOne({ username: userName });
  if (findUser) {
    res.send(true);
  } else {
    res.send(false);
  }
};

exports.postCustomer = async (req, res, next) => {
  // req.session.url = req.url;

  const newCustomer = {
    cusName: req.body.fullName,
    phone: req.body.phone,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    status: true,
  };
  const customer = new Customer(newCustomer);
  await customer.save((err, data) => {
    if (err) console.log(err);

    //
    // generate token and save
    var token = new Token({
      _userId: customer._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    token.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      var fullUrl = req.protocol + "://" + req.get("host");
      // Send email (use credintials of SendGrid)
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        },
      });
      var mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: newCustomer.email,
        subject: "Account Verification Link",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${newCustomer.cusName}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href="${fullUrl}/confirm/${token.token}"> Click here</a>
        </div>`,
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.log(err);
          res.cookie("message", {
            message:
              "Technical Issue!, Please click on resend for verify your Email.",
            type: "error",
          });
          res.redirect("/login");
        }
        res.cookie("message", {
          message:
            "A verification email has been sent to " +
            newCustomer.email +
            ". It will be expire after one day. If you not get verification Email click on resend token.",
          type: "fail",
        });
        res.redirect("/login");
      });
    });
    //
  });
  //  res.redirect("/login");
};

exports.verifyCustomer = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var tokenCus = await Token.findOne({ token: req.params.token });
  if (tokenCus) {
    var checkVerify = await Customer.updateOne(
      { _id: tokenCus._userId },
      { active: true }
    );
    if (checkVerify.modifiedCount) {
      res.cookie("message", {
        message: "Verify your mail successfully",
        type: "success",
      });
      res.redirect("/login");
    }
  }
};

exports.profile = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var message = req.cookies?.message || "";
  res.clearCookie("message");
  var cartTotal = 0;
  if (user != null) {
    cartTotal = user.cart.totalQuantity;
  } else {
    cartTotal = req.session.totalQuantity;
  }

  const date = new Date(user?.dateOfBirth);
  user.dateOfBirth =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  res.render("profile", {
    pageName: "profile",
    user,
    cusModel: CUSTOMER_MODEL,
    cartTotal: cartTotal,
    message: message,
  });
};

exports.changepassword = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var message = req.cookies?.message || "";
  res.clearCookie("message");
  var cartTotal = 0;
  if (user != null) {
    cartTotal = user.cart.totalQuantity;
  } else {
    cartTotal = req.session.totalQuantity;
  }

  res.render("changepassword", {
    pageName: "changepassword",
    user,
    cusModel: CUSTOMER_MODEL,
    cartTotal: cartTotal,
    message: message,
  });
};

exports.addCard = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const product = await Product.findById(req.params.id);

  const newCardDetail = {
    productId: product._id,
    productName: product.prodName,
    productImg: product.prodImage[0].imageLink,
    price: product.price,
    amount: 1,
  };

  if (user != null) {
    var flag = false;
    for (let i = 0; i < user.cart.cartDetails.length; i++) {
      if (user.cart.cartDetails[i].productId == newCardDetail.productId) {
        user.cart.cartDetails[i].amount++;
        user.cart.cartDetails[i].price = product.price;
        user.cart.price += user.cart.cartDetails[i].price;
        flag = true;
        break;
      }
    }
    user.cart.totalQuantity++;

    if (!flag) {
      user.cart.cartDetails.push(newCardDetail);
      user.cart.price += newCardDetail.price;
    }

    var checkUpdate = await Customer.updateOne(
      { _id: user._id },
      { cart: user.cart }
    );

    if (checkUpdate?.modifiedCount) {
      const userToken = {
        _id: user._id,
        cusName: user.cusName,
        phone: user.phone,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        avatarLink: user.avatarLink,
        username: user.username,
        password: user.password,
        cart: user.cart,
        province: user.province,
        district: user.district,
        commune: user.commune,
        address: user.address,
      };

      const token = jwt.sign(userToken, process.env.KEY_JWT, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      res.cookie("cusToken", token);
    }

    res.send({ amount: user.cart.totalQuantity });
  } else {
    var cartDetails = [];
    var totalQuantity = req.session.totalQuantity || 0;
    var totalCarts = req.session.totalCarts || 0;
    var flag = false;
    if (req.session?.cartDetails) {
      cartDetails = req.session.cartDetails;
      for (let i = 0; i < cartDetails.length; i++) {
        if (cartDetails[i].productId == newCardDetail.productId) {
          cartDetails[i].amount++;
          cartDetails[i].price = product.price;
          totalCarts += cartDetails[i].price;
          flag = true;
          break;
        }
      }
    }
    if (!flag) {
      cartDetails.push(newCardDetail);
      totalCarts += newCardDetail.price;
    }

    req.session.totalQuantity = totalQuantity + 1;
    req.session.cartDetails = cartDetails;
    req.session.totalCarts = totalCarts;
    res.send({ amount: req.session.totalQuantity });
  }
};

exports.addCardProductDetail = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const product = await Product.findById(req.params.id);
  const amount = parseInt(req.params.amount);

  const newCardDetail = {
    productId: product._id,
    productName: product.prodName,
    productImg: product.prodImage[0].imageLink,
    price: product.price,
    amount: amount,
  };

  if (user != null) {
    var flag = false;
    for (let i = 0; i < user.cart.cartDetails.length; i++) {
      if (user.cart.cartDetails[i].productId == newCardDetail.productId) {
        user.cart.cartDetails[i].amount+= newCardDetail.amount;
        user.cart.cartDetails[i].price = product.price;
        user.cart.price += user.cart.cartDetails[i].price*newCardDetail.amount;
        flag = true;
        break;
      }
    }
    user.cart.totalQuantity+=newCardDetail.amount;

    if (!flag) {
      user.cart.cartDetails.push(newCardDetail);
      console.log(user.cart.price, newCardDetail.price*newCardDetail.amount);
      user.cart.price += newCardDetail.price*newCardDetail.amount;
    }

    var checkUpdate = await Customer.updateOne(
      { _id: user._id },
      { cart: user.cart }
    );

    if (checkUpdate?.modifiedCount) {
      const userToken = {
        _id: user._id,
        cusName: user.cusName,
        phone: user.phone,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        avatarLink: user.avatarLink,
        username: user.username,
        password: user.password,
        cart: user.cart,
        province: user.province,
        district: user.district,
        commune: user.commune,
        address: user.address,
      };

      const token = jwt.sign(userToken, process.env.KEY_JWT, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      res.cookie("cusToken", token);
    }

    res.send({ amount: user.cart.totalQuantity });
  } else {
    var cartDetails = [];
    var totalQuantity = req.session.totalQuantity || 0;
    var totalCarts = req.session.totalCarts || 0;
    var flag = false;
    if (req.session?.cartDetails) {
      cartDetails = req.session.cartDetails;
      for (let i = 0; i < cartDetails.length; i++) {
        if (cartDetails[i].productId == newCardDetail.productId) {
          cartDetails[i].amount+=newCardDetail.amount;
          cartDetails[i].price = product.price;
          totalCarts += cartDetails[i].price*newCardDetail.amount;
          flag = true;
          break;
        }
      }
    }
    if (!flag) {
      cartDetails.push(newCardDetail);
      totalCarts += newCardDetail.price*newCardDetail.amount;
    }

    req.session.totalQuantity = totalQuantity + newCardDetail.amount;
    req.session.cartDetails = cartDetails;
    req.session.totalCarts = totalCarts;
    res.send({ amount: req.session.totalQuantity });
  }
};

exports.getAllPriceByProductId = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var productId = req.params.productId;
  var newProductAmount = parseInt(req.params.productAmount);

  if (user != null) {
    var cartsPrice = 0;
    for (let i = 0; i < user.cart.cartDetails.length; i++) {
      if (user.cart.cartDetails[i].productId == productId) {
        user.cart.totalQuantity =
          user.cart.totalQuantity -
          user.cart.cartDetails[i].amount +
          newProductAmount;
        user.cart.price +=
          user.cart.cartDetails[i].price * newProductAmount -
          user.cart.cartDetails[i].price * user.cart.cartDetails[i].amount;
        user.cart.cartDetails[i].amount = newProductAmount;
        cartsPrice =
          user.cart.cartDetails[i].price * user.cart.cartDetails[i].amount;
      }
    }

    await Customer.updateOne({ _id: user._id }, { cart: user.cart });

    const userToken = {
      _id: user._id,
      cusName: user.cusName,
      phone: user.phone,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      avatarLink: user.avatarLink,
      username: user.username,
      password: user.password,
      cart: user.cart,
      province: user.province,
      district: user.district,
      commune: user.commune,
      address: user.address,
    };

    const token = jwt.sign(userToken, process.env.KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.cookie("cusToken", token);
    res.send({
      cartsPrice: cartsPrice,
      totalCarts: user.cart.price,
      totalQuantity: user.cart.totalQuantity,
      success: true,
    });
  } else {
    var cartDetails = [];
    var cartsPrice = 0;
    if (req.session?.cartDetails) {
      cartDetails = req.session.cartDetails;
      for (let i = 0; i < cartDetails.length; i++) {
        if (cartDetails[i].productId == productId) {
          req.session.totalQuantity =
            req.session.totalQuantity -
            req.session.cartDetails[i].amount +
            newProductAmount;
          req.session.totalCarts +=
            cartDetails[i].price * newProductAmount -
            cartDetails[i].price * cartDetails[i].amount;
          cartDetails[i].amount = newProductAmount;
          cartsPrice = cartDetails[i].price * cartDetails[i].amount;
        }
      }
    }

    req.session.cartsPrice = cartsPrice;
    req.session.cartDetails = cartDetails;
    res.send({
      cartsPrice: req.session.cartsPrice,
      totalCarts: req.session.totalCarts,
      totalQuantity: req.session.totalQuantity,
      success: true,
    });
  }
};

exports.deleteProductCart = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  // console.log(user.cart.cartDetails);
  var productId = req.params.productId;
  if (user != null) {
    for (let i = 0; i < user.cart.cartDetails.length; i++) {
      if (user.cart.cartDetails[i].productId == productId) {
        user.cart.totalQuantity =
          user.cart.totalQuantity - user.cart.cartDetails[i].amount;
        user.cart.price -=
          user.cart.cartDetails[i].price * user.cart.cartDetails[i].amount;
      }
    }

    user.cart.cartDetails = user.cart.cartDetails.filter(
      (data) => data.productId != productId
    );

    Customer.updateOne({ _id: user._id }, { cart: user.cart }, (error) => {
      if (!error) {
        const userToken = {
          _id: user._id,
          cusName: user.cusName,
          phone: user.phone,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          avatarLink: user.avatarLink,
          username: user.username,
          password: user.password,
          cart: user.cart,
          province: user.province,
          district: user.district,
          commune: user.commune,
          address: user.address,
        };

        const token = jwt.sign(userToken, process.env.KEY_JWT, {
          algorithm: "HS256",
          expiresIn: "1h",
        });

        res.cookie("cusToken", token);
        res.send({
          success: true,
          totalCarts: user.cart.price,
          totalQuantity: user.cart.totalQuantity,
        });
      } else {
        res.send({ success: false });
      }
    });
  } else {
    if (req.session?.cartDetails) {
      for (let i = 0; i < req.session.cartDetails.length; i++) {
        if (req.session.cartDetails[i].productId == productId) {
          req.session.totalQuantity =
            req.session.totalQuantity - req.session.cartDetails[i].amount;
          req.session.totalCarts -=
            req.session.cartDetails[i].price *
            req.session.cartDetails[i].amount;
        }
      }
    }
    req.session.cartDetails = req.session?.cartDetails.filter(
      (data) => data.productId != productId
    );
    res.send({
      success: true,
      totalCarts: req.session.totalCarts,
      totalQuantity: req.session.totalQuantity,
    });
  }
};

exports.updateCustomerProfile = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  var newCustomer = {
    cusName: req.body.cusName,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
    province: req.body.province,
    district: req.body.district,
    commune: req.body.commune,
    address: req.body.address,
  };

  Customer.updateOne({ _id: user._id }, newCustomer, (error) => {
    if (!error) {
      const userToken = {
        _id: user._id,
        cusName: req.body.cusName,
        phone: req.body.phone,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        avatarLink: user.avatarLink,
        username: user.username,
        password: user.password,
        cart: user.cart,
        province: req.body.province,
        district: req.body.district,
        commune: req.body.commune,
        address: req.body.address,
      };

      // console.log(userToken);

      const token = jwt.sign(userToken, process.env.KEY_JWT, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      res.cookie("cusToken", token);
      res.cookie("message", { message: "Update Success", type: "success" });
      res.redirect("/profile");
    } else {
      res.cookie("message", { message: "Update Fail", type: "fail" });
    }
  });
};

exports.postOrder = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const newOrder = {
    orderNote: req.body.orderNote,
    shipping: 20,
    province: req.body.province,
    district: req.body.district,
    commune: req.body.commune,
    address: req.body.address,
    receiverPhone: req.body.phone,
    receiverName: req.body.cusName,
    receiverMail: req.body.email,
    totalQuantity: user.cart.totalQuantity,
    subTotalPrice: user.cart.price,
    orderDetails: user.cart.cartDetails,
    discountMoney: 0,
    cusId: user._id,
    totalPrice: user.cart.price + 20,
    status: "order",
  };

  const coupon = await Coupon.findOne({ code: req.body.code, status: true });
  if (coupon != null) {
    if (coupon.amount > 0) {
      if (coupon.startDate <= Date.now() && coupon.endDate >= Date.now()) {
        newOrder.couponCode = coupon.code;
        newOrder.couponId = coupon.Id;
        newOrder.discountMoney = Math.floor(
          user.cart.price * (coupon.promotionValue / 100)
        );
        newOrder.totalPrice -= newOrder.discountMoney;
      }
    }
  }

  const order = new Order(newOrder);
  order.save((err, data) => {
    if (!err) {
      user.cart.totalQuantity = 0;
      user.cart.price = 0;
      user.cart.cartDetails = [];
      Customer.updateOne({ _id: user._id }, { cart: user.cart }, (error) => {
        if (!error) {
          const userToken = {
            _id: user._id,
            cusName: user.cusName,
            phone: user.phone,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            avatarLink: user.avatarLink,
            username: user.username,
            password: user.password,
            cart: user.cart,
            province: user.province,
            district: user.district,
            commune: user.commune,
            address: user.address,
          };

          const token = jwt.sign(userToken, process.env.KEY_JWT, {
            algorithm: "HS256",
            expiresIn: "1h",
          });

          res.cookie("cusToken", token);
          res.redirect("/orders");
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(err);
    }
  });
};

exports.addCoupon = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );
  var discountMoney = 0;
  var totalMoney = 0;
  var coupon = await Coupon.findOne({ code: req.params.code, status: true });
  if (coupon != null) {
    if (coupon.amount > 0) {
      if (coupon.startDate <= Date.now() && coupon.endDate >= Date.now()) {
        discountMoney = Math.floor(
          user.cart.price * (coupon.promotionValue / 100)
        );
        totalMoney = user.cart.price + 20 - discountMoney;
        res.send({
          message: "Add coupon sussessfully",
          status: true,
          discountMoney: discountMoney,
          totalMoney: totalMoney,
        });
      } else {
        res.send({ message: "Coupon out of date", status: false });
      }
    } else {
      res.send({ message: "Limited used coupon", status: false });
    }
  } else {
    res.send({ message: "Not found coupon", status: false });
  }
};

exports.getOrdersDetail = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.cusToken,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return null;
      } else {
        return data;
      }
    }
  );

  const order = await Order.findOne({ _id: req.params.orderId });
  return res.render("orderdetail", {
    order: order,
    user: user,
    cartTotal: user.cart.totalQuantity,
  });
};
