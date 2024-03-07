import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDelorderMutation, useGetsingleorderQuery, useProcessorderMutation } from "../../../redux/api/orderapi";
import { OrderItems, orders, userreducertype } from "../../../types/reducers-types";
import { server } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const defaultData: orders = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingcharge: 0,
  tax: 0,
  total: 0,
  orderitems: [],
  user: { name: "", _id: "" },
  _id: "",
};

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: userreducertype }) => state.userReducer);
    const params=  useParams();
    const navigate= useNavigate();
  const { data, isError } = useGetsingleorderQuery(params.id!);
    const {shippingInfo:{address,city,country,pincode,state},orderitems,user:{name},status,total,discount,tax,subtotal,shippingcharge,_id}= data?.orders || defaultData ;

  const [updateOrder] = useProcessorderMutation();
  const [deleteOrder] = useDelorderMutation();
  const updateHandler = async() => {
   const res= await updateOrder({orderid:_id!, userid:user?._id! })
    responseToast(res, navigate, "/admin/transaction");
  };
  const deleteHandler=async()=>{
    const res= await deleteOrder({orderid:_id!, userid:user?._id! })
    responseToast(res, navigate, "/admin/transaction");
  }; 
  if(isError) return  <Navigate to={"/404"}/>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderitems?.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={`${server}/${i.photo}`}
              productid={i.productid}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pincode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingcharge}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productid,
}: OrderItems) => (
  <div className="transaction-product-card">
    <img src={`${server}/${photo}`} alt={name} />
    <Link to={`/product/${productid}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
