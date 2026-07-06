import { ProductService } from "../services/product.service.js";
import { successResponse } from "../utils/api.response.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await ProductService.getAll();
        return successResponse(res, {
            message: "Productos obtenidos correctamente",
            payload: products
        });
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await ProductService.getById(pid);
        return successResponse(res, {
            message: "Producto obtenido correctamente",
            payload: product
        });
    } catch (error) {
        next(error)
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const product = await ProductService.create(productData);
        return successResponse(res, {
            statusCode: 201,
            message: "Producto creado correctamente",
            payload: product
        });
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const productData = req.body;
        const product = await ProductService.update(pid, productData);
        return successResponse(res, {
            message: "Producto actualizado correctamente",
            payload: product
        });
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;
        if (!pid) {
            throw new Error("ID de producto no proporcionado");
        }
        const product = await ProductService.delete(pid);
        return successResponse(res, {
            message: "Producto eliminado correctamente",
            payload: product
        });
    } catch (error) {
        next(error)
    }
}
