import app from "./app.js";
import connectDB from "./config/db.config.js";
import { env } from "./config/env.config.js";
import logger from "./utils/logger.js";

const PORT = env.port;
const NODE_ENV = env.nodeEnv;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      // console.log(`Servidor escuchando en el puerto ${PORT} en modo ${NODE_ENV}`);
      logger.info(`Servidor corriendo en http://localhost:${PORT} en modo ${NODE_ENV}`);
    });
  } catch (error) {
    // console.error(`Error al iniciar el servidor: ${error.message}`);
    logger.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
