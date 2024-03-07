import express from 'express';
import userroute from './Routes/user.js';
import productroute from './Routes/product.js';
import orderroute from './Routes/order.js';
import paymentroute from './Routes/payment.js';
import dashboardroute from './Routes/stats.js';
import { connectDB } from './Utils/feature.js';
import { errorMiddleware } from './Middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from "cors";
config({
    path: `./.env`
});
const port= process.env.PORT || 3000;
const stripekey=  process.env.STRIPE_KEY || "";
connectDB();

export const stripe= new Stripe(stripekey)
export const Nodecache = new NodeCache()
const app = express();
app.use(express.json())
app.use(morgan('dev'));
app.use(cors());

app.use("/api/v1/user",userroute);
app.use("/api/v1/product",productroute);
app.use("/api/v1/order",orderroute);
app.use("/api/v1/payment",paymentroute);
app.use("/api/v1/dashboard",dashboardroute);
app.use("/uploads",express.static("uploads"))
app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`express is running on ${port}`);
})
app.get("/",function(req,res,next){
    res.send("Hello World");
})
