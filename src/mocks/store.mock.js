import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";

export const mockStore = () => {
    return {
        name: faker.company.name(),
        address: faker.address.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        role: USER_ROLES.STORE,
        storeId: faker.string.uuid()
    };
}

export const generateMockStores = (n) => faker.helpers.multiple(mockStore, { count: parseInt(n) });