import { useAuth } from "@/features/auth/hooks/use-auth";
import type React from "react";
import { Navigate } from "react-router-dom";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuth, isLoading } = useAuth();

  if (user && isAuth && !isLoading) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {children}
    </div>
  );
}
