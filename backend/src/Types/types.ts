import { NextFunction, Request, Response } from "express";

export interface requestuserbody{
name: String;
_id:string;
photo:string;
email:string;
gender:string;
dob : Date;
}
export interface reqproduct{
name: String;
price:number;
stock:number;
category:string;
}
export interface searchreq{
  search?:string;
  price?:string;
  category?:string;
  sort?:string;
  page?:string;
}
export  interface orderitem{
  name:string;
  photo:string;
  price:string;
  quantity:number;
  productid:string;
}
export  interface shippingtype{
  state:string;
  country:string;
  pincode:number;
  address:string;
  city:string;
}
export interface neworderprops{
shippingInfo:shippingtype;
user:string;
subtotal:number;
tax:number;
total:number;
discount:number;
shippingcharge:number;
orderitems:orderitem[];
}
export interface basequery{
  name?:{
    $regex:string;
    $options:"i" ;
  };
  price?: { $lte:number} ;
  category?:string;
}
export type invalidatecachetype={
product?:boolean,
order?:boolean,
admin?:boolean,
userid?:string,
orderid?:string,
productId?:string | string[],
}
export type controllertype=(
req:Request,
res:Response,
next:NextFunction
)=> Promise<void | Response<any, Record<string, any>>>;//void as the new user post route is returning the next in catch(check controller user)
// Define a TypeScript type for commonly used HTTP status codes with descriptions
// Define a TypeScript interface for commonly used HTTP status codes with descriptions
// Define a TypeScript interface for commonly used HTTP status codes with descriptions
export const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  };
  
  export type HttpStatusCode = keyof typeof HttpStatusCode;
  
  