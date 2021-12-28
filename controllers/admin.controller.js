const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const firebase = require("../services/firebase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  PRODUCT_MODEL,
  ADMIN_MODEL,
  BRAND_MODEL,
  CATEGORY_MODEL,
} = require("../constants/modal");

dotenv.config();
const ITEM_PAGE = 4;

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
  req.session.url = req.url;
  const page = 1;
  let search = req.query.search || "";
  let products = [];

  if (search) {
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    products = await Product.find().sort({ createdAt: -1 }).exec();
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
    prodModel: PRODUCT_MODEL,
  });
};

exports.postProduct = async (req, res, next) => {
  req.session.url = req.url;
  let page = req.body.page || 1;
  let search = req.query.search || "";
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
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    products = await Product.find().sort({ createdAt: -1 }).exec();
    //console.log(productSave);
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
    prodModel: PRODUCT_MODEL,
  });
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.id;
  const prodOld = await Product.findById({ _id: prodId });
  const update = await Product.updateOne(
    { _id: prodId },
    { $set: { status: !prodOld.status } }
  );
  const prodNew = await Product.findById({ _id: prodId });

  if (prodNew) {
    res.send({ status: prodNew.status, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.updateProduct = async (req, res, next) => {
  let url = "";
  const prodId = req.params.id || "";
  const prodOld = await Product.findById({ _id: prodId });

  switch (Object.keys(req.body)[0]) {
    case PRODUCT_MODEL.prodTypeId:
      const prodType = await Category.findById(req.body.prodTypeId);
      await Product.updateOne(
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
      await Product.updateOne(
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
      await Product.updateOne(
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
      await Product.updateOne(
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
      await Product.updateOne(
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
      await Product.updateOne(
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

      await Product.updateOne({ _id: prodId }, prodProperty);
      break;
  }

  const prodNew = await Product.findById({ _id: prodId });

  if (prodNew) {
    res.send({ prodNew, success: true });
  } else {
    res.send({ success: false });
  }
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
  let url = "";
  const prodTypeId = req.params.id || "";

  switch (Object.keys(req.body)[0]) {
    case CATEGORY_MODEL.prodTypeName:
      await Category.updateOne(
        { _id: prodTypeId },
        {
          $set: {
            prodTypeName: req.body.prodTypeName,
          },
        }
      );
      break;
    case CATEGORY_MODEL.amount:
      await Category.updateOne(
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

  const prodTypeNew = await Category.findById({ _id: prodTypeId });

  if (prodTypeNew) {
    res.send({ prodTypeNew, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.deleteCategory = async (req, res, next) => {
  const prodTypeId = req.params.id;
  const prodTypeOld = await Category.findById({ _id: prodTypeId });
  const update = await Category.updateOne(
    { _id: prodTypeId },
    { $set: { status: !prodTypeOld.status } }
  );
  const prodTypeNew = await Category.findById({ _id: prodTypeId });

  if (prodTypeNew) {
    res.send({ status: prodTypeNew.status, success: true });
  } else {
    res.send({ success: false });
  }
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
  let url = "";
  const brandId = req.params.id || "";

  switch (Object.keys(req.body)[0]) {
    case BRAND_MODEL.brandName:
      await Brand.updateOne(
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

  const brandNew = await Brand.findById({ _id: brandId });

  if (brandNew) {
    res.send({ brandNew, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.deleteBrand = async (req, res, next) => {
  const brandId = req.params.id;
  const brandOld = await Brand.findById({ _id: brandId });
  const update = await Brand.updateOne(
    { _id: brandId },
    { $set: { status: !brandOld.status } }
  );
  const brandNew = await Brand.findById({ _id: brandId });

  if (brandNew) {
    res.send({ status: brandNew.status, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.profile = async (req, res, next) => {
  const getUser = jwt.verify(
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

  let user = await Admin.findById({ _id: getUser?._id });

  const date = new Date(user?.dateOfBirth);
  user.dateOfBirth =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  res.render("admin/profile", {
    pageName: "profile",
    user,
    adminModel: ADMIN_MODEL,
  });
};

exports.users = async (req, res, next) => {
  res.render("admin/users", { pageName: "customer" });
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
  let newPassword = admin.password;

  if (req.body?.password) {
    newPassword = await bcrypt.hash(req.body?.password, 12);
  }

  const newAdmin = {
    email: req.body.email,
    password: newPassword,
    adminName: req.body.adminName,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
    identityCard: req.body.identityCard,
    address: req.body.address,
    aboutMe: aboutMe,
  };

  await Admin.updateOne({ _id: admin._id }, newAdmin);

  res.cookie("message", { message: "Please login again", type: "warning" });
  res.clearCookie("token");
  res.redirect("/admin/login");
};

exports.resetPassword = async (req, res, next) => {
  // const token = req.cookies?.token || "";
  // jwt.verify(token, process.env.KEY_JWT, async (err, data) => {
  //   if (!err) {
  //     await Admin.updateOne({ _id: data._id }, { password: data.identityCard });
  //   }
  // });

  // res.clearCookie("token");
  // res.redirect("/admin/login");
  const id = req.params.id;
  const admin = await Admin.findById({ _id: id });
  const newPassword = await bcrypt.hash("Admin@" + admin.identityCard, 12);

  await Admin.updateOne({ _id: id }, { password: newPassword });
  res.redirect("/admin/admins");
};

exports.updateAdmin = async (req, res, next) => {
  let url = "";
  const adminId = req.params.id || "";

  switch (Object.keys(req.body)[0]) {
    case ADMIN_MODEL.avatarLink:
      await Admin.updateOne(
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

      await Admin.updateOne({ _id: adminId }, adminProperty);
      break;
  }

  const adminNew = await Admin.findById({ _id: adminId });

  if (adminNew) {
    res.send({ adminNew, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.deleteAdmin = async (req, res, next) => {
  const adminId = req.params.id;
  const adminOld = await Admin.findById({ _id: adminId });
  const isMe = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    (err, data) => {
      if (err) return [];
      return data;
    }
  );
  if (isMe._id != adminId) {
    const update = await Admin.updateOne(
      { _id: adminId },
      { $set: { status: !adminOld.status } }
    );
  }

  const adminNew = await Admin.findById({ _id: adminId });

  if (adminNew && isMe._id != adminId) {
    res.send({ status: adminNew.status, success: true });
  } else {
    res.send({ success: false });
  }
};
