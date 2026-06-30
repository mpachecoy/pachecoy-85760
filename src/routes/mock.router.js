import { Router } from "express";
import {
    getMockUsers,
    getMockStores,
    getMockProducts,
    getMockOrders,
    getMockDeliveries,

} from "../controllers/mock.controller.js";

const router = Router();

router.get("/users/:n", getMockUsers);
router.get("/stores/:n", getMockStores);
router.get("/products/:n", getMockProducts);
router.get("/orders/:n", getMockOrders);
router.get("/deliveries/:n", getMockDeliveries);


export default router;
