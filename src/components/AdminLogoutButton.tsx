"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <button className="secondaryButton" type="button" onClick={handleLogout}>
      <LogOut size={18} />
      Cerrar sesión
    </button>
  );
}
