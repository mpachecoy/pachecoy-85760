import { UserRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.constants.js";
import bcrypt from "bcrypt";

export const UserService = {
    async getAll() {
        const users = await UserRepository.getAll();
        if (!users) {
            const error = new Error("No se encontraron usuarios");
            error.statusCode = 404;
            throw error;
        }
        return users;
    },

    async getById(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return user;
    },

    async create(userData) {
        const { firstName, lastName, email, password, role } = userData;
        if (!firstName || !lastName || !email || !password) {
            const error = new Error("Datos obligatorios no proporcionados");
            error.statusCode = 400;
            throw error;
        }
        const exist = await UserRepository.getByEmail(email);
        if (exist) {
            const error = new Error("Usuario ya existe");
            error.statusCode = 400;
            throw error;
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER];
            if (!validRoles.includes(role)) {
                const error = new Error("Rol inválido");
                error.statusCode = 400;
                throw error;
            }
        }

        const newUser = {
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
            role,
        }
        const user = await UserRepository.create(newUser);
        return user;
    },

    async update(uid, userData) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }
        const { email, role } = userData;
        if (email) {
            const exist = await UserRepository.getByEmail(email);
            if (exist) {
                const error = new Error("Usuario ya existe");
                error.statusCode = 400;
                throw error;
            }
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER];
            if (!validRoles.includes(role)) {
                const error = new Error("Rol inválido");
                error.statusCode = 400;
                throw error;
            }
        }
        const updatedUser = await UserRepository.update(uid, userData);
        return updatedUser;
    },

    async delete(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }
        const deletedUser = await UserRepository.delete(uid);
        return deletedUser;
    }
}