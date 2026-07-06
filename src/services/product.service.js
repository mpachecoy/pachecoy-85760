import { ProductRepository } from "../repositories/products.repository.js";
import { createError } from "../utils/api.response.js";

export const ProductService = {
    async getAll() {
        const products = await ProductRepository.getAll();
        if (!products) {
            throw createError("PRODUCT_NOT_FOUND");
        }
        return products;
    },

    async getById(pid) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            throw createError("PRODUCT_NOT_FOUND");
        }
        return product;
    },

    async create(productData) {
        const { title, description, price, stock, category } = productData;
        if (!title || !description || !price || !stock || !category) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        return await ProductRepository.create(productData);
    },

    async update(pid, productData) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            throw createError("PRODUCT_NOT_FOUND");
        }
        return await ProductRepository.update(pid, productData);
    },

    async delete(pid) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            throw createError("PRODUCT_NOT_FOUND");
        }
        return await ProductRepository.delete(pid);
    }
}