import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productapi";
import { addToCart } from "../redux/reducer/cartreducer";
import { cartitems } from "../types/reducers-types";

const Home = () => {
  const {data,isError,error}  = useLatestProductsQuery("");
  if(isError) toast.error("Something went wrong!");
  const dispatch = useDispatch();
  const addtoCarthandler=(cartitems: cartitems)=>{
      if (cartitems.stock<1) {
  return toast.error(`${cartitems.name} is out of stock!`);
      }
       dispatch(addToCart(cartitems));
  }

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>

      <main>
        { 
          data?.product.map((i) => (
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
      </main>
    </div>
  );
};

export default Home;