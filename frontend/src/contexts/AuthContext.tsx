import { createContext, useState, ReactNode, useContext } from "react";
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
    localStorage.setItem("teacher_id", JSON.stringify(token.token.teacher_id));
    localStorage.setItem("firstname", JSON.stringify(token.token.firstname));
    localStorage.setItem("lastname", JSON.stringify(token.token.lastname));
    localStorage.setItem(
      "phone_number",
      JSON.stringify(token.token.phone_number)
    );
    localStorage.setItem(
      "profile_pic",
      JSON.stringify(token.token.profile_pic)
    );
    localStorage.setItem("email", JSON.stringify(token.token.email));
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
