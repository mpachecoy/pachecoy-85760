import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.config.js";

const PORT = env.port;
const NODE_ENV = env.nodeEnv;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT} en modo ${NODE_ENV}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
