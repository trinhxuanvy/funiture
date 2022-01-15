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
  if(user != null)
  {
    cartTotal = user.cart.totalQuantity;
  }
  else
  {
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
    categories: '',
    brands: '',
    fromPrice: '',
    toPrice: '',
    sortPrice: '',
    search: '',
  };

  //Set số sản phẩm trên một trang, và lấy trang hiện tại
  let perPage = 9;
  let page;

  if (Number(req.query.page)) {
    page = page <= 0 ? 1 : req.query.page;
  } else {
    page = 1;
  }

  const allCategories = await Category.find();
  const allBrands = await Brand.find();
  const allProducts = await Product.find();

  //Product sau khi lọc
  let productsFilter = allProducts;

  //Categories đã chọn
  let categories = '';
  if (!req.query.categories) {
    category.categories = '';
  } else if (req.query.categories != '') {
    categories =  req.query.categories || '';
    categories = categories.split('_');
    productsFilter = productsFilter.filter(product => 
      categories.includes(product.prodTypeName.toLowerCase().split(' ').join('-')));
    category.categories =  req.query.categories || '';
  }

  //Brands đã chọn
  let brands = '';
  if (!req.query.brands) {
    category.brands = '';
  } else if (req.query.brands != '') {
    brands =  req.query.brands || '';
    brands = req.query.brands.split('_');
    productsFilter = productsFilter.filter(product => 
      brands.includes(product.brandName.toLowerCase().split(' ').join('-')));
    category.brands =  req.query.brands || '';
  }
  //Khoảng giá đã chọn
  let fromPrice = '';
  let toPrice = '';

  if(req.query.fromPrice == '' || isNaN(Number(req.query.fromPrice))) {
    category.fromPrice = '';
  } else {
    fromPrice = Number(req.query.fromPrice);
    productsFilter = productsFilter.filter(product => 
      fromPrice <= Number(product.price));
    category.fromPrice = fromPrice;
  }

  if(req.query.toPrice == '' || isNaN(Number(req.query.toPrice))) {
    category.toPrice = '';
  } else {
    toPrice = Number(req.query.toPrice);
    productsFilter = productsFilter.filter(product => 
      toPrice >= Number(product.price));
    category.toPrice = toPrice;
  }

  //best seller
  const bestSellers = await Product.find()
    .sort({ hasSold: -1 })
    .limit(10)
    .exec();
  category.bestSellers = bestSellers;

  //sort by price
  category.sortPrice = req.query.sortPrice || '';
  if (category.sortPrice == 'increase') {
    productsFilter.sort(function(a, b) {
      return a.price - b.price;
    });
  } else if (category.sortPrice == 'decrease') {
    productsFilter.sort(function(a, b) {
      return b.price - a.price;
    });
  }

  //search
  let search = req.query.search || '';
  if (search) {
    productsFilter = productsFilter.filter(product => 
      product.prodName.toLowerCase().includes(search.toLowerCase()))
    category.search = search;
  }

  //Lấy sản phẩm được lọc
  category.allProducts = productsFilter;
  category.allCategories = allCategories;
  category.allBrands = allBrands;

  category.products = productsFilter.slice(perPage * (page - 1), perPage * page);
  category.current = page;
  category.pages = Math.ceil(productsFilter.length / perPage);

  category.user = user;

  category.cartTotal = cartTotal;

  res.render("categories", category);
};

