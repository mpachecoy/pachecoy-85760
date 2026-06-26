import { Router } from "express";
import { getAllStores, getStoreById, createStore, updateStore, deleteStore } from "../controllers/store.controller.js";

const router = Router();

router.get("/", getAllStores);
router.get("/:sid", getStoreById);
router.post("/", createStore);
router.put("/:sid", updateStore);
router.delete("/:sid", deleteStore);

export default router;
