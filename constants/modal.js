const PRODUCT_MODEL = {
  prodId: "prodId",
  prodName: "prodName",
  prodTypeId: "prodTypeId",
  prodTypeName: "prodTypeName",
  brandId: "brandId",
  brandName: "brandName",
  price: "price",
  amount: "amount",
  soldQuantity: "soldQuantity",
  color: "color",
  width: "width",
  height: "height",
  depth: "depth",
  weight: "weight",
  description: "description",
  primaryImage: "primaryImage",
  secondaryImage1: "secondaryImage1",
  secondaryImage2: "secondaryImage2",
  secondaryImage3: "secondaryImage3",
};

const ADMIN_MODEL = {
  adminName: "adminName",
  identityCard: "identityCard",
  phone: "phone",
  email: "email",
  address: "address",
  username: "username",
  password: "password",
  dateOfBirth: "dateOfBirth",
  avatarLink: "avatarLink",
  roleLevel: "roleLevel",
  aboutMe: "aboutMe",
};

const CUSTOMER_MODEL = {
  cusName: "cusName",
  phone: "phone",
  email: "email",
  username: "username",
  password: "password",
  province: "province",
  district: "district",
  commune: "commune",
  address: "address",
  dateOfBirth: "dateOfBirth",
  avatarLink: "avatarLink",
  cart: "cart",
  totalQuantity: "totalQuantity",
  totalPrice: "totalPrice",
};

const BRAND_MODEL = {
  brandName: "brandName",
};

const CATEGORY_MODEL = {
  prodTypeName: "prodTypeName",
  amount: "amount",
};

const COUPON_MODEL = {
  code: "code",
  promotionValue: "promotionValue",
  startDate: "startDate",
  endDate: "endDate",
  amount: "amount",
};

const ORDER_MODEL = {
  orderNote: "orderNode",
  shipping: "shipping",
  subTotalPrice: "subTotalPrice",
  totalQuantity: "totalQuantity",
  totalPrice: "totalPrice",
  province: "province",
  district: "district",
  commune: "commune",
  address: "address",
  receiverPhone: "receiverPhone",
  receiverMail: "receiverMail",
  receiverName: "receiverName",
  couponCode: "couponCode",
  discountMoney: "discountMoney",
  createdAt: "createdAt",
  status: "status"
}

module.exports = {
  PRODUCT_MODEL,
  ADMIN_MODEL,
  CUSTOMER_MODEL,
  BRAND_MODEL,
  CATEGORY_MODEL,
  COUPON_MODEL,
  ORDER_MODEL
};