exports.cart = async (req, res, next) => {
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
  
  var cartDetails = [];

  var cartTotal = 0;
  var totalCarts = 0;
  var allTotalCarts = 0;
  if(user != null)
  {
    cartTotal = user.cart.totalQuantity;
    cartDetails = user.cart.cartDetails;
    if(user.cart)
    {
      for(let i = 0; i < user.cart.cartDetails.length; i++)
      {
        totalCarts += user.cart.cartDetails[i].price*user.cart.cartDetails[i].amount;
      }
    }
  }
  else
  {
    cartTotal = req.session.totalQuantity;
    if(req.session.cartDetails)
    {
      cartDetails = req.session.cartDetails;
      for(let i = 0; i < req.session.cartDetails.length; i++)
      {
        totalCarts += req.session.cartDetails[i].price*req.session.cartDetails[i].amount;
      }
    }
  }

  allTotalCarts = totalCarts + 20;

  res.render("cart", { user, cartTotal, cartDetails, totalCarts, allTotalCarts});
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
  if(user != null)
  {
    cartTotal = user.cart.totalQuantity;
  }
  else
  {
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

  if(user != null)
  {
    res.render("checkout", { user: user, cartDetails: user.cart.cartDetails, cartTotal: user.cart.totalQuantity, totalCarts: user.cart.price, allTotalCarts : user.cart.price + 20 });
  }
  else
  {
    res.render("checkout", { user: user, cartDetails: req.session.cartDetails, cartTotal: req.session.totalQuantity, totalCarts: req.session.totalCarts, allTotalCarts : req.session.totalCarts + 20 });
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
  if(user != null)
  {
    cartTotal = user.cart.totalQuantity;
  }
  else
  {
    cartTotal = req.session.totalQuantity;
  }

  const bestSellers = await Product.find()
    .sort({ hasSold: -1 })
    .limit(10)
    .exec();

  const awesomeProducts = await Product.find()
    .sort({ viewCount: -1 })
    .limit(12)
    .exec();

  res.render("index", {
    awesomeProducts: awesomeProducts,
    bestSellers: bestSellers,
    user: user,
    cartTotal: cartTotal
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
  if(user != null)
  {
    cartTotal = user.cart.totalQuantity;
  }
  else
  {
    cartTotal = req.session.totalQuantity;
  }

  const prodId = req.params.id;
  const product = await Product.findById({ _id: prodId });
  const bestSellers = await Product.find({ status: true }).exec();
  return res.render("products", {product, bestSellers, user, cartTotal});
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
  req.session.url = req.url;

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
  });
  res.redirect("/login");
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
  if(user != null)
  {
    cartTotal = user.cart.totalQuantity;
  }
  else
  {
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
    res.send({amount: user.cart.totalQuantity});
  } 
  else {
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
    res.send({amount: req.session.totalQuantity});
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
        user.cart.totalQuantity = user.cart.totalQuantity - user.cart.cartDetails[i].amount + newProductAmount;
        user.cart.price += user.cart.cartDetails[i].price*newProductAmount - user.cart.cartDetails[i].price*user.cart.cartDetails[i].amount;
        user.cart.cartDetails[i].amount = newProductAmount;
        cartsPrice = user.cart.cartDetails[i].price*user.cart.cartDetails[i].amount;
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
    res.send({cartsPrice: cartsPrice, totalCarts: user.cart.price, totalQuantity: user.cart.totalQuantity, success: true});
  } 
  else {
    var cartDetails = [];
    var cartsPrice = 0;
    if (req.session?.cartDetails) {
      cartDetails = req.session.cartDetails;
      for (let i = 0; i < cartDetails.length; i++) {
        if (cartDetails[i].productId == productId) {
          req.session.totalQuantity = req.session.totalQuantity - req.session.cartDetails[i].amount + newProductAmount;
          req.session.totalCarts +=  cartDetails[i].price*newProductAmount - cartDetails[i].price*cartDetails[i].amount;
          cartDetails[i].amount = newProductAmount;
          cartsPrice = cartDetails[i].price*cartDetails[i].amount;
        }
      }
    }

    req.session.cartsPrice = cartsPrice;
    req.session.cartDetails = cartDetails;
    res.send({cartsPrice: req.session.cartsPrice, totalCarts: req.session.totalCarts, totalQuantity: req.session.totalQuantity, success: true});
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
        user.cart.totalQuantity = user.cart.totalQuantity - user.cart.cartDetails[i].amount;
        user.cart.price -= user.cart.cartDetails[i].price*user.cart.cartDetails[i].amount;
      }
    }

    user.cart.cartDetails = user.cart.cartDetails.filter( data => data.productId != productId);

    Customer.updateOne({ _id: user._id }, { cart: user.cart }, (error) =>
    {
      if(!error)
      {
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
        console.log(user.cart.cartDetails);
        res.send({success: true, totalCarts: user.cart.price, totalQuantity: user.cart.totalQuantity});
      }
      else
      {
        res.send({success: false});
      }
    });
  }
  else
  {
    if (req.session?.cartDetails) {
      for (let i = 0; i < req.session.cartDetails.length; i++) {
        if (req.session.cartDetails[i].productId == productId) {
          req.session.totalQuantity = req.session.totalQuantity - req.session.cartDetails[i].amount;
          req.session.totalCarts -= req.session.cartDetails[i].price*req.session.cartDetails[i].amount;
        }
      }
    }
    req.session.cartDetails = req.session?.cartDetails.filter( data => data.productId != productId);
    res.send({success: true, totalCarts: req.session.totalCarts, totalQuantity: req.session.totalQuantity});
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

  var newCustomer = {};

  if (req.body?.password) {
    const newPassword = await bcrypt.hash(req.body?.password, 12);
    newCustomer = {
      password: newPassword,
    };
  } else {
    newCustomer = {
      cusName: req.body.cusName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      province: req.body.province,
      district: req.body.district,
      commune: req.body.commune,
      address: req.body.address,
    };
  }

  console.log(newCustomer);

  Customer.updateOne({ _id: user._id }, newCustomer, (error) =>
  {
    if(!error)
    {
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
    }
    else{
      res.cookie("message", { message: "Update Fail", type: "fail" });
    }
  });

};
