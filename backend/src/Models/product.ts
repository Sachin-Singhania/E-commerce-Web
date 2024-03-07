import mongoose from "mongoose";

const schema = new mongoose.Schema(
  { 
    name: {
      type: String,
      required: [true, "Enter Name"],
    },
    category: {
      type: String,
      required: [true, "Enter Category"],
      trim:true,
    },
    photo:{
        type:String,
        required: [true, "Enter photo"],
    },
    price:{
        type : Number ,
        required: [true, "Enter Price"],
    },
    stock:{
        type : Number ,
        required: [true, "Enter Stock"],
    }
  },
  { timestamps: true, }
);


export const Productmodel = mongoose.model("Product", schema);
