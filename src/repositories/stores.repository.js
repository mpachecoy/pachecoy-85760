import StoreModel from "../models/store.model.js";

export const StoreRepository = {
    async getAll() {
        return await StoreModel.find().populate("owner", "-password");
    },
    async getById(sid) {
        return await StoreModel.findById(sid).populate("owner", "-password");
    },
    async create(storeData) {
        return await StoreModel.create(storeData);
    },
    async update(sid, store) {
        return await StoreModel.findByIdAndUpdate(sid, store, {
            new: true,
            runValidators: true
        });
    },
    async delete(sid) {
        return await StoreModel.findByIdAndDelete(sid);
    }
}
