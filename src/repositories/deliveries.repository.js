import DeliveryModel from "../models/delivery.model.js";
import { USER_ROLES } from "../constants/index.js";

export const DeliveryRepository = {
    async getAll() {
        return await DeliveryModel.find().populate(USER_ROLES.ORDER).populate(USER_ROLES.DRIVER);
    },

    async getById(id) {
        return await DeliveryModel.findById(id)
            .populate(USER_ROLES.ORDER)
            .populate(USER_ROLES.DRIVER);
    },

    async create(deliveryData) {
        return await DeliveryModel.create(deliveryData);
    },

    async update(id, delivery) {
        return await DeliveryModel.findByIdAndUpdate(id, delivery, {
            new: true,
            runValidators: true
        });
    },

    async delete(id) {
        return await DeliveryModel.findByIdAndDelete(id);
    }
}