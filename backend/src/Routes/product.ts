import express from "express";
import { Admin } from "../Middlewares/auth.js";
import { allcategory, newporduct, allproducts, delproduct, categorybased } from "../Controllers/product.js";
import { getsingleproduct, updateproduct, getallproductswf } from "../Controllers/product.js";
import { latestporduct } from "../Controllers/product.js";
import { upload } from "../Middlewares/multer.js";

const app = express.Router(); // Renaming router to app

// Middleware for authentication, if required globally
// app.use(Admin);

// Route for adding a new product
app.post("/new", Admin,upload, newporduct);

// Route for getting the latest products
app.get("/latest", latestporduct);
//get all products with filter
app.get("/all" ,getallproductswf);

// Route for getting all products
app.get("/products",Admin, allproducts);
//getting products by their category
// app.get("/category=:category", categorybased);
// Route for getting all categories
app.get("/allcategory", allcategory);

// Route for getting a single product by ID
// Route for updating a product by ID
// Route for deleting a product by ID
app
.route("/:id")
.get(getsingleproduct)
.put(Admin,upload, updateproduct)
.delete(Admin,delproduct);


export default app;
