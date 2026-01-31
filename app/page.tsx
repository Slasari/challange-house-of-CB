import { cookies } from "next/headers";
import Link from "next/link";
import { logout } from "./actions/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth_token");

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="min-w-[320px] w-3xl text-white flex gap-30 rounded-2xl flex-col">
        <h1 className="text-center text-6xl">Bienvenido</h1>
        {isLoggedIn ? (
            <div className="flex justify-around">
              <Link href="/tasks">
              <button className="cursor-pointer text-2xl">Lista de tareas</button>
              </Link>
              <button className="cursor-pointer text-2xl" onClick={logout}>Cerrar sesión</button>
          </div>
        ) : (
          <div className="flex justify-around">
            <Link href="/login">
              <button className="cursor-pointer text-2xl">Iniciar sesión</button>
            </Link>
            <Link href="/register">
              <button className="cursor-pointer text-2xl">Registrarse</button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
