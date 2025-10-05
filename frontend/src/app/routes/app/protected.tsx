import { useAuth } from "@/features/auth/hooks/use-auth";
import { Loader } from "lucide-react";
import type React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, user, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <Loader size={64} className="animate-spin z-50" />
      </div>
    );
  }

  if (!isAuth || isError || !user) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}
