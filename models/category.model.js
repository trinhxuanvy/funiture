const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Category = new Schema({
    prodTypeName: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    amount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: "Category",
});

module.exports = mongooes.model("Category", Category);