import express from "express"
import { Admin } from "../Middlewares/auth.js";
import { neworder,myorder, allorder,getsingleorder, processorder, delorder } from "../Controllers/order.js";
 const app= express.Router();

 // /api/v1/order/new

// route - /api/v1/order/new
app.post("/new", neworder);

// route - /api/v1/order/my
app.get("/my", myorder);

// route - /api/v1/order/all
app.get("/all", Admin,allorder);

app
  .route("/:id")
  .get(getsingleorder)
  .put(Admin, processorder)
  .delete(Admin,delorder);
 export default app;