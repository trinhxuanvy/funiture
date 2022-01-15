const Brand = require("../../models/brand.model");
const { BRAND_MODEL } = require("../../constants/modal");
const { ITEM_PAGE } = require("../../constants/variables");

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
