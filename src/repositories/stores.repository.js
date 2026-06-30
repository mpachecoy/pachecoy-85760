import StoreModel from "../models/store.model.js";
import { USER_ROLES } from "../constants/index.constants.js";

export const StoreRepository = {
    async getAll() {
        return await StoreModel.find().populate(USER_ROLES.OWNER);
    },
    async getById(sid) {
        return await StoreModel.findById(sid).populate(USER_ROLES.OWNER);
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
