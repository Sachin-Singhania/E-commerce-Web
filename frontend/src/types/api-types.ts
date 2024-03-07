import { Bar, Line, Pie, Stats, cartitems, orders, shippingtype } from "./reducers-types";
import { Product, user } from "./types";

export interface message{
    success:boolean;
    message:string;
}
export interface userresponse{
    success:boolean;
    user:user;
}
export interface alluser{
    success:boolean;
    user:user[];
}
export interface allproductresponse{
    success:boolean;
    product:Product[];
}
export interface searchproductsres{
    success:boolean;
    product:Product[];
    totalpage:number;
}
export interface searchproductsreq{
    price:number;
     page:number;
     category?:string;
     search:string;
     sort:string;
}
export interface categoriesres{
    success:boolean;
    categories:string[];
}
export interface orderres{
    success:boolean;
    orders:orders[];
}
export type StatsResponse = {
    success: boolean;
    stats: Stats;
  };
  
  export type PieResponse = {
    success: boolean;
    charts: Pie;
  };
  
  export type BarResponse = {
    success: boolean;
    charts: Bar;
  };
  
  export type LineResponse = {
    success: boolean;
    charts: Line;
  };
export interface orderdetail{
    success:boolean;
    orders:orders;
}
export interface updateorder{
    userid:string;
    orderid:string;
}
export interface deluser{
    userid:string;
    adminid:string;
}
export interface newproductreq{
    id:string;
    formData:FormData;
}
export interface customerror{
    status:number;
    data:{
        message:string;
        success:boolean;
    }
}
export interface ProductResponse{
    success:boolean;
    product:Product | null;
}
export interface UpdateProductRequest{
    userid:string;
    productid:string;
    formData:FormData;
}
export interface DeleteProductRequest{
    userId:string;
    productId:string;
}
export interface ordertype{
    shippingInfo:shippingtype;
    subtotal:number;
    tax:number;
    total:number;
    discount:number;
    shippingcharge:number;
    user:string;
    orderitems: cartitems[];
}