import swaggerJSDoc from "swagger-jsdoc";


export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ShipNow API",
            version: "1.0.0",
            description: "API REST base para la gestión de logística y envíos."
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local development server"
            }
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        firstName: {
                            type: "string",
                            example: "Juan"
                        },
                        lastName: {
                            type: "string",
                            example: "Perez"
                        },
                        email: {
                            type: "string",
                            example: "[EMAIL_ADDRESS]"
                        },
                        role: {
                            type: "string",
                            example: "user"
                        },
                        documents: {
                            type: "array",
                            example: []
                        }
                    }
                },
                UsersResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Usuarios obtenidos correctamente"
                        },
                        payload: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/User"
                            }
                        }
                    }
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Usuario obtenido correctamente"
                        },
                        payload: {
                            $ref: "#/components/schemas/User"
                        }
                    }
                },
                UsersErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error"
                        },
                        error: {
                            type: "string",
                            example: "USER_NOT_FOUND"
                        },
                        message: {
                            type: "string",
                            example: "Usuario no encontrado"
                        },
                    }
                },
                UserInput: {
                    type: "object",
                    properties: {
                        firstName: {
                            type: "string",
                            example: "Juan"
                        },
                        lastName: {
                            type: "string",
                            example: "Perez"
                        },
                        email: {
                            type: "string",
                            example: "[EMAIL_ADDRESS]"
                        },
                        password: {
                            type: "string",
                            example: "password"
                        },
                        role: {
                            type: "string",
                            example: "user"
                        }
                    },
                    required: ["firstName", "lastName", "email", "password"]
                },
                Order: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },

                    }
                },
                OrderResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Orden obtenida correctamente"
                        },
                        payload: {
                            $ref: "#/components/schemas/Order"
                        }
                    }
                },
                OrdersResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Órdenes obtenidas correctamente"
                        },
                        payload: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Order"
                            }
                        }
                    }
                },
                OrdersErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error"
                        },
                        error: {
                            type: "string",
                            example: "ORDER_NOT_FOUND"
                        },
                        message: {
                            type: "string",
                            example: "Orden no encontrada"
                        },
                    }
                },
                OrderInput: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },

                    }
                },
                Delivery: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        orderId: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        driverId: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        status: {
                            type: "string",
                            example: "pending"
                        },
                        priority: {
                            type: "string",
                            example: "normal"
                        }

                    }
                },
                DeliveryResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Entrega obtenida correctamente"
                        },
                        payload: {
                            $ref: "#/components/schemas/Delivery"
                        }
                    }
                },
                DeliveriesResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Entregas obtenidas correctamente"
                        },
                        payload: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Delivery"
                            }
                        }
                    }
                },
                DeliveriesErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error"
                        },
                        error: {
                            type: "string",
                            example: "DELIVERY_NOT_FOUND"
                        },
                        message: {
                            type: "string",
                            example: "Entrega no encontrada"
                        },
                    }
                },
                DeliveryInput: {
                    type: "object",
                    properties: {
                        driver: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        order: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        status: {
                            type: "string",
                            example: "pending"
                        },
                        priority: {
                            type: "string",
                            example: "normal"
                        }
                    }
                },
                Product: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        name: {
                            type: "string",
                            example: "Product 1"
                        },
                        description: {
                            type: "string",
                            example: "Description 1"
                        },
                        price: {
                            type: "number",
                            example: 10
                        },
                        stock: {
                            type: "number",
                            example: 10
                        }
                    }
                },
                ProductsResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Productos obtenidos correctamente"
                        },
                        payload: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                ProductsErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error"
                        },
                        error: {
                            type: "string",
                            example: "PRODUCT_NOT_FOUND"
                        },
                        message: {
                            type: "string",
                            example: "Producto no encontrado"
                        },
                    }
                },
                ProductInput: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "Product 1"
                        },
                        description: {
                            type: "string",
                            example: "Description 1"
                        },
                        price: {
                            type: "number",
                            example: 10
                        },
                        stock: {
                            type: "number",
                            example: 10
                        }
                    }
                },
                Store: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "6a4485be97eca2972879e510"
                        },
                        name: {
                            type: "string",
                            example: "Store 1"
                        },
                        description: {
                            type: "string",
                            example: "Description 1"
                        },
                        address: {
                            type: "string",
                            example: "Address 1"
                        },
                        phone: {
                            type: "string",
                            example: "Phone 1"
                        },
                        email: {
                            type: "string",
                            example: "[EMAIL_ADDRESS]"
                        }
                    }
                },
                StoresResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Stores obtenidas correctamente"
                        },
                        payload: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Store"
                            }
                        }
                    }
                },
                StoresErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error"
                        },
                        error: {
                            type: "string",
                            example: "STORE_NOT_FOUND"
                        },
                        message: {
                            type: "string",
                            example: "Store no encontrada"
                        },
                    }
                },
                StoreInput: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "Store 1"
                        },
                        description: {
                            type: "string",
                            example: "Description 1"
                        },
                        address: {
                            type: "string",
                            example: "Address 1"
                        },
                        phone: {
                            type: "string",
                            example: "Phone 1"
                        },
                        email: {
                            type: "string",
                            example: "[EMAIL_ADDRESS]"
                        }
                    }
                },
                LoggerTestResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success"
                        },
                        message: {
                            type: "string",
                            example: "Logs generados correctamente"
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
})

