import winston from "winston";
import { env } from "../config/env.config.js";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        debug: "blue",
        http: "green",
        info: "cyan",
        warn: "yellow",
        error: "red",
        fatal: "magenta"
    }
};

winston.addColors(customLevels.colors);

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack, ...metaData }) => {
        const hsMetadata = Object.keys(metaData).length;
        const metadataText = hsMetadata ? `\n${JSON.stringify(metaData, null, 2)}` : "";
        return `${timestamp} ${level}: ${message}${metadataText}`;
    })
);

const logLevel = env.nodeEnv === "development" ? "debug" : "info";

const consoleTransport = new winston.transports.Console({
    level: logLevel,
    format: consoleFormat,
});

const errorRotateTransport = new DailyRotateFile({
    filename: "error.%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20mb",
    maxFiles: "30d",
    level: "error",
    format: logFormat,
});

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: logLevel,
    format: logFormat,
    transports: [consoleTransport, errorRotateTransport]
});

export default logger;