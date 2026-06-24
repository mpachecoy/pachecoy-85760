import { Router } from "express";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import StoreModel from "../models/store.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("customer").populate("store");
    res.json({ status: "success", payload: orders });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:oid", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.oid)
      .populate("customer")
      .populate("store");

    if (!order) {
      return res.status(404).json({ status: "error", message: "Pedido no encontrado" });
    }

    res.json({ status: "success", payload: order });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { customer, store, items, deliveryAddress, priority } = req.body;

    if (!customer || !store || !items || !deliveryAddress) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "El pedido debe tener al menos un producto"
      });
    }

    const customerFound = await UserModel.findById(customer);

    if (!customerFound) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    const storeFound = await StoreModel.findById(store);

    if (!storeFound) {
      return res.status(404).json({
        status: "error",
        message: "Comercio no encontrado"
      });
    }

    const total = items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );

    const order = await OrderModel.create({
      customer,
      store,
      items,
      deliveryAddress,
      priority,
      total
    });

    res.status(201).json({ status: "success", payload: order });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:oid/status", async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.oid,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ status: "error", message: "Pedido no encontrado" });
    }

    res.json({ status: "success", payload: order });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:oid", async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.oid);

    if (!order) {
      return res.status(404).json({ status: "error", message: "Pedido no encontrado" });
    }

    res.json({ status: "success", payload: order });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

export default router;
