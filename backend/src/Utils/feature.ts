import mongoose from "mongoose"
import {invalidatecachetype, orderitem} from "../Types/types.js"
import { Nodecache as myCache } from "../app.js"
import { Productmodel } from "../Models/product.js"
import { Order } from "../Models/order.js"

export const connectDB=()=>{
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName: "ecommerce"
}
).then(()=>{
    console.log(`Connected to  MongoDB`);
}).catch((err)=>{
    console.log(err)
})
}
export const invalidateCache =  async ({
    product,
    order,
    admin,userid,orderid,productId
  }: invalidatecachetype) => {
    if (product) {
      const productKeys: string[] = [
        "latest-products",
        "categories",
        "all-products",
      ];
      if (typeof productId === "string") productKeys.push(`product-${productId}`);

      if (typeof productId === "object")
        productId.forEach((i) => productKeys.push(`product-${i}`));
      myCache.del(productKeys);
    }
    if (order) {
      // Invalidate the user's shopping cart
       const orderkeys: string[]=[
        "all-order",
        `my-order-${userid}`,
        `order-${orderid}`
       ]
       
       myCache.del(orderkeys);
    }
    if (admin) {
       myCache.del(["admin-stats","admin-pie-charts","admin-bar-charts","admin-line-charts"]);
    }
  };
  export const reducestock=async (orderitem:orderitem[])=>{
    for (let index = 0; index < orderitem.length; index++) {
      const element = orderitem[index];
      const product=await Productmodel.findById(element.productid);
      if(!product){
         throw new Error("Product now found");
      }
      product.stock -= element.quantity;
      await product.save();
    }

  }
  export const percentagechange=( thismonth:number ,lastmonth:number)=>{
    if ( lastmonth==0) {
       return thismonth*100 ;
    }
     const percentage= ((thismonth - lastmonth)/lastmonth)*100 ;
     return Number(percentage.toFixed(0));
  }
  export const getcategories = async ({ allcategory, productscount }: { allcategory: string[], productscount: number }) => {
    const categorycountpro = allcategory.map(async (category) => {
        const count = await Productmodel.countDocuments({ category });
        return count;
    });
    const categorycount = await Promise.all(categorycountpro);

    const count_category: Record<string, number>[] = [];

    allcategory.forEach((category, i) => {
        const percentage = Math.round((categorycount[i] / productscount) * 100);
        count_category.push({
            [category]: percentage,
        });
    });

    return count_category;
}
interface MyDocument{
  createdAt: Date;
  discount?: number;
  total?: number;
}

type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const chartdata = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((doc) => {
    const creationDate = doc.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
    if (monthDiff < length) {
      if (property) {
        const value = property === 'discount' ? doc.discount : doc.total;
        if (value !== undefined) {
          data[length - monthDiff - 1] += value;
        }

      } else {
        data[length - monthDiff - 1]++;
      }
    }
  });

  return data;
};