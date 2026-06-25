import { UserRepository } from "../repositories/users.repository.js";

export const UserService = {
    async getAll() {
        return await UserRepository.getAll();
    },

    async getById(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    },

    async create(userData) {
        const { firstName, lastName, email, password, role, isAvailable, documents } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw new Error("Datos obligatorios no proporcionados");
        }
        const exist = await UserRepository.getByEmail(email);
        if (exist) {
            throw new Error("Usuario ya existe");
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE];
            if (!validRoles.includes(role)) {
                throw new Error("Rol inválido");
            }
        }
        const user = await UserRepository.create(userData);
        return user;
    },

    async update(uid, userData) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        const { email, role } = userData;
        if (email) {
            const exist = await UserRepository.getByEmail(email);
            if (exist) {
                throw new Error("Usuario ya existe");
            }
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE];
            if (!validRoles.includes(role)) {
                throw new Error("Rol inválido");
            }
        }
        const updatedUser = await UserRepository.update(uid, userData);
        return updatedUser;
    },

    async delete(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        const deletedUser = await UserRepository.delete(uid);
        return deletedUser;
    }
}