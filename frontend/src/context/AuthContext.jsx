import React,{createContext,useContext,useState} from "react";
const AuthContext=createContext(null);
export const AuthProvider=({children})=>{
 const[user,setUserState]=useState(()=>{try{return JSON.parse(localStorage.getItem("healtechUser"))||null}catch{return null}});
 const setUser=u=>{setUserState(u);if(u)localStorage.setItem("healtechUser",JSON.stringify(u));else localStorage.removeItem("healtechUser")};
 const logout=()=>{localStorage.removeItem("healtechToken");setUser(null)};
 return <AuthContext.Provider value={{user,setUser,logout}}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>useContext(AuthContext);
