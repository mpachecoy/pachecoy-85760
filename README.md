# ShipNow API — Backend III

API REST desarrollada con Node.js, Express y MongoDB (Mongoose) siguiendo una arquitectura por capas para la gestión de usuarios, comercios, productos, pedidos y entregas.

Permite administrar el ciclo completo de compra y distribución: creación de productos y pedidos, asignación de entregas a repartidores y seguimiento de su estado.

---

## Tecnologías utilizadas

- Node.js + Express.js
- MongoDB + Mongoose
- Passport (dependencia instalada, integración de autenticación pendiente)
- bcrypt (hash de contraseñas)
- cors
- dotenv
- Winston + winston-daily-rotate-file (logging estructurado con rotación diaria)
- @faker-js/faker (generación de datos mock, solo en desarrollo)

---

## Arquitectura del proyecto

```
Routes → Controllers → Services → Repositories → MongoDB
```

| Capa             | Responsabilidad                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Routes**       | Definen los endpoints disponibles y los derivan al controller correspondiente.                                                        |
| **Controllers**  | Reciben la petición HTTP, extraen `params`/`body` y delegan la lógica al Service. No contienen lógica de negocio.                     |
| **Services**     | Contienen las validaciones y reglas de negocio. Son la única capa que decide qué error de negocio lanzar.                             |
| **Repositories** | Encapsulan el acceso a datos vía Mongoose (`find`, `create`, `findByIdAndUpdate`, etc.), aislando a los Services de la base de datos. |
| **Models**       | Definen los schemas de Mongoose y las validaciones a nivel de documento (`required`, `enum`, `unique`).                               |

La capa Repository reduce el acoplamiento entre Services y MongoDB, facilita el testing y deja la puerta abierta a cambiar el motor de persistencia sin tocar Controllers ni Services.

Todos los controllers están envueltos con un helper `asyncHandler` (ver más abajo), por lo que **no necesitan `try/catch` propio**: cualquier error (de validación, de Mongoose, o inesperado) viaja automáticamente hasta el middleware central de errores.

---

## Manejo de errores

El manejo de errores es centralizado y está compuesto por cuatro piezas, dentro de `src/utils` y `src/middlewares`:

### 1. `errors.dictionary.js`

Diccionario único con todos los códigos de error posibles de la aplicación, cada uno con su `statusCode` HTTP y su mensaje por defecto en español (`USER_NOT_FOUND`, `MISSING_REQUIRED_DATA`, `INVALID_STATUS`, `STORE_NOT_ACTIVE`, `VALIDATION_ERROR`, etc). Agregar un nuevo tipo de error a la aplicación implica agregar una entrada acá.

### 2. `custom.error.js` — `CustomError`

Clase que extiende `Error`. Al instanciarla con un código del diccionario arma automáticamente el `statusCode`, el `code` y el `message`.

```js
throw new CustomError("STORE_NOT_ACTIVE");
// equivalente y más habitual dentro de los Services:
throw createError("STORE_NOT_ACTIVE");
```

> `createError(code, customMessage)` es el punto de entrada que usan Services y Controllers; internamente delega en `new CustomError(code, customMessage)`.

### 3. `async.handler.js` — `asyncHandler`

Wrapper que envuelve cada función de controller. Captura cualquier excepción síncrona o rechazo de promesa y lo reenvía a `next(error)` automáticamente:

```js
export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getById(req.params.uid);
  return successResponse(res, { payload: user });
});
```

Esto elimina la necesidad (y el riesgo) de escribir `try { ... } catch (error) { next(error) }` en cada controller.

### 4. `error.middleware.js` — `errorHandler` / `notFoundHandler`

Middleware final de la app (`app.use(errorHandler)`), que:

- Si el error ya es un `CustomError` (lanzado por un Service o Controller), lo usa tal cual.
- Si es un `mongoose.Error.CastError` (ID con formato inválido, ej. `/api/users/123`) está pensado para traducirlo a `400 INVALID_ID`.
- Si es un `mongoose.Error.ValidationError` (falló un `required`/`enum` del schema) lo traduce a `400 VALIDATION_ERROR` con el detalle de cada campo.
- Si es un error de clave duplicada de Mongo (`code 11000`, ej. email repetido) lo traduce a `409 CONFLICT`.
- Si el body de la request no es JSON válido, responde `400 BAD_REQUEST`.
- Cualquier otro error cae en `500 INTERNAL_SERVER_ERROR`.

