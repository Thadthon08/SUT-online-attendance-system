import React, { createContext, useState, ReactNode, useContext } from "react";
import { LoginResponseInterface } from "../interface/ILoginRespon";

interface AuthContextData {
  isSigned: boolean;
  signIn(token: LoginResponseInterface): void;
  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isSigned, setIsSigned] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });
  function signIn(token: LoginResponseInterface) {
    localStorage.setItem("email", JSON.stringify(token.token.email));
    localStorage.setItem("name", JSON.stringify(token.token.name));
    localStorage.setItem("token", JSON.stringify(token.token.token));
    setIsSigned(true);
  }

  function signOut() {
    localStorage.clear();
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
