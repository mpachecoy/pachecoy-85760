import { ProductService } from "../services/product.service.js";
import { successResponse, createError } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await ProductService.getAll();
    return successResponse(res, {
        message: "Productos obtenidos correctamente",
        payload: products
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (pid) {
        throw createError("INVALID_INPUT", "ID de producto no proporcionado");
    }
    const product = await ProductService.getById(pid);
    return successResponse(res, {
        message: "Producto obtenido correctamente",
        payload: product
    });
});

export const createProduct = asyncHandler(async (req, res) => {
    const productData = req.body;
    const product = await ProductService.create(productData);
    return successResponse(res, {
        statusCode: 201,
        message: "Producto creado correctamente",
        payload: product
    });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const productData = req.body;
    if (pid) {
        throw createError("INVALID_INPUT", "ID de producto no proporcionado");
    }
    const product = await ProductService.update(pid, productData);
    return successResponse(res, {
        message: "Producto actualizado correctamente",
        payload: product
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        throw new Error("ID de producto no proporcionado");
    }
    const product = await ProductService.delete(pid);
    return successResponse(res, {
        message: "Producto eliminado correctamente",
        payload: product
    });
});
