import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { cartitems } from "../types/reducers-types";

type cartporps={
  cartitems:cartitems;
  incrementhandl: (cartitems:cartitems) => void;
  decrementHandel:(cartitems:cartitems)=>void;
  removeHandel: (id:string)=>void;
}
const CartItems = ({cartitems,decrementHandel,incrementhandl,removeHandel}:cartporps) => {
    const {photo,productid,name,price,quantity,stock} = cartitems;
  return (
<>
<div className="cart-item">
    <img src={`${server}/${photo}`} alt={name} />
    <article>
        <Link to={ ` /product/${ productid}`}>{name}</Link>
        <p> ₹{ price}</p>
    </article>
    <div>
        <button onClick={()=>incrementhandl(cartitems)} >+</button>
        <p>{quantity}</p>
        <button onClick={cartitems.quantity == 1 ? () => removeHandel(productid) : () => decrementHandel(cartitems)}
>-</button>
    </div>
    <button onClick={()=>removeHandel(productid)}><FaTrash/></button>
</div>

</>
  )
}

export default CartItems