import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetcart } from '../redux/reducer/cartreducer';
import { useNeworderMutation } from '../redux/api/orderapi';
import toast from 'react-hot-toast';
import { ordertype } from '../types/api-types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { cartreducertype } from '../types/reducers-types';
import { responseToast } from '../utils/features';
const stripePromise = loadStripe('pk_test_51Ok64KSIsleF8nMHKFTO8gNTWSC6MV5BX6vIekR8PRaUJvda1aFgHtEd5GJRZjFGElHT6gmPEowUxnmM4hCiJjoH00P8Wdtg88');

const CheckoutForm = () => {

  const stripe = useStripe()
  const elements = useElements();
  const navigate  = useNavigate();
  const { user } = useSelector(
    (state:RootState) => state.userReducer);
    const {cartitems,discount,shippingInfo,shippingcharge,subtotal,tax,total}=useSelector((state: cartreducertype)=>state)
    const [isProcessing, setisProcessing] = useState<boolean>(false);
    const [ordernew]= useNeworderMutation();
    const dispatch=useDispatch();

     const handleSubmit =async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
         if (!stripe || !elements) return;
      const order:ordertype ={
         discount,orderitems:cartitems,shippingcharge,shippingInfo,
         subtotal,tax,total,user:user?._id!,
      };
         setisProcessing(true); 

         const { paymentIntent, error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin ,
          },
          redirect: "if_required",
        });
            if (error) {
              console.log(error)
            setisProcessing(false);
              return toast.error(error.message|| "Error came during payment");
            }
            else if (paymentIntent.status === 'succeeded') {
                   const response = await ordernew(order);
                   dispatch(resetcart());
                   responseToast(response, navigate, "/orders");
                console.log("Payment is successful")
            }
            setisProcessing(false);
     }
    return (
        <>
      <form className='checkout-container'  onSubmit={handleSubmit}>
        <PaymentElement/>
        <button >{ isProcessing? "Processing..":"Pay"}</button>
      </form>
        </>
    );
  };
const Checkout=()=> {
  const location= useLocation()
  const clientSecret :string| undefined= location.state;
  if(!clientSecret) <Navigate to={"/shipping"}/>

  return (
    <Elements options={{
      clientSecret,
    }} stripe={stripePromise}  >
      <CheckoutForm/>
    </Elements>
  );
};



  export default Checkout;