"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export function TopNavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="fixed top-0 w-full z-50 hidden md:flex justify-between items-center px-16 h-16 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex items-center gap-6">
        <Link href="/discover" className="flex items-center gap-2 opacity-100 hover:opacity-80 transition-opacity">
          <Logo className="w-7 h-7" />
          <span className="text-headline-md font-bold text-primary">Collawork</span>
        </Link>
      </div>
      <ul className="flex items-center gap-6 h-full">
        <li className="h-full flex items-center">
          <Link
            href="/discover"
            className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-medium"
          >
            Discover
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href={`/profile/${user.id}`}
              className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container flex items-center justify-center text-label-sm font-semibold text-on-surface-variant hover:border-primary transition-colors"
            >
              {user.profile_media?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profile_media.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="text-label-md font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-primary text-on-primary text-label-md font-medium px-4 py-2 rounded hover:bg-primary-container transition-colors"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
