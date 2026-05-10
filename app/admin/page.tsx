import { redirect } from "next/navigation";

export default function AdminIndex() {
  // Redirect to the admin dashboard. The middleware or the dashboard page itself
  // will handle redirecting unauthenticated users to /admin/login.
  redirect("/admin/dashboard");
}
