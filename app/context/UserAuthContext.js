import { View, Text } from 'react-native'
import React , {useContext ,createContext, useEffect} from 'react';
import { useState } from 'react';

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})
    useEffect(() => {
      console.log(user)
    }, [user])
    
  return (
    <UserAuthContext.Provider value={{user , setUser}}>
        {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth(){
    return useContext(UserAuthContext);
}