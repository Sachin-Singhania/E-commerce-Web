import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { cartitems } from "../types/reducers-types";

type ProductsProps ={
productid:string;
name: string;
photo:string;
price:number;
stock:number;
handler:(cartitems: cartitems) => string | undefined;
}
const ProductCard = ({productid,name,photo,price,stock,handler,}:ProductsProps) => {
  return (
    <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>{name}</p>
        <span>₹{price}</span>
        <div>
            <button onClick={()=>handler({productid,name,photo,stock,quantity:1,price})}>

            <FaPlus/>
            </button>
        </div>
    </div>
  )
}

export default ProductCard