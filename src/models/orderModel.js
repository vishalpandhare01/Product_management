const { default: mongoose } = require("mongoose");
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: { type: Number, required: true }
            }
        ],
        totalPrice: { type: Number, required: true },
        totalItems: { type: Number, required: true },
        totalQuantity: { type: Number, required: true },
        cancellable: {type: Boolean, default: true},
        status: {type: String, default: 'pending', enum:["pending", "completed", "cancled"]},
        deletedAt: {type:Date}, 
        isDeleted:  {type: Boolean, default: false}
       
    },{timestamps:true}
)

module.exports = mongoose.model("Order", orderSchema)