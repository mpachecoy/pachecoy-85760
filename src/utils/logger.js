import winston from "winston";
import { env } from "../config/env.config.js";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5
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

const consoleTransport = new winston.transports.Console({
    level: env.nodeEnv === "development" ? "info" : "debug",
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
    level: env.nodeEnv === "development" ? "info" : "debug",
    format: logFormat,
    transports: [consoleTransport, errorRotateTransport]
});

if (env.nodeEnv === "development") {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

export default logger;