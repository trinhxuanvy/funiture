const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const firebase = require("../services/firebase");

const ITEM_PAGE = 4;

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
            prodImage: [{
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
    });
};

exports.deleteProduct = async (req, res, next) => {
    const prodId = req.params.id;
    const product = await Product.findById({ _id: prodId });
    const result = await Product.findByIdAndUpdate({ _id: prodId }, { $set: { status: !product.status } });

    if (result) {
        res.send({ status: result.status, success: true });
    } else {
        res.send({ success: false });
    }
};

exports.updateProduct = async (req, res, next) => {
    const prodType = await Category.findById(req.body.prodTypeId);
    const brand = await Brand.findById(req.body.brandId);
    const oldProduct = await Product.findById({ _id: req.params.id });
    const priImage = req.files?.primaryImage?.[0] || "";
    const secImage1 = req.files?.secondaryImage_1?.[0] || "";
    const secImage2 = req.files?.secondaryImage_2?.[0] || "";
    const secImage3 = req.files?.secondaryImage_3?.[0] || "";
    let priImageUrl, secImage1Url, secImage2Url, secImage3Url;

    if (priImage) {
        priImageUrl = await firebase.uploadImage(priImage);
    } else {
        oldProduct.prodImage.forEach((item) => {
            if (item.type == 1) {
                priImageUrl = item.imageLink;
            }
        });
    }

    if (secImage1) {
        secImage1Url = await firebase.uploadImage(secImage1);
    } else {
        oldProduct.prodImage.forEach((item) => {
            if (item.type == 2) {
                secImage1Url = item.imageLink;
            }
        });
    }

    if (secImage2) {
        secImage2Url = await firebase.uploadImage(secImage2);
    } else {
        oldProduct.prodImage.forEach((item) => {
            if (item.type == 3) {
                secImage2Url = item.imageLink;
            }
        });
    }

    if (secImage3) {
        secImage3Url = await firebase.uploadImage(secImage3);
    } else {
        oldProduct.prodImage.forEach((item) => {
            if (item.type == 4) {
                secImage3Url = item.imageLink;
            }
        });
    }

    const product = {
        prodName: req.body.prodName,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        status: true,
        prodImage: [{
            imageLink: priImageUrl,
            type: "1",
        },
        {
            imageLink: secImage1Url,
            type: "2",
        },
        {
            imageLink: secImage2Url,
            type: "3",
        },
        {
            imageLink: secImage3Url,
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
    const result = await Product.findOneAndUpdate({ _id: req.params.id }, product);

    if (result) {
        res.redirect("/admin/products");
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