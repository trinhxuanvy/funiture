const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Product = new Schema({
    prodName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    prodImage: [{
        imageLink: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }],
    prodTypeID: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    prodName: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    witdh: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    soldQuantity: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: "Product",
});

module.exports = mongooes.model("Product", Product);