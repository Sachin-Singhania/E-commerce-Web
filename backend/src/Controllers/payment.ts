import { webcrypto } from "crypto";
import { trycatch } from "../Middlewares/error.js";
import { Couponmodel } from "../Models/coupon.js";
import { HttpStatusCode } from "../Types/types.js";
import errorhandler from "../Utils/utility-class.js";
import { stripe } from "../app.js";

export const newpayment=trycatch(async(req,res,next)=>{
        const { amount}= req.body;
        if(!amount)
        return next(new errorhandler("Please enter amount",HttpStatusCode.BAD_GATEWAY));

        const payment= await stripe.paymentIntents.create({
            amount:Number(amount)*100,
            currency:"inr",
        });
    
    return  res.status(HttpStatusCode.CREATED).json({success:true,clientSecret:payment.client_secret});
    }
)
export const newcoupon= trycatch(
    async (req, res,next) => {
        const {code, amount}= req.body;
        if(!code || !amount)
        return next(new errorhandler("Please provide all the details",HttpStatusCode.BAD_GATEWAY));

    const  newcoupon = await Couponmodel.create({ code , amount});
    
    return  res.status(HttpStatusCode.CREATED).json({message: `new coupon ${newcoupon.code} has been created`});
    }
)
export const couponapplied= trycatch(
    async (req, res,next) => {
        const {coupon}= req.query;
        const appliedCoupon =await Couponmodel.findOne({code:coupon});
        if(!appliedCoupon)
            return next({status:400 , message:"Coupon not found"})
        
        return  res.status(HttpStatusCode.CREATED).json({message: `${coupon} has been applied`,appliedCoupon});
    }
)
export const allcoupon= trycatch(
    async (req, res,next) => {
        const all =await Couponmodel.find({});
        return  res.status(HttpStatusCode.CREATED).json({all});
    }
)
export const delcoupon= trycatch(
    async (req, res,next) => {
        const {id}= req.params;
        const coupon = await Couponmodel.findByIdAndDelete(id);

        if (!coupon) return next(new errorhandler("Invalid Coupon ID", 400));
        
        return  res.status(HttpStatusCode.CREATED).json({message: `${coupon.code} has been deleted`});
    }
)