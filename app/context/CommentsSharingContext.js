import { View, Text } from 'react-native'
import React , {useContext ,createContext, useEffect} from 'react';
import { useState } from 'react';

const CommentsSharingContext = createContext();

export const CommentsSharingContextProvider = ({children}) => {
    const [commentsData, setCommentsData] = useState({})
    useEffect(() => {
      //console.log(user)
    }, [commentsData])
    
  return (
    <CommentsSharingContext.Provider value={{commentsData, setCommentsData}}>
        {children}
    </CommentsSharingContext.Provider>
  )
}

export function useCommentsSharing(){
    return useContext(CommentsSharingContext);
}