import { View, Text } from 'react-native'
import React , {useContext ,createContext, useEffect} from 'react';
import { useState } from 'react';

const DataSharingContext = createContext();

export const DataSharingContextProvider = ({children}) => {
    const [sharedData, setSharedData] = useState({})
    useEffect(() => {
      //console.log(user)
    }, [sharedData])
    
  return (
    <DataSharingContext.Provider value={{sharedData, setSharedData}}>
        {children}
    </DataSharingContext.Provider>
  )
}

export function useDataSharing(){
    return useContext(DataSharingContext);
}