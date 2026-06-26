import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const productsRouter = Router();

productsRouter.get("/", ProductController.getAll);
productsRouter.get("/:pid", ProductController.getById);
productsRouter.post("/", ProductController.create);
productsRouter.put("/:pid", ProductController.update);
productsRouter.delete("/:pid", ProductController.delete);

export default productsRouter;
