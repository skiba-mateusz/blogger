import { Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app-layout";

export function Root() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
