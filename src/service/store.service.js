import { StoreRepository } from "../repository/store.repository.js";
import { USER_ROLES } from "../constants/index.constants.js";
import { UserRepository } from "../repository/users.repository.js";

export const StoreService = {
    async getAll() {
        const stores = await StoreRepository.getAll();
        if (!stores) {
            const error = new Error("No se encontraron comercios");
            error.statusCode = 404;
            throw error;
        }
        return stores;
    },

    async getById(sid) {
        const store = await StoreRepository.getById(sid);
        if (!store) {
            const error = new Error("Comercio no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return store;
    },

    async create(storeData) {
        const { name, address, owner, isActive } = storeData;
        if (!name || !address || !owner) {
            const error = new Error("Datos obligatorios no proporcionados");
            error.statusCode = 400;
            throw error;
        }
        const userOwner = await UserRepository.getById(owner);
        if (!userOwner) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }
        if (userOwner.role !== USER_ROLES.STORE) {
            const error = new Error("El usuario no es un comercio");
            error.statusCode = 400;
            throw error;
        }
        const activeStatus = isActive ?? false;
        const storeToCreate = { ...storeData, isActive: activeStatus };
        return await StoreRepository.create(storeToCreate)
    },

    async update(sid, storeUpdateData) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            const error = new Error("Comercio no encontrado");
            error.statusCode = 404;
            throw error;
        }
        if (storeFound.isActive === false) {
            const error = new Error("El comercio no esta activo");
            error.statusCode = 400;
            throw error;
        }

        return await StoreRepository.update(sid, storeUpdateData);
    },

    async delete(sid) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            const error = new Error("Comercio no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return await StoreRepository.delete(sid);
    }
}