const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Customer = require("../models/customer.model");
const Brand = require("../models/brand.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const firebase = require("../services/firebase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  PRODUCT_MODEL,
  ADMIN_MODEL,
  BRAND_MODEL,
  CATEGORY_MODEL,
  CUSTOMER_MODEL,
  COUPON_MODEL,
  ORDER_MODEL,
} = require("../constants/modal");
//const { data } = require("../data-sample/data");
const { PRODUCT, SORT } = require("../constants/variables");
const {
  statisticWithDaily,
  statisticWithMonthly,
  statisticWithYearly,
} = require("../services/custom");

dotenv.config();
const ITEM_PAGE = 8;

exports.uploadFile = async (req, res, next) => {
  let upload = [];
  if (req?.files) {
    upload = await firebase.uploadImage(req?.files?.[0]);
  }

  if (upload.length) {
    res.send({ url: upload, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.getIndex = async (req, res, next) => {
  res.render("admin/products", { pageName: "product" });
};

exports.getProduct = async (req, res, next) => {
  const page = 1;
  let search = req.query.search || "";
  let sort = req.query.sort || "";
  let following = req.query.following || "";
  let products = [];
  let prodProperty = {};

  if (search) {
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: "desc" })
      .exec();

    search = "?search=" + search;
  } else if (SORT.indexOf(sort) > -1 && PRODUCT.indexOf(following) > -1) {
    prodProperty[following] = sort || "";
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort(prodProperty)
      .exec();

    sort = "?sort=" + sort;
    following = "&following=" + following;
  } else {
    products = await Product.find().sort({ createdAt: "desc" }).exec();
  }

  const getPage = Math.floor(products.length / ITEM_PAGE);
  const totalPage = products.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const categories = await Category.find({ status: true });
  const brands = await Brand.find({ status: true });
  const numPage = products.length ? page : 0;
  products = products.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/products", {
    pageName: "product",
    products,
    categories,
    brands,
    page,
    numPage,
    nextPage,
    prevPage,
    totalPage,
    search,
    sort,
    following,
    prodModel: PRODUCT_MODEL,
  });
};

exports.postProduct = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let sort = req.query.sort || "";
  let following = req.query.following || "";
  let prodProperty = {};
  let products = [],
    productSave;

  if (!req.body.page) {
    const prodType = await Category.findById(req.body.prodTypeId);
    const brand = await Brand.findById(req.body.brandId);
    const urlPrimaryImage = await firebase.uploadImage(
      req.files["primaryImage"][0]
    );
    const urlSecondaryImage1 = await firebase.uploadImage(
      req.files["secondaryImage_1"][0]
    );
    const urlSecondaryImage2 = await firebase.uploadImage(
      req.files["secondaryImage_2"][0]
    );
    const urlSecondaryImage3 = await firebase.uploadImage(
      req.files["secondaryImage_3"][0]
    );
    const newProduct = {
      prodName: req.body.prodName,
      description: req.body.description,
      amount: req.body.amount,
      price: req.body.price,
      status: true,
      prodImage: [
        {
          imageLink: urlPrimaryImage,
          type: "1",
        },
        {
          imageLink: urlSecondaryImage1,
          type: "2",
        },
        {
          imageLink: urlSecondaryImage2,
          type: "3",
        },
        {
          imageLink: urlSecondaryImage3,
          type: "4",
        },
      ],
      prodTypeId: req.body.prodTypeId,
      prodTypeName: prodType.prodTypeName,
      brandId: req.body.brandId,
      brandName: brand.brandName,
      prodName: req.body.prodName,
      color: req.body.color,
      width: req.body.width,
      height: req.body.height,
      depth: req.body.depth,
      weight: req.body.weight,
      soldQuantity: req.body.soldQuantity,
    };
    const product = new Product(newProduct);
    productSave = await product.save();
  }

  if (search) {
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: "desc" })
      .exec();

    search = "?search=" + search;
  } else if (SORT.indexOf(sort) > -1 && PRODUCT.indexOf(following) > -1) {
    prodProperty[following] = sort || "";
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort(prodProperty)
      .exec();

    sort = "?sort=" + sort;
    following = "&following=" + following;
  } else {
    products = await Product.find().sort({ createdAt: "desc" }).exec();
  }

  const getPage = Math.floor(products.length / ITEM_PAGE);
  const totalPage = products.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const categories = await Category.find({ status: true });
  const brands = await Brand.find({ status: true });
  const numPage = products.length ? page : 0; // Page Number sẽ hiển thị
  products = products.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/products", {
    pageName: "product",
    products,
    categories,
    brands,
    page,
    numPage,
    nextPage,
    prevPage,
    totalPage,
    search,
    sort,
    following,
    prodModel: PRODUCT_MODEL,
  });
};

