import React, {createContext, useState, useContext, ReactNode} from 'react';

interface UriContextType {
  uri: string | null;
  setUri: React.Dispatch<React.SetStateAction<string | null>>
}

const UriContext = createContext<UriContextType | undefined>(undefined);

export const UriProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [uri, setUri] = useState<string | null>(import.meta.env.VITE_API_REQUEST_URI);

  return (
    <UriContext.Provider value = {{uri,setUri}}>
      {children}
    </UriContext.Provider>
  )
}

export const useUri = (): UriContextType => {
  const context = useContext(UriContext);

  if (context === undefined) {
    throw new Error('useUri must be used within an UriProvider')
  }

  return context;
}