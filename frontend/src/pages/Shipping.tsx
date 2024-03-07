import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { server } from '../redux/store';
import { cartreducertype } from '../types/reducers-types';
import { saveshippinginfo } from '../redux/reducer/cartreducer';
const Shipping = () => {
  const {cartitems,total}= useSelector((state: {
    CartReducer: cartreducertype
  })=> state.CartReducer);
    const [shippinginfo, setshippinginfo] = useState({
        address: "",
        city: "",
        pincode: "",
        state: "",
        country: "",
    });
    let navigate  = useNavigate();
    const dispatch= useDispatch();
    const changehandler = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        setshippinginfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };
      const submithandler=async( e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        dispatch(saveshippinginfo(shippinginfo));
        try {
          
          const {data}= await axios.post(`${server}/api/v1/payment/newpay`,{
            amount:total,
          },{
            headers:{
              "Content-Type":"application/json",
            }
          })
          navigate("/pay",{
             state: data.clientSecret,
          })
        } catch (error) {
          console.log(error)
        }
      }

      useEffect(()=>{
          if(Object.keys(cartitems).length===0){
              navigate("/cart")
          }
      },[])
      
  return (
    <div className="shipping">
        <button className='back-btn' onClick={()=>{
            navigate('/cart')
        }}><BiArrowBack/></button>
        <form onSubmit={submithandler}>
            <h1>Shipping Information</h1>
            <input required type="text" placeholder='Address' name='address' value={shippinginfo.address} onChange={ changehandler} />
            <input required type="text" placeholder='city' name='city' value={shippinginfo.city} onChange={ changehandler} />
            <input required type="number" placeholder='pincode' name='pincode' value={shippinginfo.pincode} onChange={ changehandler} />
            <input required type="text" placeholder='state' name='state' value={shippinginfo.state} onChange={ changehandler} />
            <input required type="text" placeholder='country' name='country' value={shippinginfo.country} onChange={ changehandler} />
            <select
          name="country"
          required
          value={shippinginfo.country}
          onChange={changehandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>

        <button type="submit">Pay Now</button>
        </form>
    </div>
  )
}

export default Shipping