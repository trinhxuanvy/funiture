const Coupon = require("../../models/coupon.model");
const { COUPON_MODEL } = require("../../constants/modal");
const { ITEM_PAGE } = require("../../constants/variables");

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
