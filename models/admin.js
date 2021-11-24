const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const Admin = new Schema({
    adminName: {
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
}, {
    timestamps: true,
    versionKey: false,
    collection: "Admin",
});

module.exports = mongooes.model("Admin", Admin);