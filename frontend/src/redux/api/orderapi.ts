import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { message, orderdetail, orderres, ordertype, updateorder } from "../../types/api-types";

export const  orderapi = createApi({
    reducerPath: "orderapi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
      }),
      tagTypes:["Order"],
      endpoints: (builder) => ({
        neworder: builder.mutation<message,ordertype>({
          query: ( order) => ({url:"new",method:"POST",body:order}),
          invalidatesTags:["Order"]
        }),
        myorder: builder.query <orderres,string>({
          query: (id) => `my?id=${id}`,
          providesTags:["Order"]
        }),
        allorder: builder.query<orderres,string>({
          query: (id) => `all?id=${id}`,
          providesTags:  ["Order"]
        }),
        getsingleorder: builder.query<orderdetail, string>({
          query: (id) => id,
          providesTags : ["Order"]
        }),
        processorder: builder.mutation<message,updateorder>({
            query: ( {userid,orderid}) => ({url:`${orderid}?id=${userid}`,method:"PUT"}),
            invalidatesTags: ["Order"]
        }),
        delorder: builder.mutation<message,updateorder>({
            query: ( {userid,orderid}) => ({url:`${orderid}?id=${userid}`,method:"DELETE"}),
            invalidatesTags: ["Order"]
        }),
    }),
});
export  const { useNeworderMutation,useAllorderQuery,useDelorderMutation,useGetsingleorderQuery,useMyorderQuery,useProcessorderMutation} = orderapi;

//Action Creators