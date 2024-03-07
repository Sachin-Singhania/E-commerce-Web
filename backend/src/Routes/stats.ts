import express from "express"
import { Admin } from "../Middlewares/auth.js";
import { getbarchart, getdashboard, getlinechart, getpiechart } from "../Controllers/stats.js";
 const app= express.Router();

 // /api/v1/user/new
 app.get("/stats",Admin,getdashboard);
 app.get("/bar",Admin,getbarchart);
 app.get("/pie",Admin,getpiechart);
 app.get("/line",Admin,getlinechart);

 
 export default app;