export const USER_ROLES = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    DRIVER: 'driver',
    STORE: 'store',
    USER: 'user',
    OWNER: 'owner'
};


export const ORDER_STATUS = Object.freeze({
    CREATED: 'created',
    ASSIGNED: 'assigned',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
    REJECTED: 'rejected',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
});


export const DELIVERY_PRIORITY = Object.freeze({
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
});


export const DOCUMENT_TYPES = Object.freeze({
    USER_DOCUMENT: 'user_document',
    DRIVER_LICENSE: 'driver_license',
    DELIVERY_PROOF: 'delivery_proof'
});

export const DELIVERY_REFERENCES = Object.freeze({
    ORDER: "order",
    DRIVER: "driver"
});