"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function BottomNavBar() {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center h-16 bg-surface-container-lowest border-t border-outline-variant">
      <Link
        href="/discover"
        className="flex flex-col items-center justify-center gap-1 text-primary font-bold w-full h-full hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined">grid_view</span>
        <span className="text-label-sm">Discover</span>
      </Link>
      <Link
        href={user ? `/profile/${user.id}` : "/login"}
        className="flex flex-col items-center justify-center gap-1 text-on-surface-variant w-full h-full hover:bg-surface-container hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined">account_circle</span>
        <span className="text-label-sm">Profile</span>
      </Link>
    </nav>
  );
}
