import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { user } from "../../types/types";
import { alluser, deluser, message, userresponse } from "../../types/api-types";
import axios from "axios";

export const userapi = createApi({
    reducerPath: "UserApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/` }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        login: builder.mutation<message,user>({
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,

            }),
            invalidatesTags : ["Users"],
        }),
        
        alluser:builder.query<alluser,string>({
            query : (id)=>`alluser?id=${id}`,
            providesTags:["Users"],
            }),
            deleteUser: builder.mutation<message, deluser>({
                query: ({ userid, adminid }) => ({
                  url: `${userid}?id=${adminid}`,
                  method: "DELETE",
                }),
                invalidatesTags: ["Users"],
              }),
    }),
});

export const getuser= async (id:string)=>{
    try {
        const {data}:{data:userresponse}= await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`)
        return data;
    } catch (error) {
        throw error;
    }
}
export const { useLoginMutation,useAlluserQuery,useDeleteUserMutation } =
  userapi;

