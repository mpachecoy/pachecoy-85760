import { Router } from "express";
import { register, logout, refresh, login, githubCallback, githubFailure } from "../controllers/auth.controller.js";
import passport from "passport";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/api/auth/github/failure", session: false }), githubCallback);
router.get("/github/failure", githubFailure);

export default router;
