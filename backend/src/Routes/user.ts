import express from "express"
import { deluser, getallusers, newuser, user } from "../Controllers/user.js";
import { Admin } from "../Middlewares/auth.js";
 const app= express.Router();

 // /api/v1/user/new
 app.post("/new",newuser);
 
 app.get("/alluser",getallusers);

//  or
app.route("/:id").get(user).delete(Admin,deluser);
//  app.get("/:id",user);
 export default app;