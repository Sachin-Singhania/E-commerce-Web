import mongoose from "mongoose";

const schema = new mongoose.Schema(
  { 
    code: {
      type: String,
      required: [true, "Enter Coupon"],
    },
    amount:{
        type : Number ,
        required: [true, "Enter Discount Price"],
    },
  },
);


export const Couponmodel = mongoose.model("Coupon", schema);
