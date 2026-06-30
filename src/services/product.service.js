import { ProductRepository } from "../repositories/products.repository.js";

export const ProductService = {
    async getAll() {
        const products = await ProductRepository.getAll();
        if (!products) {
            const error = new Error("No se encontraron productos");
            error.statusCode = 404;
            throw error;
        }
        return products;
    },

    async getById(pid) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return product;
    },

    async create(productData) {
        const { title, description, price, stock, category } = productData;
        if (!title || !description || !price || !stock || !category) {
            const error = new Error("Datos obligatorios no proporcionados");
            error.statusCode = 400;
            throw error;
        }
        return await ProductRepository.create(productData);
    },

    async update(pid, productData) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return await ProductRepository.update(pid, productData);
    },

    async delete(pid) {
        const product = await ProductRepository.getById(pid);
        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return await ProductRepository.delete(pid);
    }
}