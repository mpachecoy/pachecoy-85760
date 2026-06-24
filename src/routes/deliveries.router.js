import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/deliveries.controller.js";

const router = Router();

router.get("/", getAllOrders);
router.get("/:did", getOrderById);
router.post("/", createOrder);
router.put("/:did/status", updateOrder);
router.delete("/:did", deleteOrder);

export default router;
