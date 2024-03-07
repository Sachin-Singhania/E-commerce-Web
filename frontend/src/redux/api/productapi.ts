import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  allproductresponse,
  categoriesres,
  message,
  newproductreq,
  searchproductsreq,
  searchproductsres,
  ProductResponse,
  UpdateProductRequest,
  DeleteProductRequest
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<allproductresponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<allproductresponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<categoriesres, string>({
      query: () => `allcategory`,
      providesTags: ["product"],
    }),

    searchProducts: builder.query<searchproductsres,      searchproductsreq >({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"],
    }),

    productDetails: builder.query<ProductResponse,string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    newProduct: builder.mutation<message, newproductreq>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<message, UpdateProductRequest>({
      query: ({ formData, userid, productid }) => ({
        url: `${productid}?id=${userid}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<message, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productAPI;