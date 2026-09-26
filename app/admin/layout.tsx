"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-encre text-white flex flex-col">
        <div className="p-6">
          <Link href="/" className="font-display text-2xl tracking-tight text-white hover:text-craie transition-colors">
            GTS Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {/* We will hide some links using CSS or we can let the server protect them. 
              Ideally we check the cookie role here, but since it's a client component without context, 
              we rely on the middleware to protect. For better UX, we'll just show them, 
              but it's cleaner to fetch the user role. We'll do a simple approach. */}
          <Link
            href="/admin"
            className={`block px-4 py-2 rounded transition-colors ${
              pathname === "/admin" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            Cours & PDFs
          </Link>
          <Link
            href="/admin/paiements"
            className={`block px-4 py-2 rounded transition-colors ${
              pathname === "/admin/paiements" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            Suivi Paiements
          </Link>
          <Link
            href="/admin/profil"
            className={`block px-4 py-2 rounded transition-colors ${
              pathname === "/admin/profil" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            Mon Profil
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
