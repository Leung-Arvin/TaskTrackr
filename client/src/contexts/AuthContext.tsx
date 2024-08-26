import {createContext, useState, useContext, ReactNode} from 'react';

interface AuthContextType {
  auth: string | null;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [auth,setAuth] = useState<string | null>(localStorage.getItem('token') || null);

  return (
    <AuthContext.Provider value={{auth,setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context;
}