exports.lockProduct = (req, res, next) => {
  const prodId = req.params.id;

  Product.findById({ _id: prodId }, async (err, data) => {
    if (!err) {
      const update = await Product.updateOne(
        { _id: prodId },
        { $set: { status: !data.status } }
      );

      if (update?.modifiedCount != 0) {
        res.send({ status: !data.status, success: true });
      } else {
        res.send({ success: false });
      }
    }
  });
};

exports.updateProduct = async (req, res, next) => {
  try {
    let update;
    const prodId = req.params.id || "";
    const prodOld = await Product.findById({ _id: prodId });

    switch (Object.keys(req.body)[0]) {
      case PRODUCT_MODEL.prodTypeId:
        const prodType = await Category.findById(req.body.prodTypeId);
        update = await Product.updateOne(
          { _id: prodId },
          {
            $set: {
              prodTypeId: req.body.prodTypeId,
              prodTypeName: prodType.prodTypeName,
            },
          }
        );
        break;
      case PRODUCT_MODEL.brandId:
        const brand = await Brand.findById(req.body.brandId);
        update = await Product.updateOne(
          { _id: prodId },
          {
            $set: {
              brandId: req.body.brandId,
              brandName: brand.brandName,
            },
          }
        );
        break;
      case PRODUCT_MODEL.primaryImage:
        update = await Product.updateOne(
          { _id: prodId },
          {
            $set: {
              prodImage: [
                {
                  imageLink: req.body.primaryImage,
                  type: "1",
                },
                {
                  imageLink: prodOld?.prodImage?.[1].imageLink,
                  type: "2",
                },
                {
                  imageLink: prodOld?.prodImage?.[2].imageLink,
                  type: "3",
                },
                {
                  imageLink: prodOld?.prodImage?.[3].imageLink,
                  type: "4",
                },
              ],
            },
          }
        );
        break;
      case PRODUCT_MODEL.secondaryImage1:
        update = await Product.updateOne(
          { _id: prodId },
          {
            $set: {
              prodImage: [
                {
                  imageLink: prodOld?.prodImage?.[0].imageLink,
                  type: "1",
                },
                {
                  imageLink: req.body.secondaryImage1,
                  type: "2",
                },
                {
                  imageLink: prodOld?.prodImage?.[2].imageLink,
                  type: "3",
                },
                {
                  imageLink: prodOld?.prodImage?.[3].imageLink,
                  type: "4",
                },
              ],
            },
          }
        );
        break;
      case PRODUCT_MODEL.secondaryImage2:
        update = await Product.updateOne(
          { _id: prodId },
          {
            $set: {
              prodImage: [
                {
                  imageLink: prodOld?.prodImage?.[0].imageLink,
                  type: "1",
                },
                {
                  imageLink: prodOld?.prodImage?.[1].imageLink,
                  type: "2",
                },
                {
                  imageLink: req.body.secondaryImage2,
                  type: "3",
                },
                {
                  imageLink: prodOld?.prodImage?.[3].imageLink,
                  type: "4",
                },
              ],
            },
          }
        );
        break;
      case PRODUCT_MODEL.secondaryImage3:
        update = await Product.updateOne(
          { _id: prodId },
          {
            $set: {
              prodImage: [
                {
                  imageLink: prodOld?.prodImage?.[0].imageLink,
                  type: "1",
                },
                {
                  imageLink: prodOld?.prodImage?.[1].imageLink,
                  type: "2",
                },
                {
                  imageLink: prodOld?.prodImage?.[2].imageLink,
                  type: "3",
                },
                {
                  imageLink: req.body.secondaryImage3,
                  type: "4",
                },
              ],
            },
          }
        );
        break;
      default:
        let prodProperty = { $set: {} };
        prodProperty["$set"][Object.keys(req.body)[0]] =
          req.body[Object.keys(req.body)[0]] || "";

        update = await Product.updateOne({ _id: prodId }, prodProperty);
        break;
    }

    if (update?.modifiedCount != 0) {
      const prodNew = await Product.findById({ _id: prodId });
      res.send({ prodNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.getProductById = async (req, res, next) => {
  const prodId = req.params.id;
  const product = await Product.findById({ _id: prodId });

  if (product) {
    res.json({ data: product, success: true });
  } else {
    res.json({ success: false });
  }
};

exports.getCategory = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let categories = [];

  if (search) {
    categories = await Category.find({
      prodTypeName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    categories = await Category.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(categories.length / ITEM_PAGE);
  const totalPage = categories.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = categories.length ? page : 0;
  categories = categories.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/categories", {
    pageName: "category",
    categories,
    categoryModel: CATEGORY_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.postCategory = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let categories = [];

  if (!req.body.page) {
    const category = {
      prodTypeName: req.body.prodTypeName,
    };

    const newCategory = new Category(category);
    await newCategory.save();
  }

  if (search) {
    categories = await Category.find({
      prodTypeName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    categories = await Category.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(categories.length / ITEM_PAGE);
  const totalPage = categories.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = categories.length ? page : 0;
  categories = categories.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/categories", {
    pageName: "category",
    categories,
    categoryModel: CATEGORY_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.updateCategory = async (req, res, next) => {
  try {
    let update;
    const prodTypeId = req.params.id || "";

    switch (Object.keys(req.body)[0]) {
      case CATEGORY_MODEL.prodTypeName:
        update = await Category.updateOne(
          { _id: prodTypeId },
          {
            $set: {
              prodTypeName: req.body.prodTypeName,
            },
          }
        );
        break;
      case CATEGORY_MODEL.amount:
        update = await Category.updateOne(
          { _id: prodTypeId },
          {
            $set: {
              amount: req.body.amount,
            },
          }
        );
        break;
      default:
        break;
    }

    if (update?.modifiedCount != 0) {
      const prodTypeNew = await Category.findById({ _id: prodTypeId });
      res.send({ prodTypeNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.lockCategory = (req, res, next) => {
  const prodTypeId = req.params.id;

  Category.findById({ _id: prodTypeId }, async (err, data) => {
    if (!err) {
      const update = await Category.updateOne(
        { _id: prodTypeId },
        { $set: { status: !data.status } }
      );

      if (update?.modifiedCount != 0) {
        res.send({ status: !data.status, success: true });
      } else {
        res.send({ success: false });
      }
    }
  });
};

exports.getBrand = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let brands = [];

  if (search) {
    brands = await Brand.find({
      brandName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    brands = await Brand.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(brands.length / ITEM_PAGE);
  const totalPage = brands.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = brands.length ? page : 0;
  brands = brands.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/brands", {
    pageName: "brand",
    brands,
    brandModel: BRAND_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.postBrand = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let brands = [];

  if (!req.body.page) {
    const brand = {
      brandName: req.body.brandName,
    };

    const newBrand = new Brand(brand);
    await newBrand.save();
  }

  if (search) {
    brands = await Brand.find({
      brandName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    brands = await Brand.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(brands.length / ITEM_PAGE);
  const totalPage = brands.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = brands.length ? page : 0;
  brands = brands.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/brands", {
    pageName: "brand",
    brands,
    brandModel: BRAND_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.updateBrand = async (req, res, next) => {
  try {
    const brandId = req.params.id || "";
    let update;

    switch (Object.keys(req.body)[0]) {
      case BRAND_MODEL.brandName:
        update = await Brand.updateOne(
          { _id: brandId },
          {
            $set: {
              brandName: req.body.brandName,
            },
          }
        );
        break;
      default:
        // let brandProperty = { $set: {} };
        // brandProperty["$set"][Object.keys(req.body)[0]] =
        //   req.body[Object.keys(req.body)[0]] || "";

        // await Brand.updateOne({ _id: brandId }, brandProperty);
        break;
    }

    if (update?.modifiedCount != 0) {
      const brandNew = await Brand.findById({ _id: brandId });
      res.send({ brandNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.lockBrand = (req, res, next) => {
  const brandId = req.params.id;
  Brand.findById({ _id: brandId }, async (err, data) => {
    if (!err) {
      const update = await Brand.updateOne(
        { _id: brandId },
        { $set: { status: !data.status } }
      );

      if (update?.modifiedCount != 0) {
        res.send({ status: !data.status, success: true });
      } else {
        res.send({ success: false });
      }
    }
  });
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

  const message = req.cookies.message;
  res.clearCookie("message");

  res.render("admin/profile", {
    pageName: "profile",
    user,
    adminModel: ADMIN_MODEL,
    type: req.query?.type,
    message,
  });
};

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

exports.getAdmin = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let admin = [];

  if (search) {
    admin = await Admin.find({
      adminName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    admin = await Admin.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(admin.length / ITEM_PAGE);
  const totalPage = admin.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = admin.length ? page : 0;
  admin = admin.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/admins", {
    pageName: "admin",
    admin,
    adminModel: ADMIN_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.postAdmin = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let admin = [];

  if (!req.body.page) {
    const urlAvatar = await firebase.uploadImage(req.files[0]);

    admin = {
      adminName: req.body.adminName,
      identityCard: req.body.identityCard,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      username: req.body.username,
      password: "Admin@" + req.body.identityCard,
      dateOfBirth: req.body.dateOfBirth,
      avatarLink: urlAvatar,
      aboutMe: req.body.aboutMe,
    };

    const newAdmin = new Admin(admin);
    await newAdmin.save();
  }

  if (search) {
    admin = await Admin.find({
      adminName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    admin = await Admin.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(admin.length / ITEM_PAGE);
  const totalPage = admin.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = admin.length ? page : 0;
  admin = admin.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/admins", {
    pageName: "admin",
    admin,
    adminModel: ADMIN_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const isMe = jwt.verify(
      req.cookies?.token,
      process.env.KEY_JWT,
      (err, data) => {
        if (err) return [];
        return data;
      }
    );

    let user = {};
    let update;
    const adminId = req.params.id || "";

    switch (Object.keys(req.body)[0]) {
      case ADMIN_MODEL.avatarLink:
        update = await Admin.updateOne(
          { _id: adminId },
          {
            $set: {
              avatarLink: req.body.avatarLink,
            },
          }
        );
        break;
      default:
        let adminProperty = { $set: {} };
        adminProperty["$set"][Object.keys(req.body)[0]] =
          req.body[Object.keys(req.body)[0]] || "";

        update = await Admin.updateOne({ _id: adminId }, adminProperty);
        break;
    }

    if (isMe._id == adminId && update?.modifiedCount != 0) {
      user = await Admin.findById({ _id: adminId });

      const userToken = {
        _id: user._id,
        adminName: user.adminName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        avatarLink: user.avatarLink,
        username: user.username,
        password: user.password,
        aboutMe: user.aboutMe,
        roleLevel: user.roleLevel,
        avatarLink: user.avatarLink,
        roleLevel: user.roleLevel,
        identityCard: user.identityCard,
      };

      const token = jwt.sign(userToken, process.env.KEY_JWT, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      res.cookie("token", token);
    }

    if (user) {
      res.send({ user, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.lockAdmin = (req, res, next) => {
  try {
    const adminId = req.params.id;
    const isMe = jwt.verify(
      req.cookies?.token,
      process.env.KEY_JWT,
      (err, data) => {
        if (err) return [];
        return data;
      }
    );
    let update;
    if (isMe._id != adminId) {
      Admin.findById({ _id: adminId }, async (err, data) => {
        if (!err) {
          update = await Admin.updateOne(
            { _id: adminId },
            { $set: { status: !data.status } }
          );
        }

        if (update?.modifiedCount != 0) {
          res.send({ status: !data.status, success: true });
        } else {
          res.send({ success: false });
        }
      });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.getAdminbyUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const findAdmin = await Admin.findOne({ username: username });
    if (findAdmin) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {}
};

exports.updateProfile = async (req, res, next) => {
  const admin = jwt.verify(
    req.cookies.token,
    process.env.KEY_JWT,
    (err, data) => {
      if (!err) {
        return data;
      }
    }
  );
  const aboutMe = req.body.aboutMe ? req.body.aboutMe : admin.aboutMe;
  let newAdmin = {};
  let update;

  if (req.body?.password) {
    const newPassword = await bcrypt.hash(req.body?.password, 12);
    newAdmin = {
      password: newPassword,
    };
  } else {
    newAdmin = {
      email: req.body.email,
      adminName: req.body.adminName,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      identityCard: req.body.identityCard,
      address: req.body.address,
      aboutMe: aboutMe,
    };
  }

  update = await Admin.updateOne({ _id: admin._id }, newAdmin);
  if (update?.modifiedCount) {
    const user = await Admin.findById({ _id: admin._id });

    const userToken = {
      _id: user._id,
      adminName: user.adminName,
      phone: user.phone,
      email: user.email,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      avatarLink: user.avatarLink,
      username: user.username,
      password: user.password,
      aboutMe: user.aboutMe,
      roleLevel: user.roleLevel,
      avatarLink: user.avatarLink,
      roleLevel: user.roleLevel,
      identityCard: user.identityCard,
    };

    const token = jwt.sign(userToken, process.env.KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.cookie("message", { message: "Update Success", type: "success" });
  }

  res.redirect("/admin/profile");
};

exports.updateImageProfile = async (req, res, next) => {
  const admin = jwt.verify(
    req.cookies.token,
    process.env.KEY_JWT,
    (err, data) => {
      if (!err) {
        return data;
      }
    }
  );

  const avatarLink = req.body?.avatarLink || admin.avatarLink;
  let update = await Admin.updateOne(
    { _id: admin._id },
    { avatarLink: avatarLink }
  );
  let user = [];

  if (update?.modifiedCount) {
    user = await Admin.findById({ _id: admin._id });

    const userToken = {
      _id: user._id,
      adminName: user.adminName,
      phone: user.phone,
      email: user.email,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      avatarLink: user.avatarLink,
      username: user.username,
      password: user.password,
      aboutMe: user.aboutMe,
      roleLevel: user.roleLevel,
      avatarLink: user.avatarLink,
      roleLevel: user.roleLevel,
      identityCard: user.identityCard,
    };

    const token = jwt.sign(userToken, process.env.KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.cookie("token", token);
  }

  if (user) {
    res.send({ userToken, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.resetPasswordAdmin = async (req, res, next) => {
  // const token = req.cookies?.token || "";
  // jwt.verify(token, process.env.KEY_JWT, async (err, data) => {
  //   if (!err) {
  //     await Admin.updateOne({ _id: data._id }, { password: data.identityCard });
  //   }
  // });

  // res.clearCookie("token");
  // res.redirect("/admin/login");
  const id = req.params.id;
  Admin.findById({ _id: id }, async (err, data) => {
    if (!err) {
      const newPassword = await bcrypt.hash("Admin@" + data.identityCard, 12);
      const update = await Admin.updateOne(
        { _id: id },
        { password: newPassword }
      );
      if (update?.modifiedCount > 0) {
        res.send({ success: true });
      }
    } else {
      res.send({ success: false });
    }
  });
};

exports.getStatistic = async (req, res, next) => {
  res.render("admin/statistic", {
    pageName: "statistic",
  });
};

exports.postStatistic = async (req, res, next) => {
  res.send(data);
};

exports.getStatisticSales = async (req, res, next) => {
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

      result = statisticWithDaily(data, startTemp, endTemp);
      titleX = "Daily Sales Data";

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

      result = statisticWithMonthly(data, startTemp, endTemp);
      titleX = "Monthly Sales Data";

      break;
    case "year":
      startTemp = new Date(start, 1, 1, 0, 0, 0, 0);
      endTemp = new Date(end, 12, 31, 23, 59, 59, 999);

      data = await Order.find({
        createdAt: { $gte: startTemp, $lt: endTemp },
        status: "paid",
      }).sort({ createdAt: "asc" });

      result = statisticWithYearly(data, startTemp, endTemp);
      titleX = "Yearly Sales Data";

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

exports.getCoupon = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let coupons = [];

  if (search) {
    coupons = await Coupon.find({
      code: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    coupons = await Coupon.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(coupons.length / ITEM_PAGE);
  const totalPage = coupons.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = coupons.length ? page : 0;
  coupons = coupons.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/coupons", {
    pageName: "coupon",
    coupons,
    couponModel: COUPON_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.postCoupon = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let coupons = [];

  if (!req.body.page) {
    const coupon = {
      code: req.body.code,
      promotionValue: req.body.promotionValue,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      amount: req.body.amount,
    };

    const newCoupon = new Coupon(coupon);
    await newCoupon.save();
  }

  if (search) {
    coupons = await Coupon.find({
      code: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    coupons = await Coupon.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(coupons.length / ITEM_PAGE);
  const totalPage = coupons.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = coupons.length ? page : 0;
  coupons = coupons.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/coupons", {
    pageName: "coupon",
    coupons,
    couponModel: COUPON_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.id || "";
    let update;

    switch (Object.keys(req.body)[0]) {
      default:
        let couponProperty = { $set: {} };
        couponProperty["$set"][Object.keys(req.body)[0]] =
          req.body[Object.keys(req.body)[0]] || "";

        update = await Coupon.updateOne({ _id: couponId }, couponProperty);
        break;
    }

    if (update?.modifiedCount != 0) {
      const couponNew = await Coupon.findById({ _id: couponId });
      res.send({ couponNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.lockConpon = (req, res, next) => {
  const couponId = req.params.id;
  Coupon.findById({ _id: couponId }, async (err, data) => {
    if (!err) {
      const update = await Coupon.updateOne(
        { _id: couponId },
        { $set: { status: !data.status } }
      );

      if (update?.modifiedCount != 0) {
        res.send({ status: !data.status, success: true });
      } else {
        res.send({ success: false });
      }
    }
  });
};

exports.getCouponbyCode = async (req, res, next) => {
  try {
    const code = req.params.code;
    const findCoupon = await Coupon.findOne({ code: code });
    if (findCoupon) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {}
};

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
    let update = await Order.updateOne(
      { _id: orderId },
      { status: req.body.status }
    );

    if (update?.modifiedCount != 0) {
      const orderNew = await Order.findById({ _id: orderId });
      res.send({ orderNew, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.id;
  Product.findOneAndDelete({ _id: prodId }, (err, data) => {
    if (!err) {
      for (let i = 0; i < data?.prodImage?.length; i++) {
        firebase.deleteImage(data?.prodImage[i]?.imageLink);
      }
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
};

exports.deleteCategory = async (req, res, next) => {
  const prodTypeId = req.params.id;
  Category.findByIdAndDelete({ _id: prodTypeId }, (err) => {
    if (!err) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
};

exports.deleteBrand = async (req, res, next) => {
  const brandId = req.params.id;
  Brand.findByIdAndDelete({ _id: brandId }, (err) => {
    if (!err) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
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

exports.deleteAdmin = async (req, res, next) => {
  const adminId = req.params.id;
  Admin.findByIdAndDelete({ _id: adminId }, (err, data) => {
    if (!err) {
      firebase.deleteImage(data.avatarLink);
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
};

exports.deleteCoupon = async (req, res, next) => {
  const couponId = req.params.id;
  Coupon.findByIdAndDelete({ _id: couponId }, (err) => {
    if (!err) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
};
