import { RequestHandler } from "express";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";

export type SessionUser = (typeof auth.$Infer.Session)["user"];

declare global {
    namespace Express {
        interface Locals {
            user: SessionUser;
        }
    }
}

export const requireAuth: RequestHandler = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
        return res.status(401).json({
            error: "Não autorizado",
        });
    }

    res.locals.user = session.user;

    next();
};