"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const error = await register({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-8">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 min-w-[320px]">
        <h1 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Crear cuenta
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Correo Electrónico
            </label>
          </div>
          <div className="relative group">
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-200 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 group-hover:border-slate-300"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Contraseña
            </label>
          </div>
          <div className="relative group">
          <input
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-200 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 group-hover:border-slate-300"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          <button className="w-full cursor-pointer bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 mt-2" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <span className=" text-slate-800">
          Ya tenes cuenta?{" "}
          <span
            className="cursor-pointer text-blue-950 font-semibold"
            onClick={() => router.push("/login")}
          >
            Iniciar sesión
          </span>
        </span>
      </div>
    </main>
  );
}
