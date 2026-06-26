import { UserService } from "../services/users.service.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAll();
        res.json({ status: "success", payload: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}


export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const user = await UserService.getById(uid);
        res.json({ status: "success", payload: user });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const user = await UserService.create(userData);
        res.status(201).json({ status: "success", payload: user });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const userData = req.body;
        if (!uid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const user = await UserService.update(uid, userData);
        res.json({ status: "success", payload: user });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const user = await UserService.delete(uid);
        res.json({ status: "success", payload: user });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}
