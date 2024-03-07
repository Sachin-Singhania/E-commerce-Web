import {BrowserRouter as Router,Routes, Route } from "react-router-dom"
import { lazy,Suspense, useEffect } from "react" 
import Loader from "./Components/Loader"
import Header from "./Components/Header"
import { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { userexist, usernotexist } from "./redux/reducer/userreducer"
import { getuser } from "./redux/api/userapi"
import { userreducertype } from "./types/reducers-types"
import Protectedroute from "./Components/protected-route"
const Home = lazy(() => import("./pages/Home"))
const Search = lazy(()=> import('./pages/Search'))
const Cart = lazy(()=> import('./pages/Cart'))
const Shipping = lazy(()=> import('./pages/Shipping'))
const Login = lazy(()=> import('./pages/Login'))
const Orders = lazy(()=> import('./pages/Orders'))
// const Orderdetails = lazy(()=> import('./pages/order-details'))
const Checkout  = lazy(()=> import('./pages/Checkout'));


// Admin
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);


const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: userreducertype }) => state.userReducer);
  const dispatch = useDispatch();


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getuser(user.uid);
        dispatch(userexist(data.user));
      } else dispatch(usernotexist());
    });
  }, []); // Added dispatch to the dependency array as it's used inside the effect

  
  return loading ? (<Loader/>) : (
    <Router>
      <Header user={user}/>
      <Suspense fallback={<Loader/>}>
      <Routes >
        <Route path="/"  element ={<Home/>}/>
        <Route path="/Search"  element ={<Search/>}/>
        <Route path="/Cart"  element ={<Cart/>}/>
        <Route path="/Login"  element ={
           <Protectedroute isauthenticated={user?false:true}>
             <Login/>
           </Protectedroute>
        }/>

    {/* {Logged in user} */}
    <Route element={<Protectedroute isauthenticated={user?true:false}/>} >
        <Route path="/shipping"  element ={<Shipping/>}/>
        <Route path="/pay"  element ={<Checkout/>}/>
        <Route path="/orders"  element ={<Orders/>}/>
        {/* <Route path="/orders/:id"  element ={<Orderdetails/>}/> */}
    </Route>
{/* Admin routing */}
        <Route 
  element={
    <Protectedroute isauthenticated={true} adminroute={true} isadmin={user?.role=="admin"?true:false} />
  }
>
  <Route path="/admin/dashboard" element={<Dashboard />} />
  <Route path="/admin/product" element={<Products />} />
  <Route path="/admin/customer" element={<Customers />} />
  <Route path="/admin/transaction" element={<Transaction />} />
  {/* Charts */}
  <Route path="/admin/chart/bar" element={<Barcharts />} />
  <Route path="/admin/chart/pie" element={<Piecharts />} />
  <Route path="/admin/chart/line" element={<Linecharts />} />
  {/* Apps */}
  <Route path="/admin/app/coupon" element={<Coupon />} />
  <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
  <Route path="/admin/app/toss" element={<Toss />} />

  {/* Management */}
  <Route path="/admin/product/new" element={<NewProduct />} />

  <Route path="/admin/product/:id" element={<ProductManagement />} />

  <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
</Route>
      </Routes>
      </Suspense>
      <Toaster position="bottom-center"/>
    </Router>
  )
}

export default App