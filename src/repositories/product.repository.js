import ProductModel from "../models/product.model.js";

export const ProductRepository = {
    async getAll() {
        return await ProductModel.find();
    },

    async getById(pid) {
        return await ProductModel.findById(pid);
    },

    async create(product) {
        return await ProductModel.create(product);
    },

    async update(pid, product) {
        return await ProductModel.findByIdAndUpdate(pid, product, {
            new: true,
            runValidators: true
        });
    },

    async delete(pid) {
        return await ProductModel.findByIdAndDelete(pid);
    }
}
