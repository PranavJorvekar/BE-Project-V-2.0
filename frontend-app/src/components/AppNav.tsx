"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNav() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/projects" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                        <span className="material-symbols-outlined text-white text-sm">psychology</span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base">AI SDLC Analyst</span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    <NavLink href="/projects" label="Projects" icon="folder_open" active={pathname.startsWith("/projects")} />
                    <NavLink href="/templates" label="Templates" icon="grid_view" active={pathname.startsWith("/templates")} />
                    <NavLink href="/employees" label="Employees" icon="group" active={pathname.startsWith("/employees")} />
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-lg">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                    </button>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer select-none"
                        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                        U
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            style={active ? { backgroundColor: "#EEF2FF", color: "#4F46E5" } : {}}
        >
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
        </Link>
    );
}
