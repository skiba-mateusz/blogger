import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useNavigate } from "react-router-dom";

export function RegisterRoute() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <RegisterForm onSuccess={() => navigate("/auth/login")} />
    </AuthLayout>
  );
}
