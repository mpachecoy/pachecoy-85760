import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/users.repository.js";
import { generateToken } from "../utils/jwt.utils.js";
import { createError } from "../utils/api.response.js";
import { USER_ROLES } from "../constants/index.constants.js";

export const AuthService = {
    async register(userData) {
        const { email, password, firstName, lastName } = userData;
        const user = await UserRepository.getByEmail(email);
        if (user) throw createError("USER_ALREADY_EXISTS");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: USER_ROLES.USER,
        });
        return newUser;
    },

    async login(email, password) {
        const user = await UserRepository.getByEmail(email);

        if (!user) throw createError("USER_NOT_FOUND");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw createError("INVALID_CREDENTIALS");

        const userLogin = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
        const token = generateToken(userLogin);
        return { userLogin, token };
    },

    async logout(userId) {
        const user = await UserRepository.getById(userId);
        if (!user) throw createError("USER_NOT_FOUND");
        return await UserRepository.logout(userId);
    }
}
