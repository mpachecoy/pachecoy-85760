Backend III - API REST para Gestión de Pedidos y Entregas

Descripción

API REST desarrollada con Node.js, Express y MongoDB siguiendo una arquitectura por capas para la gestión de usuarios, tiendas, productos, pedidos y entregas.

La aplicación permite administrar el ciclo completo de compra y distribución de productos, desde la creación de productos y pedidos hasta la asignación y seguimiento de entregas.

⸻

Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Passport
- bcrypt
- dotenv

⸻

Arquitectura del proyecto

El proyecto implementa una arquitectura por capas para garantizar una correcta separación de responsabilidades.

Flujo de ejecución

Routes
↓
Controllers
↓
Services
↓
Repositories
↓
MongoDB

Responsabilidades

Routes

Definen los endpoints disponibles y derivan las solicitudes al controlador correspondiente.

Controllers

Reciben las peticiones HTTP, extraen parámetros y delegan la lógica al Service.

Services

Contienen la lógica de negocio, validaciones y reglas de la aplicación.

Repositories

Encapsulan el acceso a los datos y la interacción con MongoDB mediante Mongoose.

Models

Definen la estructura de los documentos almacenados en la base de datos.

⸻

Justificación técnica de la separación de capas

La incorporación de la capa Repository permite:

- Separar la lógica de negocio de la persistencia de datos.
- Reducir el acoplamiento entre Services y MongoDB.
- Facilitar el mantenimiento del código.
- Mejorar la reutilización de componentes.
- Simplificar las pruebas unitarias.
- Permitir cambios futuros en la tecnología de persistencia sin modificar Controllers ni Services.

⸻

Entidades implementadas

Users

Representa los usuarios del sistema.

Campos principales:

- first_name
- last_name
- email
- password
- role
- documentType
- documentNumber

Roles disponibles:

- admin
- customer
- driver
- store
- user

⸻

Stores

Representa los comercios registrados.

Campos principales:

- name
- owner
- address
- phone
- email

Relaciones:

- owner → User

⸻

Products

Representa los productos ofrecidos por los comercios.

Campos principales:

- title
- description
- price
- stock
- category
- store

Relaciones:

- store → Store

Funcionalidades:

- Crear producto
- Consultar productos
- Actualizar producto
- Eliminar producto

⸻

Orders

Representa los pedidos realizados por los clientes.

Campos principales:

- customer
- store
- products
- total
- status

Relaciones:

- customer → User
- store → Store
- products → Product

Estados posibles:

- pending
- confirmed
- preparing
- delivered
- cancelled

⸻

Deliveries

Representa las entregas asociadas a los pedidos.

Campos principales:

- order
- driver
- status
- priority
- assignedAt
- deliveredAt

Relaciones:

- order → Order
- driver → User

Prioridades:

- low
- medium
- high

Estados:

- pending
- assigned
- delivered

⸻

Variables de entorno

Crear un archivo .env con las siguientes variables:

MONGO_URL=
JWT_SECRET=
PORT=

⸻

Instalación

npm install

Ejecución

Modo desarrollo:

npm run dev

Modo producción:

npm start

⸻

Autor

Carlos Martin Pachecoy
