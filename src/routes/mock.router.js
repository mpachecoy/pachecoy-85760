import { Router } from "express";
import {
    getMockUsers,
    getMockStores,
    getMockProducts,
    getMockOrders,
    getMockDeliveries,
    saveMockUsers
} from "../controllers/mock.controller.js";

const router = Router();

router.get("/users/:n", getMockUsers);
router.get("/stores/:n", getMockStores);
router.get("/products/:n", getMockProducts);
router.get("/orders/:n", getMockOrders);
router.get("/deliveries/:n", getMockDeliveries);

router.post("/users/:n", saveMockUsers);

export default router;
