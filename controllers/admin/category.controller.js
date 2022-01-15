const Category = require("../../models/category.model");
const { CATEGORY_MODEL } = require("../../constants/modal");
const { ITEM_PAGE } = require("../../constants/variables");

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
