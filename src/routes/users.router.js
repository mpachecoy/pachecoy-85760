import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controller/users.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:uid", getUserById);
router.post("/", createUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);

export default router;
