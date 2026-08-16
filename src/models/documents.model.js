import mongoose from "mongoose";

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

export default documentsSchema;