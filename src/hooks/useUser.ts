import {useState,useEffect} from "react";

export const useUser = () =>{
    const [user,setUser] = useState<any>(null);
    useEffect(() =>{
        const storeUser = localStorage.getItem("user");
        if(storeUser) setUser(JSON.parse(storeUser))
    }, []);
    return user;
};