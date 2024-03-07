import { useState } from "react"
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productapi";
import { customerror } from "../types/api-types";
import toast from "react-hot-toast";
import ProductCard from "../Components/ProductCard";
import { useDispatch } from "react-redux";
import { cartitems } from "../types/reducers-types";
import { addToCart } from "../redux/reducer/cartreducer";

const Search = () => {
  const { data:categoryresponse,isLoading,isError,error}= useCategoriesQuery("")
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(22200);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const {data:searchdata,isLoading:loading}= useSearchProductsQuery({
    search,sort,page,category,price:maxPrice
  })
  const dispatch = useDispatch();
  const addtoCarthandler=(cartitems: cartitems)=>{
      if (cartitems.stock<1) {
  return toast.error(`${cartitems.name} is out of stock!`);
      }
       dispatch(addToCart(cartitems));
  }
  const isPrevPage=true;
  const isNextPage=true;
  if(isError){
    const err= error as customerror
     toast.error(err.data.message )
   } 
  return (
    <div className="product-search-page">
    <aside>
      <h2>Filters</h2>
      <div>
        <h4>Sort</h4>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">None</option>
          <option value="asc">Price (Low to High)</option>
          <option value="dsc">Price (High to Low)</option>
        </select>
      </div>

      <div>
        <h4>Max Price: {maxPrice || ""}</h4>
        <input
          type="range"
          min={100}
          max={100000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>

      <div>
        <h4>Category</h4>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">ALL</option>
          {
             categoryresponse?.categories.map((i) => (
               <option key={i} value={i}>{i.toUpperCase()}</option>
             ))
          }
        </select>
      </div>
    </aside>
    <main>
      <h1>Products</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        {loading ? (
           <p>Loading...</p>
        ) : (
          <div className="search-product-list">
            {searchdata?.product.map((i) => (
              <ProductCard
                key={i._id}
                productid={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addtoCarthandler}
                photo={i.photo}
              />
            ))}
          </div>  
        )}

{searchdata && searchdata.totalpage > 1 && (
          <article>
            <button
  disabled={!isPrevPage}
  onClick={() => {
    setPage(prev => {
      const newPage = prev - 1;
      return newPage <= 0 ? 1 : newPage;
    });
  }}
>
  Prev
</button>

<span>
  {page} of {searchdata.totalpage}
</span>

<button
  disabled={!isNextPage}
  onClick={() => {
    setPage(prev => (prev >= searchdata.totalpage ? searchdata.totalpage : prev + 1));
  }}
>
  Next
</button>
          </article>
        )}
    </main>
  </div>
);
};

export default Search