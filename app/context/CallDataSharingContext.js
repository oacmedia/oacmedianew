import { View, Text } from 'react-native'
import React , {useContext ,createContext, useEffect} from 'react';
import { useState } from 'react';

const CallDataSharingContext = createContext();

export const CallDataSharingContextProvider = ({children}) => {
    const [callSharedData, setCallSharedData] = useState({})
    useEffect(() => {
      //console.log(user)
    }, [callSharedData])
    
  return (
    <CallDataSharingContext.Provider value={{callSharedData, setCallSharedData}}>
        {children}
    </CallDataSharingContext.Provider>
  )
}

export function useCallDataSharing(){
    return useContext(CallDataSharingContext);
}