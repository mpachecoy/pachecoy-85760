# ShipNow API — Backend III

API REST desarrollada con Node.js, Express y MongoDB (Mongoose) siguiendo una arquitectura por capas para la gestión de usuarios, comercios, productos, pedidos y entregas.

Permite administrar el ciclo completo de compra y distribución: creación de productos y pedidos, asignación de entregas a repartidores y seguimiento de su estado.

---

## Tecnologías utilizadas

- Node.js + Express.js
- MongoDB + Mongoose
- Passport + passport-jwt (autenticación vía JWT en cookies httpOnly)
- passport-github2 (login social con GitHub OAuth2)
- jsonwebtoken (firma y verificación de tokens)
- cookie-parser (lectura de cookies en cada request)
- bcrypt (hash de contraseñas)
- helmet (headers de seguridad HTTP)
- multer (carga de archivos multipart/form-data)
- cors
- dotenv
- Winston + winston-daily-rotate-file (logging estructurado con rotación diaria)
- swagger-jsdoc + swagger-ui-express (documentación interactiva de la API)
- @faker-js/faker (generación de datos mock, solo en desarrollo)
- Mocha (organización y ejecución de tests)
- Chai (aserciones)
- Supertest (peticiones HTTP a la app sin levantar un puerto)
- Docker (`dockerfile` + `.dockerignore` en la raíz)

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

## Documentación interactiva (Swagger)

La API expone su documentación en **`GET /api/docs`** (Swagger UI). Está montada en `app.js` sin depender de `NODE_ENV`, así que también está disponible en producción.

- Generada con `swagger-jsdoc` a partir de anotaciones `@swagger` escritas directamente en los archivos de `src/routes/*.js`.
- Servida con `swagger-ui-express` desde `src/routes/docs.router.js`.
- Los schemas (`User`, `Order`, `Delivery`, `Product`, `Store`, y sus variantes `*Input`/`*Response`/`*ErrorResponse`) están centralizados en `src/config/swagger.js`.

### Módulos documentados

| Módulo                          | ¿Tiene anotaciones `@swagger`?                               |
| ------------------------------- | ------------------------------------------------------------ |
| Users (`/api/users`)            | ✅ Sí                                                        |
| Orders (`/api/orders`)          | ✅ Sí                                                        |
| Deliveries (`/api/deliveries`)  | ✅ Sí                                                        |
| Mocks (`/api/mocks`)            | ✅ Sí                                                        |
| Logger test (`/api/loggerTest`) | ✅ Sí                                                        |
| Products (`/api/products`)      | ❌ No — el endpoint funciona, pero no aparece en `/api/docs` |
| Stores (`/api/stores`)          | ❌ No — el endpoint funciona, pero no aparece en `/api/docs` |

### Cómo levantar el servidor y abrir la documentación

```bash
npm install
cp .env.example .env   # completar PORT, MONGODB_URI y NODE_ENV
npm run dev            # o: npm start
```

Con el servidor arriba (por defecto en `http://localhost:8080`), abrir en el navegador:

```
http://localhost:8080/api/docs
```

(`/api/docs`, sin la barra final, también funciona — redirige automáticamente a `/api/docs/`).

### Aclaraciones para probar los endpoints

- Cada operación tiene un botón **"Try it out"** que arma y envía el request desde el propio navegador — no hace falta Postman ni `curl` para las pruebas básicas.
- El campo `servers` en `src/config/swagger.js` está fijo en `http://localhost:8080`. Si corrés la API en otro puerto (variable `PORT` en `.env`), Swagger UI va a cargar igual, pero el botón "Try it out" va a fallar hasta que cambies esa URL en el archivo o la pegues manualmente en el selector "Servers" de la interfaz.
- Los endpoints que reciben un ID por parámetro (`:uid`, `:oid`, `:did`, `:pid`, `:sid`) necesitan un `ObjectId` real que ya exista en tu base — probá primero un `GET` de la colección para conseguir uno, o generá datos de prueba con `/api/mocks` (ver tabla de Mocks más abajo).
- ⚠️ Los ejemplos de `OrderInput` y `Delivery`/`DeliveryInput` en `src/config/swagger.js` están desactualizados respecto al modelo real:
  - `OrderInput` solo documenta un campo `userId`, pero `POST /api/orders` en realidad requiere `customer`, `store`, `items` (array de `{ product, quantity, price }`) y `deliveryAddress` (ver tabla de **Orders** en Entidades implementadas).
  - El schema de respuesta `Delivery` documenta `orderId`/`driverId`, pero el modelo real usa `order`/`driver` (que es lo que sí usa correctamente `DeliveryInput`).
  - Si probás "Try it out" con el ejemplo tal cual lo pre-carga Swagger para estos dos casos, vas a recibir un `400` (`MISSING_REQUIRED_DATA` o `VALIDATION_ERROR`) — reemplazá el body por los campos reales antes de ejecutar.
