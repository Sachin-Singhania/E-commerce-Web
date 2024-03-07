import { NextFunction, Request, Response } from "express"
import errorhandler from "../Utils/utility-class.js"
import { controllertype } from "../Types/types.js";

export const errorMiddleware=(err:errorhandler,req:Request,res:Response,next:NextFunction)=>{
    err.message||="ERROR SERVER";
    err.statusCode||=500;
    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}
export const trycatch=(func:controllertype)=>(req:Request,
    res:Response,
    next:NextFunction)=>{
        return Promise.resolve(func(req,res,next)).catch(next);
    };