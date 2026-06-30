import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store"
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    },
    {
        timestamps: true
    }
)

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel