import { NextFunction, Request, Response } from "express";
import { trycatch } from "../Middlewares/error.js";
import { HttpStatusCode, neworderprops } from "../Types/types.js";
import { Order } from "../Models/order.js";
import { invalidateCache, reducestock } from "../Utils/feature.js";
import { Nodecache } from "../app.js";

export const neworder=trycatch(
    async(  req:Request<{},{},neworderprops>,res:Response,next:NextFunction)=>{
        const {discount,shippingcharge,shippingInfo,subtotal,tax,total,user,orderitems}= req.body;
        if( !user || !discount || !shippingcharge||!shippingInfo||!subtotal ||!tax||!total || !orderitems ){
            return res.status(HttpStatusCode.BAD_GATEWAY).json({message:"Missing data"});
        }
        const order=await  Order.create({
            discount,shippingcharge,shippingInfo,subtotal,tax,total,user,orderitems
        });
        await reducestock(orderitems)
        invalidateCache({
            product: true,
            order: true,
            admin: true,
            userid: user,
            productId: order.orderitems.map((i) => String(i.productId)),
          });
      

        return res.status(HttpStatusCode.CREATED).json({message:"Product Created",order});
})
export const processorder=trycatch(
    async(  req,res,next)=>{
        const {id} =req.params;
        const order= await Order.findById(id);
        if(!order)
            return res.status(HttpStatusCode.NOT_FOUND).json({message:`Order with id ${id} not found`})
        switch (order.status) {
            case "Processing":
                 order.status="Shipped"
                break;
             case "Shipped":
                 order.status="Delivered"
                  break;
            default:
                  order.status="Delivered"
                  break;
        }
         await order.save();
         await invalidateCache({admin:true,order:true,product:false,userid:order.user,orderid:String(order._id)});

        return res.status(HttpStatusCode.OK).json({message:"Data processed",order});
})
export const delorder=trycatch(
    async(  req,res,next)=>{
        const {id} =req.params;
        const order= await Order.findById(id);
        if(!order)
            return res.status(HttpStatusCode.NOT_FOUND).json({message:`Order with id ${id} not found`})
         await order.deleteOne();
          await invalidateCache({admin:true,order:true,product:false,userid:order.user,orderid:String(order._id)});
        return res.status(HttpStatusCode.OK).json({message:"hogya del",order});
})
export const myorder=trycatch(
    async(  req,res,next)=>{
        const {id:user}= req.query;
        let orders=[]
        if(Nodecache.has(`my-order-${user}`)){
            orders=JSON.parse(Nodecache.get(`my-order-${user}`) as string);
        }
        else{
             orders = await Order.find({user});
             Nodecache.set(`my-order-${user}`, JSON.stringify(orders));
        }   

        return res.status(HttpStatusCode.OK).json({ message:'success',orders:orders});
})
export const allorder=trycatch(
    async(  req,res,next)=>{
        const key=`all-order`
        let orders=[]
        if(Nodecache.has(key)) orders=JSON.parse(Nodecache.get(key) as string);
        else{
             orders = await Order.find().populate("user","name");
             Nodecache.set(key, JSON.stringify(orders));
        }   
        return res.status(HttpStatusCode.OK).json({ message:'success',orders:orders});
})
export const getsingleorder=trycatch(
    async(  req,res,next)=>{
        const {id}=req.params;

        const key=`order-${id}`
        let orders;
        if(Nodecache.has(key)) {
            orders=JSON.parse(Nodecache.get(key) as string);
        }
        else{
             orders = await Order.findById(id).populate('user','name');                
             Nodecache.set(key, JSON.stringify(orders));
        }   
        return res.status(HttpStatusCode.OK).json({ message:'success',orders:orders});
})