- Para generar datos de prueba rápido antes de probar Orders/Deliveries: `GET /api/mocks/users/:n` (usuarios de ejemplo sin persistir) o `POST /api/mocks/users/:n` (los guarda en la base, para tener IDs reales que usar en otros endpoints).

---

## Autenticación y autorización

Toda la protección de rutas se apoya en JWT (`passport-jwt`) + un modelo de "rol + dueño del recurso" (ownership), no solo roles fijos. Los tokens viajan en **cookies `httpOnly`**, no en el header `Authorization` — el JWT nunca es accesible desde JavaScript del lado del cliente.

### Login, registro, refresh y logout

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/register` | Registra un usuario nuevo. Ignora cualquier `role` que mande el cliente — siempre queda `customer`. Setea las cookies de sesión y devuelve `{ user }`. |
| POST | `/api/auth/login` | Verifica email + password con bcrypt. Setea las cookies de sesión y devuelve `{ user }`. |
| POST | `/api/auth/refresh` | Lee el `refreshToken` de la cookie, lo rota (invalida el viejo, emite uno nuevo) y renueva el `accessToken`. |
| POST | `/api/auth/logout` | Borra el refresh token de la base y limpia las cookies. |

El `POST /api/users` "genérico" (crear usuarios con cualquier rol, incluido `admin`) quedó reservado para admins autenticados — el alta pública de cuentas es siempre por `/api/auth/register`.

### Login con GitHub (OAuth2)

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/auth/github` | Redirige a GitHub para autenticarse (requiere abrirlo en un navegador real, no funciona desde Postman). |
| GET | `/api/auth/github/callback` | GitHub redirige acá después del login. Busca al usuario por `githubId`; si no existe pero ya hay una cuenta con el mismo email, la enlaza; si no existe ninguna, crea una cuenta nueva con `role: customer` y sin password. Setea las cookies igual que un login normal. |
| GET | `/api/auth/github/failure` | Callback de error si GitHub rechaza la autenticación. |

Requiere una OAuth App creada en GitHub (`Settings → Developer settings → OAuth Apps`), con **Authorization callback URL** apuntando a `http://localhost:8080/api/auth/github/callback` (o el dominio real en producción).

### Cómo autenticarse

Los endpoints de login/register/refresh/GitHub setean automáticamente dos cookies `httpOnly`:

- **`accessToken`** — vive en toda la API (`path: "/"`), dura poco (`JWT_EXPIRES_IN`, default `15m`). Es la que valida `passport-jwt` en cada request protegido.
- **`refreshToken`** — acotada solo a `/api/auth/*` (`path: "/api/auth"`), dura más (`REFRESH_TOKEN_EXPIRES_DAYS`, default `7` días), y se usa únicamente para pedir un `accessToken` nuevo sin volver a loguearse. Se guarda hasheada (SHA-256) en la colección `RefreshToken`, nunca en texto plano — y rota en cada uso: si alguien reusa un refresh token ya gastado, se lo rechaza.

Con Postman: primero hacé login (`POST /api/auth/login`), Postman guarda las cookies solo; los siguientes requests las reenvían automáticamente, siempre que apunten al mismo host/puerto. Con GitHub, el login ocurre en el navegador (no en Postman) — para probar un endpoint protegido en Postman después de loguearte por GitHub hay que copiar el valor de la cookie `accessToken` desde las devtools del navegador, o probar directo en Swagger UI en la misma pestaña donde iniciaste sesión (comparte el cookie jar del navegador).

`src/config/passport.config.js` define la estrategia JWT con un extractor propio que lee `req.cookies.accessToken` (no el header): en cada request, vuelve a buscar el usuario en la base a partir del `id` del token (no confía en el rol que venga codificado ahí) — así un usuario cuyo rol cambió, o que fue borrado, deja de tener acceso en el próximo request sin necesidad de revocar nada manualmente.

Dos middlewares en `src/middlewares/auth.middleware.js`:

- `authenticate` — exige una cookie `accessToken` válida. Si falta o es inválida, `401 UNAUTHORIZED`.
- `authorizeRole([...roles])` — exige que `req.user.role` esté en la lista. Si no, `403 FORBIDDEN`.

El "ownership" (¿sos vos, o el dueño de esto?) no vive en un middleware genérico — se resuelve en cada Service, comparando `req.user._id` contra el dueño real del recurso.

