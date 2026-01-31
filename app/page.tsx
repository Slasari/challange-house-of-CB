import { cookies } from "next/headers";
import Link from "next/link";
import { logout } from "./actions/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth_token");

  return (
    <main>
      <h1>Bienvenido</h1>
      
      {isLoggedIn ? (
        <div>
          <p>Ya estás dentro</p>
          <Link href="/tasks"> Ir al Panel</Link>
   <button onClick={logout}> cerrar session</button>
        </div>
      ) : (
        <div>
          <Link href="/login">
            <button>Iniciar sesión</button>
          </Link>
          <Link href="/register">
            <button>Registrarse</button>
          </Link>
        </div>
      )}
    </main>
  );
}