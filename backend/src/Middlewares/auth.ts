import { UserModel } from "../Models/user.js";
import { HttpStatusCode } from "../Types/types.js";
import errorhandler from "../Utils/utility-class.js";
import { trycatch } from "./error.js";

export const Admin = trycatch(
    async (req, res, next) => {
        const { id } = req.query;
        if (!id) return next(new errorhandler("Not logged in", HttpStatusCode.NOT_FOUND));
        const user = await UserModel.findById(id);
        if (!user) {
            return next(new errorhandler(`User with id ${id} not found`, HttpStatusCode.NOT_FOUND))
        }
        if (user.role !== 'admin') {
            return next(new errorhandler('You are not authorized to perform this action', HttpStatusCode.UNAUTHORIZED))
        }
        next();
    }
)