Todo error con `statusCode >= 500` se loguea completo (con stack trace) del lado del servidor vía Winston, sin exponer detalles internos al cliente.

`notFoundHandler` se registra después de todas las rutas y arma un `404 ROUTE_NOT_FOUND` para cualquier endpoint que no exista.

### Formato de respuesta

Éxito:

```json
{ "status": "success", "message": "...", "payload": {} }
```

Error:

```json
{
  "status": "error",
  "error": "USER_NOT_FOUND",
  "message": "Usuario no encontrado"
}
```

---

## Logging (Winston)

`src/utils/logger.js` define niveles custom (`debug`, `http`, `info`, `warn`, `error`, `fatal`) y dos transports:

- **Console**, con formato coloreado, para seguimiento en desarrollo.
- **DailyRotateFile** (`error.YYYY-MM-DD.log`) — solo nivel `error`, con rotación diaria, compresión y retención de 30 días.

Existe un endpoint de prueba, `GET /api/loggerTest`, que dispara un log de cada nivel para verificar que todo el pipeline funciona.

---

## Entidades implementadas

### Users (`/api/users`)

| Campo       | Tipo    | Notas                                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------------- |
| firstName   | String  | requerido                                                                          |
| lastName    | String  | requerido                                                                          |
| email       | String  | requerido, único                                                                   |
| password    | String  | requerido, se guarda hasheado con bcrypt                                           |
| role        | String  | enum: `admin`, `customer`, `driver`, `store`, `user`, `owner` — default `customer` |
| isAvailable | Boolean | default `false`                                                                    |
| documents   | Array   | default `[]`                                                                       |

### Stores (`/api/stores`)

| Campo    | Tipo            | Notas                                              |
| -------- | --------------- | -------------------------------------------------- |
| name     | String          | requerido                                          |
| address  | String          | requerido                                          |
| owner    | ObjectId → User | requerido, debe ser un usuario con `role: "store"` |
| isActive | Boolean         | default `true`                                     |

Un comercio inactivo (`isActive: false`) no puede actualizarse (`STORE_NOT_ACTIVE`).

### Products (`/api/products`)

| Campo       | Tipo             | Notas     |
| ----------- | ---------------- | --------- |
| title       | String           | requerido |
| description | String           | requerido |
| price       | Number           | requerido |
| stock       | Number           | requerido |
| category    | String           | requerido |
| store       | ObjectId → Store | opcional  |
| order       | ObjectId → Order | opcional  |

### Orders (`/api/orders`)

| Campo           | Tipo                             | Notas                                                                                                |
| --------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| customer        | ObjectId → User                  | requerido                                                                                            |
| store           | ObjectId → Store                 | requerido                                                                                            |
| items           | `[{ product, quantity, price }]` | requerido, al menos 1 item                                                                           |
| deliveryAddress | String                           | requerido                                                                                            |
| total           | Number                           | calculado automáticamente (`Σ price * quantity`)                                                     |
| status          | String                           | enum: `created`, `assigned`, `picked_up`, `in_transit`, `delivered`, `cancelled` — default `created` |
| priority        | String                           | enum de `DELIVERY_PRIORITY` — default `normal`                                                       |
| proof           | Object                           | default `null`                                                                                       |

### Deliveries (`/api/deliveries`)

| Campo       | Tipo             | Notas                                          |
| ----------- | ---------------- | ---------------------------------------------- |
| order       | ObjectId → Order | requerido                                      |
| driver      | ObjectId → User  | opcional                                       |
| status      | String           | mismo enum que Order — default `created`       |
| priority    | String           | enum de `DELIVERY_PRIORITY` — default `normal` |
| assignedAt  | Date             | se completa al pasar a `assigned`              |
| deliveredAt | Date             | se completa al pasar a `delivered`             |

### Constantes compartidas (`src/constants/index.constants.js`)

