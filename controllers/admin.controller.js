const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const firebase = require("../services/firebase");
const { PRODUCT_MODEL } = require("../constants/modal");
const { render } = require("ejs");

const ITEM_PAGE = 4;

exports.uploadFile = async (req, res, next) => {
  const upload = await firebase.uploadImage(req?.files?.[0]);

  if (upload.length) {
    res.send({ url: upload, success: true });
  } else {
    res.send({ success: false });
  }
};

exports.getIndex = async (req, res, next) => {
  res.render("admin/products", { pageName: " products " });
};

exports.getProduct = async (req, res, next) => {
  req.session.url = req.url;
  const page = 1;
  let search = req.query.search || "";
  let products = [];

  if (search) {
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    });

    search = "?search=" + search;
  } else {
    products = await Product.find();
  }

  const getPage = Math.floor(products.length / ITEM_PAGE);
  const totalPage = products.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const categories = await Category.find();
  const brands = await Brand.find();
  const numPage = products.length ? page : 0;
  products = products.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/products", {
    pageName: " products ",
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
  let products = [];

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
    await product.save((err, data) => {
      if (!err) console.log(err);
    });
  }

  if (search) {
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    });

    search = "?search=" + search;
  } else {
    products = await Product.find();
  }

  const getPage = Math.floor(products.length / ITEM_PAGE);
  const totalPage = products.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const categories = await Category.find();
  const brands = await Brand.find();
  const numPage = products.length ? page : 0; // Page Number sẽ hiển thị
  products = products.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/products", {
    pageName: " products ",
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
  const prodId = req.params.id || "";
  const prodOld = await Product.findById({ _id: prodId });
  let url = "";

  switch (Object.keys(req.body)[0]) {
    case PRODUCT_MODEL.prodName:
      await Product.updateOne(
        { _id: prodId },
        { $set: { prodName: req.body.prodName } }
      );
      break;
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
    case PRODUCT_MODEL.price:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            price: req.body.price,
          },
        }
      );
      break;
    case PRODUCT_MODEL.soldQuantity:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            soldQuantity: req.body.soldQuantity,
          },
        }
      );
      break;
    case PRODUCT_MODEL.amount:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            amount: req.body.amount,
          },
        }
      );
      break;
    case PRODUCT_MODEL.color:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            color: req.body.color,
          },
        }
      );
      break;
    case PRODUCT_MODEL.width:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            width: req.body.width,
          },
        }
      );
      break;
    case PRODUCT_MODEL.height:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            height: req.body.height,
          },
        }
      );
      break;
    case PRODUCT_MODEL.depth:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            depth: req.body.depth,
          },
        }
      );
      break;
    case PRODUCT_MODEL.weight:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            weight: req.body.weight,
          },
        }
      );
      break;
    case PRODUCT_MODEL.description:
      await Product.updateOne(
        { _id: prodId },
        {
          $set: {
            description: req.body.description,
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
  const categories = await Category.find();

  res.render("admin/category", { pageName: " category ", categories });
};

exports.postCategory = async (req, res, next) => {
  const category = new Category(req.body);
  category.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  });

  res.redirect("/admin/category");
};

exports.getBrand = async (req, res, next) => {
  const brands = await Brand.find();

  res.render("admin/brand", { pageName: " brand ", brands });
};

exports.postBrand = async (req, res, next) => {
  const brand = new Brand(req.body);
  brand.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  });

  res.redirect("/admin/brand");
};

exports.profile = (req, res, next) => {
  res.render("admin/profile", { pageName: " profile " });
}

exports.users = (req, res, next) => {
  res.render("admin/users", { pageName: " users " });
}
