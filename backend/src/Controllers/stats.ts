import { trycatch } from "../Middlewares/error.js";
import { Order } from "../Models/order.js";
import { Productmodel } from "../Models/product.js";
import { UserModel } from "../Models/user.js";
import { HttpStatusCode } from "../Types/types.js";
import { chartdata, getcategories, percentagechange } from "../Utils/feature.js";
import { Nodecache } from "../app.js";
import { allorder } from "./order.js";


export const getdashboard=trycatch(async( req,res,next)=>{
    let stats;
    if (Nodecache.has("admin-stats")) {
        stats=  JSON.parse(Nodecache.get("admin-stats") as string);
    }
    else{
        const today= new Date();
        const last6month= new Date();
        last6month.setMonth(last6month.getMonth() - 6);
        const thismonth= {
            start:new Date(today.getFullYear(),today.getMonth() ,1),
            end:today,
        }
        const lastmonth={
            start:new Date( today.getFullYear(), today.getMonth() -1 ,1),
            end:new Date( today.getFullYear(), today.getMonth() ,0),
        }
        const last6months={
            start:new Date( today.getFullYear(), today.getMonth() -6 ,1),
            end:today,
        }
        const thismonthproduct=Productmodel.find({createdAt:{ $gte :thismonth.start, $lt:thismonth.end}})
        const lastmonthproduct=Productmodel.find({createdAt:{ $gte :lastmonth.start, $lt:lastmonth.end}})

        
        const thismonthuser=UserModel.find({createdAt:{ $gte :thismonth.start, $lt:thismonth.end}})
        const lastmonthuser=UserModel.find({createdAt:{ $gte :lastmonth.start, $lt:lastmonth.end}})
        
        const thismonthorder=Order.find({createdAt:{ $gte :thismonth.start, $lt:thismonth.end}})
        const lastmonthorder=Order.find({createdAt:{ $gte :lastmonth.start, $lt:lastmonth.end}})
        const month6bef=Order.find({createdAt:{ $gte :last6months.start, $lt:last6months.end}})

        const transactionpromise= Order.find({}).select(["orderitems","discount","total","status"]).limit(4)
        
        const [
            thismonthproducts,
            thismonthusers,
            thismonthorders,
            lastmonthproducts,
            lastmonthusers,
            lastmonthorders,
            productcount,
            usercount,
            ordercount,
            beforesixmonth,allcategory,femalecount,lasttranscation
         ]=await Promise.all([
            thismonthproduct,
            thismonthuser,
            thismonthorder,
            lastmonthproduct,
            lastmonthuser,
            lastmonthorder,
            Productmodel.countDocuments(),
            UserModel.countDocuments(),
            Order.find({}).sort("total"), 
            month6bef,Productmodel.distinct("category"),
            UserModel.countDocuments({gender:"female"}),
            transactionpromise
        ])

        const userpercentage= percentagechange(thismonthusers.length,lastmonthusers.length)
        const productpercentage= percentagechange(thismonthproducts.length,lastmonthproducts.length)
        const orderpercentage = percentagechange(thismonthorders.length,lastmonthorders.length)
        const TMrevenue=  (thismonthorders.reduce((total,order)=> total+ (order.total||0), 0));
        const LMrevenue=  (lastmonthorders.reduce((total,order)=> total+ (order.total||0), 0));
        const revenue= percentagechange(TMrevenue,LMrevenue);
        const revenuecount=ordercount.reduce((total,order)=> total+ (order.total||0), 0);

        const mountcountchart=new Array(6).fill(0);
        const revenuecountchart=new Array(6).fill(0);

        beforesixmonth.forEach((orders)=>{
            const creationdate= orders.createdAt;
            const monthdif= (today.getMonth()-creationdate.getMonth()+12)%12;
            if( monthdif<6){
                mountcountchart[5-monthdif]+=1;
                revenuecountchart[5-monthdif]+=orders.total;
                
            }
        })
        const chart={
             order: mountcountchart,
             rev: revenuecountchart,
        }
        const ratio={
            male:usercount-femalecount,
            female:femalecount
        }
        const inventorycount= await getcategories({
            allcategory,
            productscount: productcount 
        });
        
        
        const modifytransaction= lasttranscation.map((i)=>({
            _id:i._id,
            discount: i.discount,
            amount:i.total,
            quantity:i.orderitems.length,
            status:i.status,
         }))
        const count={
            inventorycount,
            revenuecount,
            users:usercount,
            products:productcount,
            orders:allorder.length,
        }
        stats ={
             userpercentage,
             productpercentage,
             orderpercentage,
             revenue,
             count,
             chart,
             ratio,
             modifytransaction,
        }
        Nodecache.set("admin-stats",JSON.stringify(stats)); 
    }

    return res.status(HttpStatusCode.OK).json({ success: true, stats });

})

