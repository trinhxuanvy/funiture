const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const firebase = require("../../services/firebase");
const { PRODUCT_MODEL } = require("../../constants/modal");
const { PRODUCT, SORT, ITEM_PAGE } = require("../../constants/variables");

exports.getProduct = async (req, res, next) => {
  const page = 1;
  let search = req.query.search || "";
  let sort = req.query.sort || "";
  let following = req.query.following || "";
  let products = [];
  let prodProperty = {};
  let filterProperty = {};
  let filterCategory = [];
  let filterBrand = [];
  let urlStr = "";

  if (req.url.indexOf("?") > -1) {
    urlStr = req.url.slice(req.url.indexOf("?"), req.url.length) || "";
  }

  console.log(urlStr)
  
  for (let item in req.query) {
    if (item.indexOf("category") > -1) {
      filterCategory.push(req.query[item]);
      filterProperty["prodTypeName"] = { $in: filterCategory };
    } else if (item.indexOf("brand") > -1) {
      filterBrand.push(req.query[item]);
      filterProperty["brandName"] = { $in: filterBrand };
    }
  }

  if (search) {
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: "desc" })
      .exec();
  } else if (SORT.indexOf(sort) > -1 && PRODUCT.indexOf(following) > -1) {
    prodProperty[following] = sort || "";
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort(prodProperty)
      .exec();
  } else if (Object.keys(filterProperty).length) {
    products = await Product.find(filterProperty)
      .sort({ createdAt: "desc" })
      .exec();
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
    prodModel: PRODUCT_MODEL,
    urlStr,
  });
};

exports.postProduct = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let sort = req.query.sort || "";
  let following = req.query.following || "";
  let prodProperty = {};
  let products = [];
  let filterProperty = {};
  let filterCategory = [];
  let filterBrand = [];
  let urlStr = "";

  if (req.url.indexOf("?") > -1) {
    urlStr = req.url.slice(req.url.indexOf("?"), req.url.length) || "";
  }

  for (let item in req.query) {
    if (item.indexOf("category") > -1) {
      filterCategory.push(req.query[item]);
      filterProperty["prodTypeName"] = { $in: filterCategory };
    } else if (item.indexOf("brand") > -1) {
      filterBrand.push(req.query[item]);
      filterProperty["brandName"] = { $in: filterBrand };
    }
  }

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
  } else if (SORT.indexOf(sort) > -1 && PRODUCT.indexOf(following) > -1) {
    prodProperty[following] = sort || "";
    products = await Product.find({
      prodName: { $regex: search, $options: "i" },
    })
      .sort(prodProperty)
      .exec();
  } else if (Object.keys(filterProperty).length) {
    products = await Product.find(filterProperty)
      .sort({ createdAt: "desc" })
      .exec();
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
    prodModel: PRODUCT_MODEL,
    urlStr,
  });
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
