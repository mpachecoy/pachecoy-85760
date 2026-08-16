import mongoose from "mongoose";
import { USER_ROLES } from "../constants/index.constants.js";

const documentsSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    //Declara que tipo de archivo es para nosotros
    type: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false,
    timestamps: true
  }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.STORE, USER_ROLES.USER, USER_ROLES.OWNER],
      default: USER_ROLES.CUSTOMER
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    documents: {
      type: [documentsSchema],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
