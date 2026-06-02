import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import userSrv, { UserExistsError } from "../user/user.service";
import { omit, pick } from "lodash";
import passport from "passport";
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";
import jwt from 'jsonwebtoken';

export const add = async (
    req: TypedRequest<AddUserDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const userData = omit(req.body, 'email', 'password');
        const credentialsData = pick(req.body, 'email', 'password');
        const newUser = await userSrv.add(userData, credentialsData);
        res.status(201).json(newUser);
    } catch(err) {
        if (err instanceof UserExistsError) {
            res.status(400).json({
                error: err.name,
                message: err.message
            });
        } else {
            next(err);
        }
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate('local', { session: false },
        async (loginErr, user, info) => {
            try {
                if (loginErr) return next(loginErr);

                if (!user) {
                    return res.status(400).json({
                        error: 'LoginError',
                        message: info.message
                    });
                }

                const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7 days' });

                res.status(200).json({
                    user,
                    token
                });
            } catch(err) {
                next(err);
            }
        }
    )(req, res, next);
};
