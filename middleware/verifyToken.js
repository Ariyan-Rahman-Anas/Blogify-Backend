import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/responseHandler.js"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) {
        return errorHandler(req, "Access token not provided", {}, 403 );
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
              return errorHandler(
                res,
                "Access token expired",
                {
                  expiredAt: err.expiredAt,
                },
                401
              );
            } else {
                return errorHandler(res, "Invalid access token", {}, 401);
            }
        }
        req.user = decoded
        next();
    });
}