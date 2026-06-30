import { Router } from "express";
import {
    getMockUsers,
    getMockStores,
    getMockProducts,
    getMockOrders,
    getMockDeliveries,
    saveMockUsers,
    saveMockStores,
    saveMockProducts,
    saveMockOrders,
    saveMockDeliveries
} from "../controllers/mock.controller.js";

const router = Router();

router.get("/users/:n", getMockUsers);
router.get("/stores/:n", getMockStores);
router.get("/products/:n", getMockProducts);
router.get("/orders/:n", getMockOrders);
router.get("/deliveries/:n", getMockDeliveries);
router.post("/users/save", saveMockUsers);
router.post("/stores/save", saveMockStores);
router.post("/products/save", saveMockProducts);
router.post("/orders/save", saveMockOrders);
router.post("/deliveries/save", saveMockDeliveries);

export default router;
