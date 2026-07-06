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

    async create(storeData) {
        const { name, address, owner, isActive } = storeData;
        if (!name || !address || !owner) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const userOwner = await UserRepository.getById(owner);
        if (!userOwner) {
            throw createError("USER_NOT_FOUND");
        }
        if (userOwner.role !== USER_ROLES.STORE) {
            throw createError("INVALID_ROLE");
        }
        const activeStatus = isActive ?? false;
        const storeToCreate = { ...storeData, isActive: activeStatus };
        return await StoreRepository.create(storeToCreate)
    },

    async update(sid, storeUpdateData) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }
        if (storeFound.isActive === false) {
            throw createError("STORE_NOT_ACTIVE");
        }

        return await StoreRepository.update(sid, storeUpdateData);
    },

    async delete(sid) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }
        return await StoreRepository.delete(sid);
    }
}