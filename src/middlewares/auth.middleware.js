import passport from "../config/passport.config.js";
import { createError } from "../utils/api.response.js";

export const authenticate = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (error, user) => {
        if (error) return next(error);
        if (!user) return next(createError("UNAUTHORIZED"));
        req.user = user;
        next();
    })(req, res, next);
};

export const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(createError("FORBIDDEN"));
    }
    next();
};