export const getpiechart=trycatch(async( req,res,next)=>{
    let charts;
     if (Nodecache.get("admin-pie-charts")) {
       charts= JSON.parse(Nodecache.get("pie-charts") as string);  
     } else {
        const [processorder,shippedorder,deliveredorder,productcount,allcategory,outofstock,orders,users,admins,user]=await Promise.all(
            [
                Order.countDocuments({status:"Processing"}),
                Order.countDocuments({status:"Shipped"}),
                Order.countDocuments({status:"Delivered"}),
                Productmodel.countDocuments(),
Productmodel.distinct("category"),
Productmodel.countDocuments({stock:0}),
Order.find({}).select(['total','discount','subtotal','tax','shippingcharge']),UserModel.find({}).select(["dob"]),UserModel.countDocuments({role:"admin"}),UserModel.countDocuments({role:"user"})

            ]
        )

        const adminuser={
            Admins:admins,
            Users:user
        }

        const userage={
            teen:users.filter(i=>i.age <18).length,
            adult:users.filter(i=>i.age <40  && i.age >=18).length,
            old:users.filter(i=>i.age >60   && i.age >=40).length,
        }


            const grossmargin=orders.reduce(
                (prev,order) => prev +( order.total||0),0
            )
            const discount  =orders.reduce(
                (prev,order) => prev +( order.discount||0),0
            )
            const productioncost=orders.reduce(
                (prev,order) => prev +( order.shippingcharge||0),0
            )
            const burn=orders.reduce(
                (prev,order) => prev +( order.tax||0),0
            )
            const marketingcost= Math.round(grossmargin*(30/100));
            const netmargin=    grossmargin - productioncost -burn -discount;
            const revenuedistribution={
                "Marketing":marketingcost,
                 "Burn":burn,
                  "Production Cost" :productioncost,
                   "Gross Margin":grossmargin,
                    "netmargin":netmargin,
            }
        const stocks={
            instock: productcount-outofstock,
            outofstock
        }

        const orderfulfillment={
            processing:processorder,
            shipped:shippedorder,
            delivered:deliveredorder,
        }
        const inventorycount= await getcategories({
            allcategory,
            productscount: productcount 
        });
        charts={
            inventorycount,
             orderfulfillment,
            stocks,
             revenuedistribution,
             adminuser,
             userage
            }
         Nodecache.set("pie-charts",JSON.stringify(charts))
     }

    return res.status(HttpStatusCode.OK).json({ success: true, charts });

})

export const getbarchart = trycatch(async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
  
    if (Nodecache.has(key)) charts = JSON.parse(Nodecache.get(key) as string);
    else {
      const today = new Date();
  
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  
      const sixMonthProductPromise = Productmodel.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
  
      const sixMonthUsersPromise = UserModel.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
  
      const twelveMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
  
      const [products, users, orders] = await Promise.all([
        sixMonthProductPromise,
        sixMonthUsersPromise,
        twelveMonthOrdersPromise,
      ]);
  
      const countproduct = chartdata({
        length: 6,
        docArr: products , // Specify MyDocument as the type
        today: today,
      });
      
      const countuser = chartdata({
        length: 6,
        docArr: users, // Specify MyDocument as the type
        today: today,
      });
      
      const countorder = chartdata({
        length: 12,
        docArr: orders, // Specify MyDocument as the type
        today: today,
      });
  
      charts = {
        users: countuser,
        products: countproduct,
        orders: countorder,
      };
  
      Nodecache.set(key, JSON.stringify(charts));
    }
  
    return res.status(200).json({
      success: true,
      charts,
    });
  });

export const getlinechart=trycatch(async( req,res,next)=>{
    let charts;
    const key = "admin-line-charts";
  
    if (Nodecache.has(key)) charts = JSON.parse(Nodecache.get(key) as string);
    else {
      const today = new Date();
  
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  
  
      const twelveMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select(["createdAt","discount","total"]);
  
      const twelveMonthProductPromise = Productmodel.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
  
      const twelveMonthUsersPromise = UserModel.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
  
      const [products, users, orders] = await Promise.all([
        twelveMonthProductPromise,
        twelveMonthUsersPromise,
        twelveMonthOrdersPromise,
      ]);
      const countproduct = chartdata({
        length: 12,
        docArr: products, // Specify MyDocument as the type
        today: today,
      });
      
      const countuser = chartdata({
        length: 12,
        docArr: users, // Specify MyDocument as the type
        today: today,
      });
      
      const discount = chartdata({
        length: 12,
        today: today,
        docArr: orders, // Specify MyDocument as the type
        property:"discount"
      });
      const revenue = chartdata({
        length: 12,
        today,
        docArr: orders,
        property: "total",
      });
  
      charts = {
        users: countuser,
        products: countproduct,
        discount: discount,
        revenue
      };
  
      Nodecache.set(key, JSON.stringify(charts));
    }
  
    return res.status(200).json({
      success: true,
      charts,
    });

})
