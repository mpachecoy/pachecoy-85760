import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "../config/env.config.js";
import { UserRepository } from "../repositories/users.repository.js";
import UserModel from "../models/user.model.js";
import { USER_ROLES } from "../constants/index.constants.js";


const cookieExtractor = (req) => {
    if (req && req.cookies) {
        return req.cookies.accessToken || null;
    }
    return null;
}

const options = {
    jwtFromRequest: cookieExtractor,
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

if (env.githubClientId && env.githubClientSecret) {
    passport.use("github", new GitHubStrategy(
        {
            clientID: env.githubClientId,
            clientSecret: env.githubClientSecret,
            callbackURL: env.githubCallbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await UserModel.findOne({ githubId: profile.id });
                if (!user) {
                    const email = profile.emails?.[0]?.value || `${profile.username}@users.noreply.github.com`;
                    user = await UserModel.findOne({ email });
                    if (user) {
                        user.githubId = profile.id;
                        await user.save();
                    } else {
                        const [firstName, ...lastNameParts] = (profile.displayName || profile.username).split(" ");
                        const lastName = lastNameParts.join(" ") || "GitHub";

                        user = await UserModel.create({
                            firstName: firstName || profile.username,
                            lastName,
                            email,
                            githubId: profile.id,
                            role: USER_ROLES.CUSTOMER
                        });
                    }
                }
                const sanitizeUser = user.toObject();
                delete sanitizeUser.password;
                return done(null, sanitizeUser);
            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

export default passport;
