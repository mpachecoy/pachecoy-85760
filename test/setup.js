import mongoose from "mongoose";
import { env } from "../src/config/env.config.js";

export const mochaHooks = {
    beforeAll: async () => {
        await mongoose.connect(env.mongoURI);
    },
    afterAll: async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
};

