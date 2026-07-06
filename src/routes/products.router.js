import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const productsRouter = Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", createProduct);
productsRouter.put("/:pid", updateProduct);
productsRouter.delete("/:pid", deleteProduct);

export default productsRouter;
