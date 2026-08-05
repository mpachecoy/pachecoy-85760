import User from "../models/user.model.js";

export const UserRepository = {
    async getAll() {
        return await User.find().select('-password');
    },

    async getById(id) {
        return await User.findById(id).select('-password');
    },

    async getByEmail(email) {
        return await User.findOne({ email });
    },

    async create(user) {
        const created = await User.create(user);
        const strip = (doc) => {
            const obj = doc.toObject();
            delete obj.password;
            return obj;
        }
        return Array.isArray(created) ? created.map(strip) : strip(created);
    },

    async update(id, user) {
        return await User.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true
        }).select('-password');
    },

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}