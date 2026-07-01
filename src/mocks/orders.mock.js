import { faker } from "@faker-js/faker";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.constants.js";

export const generateMockOrder = () => {
    const item = [{
        product: faker.database.mongodbObjectId(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 })
    }];
    const total = item.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
        customer: faker.database.mongodbObjectId(),
        store: faker.database.mongodbObjectId(),
        items: item,
        deliveryAddress: faker.address.streetAddress(),
        total: total,
        status: faker.helpers.arrayElement([ORDER_STATUS.CREATED, ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED]),
        priority: faker.helpers.arrayElement([DELIVERY_PRIORITY.LOW, DELIVERY_PRIORITY.NORMAL, DELIVERY_PRIORITY.HIGH]),
        proof: faker.datatype.boolean()
    };
}

export const generateMockOrders = (n) => faker.helpers.multiple(generateMockOrder, { count: parseInt(n) });