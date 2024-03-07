import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useState } from "react"
import { user } from "../types/types"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import toast from "react-hot-toast"
export type propstype={
  user:user| null;
}
const Header = ({user}:propstype) => {
  const [Isopen, setIsopen] = useState<boolean>(false)
  const logouthandler= async()=>{
    try {
      await signOut(auth)
      toast.success("Logged out Successfully")
      setIsopen(false);
    } catch (error) {
      toast.error(" Error occured")
    }
    //firebase sign out
  }
  return (
    <nav>
      <Link onClick={()=>{
            setIsopen(false);
          }} to={"/"}>Home</Link>
      <Link  onClick={()=>{
            setIsopen(false);
          }} to={"/search"}><FaSearch/></Link>
      <Link  onClick={()=>{
            setIsopen(false);
          }} to={"/cart"}><FaShoppingBag/></Link>
      {
        user?._id ? (
          <>
          <button onClick={()=>{
            setIsopen((prev)=> !prev);
          }}>
            <FaUser/>
          </button>
          <dialog open={Isopen}>
            <div>
              {user.role==="admin" && (
                <>
                <Link  onClick={()=>{
            setIsopen(false);
          }} to="/admin/dashboard">Admin</Link>
                </>
                )}
              <Link  onClick={()=>{
            setIsopen(false);
          }} to="/orders">Orders</Link>
             <a>
               <button onClick={logouthandler}>
                <FaSignOutAlt/>
              </button>
              </a>
            </div>
          </dialog>
          </>
        ) : (
          <>
          <Link to={"/login"}><FaSignInAlt/></Link>
          </>
        )
      }
    </nav>
  )
}

export default Header