import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getAllOrders);
router.get("/:oid", getOrderById);
router.post("/", createOrder);
router.put("/:oid/status", updateOrder);
router.delete("/:oid", deleteOrder);


export default router;
