import { ProductRepository } from "../repositories/products.repository.js";
import { StoreRepository } from "../repositories/stores.repository.js";
import { createError } from "../utils/api.response.js";
import { USER_ROLES } from "../constants/index.constants.js";

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

    async create(productData, requestingUser) {
        const { title, description, price, stock, category, store } = productData;
        if (!title || !description || !price || !stock || !category || !store) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const storeFound = await StoreRepository.getById(store);
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }
        const isStoreOwner = storeFound.owner._id.toString() !== requestingUser._id.toString();
        if (!isAdmin && isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        return await ProductRepository.create(productData);
    },

    async update(pid, productData, requestingUser) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            throw createError("PRODUCT_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isStoreOwner = product.store.owner._id.toString() !== requestingUser._id.toString();
        if (!isAdmin && isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        return await ProductRepository.update(pid, productData);
    },

    async delete(pid, requestingUser) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            throw createError("PRODUCT_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isStoreOwner = product.store.owner._id.toString() !== requestingUser._id.toString();
        if (!isAdmin && isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        return await ProductRepository.delete(pid);
    }
}