import { ProductService } from "../services/product.service.js";

export const ProductController = {
    async getAll(req, res) {
        try {
            const products = await ProductService.getAll();
            res.status(200).json({
                status: "success",
                message: "Productos obtenidos correctamente",
                data: products
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message
            });
        }
    },

    async getById(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductService.getById(pid);
            res.status(200).json({
                status: "success",
                message: "Producto obtenido correctamente",
                data: product
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message
            });
        }
    },

    async create(req, res) {
        try {
            const productData = req.body;
            const product = await ProductService.create(productData);
            res.status(201).json({
                status: "success",
                message: "Producto creado correctamente",
                data: product
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const { pid } = req.params;
            const productData = req.body;
            const product = await ProductService.update(pid, productData);
            res.status(200).json({
                status: "success",
                message: "Producto actualizado correctamente",
                data: product
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductService.delete(pid);
            res.status(200).json({
                status: "success",
                message: "Producto eliminado correctamente",
                data: product
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message
            });
        }
    }
}