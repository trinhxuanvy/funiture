const mongooes = require("mongoose");
const Schema = mongooes.Schema;
const bcrypt = require("bcrypt");

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
        required: false,
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
        cartDetails: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            productImg: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: false,
                default: 1
            },
            price: {
                type: Number,
                required: true,
            },
        }, ],
        totalQuantity: {
            type: Number,
            default: 0,
            required: false,
        },
        totalPrice: {
            type: Number,
            required: false,
            default: 0,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: "Customer",
});

Customer.methods.validPassword = function (password) {
    console.log(bcrypt.compareSync(password, this.password));
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongooes.model("Customer", Customer);