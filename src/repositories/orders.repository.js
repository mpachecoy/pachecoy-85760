import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import StoreModel from "../models/store.model.js";
import { USER_ROLES } from "../constants/index.constants.js";

export const OrderRepository = {
    async getAll() {
        return await OrderModel.find().populate(USER_ROLES.CUSTOMER).populate(USER_ROLES.STORE);
    },

    async getById(oid) {
        return await OrderModel.findById(oid)
            .populate(USER_ROLES.CUSTOMER)
            .populate(USER_ROLES.STORE);
    },

    async create(orderData) {
        return await OrderModel.create(orderData);
    },

    async updateStatusOrder(oid, status) {
        return await OrderModel.findByIdAndUpdate(oid, { status }, {
            new: true,
            runValidators: true
        });
    },

    async delete(oid) {
        return await OrderModel.findByIdAndDelete(oid);
    },

    async getCustomerById(cid) {
        return await UserModel.findById(cid);
    },

    async getStoreById(sid) {
        return await StoreModel.findById(sid);
    }
}
