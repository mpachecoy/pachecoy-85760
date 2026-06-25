import mongoose from "mongoose";
import { DELIVERY_PRIORITY, ORDER_STATUS } from "../constants/index.constants.js";

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: [ORDER_STATUS.CREATED, ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
      default: ORDER_STATUS.CREATED
    },
    priority: {
      type: String,
      enum: [DELIVERY_PRIORITY.LOW, DELIVERY_PRIORITY.NORMAL, DELIVERY_PRIORITY.HIGH],
      default: DELIVERY_PRIORITY.NORMAL
    },
    assignedAt: {
      type: Date
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const DeliveryModel = mongoose.model("Delivery", deliverySchema);

export default DeliveryModel;
