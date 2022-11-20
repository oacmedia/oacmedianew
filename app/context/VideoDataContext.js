import { View, Text } from 'react-native'
import React , {useContext ,createContext, useEffect} from 'react';
import { useState } from 'react';

const VideoDataContext = createContext();

export const VideoDataContextProvider = ({children}) => {
    const [videoData, setVideoData] = useState({})
    useEffect(() => {
      //console.log(user)
    }, [videoData])
    
  return (
    <VideoDataContext.Provider value={{videoData, setVideoData}}>
        {children}
    </VideoDataContext.Provider>
  )
}

export function useVideoData(){
    return useContext(VideoDataContext);
}