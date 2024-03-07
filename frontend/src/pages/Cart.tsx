import { useEffect, useState } from "react";
import CartItems from "../Components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartitems, cartreducertype } from "../types/reducers-types";
import toast from "react-hot-toast";
import { addToCart, applyDiscount, calculateprice, removeFromCart } from "../redux/reducer/cartreducer";
import axios from "axios";
import { RootState, server } from "../redux/store";
import { useBarQuery} from "../redux/api/stats";



const Cart = () => {
  const {cartitems,discount,shippingcharge,subtotal,tax,total}= useSelector((state: {
    CartReducer: cartreducertype
  })=> state.CartReducer);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError, error } = useBarQuery(user?._id!);
  console.log(data);
  const [coupon, setcoupon] = useState<string>("");
  const [isvalidcoupon, setisvalidcoupon] = useState<boolean>(false)
  const dispatch = useDispatch();

  const incrementhandl=(cartitems: cartitems)=>{
        if (cartitems.stock== cartitems.quantity) 
      return toast.error(`${cartitems.name} is now out of stock can't add more item!`);
        else
      dispatch(addToCart({...cartitems,quantity:cartitems.quantity+1}));
}
  const decrementHandel=(cartitems: cartitems)=>{
      dispatch(addToCart({ ...cartitems, quantity: cartitems.quantity -1 }));
}
  const removeHandel=(productid: string)=>{
      dispatch(removeFromCart(productid));
}
useEffect(() => {
dispatch(calculateprice())
  }, [cartitems])

  useEffect(() => {
    const { token,cancel}= axios.CancelToken.source();
    const timeOutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/coupon/apply?coupon=${coupon}`, {cancelToken:token })
        .then((res) => {
          dispatch(applyDiscount(res.data.appliedCoupon.amount));
          setisvalidcoupon(true);
          dispatch(calculateprice());
        })
        .catch(() => {
          dispatch(applyDiscount(0));
          setisvalidcoupon(false);
          cancel(  "API request cancelled." );
          dispatch(calculateprice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      setisvalidcoupon(false);
    };
  }, [coupon]);

  return (
    <div className="cart">
      <main>
        {cartitems.length>0? cartitems.map((i,idx)=>(
          <CartItems key ={idx} cartitems={i} decrementHandel={decrementHandel} incrementhandl={incrementhandl} removeHandel={removeHandel} />
        )): <h1>No Item</h1>}
      </main>
      <aside>
        <p>Subtotal :₹{subtotal}</p>
        <p>Shipping Charges :₹{shippingcharge}</p>
        <p>Discount :-₹{discount}</p>
        <p><b>Tax :₹{tax}</b></p>
        <p>total :₹{total}</p>
        <input type="text"   placeholder="Enter your coupon code here.." value={coupon} onChange={e=>setcoupon(e.target.value)}/>
        {
          coupon &&( isvalidcoupon? <span className="green">₹{discount} off</span> : <span className="red">INVALID COUPON</span>)
        }
        {
          cartitems.length>0 && <Link to={"/shipping"}>Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart