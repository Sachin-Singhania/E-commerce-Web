import { NextFunction, Request, Response } from "express";

import { trycatch } from "../Middlewares/error.js";
import { basequery, reqproduct, searchreq } from "../Types/types.js";
import errorhandler from "../Utils/utility-class.js";
import { HttpStatusCode } from '../Types/types.js';
import { Productmodel } from "../Models/product.js";
import { rm } from "fs";
import { Nodecache } from "../app.js";
import { invalidateCache } from "../Utils/feature.js";


export const newporduct = trycatch(
    async (req: Request<{}, {}, reqproduct>, res: Response, next: NextFunction) => {
        const { name, price, stock, category } = req.body;
        const photo = req.file;
        if (!photo) {
            return next(new errorhandler("No image provided", HttpStatusCode.BAD_REQUEST))
        }
        if (!name || !price || !stock || !category) {
            rm(photo.path, () => {
            })
            return next(new errorhandler('All fields are required', HttpStatusCode.BAD_REQUEST));
        }

        await Productmodel.create({
            name, price, stock, category: category.toLowerCase(), photo: photo?.path,
        })
        await invalidateCache({admin:true,product:true})
        return res.status(HttpStatusCode.OK).json({ message: "Product created" });
    }
)
export const latestporduct = trycatch(
    async (req: Request<{}, {}, reqproduct>, res: Response, next: NextFunction) => {
        let product;
        if(Nodecache.has("latestproducts")){
            product=JSON.parse(Nodecache.get("latestproducts") as string);
        }else{
            product = await Productmodel.find().sort({ createdAt: -1 }).limit(5);
            Nodecache.set("latestproduct",JSON.stringify(product))
        }
        return res.status(HttpStatusCode.OK).json({ message: "Product are listed here", product });
    }
)
export const allcategory = trycatch(
    async (req: Request<{}, {}, reqproduct>, res: Response, next: NextFunction) => {
        let categories;
        if (Nodecache.has("categories")) {
         categories = JSON.parse(Nodecache.get("categories") as string);
        }else{
            categories = await Productmodel.distinct("category");
            Nodecache.set("categories",JSON.stringify(categories))
        }
        return res.status(HttpStatusCode.OK).json({ message: "Product are listed here", categories });
    }
)
export const allproducts = trycatch(
    async (req: Request<{}, {}, reqproduct>, res: Response, next: NextFunction) => {
        let product;
        if(Nodecache.has("allproducts")){
            product = JSON.parse(Nodecache.get("allproducts") as string);
        }
        else{
            product = await Productmodel.find();
            Nodecache.set("allproducts",JSON.stringify(product));
        }
        return res.status(HttpStatusCode.OK).json({ message: "Products are listed here", product });
    }
)
export const getsingleproduct = trycatch(
    async (req, res, next) => {
        const id = req.params.id;
        let product;
        if( Nodecache.has(`product-${id}`)){
            product = JSON.parse(Nodecache.get(`product-${id}`) as string);
        }else{
            product = await Productmodel.findById(id);
            if (!product) return next(new errorhandler(`Product not found`, HttpStatusCode.NOT_FOUND));
            Nodecache.set(`product-${id}`,JSON.stringify(product)); 
        }
        return res.status(HttpStatusCode.OK).json({ message: "Products are listed here", product });
    }
)
export const delproduct = trycatch(
    async (req, res, next) => {
        const product = await Productmodel.findByIdAndDelete(req.params.id);
        if (!product) return next(new errorhandler(`Product not found`, HttpStatusCode.NOT_FOUND));
        rm(product.photo!, () => {
        })
        await invalidateCache({admin:true,product:true,productId:String(product._id)})
        return res.status(HttpStatusCode.OK).json({ message: "Products Deleted", product });
    }
)
export const updateproduct = trycatch(
    async (req, res, next) => {
        const { id } = req.params;
        const { name, price, stock, category } = req.body;
        const photo = req.file;
        const product = await Productmodel.findById(req.params.id);
        if (!product) return next(new errorhandler(`Product not found or Invalid Id`, HttpStatusCode.NOT_FOUND));
        if (photo) {
            rm(product.photo!, () => {
            })
            product.photo = photo.path;
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = category || product.category;
        const updatedproduct = await product.save();
        await invalidateCache({admin:true,product:true,productId:String(updatedproduct._id)});
        return res.status(HttpStatusCode.OK).json({ message: 'Product has been updated', updatedproduct })

    }
)
export const categorybased = trycatch(
    async (req, res, next) => {
        const { category } = req.params;
        if (!category) return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Invalid Cateogy" });
        const product = await Productmodel.find({ category })
        if (!product) return res.status(HttpStatusCode.NOT_FOUND).json({ message: `Category ${category} does not have any products` })
        return res.status(HttpStatusCode.OK).json({ message: `${(category)} Category Listed Here`, product });
    }
)
export const getallproductswf= trycatch(
async (req:Request<{},{},{},searchreq>, res, next) => {
        const { category,price,search,sort } = req.query;
        const page=Number(req.query.page) || 1;
        const limit= Number(process.env.PRODUCT_PER_PAGE) || 8; 
        const skip=(page -1)*limit;
         const basequery:basequery ={};
         if(search){
            basequery.name={
                $regex:search,
                $options:"i" ,
            }}
        if(category){
                basequery.category=category
            }
        if(price){
                basequery.price={ $lte:Number(price)}
            }
            const [product,filterdonly]=await Promise.all([
                Productmodel.find(basequery).sort(sort && {price:sort==="asc"? 1:-1}).limit(limit).skip(skip),
                Productmodel.find(basequery),
            ])
        const totalpage= Math.ceil(filterdonly.length /limit);
        return res.status(HttpStatusCode.OK).json({ success:true,product,totalpage});
    }
)