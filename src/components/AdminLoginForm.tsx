"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

type LoginStatus = {
  message: string;
  tone: "neutral" | "error";
};

export function AdminLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<LoginStatus>({
    message: "Ingresa la clave privada para administrar el sitio.",
    tone: "neutral"
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");

    setStatus({ message: "Validando acceso...", tone: "neutral" });
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setStatus({ message: "La clave no es correcta.", tone: "error" });
      return;
    }

    router.refresh();
  }

  return (
    <main className="adminLoginPage">
      <form className="adminLoginCard" onSubmit={handleSubmit}>
        <span className="loginIcon" aria-hidden="true">
          <LockKeyhole size={24} />
        </span>
        <p className="eyebrow">Acceso privado</p>
        <h1>Administración del sitio</h1>
        <p>Esta sección es solo para la propietaria del sitio y no aparece en la navegación pública.</p>
        <label>
          Clave de acceso
          <input name="password" required type="password" autoComplete="current-password" placeholder="Clave privada" />
        </label>
        <button className="primaryButton formButton" type="submit">
          Entrar
        </button>
        <p className={`formStatus ${status.tone}`} aria-live="polite">
          {status.message}
        </p>
      </form>
    </main>
  );
}
