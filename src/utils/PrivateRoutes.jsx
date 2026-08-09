import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";

const PrivateRoutes = ({children}) => {
   
    const {user, loading} = useAuth()

    if(loading) {
        return <div>Loadding...........</div>
    }
    return user? children : <Navigate to="/login" />
        
    
}

 
export default PrivateRoutes;