import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { message } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type restype =
  | {
      data: message;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };
export const responseToast = ( res: restype,navigate: NavigateFunction,url:string) => {
    if ("data" in res) {
        toast.success(res.data.message);
         if(navigate) navigate(url);
}
else{
    const err= res.error as FetchBaseQueryError;
    const messageresponse= err.data as message;
    toast.error( messageresponse.message);
}
}
export const getLastMonths = () => {
  const currentDate = moment();

  currentDate.date(1);

  const last6Months: string[] = [];
  const last12Months: string[] = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");
    last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");
    last12Months.unshift(monthName);
  }

  return {
    last12Months,
    last6Months,
  };
};