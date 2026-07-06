import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import deliveriesRouter from "./routes/deliveries.router.js";
import productsRouter from "./routes/products.router.js";
import mockRouter from "./routes/mock.router.js";
import { errorHandler, notFoundHandler } from "./middelwares/error.middleware.js";
import { env } from "./config/env.config.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ShipNow API"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "API funcionando"
  });
});

app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/deliveries", deliveriesRouter);
app.use("/api/products", productsRouter);

if (env.nodeEnv === "development") {
  app.use("/api/mocks", mockRouter);
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
