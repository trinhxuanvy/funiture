const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Product = new Schema(
  {
    prodName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    prodImage: [
      {
        imageLink: {
          type: String,
          required: false,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    prodTypeId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    prodTypeName: {
      type: String,
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    prodName: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "",
    },
    width: {
      type: Number,
      required: false,
      default: "",
    },
    height: {
      type: Number,
      required: false,
      default: "",
    },
    depth: {
      type: Number,
      required: false,
      default: "",
    },
    weight: {
      type: Number,
      required: false,
      default: "",
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Product",
  }
);

module.exports = mongooes.model("Product", Product);
