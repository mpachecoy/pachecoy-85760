import mongoose from "mongoose";

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
      enum: ["created", "assigned", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "created"
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal"
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
