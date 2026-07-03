import type { Metadata } from "next";
import { AdminAuth } from "@/components/admin-auth";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminAuth />;
}
