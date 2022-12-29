const mongoose = require("mongoose")



const ProduactSChema = mongoose.Schema({
    title: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    currencyId: { type: String, require: true },
    currencyFormat: { type: String, require: true },
    isFreeShipping: { type: Boolean, default: false },
    productImage: { type: String, require: true },
    style: { type: String },
    availableSizes: { type: ["String"], enum: ["S", "XS", "M", "X", "L", "XXL", "XL"] },
    installments: { type: Number },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })


module.exports = mongoose.model("Product", ProduactSChema)