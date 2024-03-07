import { Product, user } from "./types";

export interface userreducertype {
    user: user | null;
    loading: boolean;
  }
export interface cartreducertype {
  shippingInfo:shippingtype;
  subtotal:number;
  tax:number;
  total:number;
  discount:number;
  shippingcharge:number;
  cartitems: cartitems[];
  loading: boolean;
  }
  export  interface shippingtype{
    state:string;
    country:string;
    pincode:string;
    address:string;
    city:string;
  }
  export  interface cartitems{
    name:string;
    photo:string;
    price:number;
    quantity:number;
    productid:string;
    stock:number;
  }
  export type OrderItems = Omit<cartitems, "stock">  & { _id: string };
export interface productreducertype {
    product: Product[] | null;
    loading: boolean;
  }

  export type orders={
    orderitems:OrderItems[];
    shippingInfo:shippingtype;
    subtotal:number;
    tax:number;
    total:number;
    discount:number;
    shippingcharge:number;
    status:string;
    user:{
      name:string;
      _id:string;
    }
    _id:string;
  }
  type CountAndChange = {
    inventorycount: Record<string, number>[]; // Uses InventoryItem type for clarity
    revenuecount: number;
    users: number; // Changed from "user" to "users" to match JSON key
    products: number; // Correct key as per your JSON
    orders: number; // Correct key as per your JSON
  };
  
  // LatestTransaction type is aligned with your JSON.
  type LatestTransaction = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
  };
  
  // Adjusted Stats type to reflect your JSON structure and naming conventions.
  export type Stats = {
    inventorycount: Record<string, number>[]; // Uses InventoryItem type for clarity
        userpercentage: number;
        productpercentage: number;
        orderpercentage: number;
        revenue: number; // Optional as it's not in the provided JSON, assuming you may want to include it
    count: CountAndChange; // Aligned with the adjusted CountAndChange type
    chart: {
      order: number[];
      rev: number[]; // Changed from "rev" to "revenue" to match JSON key. If "rev" is correct, adjust accordingly
    };
    ratio: {
      male: number;
      female: number;
    };
    modifytransaction: LatestTransaction[];
  };
  
  type OrderFullfillment = {
    processing: number;
    shipped: number;
    delivered: number;
  };
  
  type RevenueDistribution = {
    netmargin: number;
    discount: number;
    'Production Cost': number;
    Burn: number;
    Marketing: number;
  };
  
  type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
  };
  
  export type Pie = {
    orderfulfillment: OrderFullfillment;
    inventorycount: Record<string, number>[];
    stocks: {
      instock: number;
      outofstock: number;
    };
    revenuedistribution: RevenueDistribution;
    userage: UsersAgeGroup;
    adminuser: {
      Admins: number;
      Users: number;
    };
  };
  
  export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
  };
  export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
  };