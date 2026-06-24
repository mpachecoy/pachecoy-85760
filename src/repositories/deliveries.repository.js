import DeliveryModel from "../models/delivery.model.js";

export const DeliveryRepository = {
    async getAll() {
        return await DeliveryModel.find().populate("order").populate("driver");
    },

    async getById(id) {
        return await DeliveryModel.findById(id)
            .populate("order")
            .populate("driver");
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