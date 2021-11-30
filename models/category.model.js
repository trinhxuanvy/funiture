const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Category = new Schema({
    prodTypeName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: "Category",
});

module.exports = mongooes.model("Category", Category);