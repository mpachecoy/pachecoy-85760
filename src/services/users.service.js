import { UserRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.constants.js";
import { createError } from "../utils/api.response.js";
import bcrypt from "bcrypt";

export const UserService = {
    async getAll() {
        const users = await UserRepository.getAll();
        if (!users) {
            throw createError("USER_NOT_FOUND");
        }
        return users;
    },

    async getById(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }
        return user;
    },

    async create(userData) {
        const { firstName, lastName, email, password, role } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const exist = await UserRepository.getByEmail(email);
        if (exist) {
            throw createError("USER_ALREADY_EXISTS");
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER];
            if (!validRoles.includes(role)) {
                throw createError("INVALID_ROLE");
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
            throw createError("USER_NOT_FOUND");
        }
        const { email, role } = userData;
        if (email) {
            const exist = await UserRepository.getByEmail(email);
            if (exist) {
                throw createError("USER_ALREADY_EXISTS");
            }
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER];
            if (!validRoles.includes(role)) {
                throw createError("INVALID_ROLE");
            }
        }
        const updatedUser = await UserRepository.update(uid, userData);
        return updatedUser;
    },

    async delete(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }
        const deletedUser = await UserRepository.delete(uid);
        return deletedUser;
    }
}