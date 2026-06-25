import { StoreRepository } from "../repository/store.repository.js";

export const StoreService = {
    async getAll() {
        const stores = await StoreRepository.getAll();
        if (!stores) {
            throw new Error("No se encontraron comercios");
        }
        return stores;
    },

    async getById(sid) {
        const store = await StoreRepository.getById(sid);
        if (!store) {
            throw new Error("Comercio no encontrado");
        }
        return store;
    },

    async create(storeData) {
        const { name, address, owner, isActive } = storeData;
        if (!name || !address || !owner) {
            throw new Error("Datos obligatorios no proporcionados");
        }
        const userOwner = await StoreRepository.getById(owner);
        if (!userOwner) {
            throw new Error("Usuario no encontrado");
        }
        if (!userOwner.role === USER_ROLES.STORE) {
            return res.status(400).json({ status: "error", message: "El usuario no es un comercio" });
        }
        if (isActive === undefined) {
            isActive = false;
            if (isActive === false) {
                return res.status(400).json({ status: "error", message: "El comercio no esta activo" });
            }
        }
        return await StoreRepository.create(storeData);
    },

    async update(sid, storeUpdateData) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            throw new Error("Comercio no encontrado");
        }
        if (storeFound.isActive === false) {
            throw new Error("El comercio no esta activo");
        }

        return await StoreRepository.update(sid, storeUpdateData);
    },

    async delete(sid) {
        const storeFound = await StoreRepository.getById(sid);
        if (!storeFound) {
            throw new Error("Comercio no encontrado");
        }
        return await StoreRepository.delete(sid);
    }
}