- **USER_ROLES**: `admin`, `customer`, `driver`, `store`, `user`, `owner`
- **ORDER_STATUS**: `created`, `assigned`, `picked_up`, `in_transit`, `delivered`, `cancelled`, `pending`, `rejected`, `confirmed`, `in_progress`, `completed`
- **DELIVERY_PRIORITY**: `low`, `normal`, `high`
- **DOCUMENT_TYPES**: `user_document`, `driver_license`, `delivery_proof`
- **DELIVERY_REFERENCES**: `order`, `driver`

> `ORDER_STATUS` define 11 valores, pero el enum de Mongoose en `order.model.js` y `delivery.model.js` solo acepta 6 (`created`, `assigned`, `picked_up`, `in_transit`, `delivered`, `cancelled`). Ver [Problemas conocidos](#problemas-conocidos).

---

## Endpoints

### Users — `/api/users`

| Método | Ruta    | Descripción            |
| ------ | ------- | ---------------------- |
| GET    | `/`     | Listar usuarios        |
| GET    | `/:uid` | Obtener usuario por ID |
| POST   | `/`     | Crear usuario          |
| PUT    | `/:uid` | Actualizar usuario     |
| DELETE | `/:uid` | Eliminar usuario       |

### Stores — `/api/stores`

Mismos verbos que Users, con `:sid`.

### Products — `/api/products`

Mismos verbos que Users, con `:pid`.

### Orders — `/api/orders`

| Método | Ruta           | Descripción                  |
| ------ | -------------- | ---------------------------- |
| GET    | `/`            | Listar pedidos               |
| GET    | `/:oid`        | Obtener pedido por ID        |
| POST   | `/`            | Crear pedido                 |
| PUT    | `/:oid/status` | Actualizar estado del pedido |
| DELETE | `/:oid`        | Eliminar pedido              |

### Deliveries — `/api/deliveries`

| Método | Ruta           | Descripción            |
| ------ | -------------- | ---------------------- |
| GET    | `/`            | Listar entregas        |
| GET    | `/:did`        | Obtener entrega por ID |
| POST   | `/`            | Crear entrega          |
| PUT    | `/:did/status` | Actualizar entrega     |
| DELETE | `/:did`        | Eliminar entrega       |

### Mocks — `/api/mocks` (solo si `NODE_ENV=development`)

| Método | Ruta             | Descripción                                          |
| ------ | ---------------- | ---------------------------------------------------- |
| GET    | `/users/:n`      | Generar `n` usuarios falsos (no se guardan)          |
| GET    | `/stores/:n`     | Generar `n` comercios falsos                         |
| GET    | `/products/:n`   | Generar `n` productos falsos                         |
| GET    | `/orders/:n`     | Generar `n` pedidos falsos                           |
| GET    | `/deliveries/:n` | Generar `n` entregas falsas                          |
| POST   | `/users/:n`      | Generar y **guardar** `n` usuarios falsos en la base |

### Utilitarios

- `GET /` — status de la API
- `GET /health` — healthcheck
- `GET /api/loggerTest` — dispara un log de cada nivel (debug/http/info/warn/error/fatal) para probar Winston

---

## Variables de entorno

Crear un archivo `.env` en la raíz (ver `.env.example`):

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development
```

Las tres son obligatorias: la app no arranca si falta alguna (`env.config.js` valida esto al inicio).

---

## Instalación y ejecución

```bash
npm install

# modo desarrollo (con nodemon)
npm run dev

# modo producción
npm start
```

---

## Estado del proyecto / próximos pasos

- Autenticación con Passport (Local/JWT) aún no integrada en las rutas de esta API (la dependencia está instalada pero no conectada a `app.js`).
- No hay middlewares de autorización por rol todavía.
- Los mocks (`/api/mocks`) están pensados solo para poblar datos de prueba en desarrollo; se desactivan automáticamente si `NODE_ENV` no es `development`.
- Resolver los ítems marcados como pendientes en [Problemas conocidos](#problemas-conocidos), en particular los que rompen validaciones (`ReferenceError`) antes de seguir sumando funcionalidad.

---

## Autor

Carlos Martín Pachecoy
