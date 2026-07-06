"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Trash2 } from "lucide-react";

type Props = {
  propertyId: string;
  propertyTitle: string;
  redirectTo?: string;
  className?: string;
  label?: string;
};

export function AdminDeletePropertyButton({
  propertyId,
  propertyTitle,
  redirectTo,
  className,
  label
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar "${propertyTitle}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setPending(true);
    const response = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
    setPending(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      window.alert(payload?.message ?? "No se pudo eliminar la propiedad.");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo as Route);
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      className={className ?? "ghostButton dangerButton"}
      onClick={handleDelete}
      disabled={pending}
    >
      <Trash2 size={14} />
      {pending ? "Eliminando..." : label ?? "Eliminar"}
    </button>
  );
}
