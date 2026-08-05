import { StoreRepository } from "../repositories/stores.repository.js";
import { USER_ROLES } from "../constants/index.constants.js";
import { UserRepository } from "../repositories/users.repository.js";
import { createError } from "../utils/api.response.js";

export const StoreService = {
    async getAll() {
        const stores = await StoreRepository.getAll();
        if (!stores) {
            throw createError("STORE_NOT_FOUND");
        }
        return stores;
    },

    async getById(sid) {
        const store = await StoreRepository.getById(sid);
        if (!store) {
            throw createError("STORE_NOT_FOUND");
        }
        return store;
    },

    async create(storeData, requestingUser) {
        const { name, address, owner, isActive } = storeData;
        if (!name || !address || !owner) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        if (!isAdmin && owner !== requestingUser._id.toString()) {
            throw createError("FORBIDDEN");
        }
        const userOwner = await UserRepository.getById(owner);
        if (!userOwner) {
            throw createError("USER_NOT_FOUND");
        }
        if (userOwner.role !== USER_ROLES.STORE) {
            throw createError("INVALID_ROLE");
        }
        const activeStatus = isActive ?? true;
        const storeToCreate = { ...storeData, isActive: activeStatus };
        return await StoreRepository.create(storeToCreate)
    },

    async update(sid, storeUpdateData, requestingUser) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isOwner = storeFound.owner._id.toString() === requestingUser._id.toString();
        if (storeFound.isActive === false) {
            throw createError("STORE_NOT_ACTIVE");
        }
        if (!isAdmin && !isOwner) {
            throw createError("FORBIDDEN");
        }
        return await StoreRepository.update(sid, storeUpdateData);
    },

    async delete(sid, requestingUser) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isOwner = storeFound.owner._id.toString() === requestingUser._id.toString();
        if (!isAdmin && !isOwner) {
            throw createError("FORBIDDEN");
        }
        return await StoreRepository.delete(sid);
    }
}