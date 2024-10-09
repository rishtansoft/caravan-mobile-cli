import React, { createContext, useState, ReactNode } from 'react';

type User = {
  role: 'driver' | 'owner' | null;
};

type AuthContextType = {
  user: User | null;
  login: (role: 'driver' | 'owner') => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: 'driver' | 'owner') => {
    setUser({ role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
