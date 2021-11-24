const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Brand = new Schema({
    brandName: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: "Brand",
});

module.exports = mongooes.model("Brand", Brand);