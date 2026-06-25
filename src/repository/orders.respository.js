import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import StoreModel from "../models/store.model.js";
import { ORDER_STATUS, USER_ROLES } from "../constants/index.constants.js";

export const OrderRepository = {
    async getAll() {
        return await OrderModel.find().populate(USER_ROLES.CUSTOMER).populate(USER_ROLES.STORE);
    },

    async getById(id) {
        return await OrderModel.findById(id)
            .populate(USER_ROLES.CUSTOMER)
            .populate(USER_ROLES.STORE);
    },

    async create(orderData) {
        return await OrderModel.create(orderData);
    },

    async updateStatusOrder(id, status) {
        return await OrderModel.findByIdAndUpdate(id, { status }, {
            new: true,
            runValidators: true
        });
    },

    async delete(id) {
        return await OrderModel.findByIdAndDelete(id);
    },

    async getCustomerById(id) {
        return await UserModel.findById(id);
    },

    async getStoreById(id) {
        return await StoreModel.findById(id);
    }
}
