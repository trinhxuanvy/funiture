const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");

exports.getIndex = async(req, res, next) => {
    res.render("admin/products", { pageName: " products " });
};

exports.getProduct = async(req, res, next) => {
    const products = await Product.find();
    const categories = await Category.find();

    res.render("admin/products", { pageName: " Product ", products, categories })
}

exports.postProduct = async(req, res, next) => {
    console.log(req.body)
    const prodType = await Category.findById(req.body.prodTypeId).exec();
    const newProduct = {
        prodName: req.body.prodName,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        status: true,
        prodImage: [],
        prodTypeId: req.body.prodTypeId,
        prodTypeName: prodType.prodTypeName,
        prodName: req.body.prodName,
        color: req.body.color,
        witdh: req.body.witdh,
        height: req.body.height,
        depth: req.body.depth,
        weight: req.body.weight,
        soldQuantity: req.body.soldQuantity
    };
    const product = new Product(newProduct);
    product.save((err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
        }
    });

    res.redirect("/admin/products");
}

exports.getCategory = async(req, res, next) => {
    const categories = await Category.find();

    res.render("admin/category", { pageName: " category ", categories });
}

exports.postCategory = async(req, res, next) => {
    const product = new Category(req.body);
    product.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
        }
    });

    res.redirect("/admin/category");
}