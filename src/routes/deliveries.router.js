import { Router } from "express";
import { getAllDeliveries, getDeliveryById, createDelivery, updateDelivery, deleteDelivery } from "../controllers/deliveries.controller.js";

const router = Router();

router.get("/", getAllDeliveries);
router.get("/:did", getDeliveryById);
router.post("/", createDelivery);
router.put("/:did/status", updateDelivery);
router.delete("/:did", deleteDelivery);

export default router;
