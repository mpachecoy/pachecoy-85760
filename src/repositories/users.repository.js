import User from "../models/user.model.js";

export const UserRepository = {
    async getAll() {
        return await User.find();
    },

    async getById(id) {
        return await User.findById(id);
    },

    async getByEmail(email) {
        return await User.findOne({ email });
    },

    async create(user) {
        return await User.create(user);
    },

    async update(id, user) {
        return await User.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true
        });
    },

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}