const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Customer = new Schema({
    cusName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    avatarLink: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: true
    },
    cart: {
        cartDetail: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: false,
            },
            price: {
                type: Number,
                required: true,
            },
        }, ],
        totalQuantity: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: "Customer",
});

module.exports = mongooes.model("Customer", Customer);