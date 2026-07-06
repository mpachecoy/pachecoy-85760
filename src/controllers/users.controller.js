import { UserService } from "../services/users.service.js";
import { successResponsae } from "../utils/api.response.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAll();
        return successResponsae(res, {
            message: "Usuarios obtenidos correctamente",
            payload: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res
                .status(400)
                .json({ status: "error", message: "ID no proporcionado" });
        }
        const user = await UserService.getById(uid);
        return successResponsae(res, {
            message: `Usuario ${uid} obtenido correctamente`,
            payload: user,
        });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await UserService.create(userData);
        return successResponsae(res, {
            statusCode: 201,
            message: "Usuario creado correctamente",
            payload: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const userData = req.body;
        if (!uid) {
            return res
                .status(400)
                .json({ status: "error", message: "ID no proporcionado" });
        }
        const user = await UserService.update(uid, userData);
        return successResponsae(res, {
            message: `Usuario ${uid} actualizado correctamente`,
            payload: user,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res
                .status(400)
                .json({ status: "error", message: "ID no proporcionado" });
        }
        const user = await UserService.delete(uid);
        return successResponsae(res, {
            message: `Usuario ${uid} eliminado correctamente`,
            payload: user,
        });
    } catch (error) {
        next(error);
    }
};