### Matriz de permisos por módulo

| Módulo | Acción | Quién puede |
| --- | --- | --- |
| **Users** | Listar / Crear / Borrar | solo `admin` |
| | Ver uno / Actualizar | el propio usuario, o `admin` (un usuario no puede cambiarse su propio `role`) |
| **Stores** | Ver (listar/uno) | público, sin token |
| | Crear | autenticado, y el `owner` del body tiene que ser vos mismo, o `admin` |
| | Actualizar / Borrar | el dueño de esa tienda, o `admin` |
| **Products** | Ver (listar/uno) | público, sin token |
| | Crear | autenticado, y la `store` del body tiene que ser tuya, o `admin` |
| | Actualizar / Borrar | el dueño de la tienda de ese producto, o `admin` |
| **Orders** | Listar todas | solo `admin` |
| | Ver una | el `customer` dueño del pedido, el dueño de la `store` del pedido, o `admin` |
| | Crear | autenticado, y el `customer` del body tiene que ser vos mismo, o `admin` |
| | Actualizar estado | el dueño de la `store` del pedido, o `admin` (el customer no puede) |
| | Borrar | solo `admin` |
| **Deliveries** | Listar todas / Borrar | solo `admin` |
| | Ver una / Actualizar estado | el `driver` asignado, el dueño de la `store` de esa orden, o `admin` |
| | Crear | el dueño de la `store` de la orden, o `admin` |

### Variables de entorno de auth

```
JWT_SECRET=<string largo y random>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
GITHUB_CLIENT_ID=<client id de tu OAuth App>
GITHUB_CLIENT_SECRET=<client secret de tu OAuth App>
GITHUB_CALLBACK_URL=http://localhost:8080/api/auth/github/callback
```

Solo `JWT_SECRET` es obligatoria — `env.config.js` no arranca la app si falta. El resto son opcionales: `JWT_EXPIRES_IN` (default `15m`) y `REFRESH_TOKEN_EXPIRES_DAYS` (default `7`) tienen su propio default si no las seteás; las tres de GitHub, si no están configuradas, simplemente hacen que la estrategia de GitHub no se registre (`passport.config.js` lo chequea con un `if`) — el resto de la API funciona igual, solo quedan sin usar las rutas `/api/auth/github*`.

---

## Entidades implementadas

### Users (`/api/users`)

| Campo       | Tipo    | Notas                                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------------- |
| firstName   | String  | requerido                                                                          |
| lastName    | String  | requerido                                                                          |
| email       | String  | requerido, único                                                                   |
| password    | String  | requerido **salvo que tenga `githubId`** (cuentas creadas por GitHub OAuth no tienen password local), se guarda hasheado con bcrypt |
| githubId    | String  | opcional, único (`sparse`) — presente solo si la cuenta se creó o se enlazó vía GitHub OAuth |
| role        | String  | enum: `admin`, `customer`, `driver`, `store`, `user`, `owner` — default `customer` |
| isAvailable | Boolean | default `false`                                                                    |
| documents   | `[documentsSchema]` | default `[]` — ver estructura de documento más abajo                 |

**Estructura de un documento** (`src/models/documents.model.js`, compartida entre `User.documents` y `Order.proof`):

| Campo | Tipo | Notas |
| --- | --- | --- |
| originalName | String | requerido — nombre original del archivo subido |
| fileName | String | requerido — nombre generado en disco (`timestamp-random.ext`) |
| path | String | requerido — ruta donde `multer` guardó el archivo |
| mimeType | String | requerido |
| size | Number | requerido, en bytes |
| type | String | requerido — uno de `DOCUMENT_TYPES`: `user_document`, `driver_license`, `delivery_proof` |
| uploadedAt | Date | default `Date.now` |

Subida vía `POST /api/users/:uid/document` (`multipart/form-data`, campo `document`) — el propio usuario o un admin. Si `type` es `driver_license`, el usuario destino tiene que tener `role: "driver"`, si no, `403 FORBIDDEN`.

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
| store       | ObjectId → Store | requerido — solo el dueño de esa tienda (o admin) puede crear/editar/borrar el producto |

### Orders (`/api/orders`)

