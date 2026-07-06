import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";
import bcrypt from "bcrypt";

export const mockUser = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync(faker.internet.password(), 10),
        role: faker.helpers.arrayElement([USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.OWNER, USER_ROLES.ADMIN]) || USER_ROLES.CUSTOMER
    };
}

export const generateMockUsers = (n) => faker.helpers.multiple(mockUser, { count: parseInt(n) });