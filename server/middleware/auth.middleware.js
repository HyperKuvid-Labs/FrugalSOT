import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

const jwt_secret = process.env.JWT_SECRET | "defaultSecret";

export const authMiddleware = (req, res, next) => {
    const authHeader = res.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, jwt_secret, (err, user) => {
            if(err){
                return res.status(403).json({ message: "Token invalid" });
            }
            req.user = user;
            next();
        })
    }else{
        res.status(401).json({ message: "Access Denied." });
    }
}