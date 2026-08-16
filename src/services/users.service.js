import { UserRepository } from "../repositories/users.repository.js";
import { DOCUMENT_TYPES, USER_ROLES } from "../constants/index.constants.js";
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

    async getById(uid, requestingUser) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }
        const isSelf = requestingUser._id.toString() === uid;
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        if (!isSelf && !isAdmin) {
            throw createError("FORBIDDEN");
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
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER, USER_ROLES.OWNER];
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

    async update(uid, userData, requestingUser) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }
        const isSelf = requestingUser._id.toString() === uid;
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        if (!isSelf && !isAdmin) {
            throw createError("FORBIDDEN");
        }
        if (userData.role && !isAdmin) {
            throw createError("FORBIDDEN", "No podés cambiar tu propio rol");
        }
        const { email, role } = userData;
        if (email) {
            const exist = await UserRepository.getByEmail(email);
            if (exist && exist._id.toString() !== uid) {
                throw createError("USER_ALREADY_EXISTS");
            }
        }
        if (role) {
            const validRoles = [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER, USER_ROLES.OWNER];
            if (!validRoles.includes(role)) {
                throw createError("INVALID_ROLE");
            }
        }
        const updatedUser = await UserRepository.update(uid, userData);
        return updatedUser;
    },

    async uploadDocuments(uid, file, type, requestingUser) {
        if (!file) {
            throw createError("FILE_REQUIRED");
        }
        if (!Object.values(DOCUMENT_TYPES).includes(type)) {
            throw createError("INVALID_DOCUMENT_TYPE");
        }
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }
        const isSelf = requestingUser._id.toString() === uid;
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;

        if (!isSelf && !isAdmin) {
            throw createError("FORBIDDEN");
        }
        if (type === DOCUMENT_TYPES.DRIVER_LICENSE && user.role !== USER_ROLES.DRIVER) {
            throw createError("FORBIDDEN", "No podés subir este tipo de documento");
        }

        const document = {
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            type
        }

        const documents = [...user.documents, document];

        const updatedUser = await UserRepository.update(uid, { documents });
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