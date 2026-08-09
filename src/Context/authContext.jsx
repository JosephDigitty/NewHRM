import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { useState } from "react";


const userContext = createContext()

const AuthContext  = ({children}) => {
   

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token")
            try {
                if (token) {
                    const response = await api.get("auth/verify")
                    if(response.data.success){
                        setUser(response.data.user) 
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                    }        
                }
                else {
                    setUser(null)
                }
                    
            } catch (error) {
                if(error.response && !error.response.data.error) {
                    setUser(null)
                    console.log(error.response.data)
                }
            } finally {
                setLoading(false)
            }
        }
        const storedUser = localStorage.getItem("user"); // ✅ Restore user from localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      verifyUser();
    }
    }, [])
    const login = (user) => {
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user)); // ✅ Store user data
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
    }
    return ( 
       <userContext.Provider value={{user, login, logout, loading}} >    
            {children}
       </userContext.Provider>
     );
     
}

export const useAuth = () => useContext(userContext)
 
export default AuthContext;