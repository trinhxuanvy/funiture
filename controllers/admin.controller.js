const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");

exports.getIndex = async(req, res, next) => {
    res.render("admin/products", { pageName: " products " });
};

exports.getProduct = async(req, res, next) => {
    const search = req.query.search || "";
    //const page = req.body.page || 1;
    //console.log(page)
    let products = [];

    if (search) {
        products = await Product.find({ prodName: { $regex: search, $options: "i" } });

        console.log(products);
    } else {
        products = await Product.find();
    }

    const categories = await Category.find();
    const brands = await Brand.find();

    res.render("admin/products", {
        pageName: " Product ",
        products,
        categories,
        brands,
    });
};

exports.postProduct = async(req, res, next) => {
    console.log(req.body);
    const prodType = await Category.findById(req.body.prodTypeId).exec();
    const brand = await Brand.findById(req.body.brandId).exec();
    const newProduct = {
        prodName: req.body.prodName,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        status: true,
        prodImage: [],
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
    product.save((err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
            res.redirect("/admin/products");
        }
    });
};

exports.getCategory = async(req, res, next) => {
    const categories = await Category.find();

    res.render("admin/category", { pageName: " category ", categories });
};

exports.postCategory = async(req, res, next) => {
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

exports.getBrand = async(req, res, next) => {
    const brands = await Brand.find();

    res.render("admin/brand", { pageName: " brand ", brands });
};

exports.postBrand = async(req, res, next) => {
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