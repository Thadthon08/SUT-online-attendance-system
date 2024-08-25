import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { TeacherData } from "../interface/ITeacher";

interface AuthContextData {
  isSigned: boolean;
  teacherData: TeacherData | null;
  signIn: (teacherData: TeacherData, token: string) => void;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isSigned, setIsSigned] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const [teacherData, setTeacherData] = useState<TeacherData | null>(() => {
    const savedData = localStorage.getItem("teacherData");
    return savedData ? JSON.parse(savedData) : null;
  });

  const signIn = useCallback((data: TeacherData, token: string) => {
    setTeacherData(data);
    localStorage.setItem("token", token);
    localStorage.setItem("teacherData", JSON.stringify(data));
    setIsSigned(true);
  }, []);

  const signOut = useCallback(() => {
    setTeacherData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("teacherData");
    setIsSigned(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      isSigned,
      teacherData,
      signIn,
      signOut,
    }),
    [isSigned, teacherData, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
