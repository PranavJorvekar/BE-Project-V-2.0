"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabNavProps {
    projectId: string;
    warnCount?: number;
}

export default function TabNav({ projectId, warnCount = 3 }: TabNavProps) {
    const pathname = usePathname();
    const base = `/projects/${projectId}`;

    const tabs = [
        { label: "Epics", href: base, icon: "layers", exact: true },
        { label: "Tasks", href: `${base}/tasks`, icon: "task_alt" },
        { label: "Team", href: `${base}/team`, icon: "group" },
        { label: "Timeline", href: `${base}/timeline`, icon: "timeline" },
        { label: "Warnings", href: `${base}/warnings`, icon: "warning", badge: warnCount },
        { label: "Share", href: `${base}/share`, icon: "share" },
    ];

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => {
                        const isActive = tab.exact
                            ? pathname === tab.href
                            : pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${isActive
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                {tab.label}
                                {tab.badge !== undefined && tab.badge > 0 && (
                                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {tab.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
