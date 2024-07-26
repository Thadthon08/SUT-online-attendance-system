import React, { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextData {
  isSigned: boolean;
  signIn(): void;
  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isSigned, setIsSigned] = useState(false);

  function signIn() {
    setIsSigned(true);
  }

  function signOut() {
    setIsSigned(false);
  }

  return (
    <AuthContext.Provider value={{ isSigned, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
