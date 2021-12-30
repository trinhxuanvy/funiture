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
  ward: "ward",
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

module.exports = {
  PRODUCT_MODEL,
  ADMIN_MODEL,
  CUSTOMER_MODEL,
  BRAND_MODEL,
  CATEGORY_MODEL,
};
