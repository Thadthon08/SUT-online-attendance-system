import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import {
  LoginResponseInterface,
  UserResponse,
} from "../interface/ILoginRespon";

interface AuthContextData {
  isSigned: boolean;
  user: UserResponse | null;
  signIn(response: LoginResponseInterface): void;
  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isSigned, setIsSigned] = useState<boolean>(() => {
    const token = sessionStorage.getItem("access_token");
    return !!token;
  });

  const [user, setUser] = useState<UserResponse | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const tokenExpiry = sessionStorage.getItem("token_expiry");

    if (token && tokenExpiry) {
      const currentTime = Date.now();
      const expiryTime = parseInt(tokenExpiry, 10);

      if (currentTime >= expiryTime) {
        signOut();
      } else {
        const remainingTime = expiryTime - currentTime;
        setTimeout(() => {
          signOut();
        }, remainingTime);
      }
    } else {
      signOut();
    }
  }, []);

  function signIn(response: LoginResponseInterface) {
    const { access_token, expires_in } = response.token;
    const userData = response.user;

    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsSigned(true);

    const tokenExpiry = Date.now() + expires_in * 1000;
    sessionStorage.setItem("token_expiry", tokenExpiry.toString());

    setTimeout(() => {
      signOut();
    }, expires_in * 1000);
  }

  function signOut() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token_expiry");
    setUser(null);
    setIsSigned(false);
  }

  return (
    <AuthContext.Provider value={{ isSigned, user, signIn, signOut }}>
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
