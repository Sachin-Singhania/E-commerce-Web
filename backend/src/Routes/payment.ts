import express from "express"
import { Admin } from "../Middlewares/auth.js";
import { allcoupon, couponapplied, delcoupon, newcoupon, newpayment } from "../Controllers/payment.js";
 const app= express.Router();


 app.post("/newpay",newpayment);
 // /api/v1/payment/coupon/new
 app.post("/coupon/new",Admin,newcoupon);
 // /api/v1/payment/coupon/apply
 app.get("/coupon/apply",couponapplied);
 app.delete("/coupon/del/:id",Admin,delcoupon);
 app.get("/coupon/all",Admin,allcoupon);
 
 export default app;