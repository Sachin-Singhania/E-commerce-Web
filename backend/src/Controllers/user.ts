import { NextFunction, Request, Response } from "express";
import { UserModel } from "../Models/user.js";
import { trycatch } from "../Middlewares/error.js";
import { requestuserbody } from "../Types/types.js";
import errorhandler from "../Utils/utility-class.js";
import { HttpStatusCode } from '../Types/types.js';

export const newuser = trycatch(
    async (req: Request<{}, {}, requestuserbody>, res: Response, next: NextFunction) => {
        const { name, _id, photo, email, gender, dob, } = req.body;
        let user = await UserModel.findById(_id);

        if (user) {
            return res.status(HttpStatusCode.OK).json({ message: `Welcome back,${name}!` });
        }

        if (!_id || !name || !email || !photo || !gender || !dob) {
            next(new errorhandler("Invalid input", HttpStatusCode.BAD_REQUEST));
        }

        user = await UserModel.create({
            name, _id, photo, email, gender, dob: new Date(dob),
        });

        return res.status(HttpStatusCode.CREATED).json({ success: true, message: `${user.name} welcome` });
    }
);

export const getallusers = trycatch(async (req, res, next) => {
    const users = await UserModel.find({});
    return res.status(HttpStatusCode.OK).send({user:users});
});

export const user = trycatch(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new errorhandler('No such user', HttpStatusCode.NOT_FOUND));
    }

    return res.status(HttpStatusCode.OK).send({user});
});
export const deluser = trycatch(async (req, res, next) => {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new errorhandler('No such user', HttpStatusCode.NOT_FOUND));
    }

    return res.status(HttpStatusCode.OK).send("user  has been deleted");
});
