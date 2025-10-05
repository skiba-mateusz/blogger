import { AuthLayout } from "@/components/layouts/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { useNavigate } from "react-router-dom";

export function LoginRoute() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <LoginForm onSuccess={() => navigate("/app")} />
    </AuthLayout>
  );
}
