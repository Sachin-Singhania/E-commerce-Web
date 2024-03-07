import mongoose, { Document } from "mongoose";
import validator from "validator";

interface User extends Document {
  _id: string;
  name: string;
  photo: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  age: number;
}

const schema = new mongoose.Schema(
  { 
    _id: {
      type: String,
      required: [true, "Enter Id"],
    },
    name: {
      type: String,
      required: [true, "Enter Name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Enter Email"],
        validate: {
          validator: (value: string) => validator.isEmail(value),
          message: "Invalid email format",
        },
    },
    photo: {
      type: String,
      required: [true, "Enter Photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Enter Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Enter Dob"],
      validate: {
        validator: (value: Date) => value instanceof Date && !isNaN(value.getTime()),
        message: "Invalid date format for DOB",
      },
    },
  },
  { timestamps: true, }
);

schema.virtual("age").get(function (this: { dob: Date }) {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const UserModel = mongoose.model<User>("User", schema);
