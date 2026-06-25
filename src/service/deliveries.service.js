import { DeliveryRepository } from "../repository/deliveries.repository.js";

export const DeliveryService = {
    async getAll() {
        return await DeliveryRepository.getAll();
    },

    async getById(id) {
        return await DeliveryRepository.getById(id);
    },

    async create(deliveryData) {
        return await DeliveryRepository.create(deliveryData);
    },

    async update(id, delivery) {
        return await DeliveryRepository.update(id, delivery);
    },

    async delete(id) {
        return await DeliveryRepository.delete(id);
    }
}