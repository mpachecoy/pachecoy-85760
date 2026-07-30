import DeliveryModel from "../models/delivery.model.js";
import { DELIVERY_REFERENCES } from "../constants/index.constants.js";

export const DeliveryRepository = {
    async getAll() {
        return await DeliveryModel.find().populate(DELIVERY_REFERENCES.ORDER).populate(DELIVERY_REFERENCES.DRIVER);
    },

    async getById(id) {
        return await DeliveryModel.findById(id)
            .populate(DELIVERY_REFERENCES.ORDER)
            .populate(DELIVERY_REFERENCES.DRIVER);
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