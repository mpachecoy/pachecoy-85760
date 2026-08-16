import multer from "multer";
import { DOCUMENT_TYPES } from "../constants/index.constants.js";
import { createError } from "../utils/api.response.js";
import path from "path";

const allowedFiles = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"];
const maxFileSize = 5 * 1024 * 1024;


const getDestination = (req) => {
    const documentType = req.body?.type;

    if (documentType === DOCUMENT_TYPES.DELIVERY_PROOF || req.originalUrl.includes("/proof")) {
        return "uploads/proofs";
    }
    if (documentType === DOCUMENT_TYPES.DRIVER_LICENSE) {
        return "uploads/licenses"
    }
    return "uploads/documents"
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getDestination(req));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedFiles.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(createError("INVALID_FILE_TYPE"));
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: maxFileSize
    },
    fileFilter
});

export default upload;