import { StoreService } from "../service/store.service.js";

export const getAllStores = async (req, res) => {
    try {
        const stores = await StoreService.getAll();
        res.json({ status: "success", payload: stores });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getStoreById = async (req, res) => {
    try {
        const { sid } = req.params;
        const store = await StoreService.getById(sid);

        res.json({ status: "success", payload: store });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const createStore = async (req, res) => {
    try {
        const storeData = req.body;
        const store = await StoreService.create(storeData);
        res.status(201).json({ status: "success", payload: store });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const updateStore = async (req, res) => {
    try {
        const { sid } = req.params;
        const storeUpdateData = req.body;
        if (!sid) {
            return res.status(400).json({ status: "error", message: "ID de comercio no proporcionado" });
        }
        if (!storeUpdateData) {
            return res.status(400).json({ status: "error", message: "Datos del comercio no proporcionados" });
        }
        const store = await StoreService.update(sid, storeUpdateData);
        res.json({ status: "success", payload: store });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteStore = async (req, res) => {
    try {
        const { sid } = req.params;
        if (!sid) {
            return res.status(400).json({ status: "error", message: "ID de comercio no proporcionado" });
        }
        const store = await StoreService.delete(sid);
        res.json({ status: "success", payload: store });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

