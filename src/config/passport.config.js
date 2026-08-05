import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { env } from "../config/env.config.js";
import { UserRepository } from "../repositories/users.repository.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecret
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await UserRepository.getById(payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
});

passport.use("jwt", jwtStrategy);

export default passport;
