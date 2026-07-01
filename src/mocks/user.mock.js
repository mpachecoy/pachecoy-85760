import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";

export const mockUser = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: USER_ROLES.CUSTOMER
    };
}

export const mockDeliverer = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: USER_ROLES.DELIVERER,
        isAvailable: true
    };
}

export const generateMockUsers = (n) => faker.helpers.multiple(mockUser, { count: parseInt(n) });
export const generateMockDeliverers = (n) => faker.helpers.multiple(mockDeliverer, { count: parseInt(n) });