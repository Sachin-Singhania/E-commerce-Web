import { ReactElement } from "react"
import { Navigate, Outlet } from "react-router-dom";

interface props{
    children?: ReactElement;
    isauthenticated:boolean;
    isadmin?: boolean;
    redirect?:string;
    adminroute?:boolean;
    
}
const Protectedroute = ({isauthenticated,children,isadmin,adminroute,redirect="/"}:props) => {
    if (!isauthenticated) return <Navigate to={redirect} /> 
    if ( !isadmin && adminroute) {
        return <Navigate to={redirect} />  
    }
  
    return  children?children:<Outlet/>
}

export default Protectedroute