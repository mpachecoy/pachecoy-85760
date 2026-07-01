import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";
import bcrypt from "bcrypt";

export const mockUser = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync(faker.internet.password(), 10),
        role: USER_ROLES.CUSTOMER
    };
}

export const generateMockUsers = (n) => faker.helpers.multiple(mockUser, { count: parseInt(n) });