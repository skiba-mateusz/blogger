import type { User } from "@/types/api";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  type LoginUserRequest,
  type RegisterUserRequest,
} from "../api/auth";

interface AuthContextProps {
  user: User | null;
  login: (request: LoginUserRequest) => Promise<void>;
  register: (request: RegisterUserRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isAuth: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegisteringIn, setIsRegisteringIn] = useState(false);

  const isLoading = isFetchingUser || isLoggingIn || isRegisteringIn;

  const fetchCurrentUser = async () => {
    try {
      setIsError(false);
      setIsFetchingUser(true);
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      setIsError(true);
      console.error("failed to fetch current user: ", err);
    } finally {
      setIsFetchingUser(false);
    }
  };

  const login = async (request: LoginUserRequest) => {
    try {
      setIsError(false);
      setIsLoggingIn(true);
      await loginApi(request);
      await fetchCurrentUser();
    } catch (err) {
      setIsError(true);
      console.error("failed to login user: ", err);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (request: RegisterUserRequest) => {
    try {
      setIsError(false);
      setIsRegisteringIn(true);
      await registerApi(request);
    } catch (err) {
      setIsError(true);
      console.error("failed to register user: ", err);
      throw err;
    } finally {
      setIsRegisteringIn(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoggingIn(true);
      await logoutApi();
      setUser(null);
    } catch (err) {
      setIsError(true);
      console.error("failed to logout user: ", err);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const state = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isLoading,
      isError,
      isAuth: !!user,
    }),
    [user, login, isLoading, isError]
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext used outsied its provider");
  }
  return context;
}