| Campo           | Tipo                             | Notas                                                                                                           |
| --------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| customer        | ObjectId → User                  | requerido                                                                                                       |
| store           | ObjectId → Store                 | requerido                                                                                                       |
| items           | `[{ product, quantity, price }]` | requerido, al menos 1 item — `price` se recalcula del lado del servidor con el precio real del producto         |
| deliveryAddress | String                           | requerido                                                                                                       |
| total           | Number                           | calculado automáticamente por el servidor (`Σ price real * quantity`), ignora el `price` enviado por el cliente |
| status          | String                           | enum: `created`, `assigned`, `picked_up`, `in_transit`, `delivered`, `cancelled` — default `created`            |
| priority        | String                           | enum de `DELIVERY_PRIORITY` — default `normal`                                                                  |
| proof           | `[documentsSchema]`              | default `[]` — comprobantes de entrega (ver estructura de documento en la sección de Users)                     |

Al crear un pedido, el servicio valida que cada producto exista y tenga stock suficiente, y descuenta el stock vendido del producto correspondiente. El comprobante de entrega se sube por separado, vía `POST /api/orders/:oid/proof` (`multipart/form-data`, campo `proof`) — solo el dueño de la tienda del pedido, o un admin; el `type` queda fijo en `delivery_proof`, no lo elige quien sube el archivo.

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
- **ORDER_STATUS**: `created`, `assigned`, `picked_up`, `in_transit`, `delivered`, `cancelled`
- **DELIVERY_PRIORITY**: `low`, `normal`, `high`
- **DOCUMENT_TYPES**: `user_document`, `driver_license`, `delivery_proof`

---

## Endpoints

### Auth — `/api/auth`

| Método | Ruta               | Descripción                              |
| ------ | ------------------ | ----------------------------------------- |
| POST   | `/register`        | Registrar usuario nuevo (rol forzado a `customer`) |
| POST   | `/login`           | Login con email + password                |
| POST   | `/refresh`         | Renovar el access token (rota el refresh) |
| POST   | `/logout`          | Cerrar sesión, invalidar el refresh token |
| GET    | `/github`          | Iniciar login con GitHub (redirect)       |
| GET    | `/github/callback` | Callback de GitHub tras el login          |
| GET    | `/github/failure`  | Callback de error de GitHub               |

### Users — `/api/users`

| Método | Ruta               | Descripción                        |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/`                | Listar usuarios                    |
| GET    | `/:uid`            | Obtener usuario por ID             |
| POST   | `/`                | Crear usuario                      |
| PUT    | `/:uid`            | Actualizar usuario                 |
| DELETE | `/:uid`            | Eliminar usuario                   |
| POST   | `/:uid/document`   | Subir un documento al perfil (`multipart/form-data`, campo `document`) |

### Stores — `/api/stores`

Mismos verbos que Users, con `:sid`.

### Products — `/api/products`

Mismos verbos que Users, con `:pid`.

### Orders — `/api/orders`

| Método | Ruta           | Descripción                  |
| ------ | -------------- | ----------------------------- |
| GET    | `/`            | Listar pedidos               |
| GET    | `/:oid`        | Obtener pedido por ID        |
| POST   | `/`            | Crear pedido                 |
| PUT    | `/:oid/status` | Actualizar estado del pedido |
| DELETE | `/:oid`        | Eliminar pedido              |
| POST   | `/:oid/proof`  | Subir comprobante de entrega (`multipart/form-data`, campo `proof`) |

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

`n` debe ser un entero positivo — un valor no numérico, negativo o cero devuelve `400 INVALID_INPUT`.

### Utilitarios

- `GET /` — status de la API
- `GET /health` — healthcheck: además de `status`/`message`, devuelve `environment` (`env.nodeEnv`), `uptime` (segundos desde que arrancó el proceso) y `timestamp` (ISO 8601 del servidor)
- `GET /api/docs` — documentación interactiva (Swagger UI)
- `GET /api/loggerTest` — dispara un log de cada nivel (debug/http/info/warn/error/fatal) para probar Winston

---

## Variables de entorno

Crear un archivo `.env` en la raíz (ver `.env.example`):

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development
JWT_SECRET=<string largo y random>

# opcionales — ver detalle en "Autenticación y autorización"
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:8080/api/auth/github/callback
```

`PORT`, `MONGODB_URI`, `NODE_ENV` y `JWT_SECRET` son obligatorias: la app no arranca si falta alguna (`env.config.js` valida esto al inicio). El resto son opcionales, con sus propios defaults o comportamiento condicional.

---

## Instalación y ejecución

```bash
npm install

# modo desarrollo (con nodemon)
npm run dev

# modo producción
npm start
```

