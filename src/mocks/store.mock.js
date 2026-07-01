import { faker } from "@faker-js/faker";


export const mockStore = () => {
    return {
        name: faker.company.name(),
        address: faker.address.streetAddress(),
        owner: faker.database.mongodbObjectId()
    };
}

export const generateMockStores = (n) => faker.helpers.multiple(mockStore, { count: parseInt(n) });