Con el servidor corriendo, la documentación interactiva queda disponible en `http://localhost:8080/api/docs` (ver sección [Documentación interactiva (Swagger)](#documentación-interactiva-swagger)).

---

## Docker

```bash
docker build -t shipnow-api .
docker run -d -p 8080:8080 --env-file .env shipnow-api
```

El `dockerfile` usa `node:22-alpine`, copia `package*.json` primero para aprovechar la cache de capas, instala dependencias, copia el resto del código y corre `npm start` (no `npm run dev` — dentro de un contenedor ya construido no tiene sentido correr `nodemon`, no hay archivos que vayan a cambiar en caliente).

El `.dockerignore` excluye `node_modules`, `.git`, `test/`, `uploads/`, los `.env*` y los logs — la imagen no necesita nada de eso para correr. La base de datos sigue siendo MongoDB Atlas (no hay un contenedor de Mongo local), así que alcanza con un solo contenedor — no hace falta `docker-compose`.

---

## Testing

La suite de tests funcionales vive en `test/*.test.js` y corre con **Mocha** + **Chai** (aserciones) + **Supertest** (peticiones HTTP contra la app de Express, sin necesidad de abrir un puerto real — se usa `src/app.js` directamente).

### Entorno de testing separado

Los tests corren contra su propio archivo de variables de entorno, `.env.test`, con una base de MongoDB **distinta** a la de desarrollo (mismo cluster, base separada por nombre) para no pisar datos reales:

```
PORT=8080
MONGODB_URI=mongodb+srv://.../backendIII_test
NODE_ENV=test
```

### Cómo correr los tests

```bash
npm test
```

El script (`node --env-file=.env.test node_modules/.bin/mocha`) carga esas variables de entorno antes de arrancar Mocha, que a su vez lee su configuración desde `.mocharc.json` (patrón de archivos, timeout y `require` del setup global).

### Conexión y limpieza de la base de test

`test/setup.js` define un **root hook plugin** (`mochaHooks`) que conecta a Mongo una sola vez antes de toda la suite y hace `dropDatabase()` + `disconnect()` al finalizar, para que cada corrida de `npm test` arranque desde una base vacía. Cada archivo de test que crea datos propios (por ejemplo `orders.test.js`, que arma un usuario + comercio + producto de prueba) además limpia esos registros puntuales en su propio `after()`, apenas termina ese módulo — no dependen de la limpieza global para no dejar basura entre archivos.

### Qué cubre cada archivo

| Archivo                    | Cubre                                                                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test/utils.test.js`      | `GET /`, `GET /health`, `GET /api/docs` (redirect + Swagger UI), `GET /api/loggerTest`, y una ruta inexistente (`404 ROUTE_NOT_FOUND`)                                                            |
| `test/auth.test.js`       | Registro, login (credenciales inválidas incluidas), refresh (con rotación del refresh token), logout — validando que las cookies `accessToken`/`refreshToken` se seteen y limpien correctamente  |
| `test/users.test.js`      | CRUD de usuarios con auth: creación admin-only, ver/editar propio perfil vs ajeno (403), carga de documentos (con la regla de `driver_license` solo para `driver`), 404, ID inválido — incluye la verificación de que el `password` nunca se expone en la respuesta |
| `test/stores.test.js`     | Creación (con ownership), listado/detalle público, actualización/borrado solo por el dueño o admin                                                                                                |
| `test/products.test.js`   | Creación ligada a una `store` (con ownership), listado/detalle público, actualización/borrado solo por el dueño de la tienda o admin                                                             |
| `test/orders.test.js`     | Creación (con ownership del `customer`, precio/stock recalculados del lado del servidor), listado admin-only, detalle (customer/store dueños o admin), actualización de estado (solo store dueña), carga de comprobante de entrega |
| `test/deliveries.test.js` | Creación por el dueño de la tienda de la orden, detalle/actualización por el `driver` asignado o la tienda dueña, listado/borrado admin-only                                                      |
| `test/mock.test.js`       | Los 5 generadores de datos mock, guardado real de usuarios mock en la base, y cantidades inválidas de `n` (no numérico, negativo)                                                                 |

Como la autenticación viaja en cookies, los tests que necesitan simular un usuario logueado arman el token con `generateToken(...)` (mismo helper que usa el login real) y lo adjuntan a mano con `.set("Cookie", \`accessToken=${token}\`)` — no hace falta pasar por el flujo completo de login en cada test.

Todos los casos de error verifican tanto el status HTTP como el formato de error definido en `errors.dictionary.js` (`{ status: "error", error: "<CODIGO>", message: "..." }`), incluyendo los casos de `401 UNAUTHORIZED` y `403 FORBIDDEN` de cada endpoint protegido.

---

## Estado del proyecto / próximos pasos

- Los mocks (`/api/mocks`) están pensados solo para poblar datos de prueba en desarrollo; se desactivan automáticamente si `NODE_ENV` no es `development`.

---

## Autor

Carlos Martín Pachecoy
