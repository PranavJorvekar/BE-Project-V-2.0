"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import Badge from "@/components/Badge";
import { getProjects, ProjectSummary, deleteProject } from "@/lib/api";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "gray" | "primary" }> = {
    DRAFT: { label: "Draft", variant: "gray" },
    GENERATING: { label: "Generating", variant: "warning" },
    IN_PLANNING: { label: "In Planning", variant: "primary" },
    IN_PROGRESS: { label: "In Progress", variant: "primary" },
    COMPLETED: { label: "Completed", variant: "success" },
};

const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
];

export default function ProjectsPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects()
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete project:", err);
            alert("Failed to delete project. Please try again.");
        }
    };

    const filtered = projects.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Manage and review your AI-generated development plans.</p>
                    </div>
                    <Link
                        href="/projects/new"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        New Project
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-sm mb-6">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="material-symbols-outlined animate-spin text-indigo-500 text-3xl">refresh</span>
                    </div>
                ) : (
                    /* Projects Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((project) => {
                            const status = statusMap[project.status] || { label: project.status, variant: "gray" };

                            // Determine link destination based on status
                            const destUrl = project.status === "GENERATING" || project.status === "DRAFT"
                                ? `/projects/new/generating?projectId=${project.id}`
                                : `/projects/${project.id}`;

                            const handleCardClick = () => {
                                router.push(destUrl);
                            };

                            return (
                                <div
                                    key={project.id}
                                    onClick={handleCardClick}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all group cursor-pointer flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)" }}>
                                                <span className="material-symbols-outlined text-indigo-600 text-lg">folder_open</span>
                                            </div>
                                            <Badge label={status.label} variant={status.variant as any} />
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, project.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Delete Project"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>

                                    {/* Name & Description */}
                                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">{project.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>

                                    {/* Progress */}
                                    {project.status !== "IN_PLANNING" && project.status !== "GENERATING" && project.status !== "DRAFT" && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <span className="font-medium">{project.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${project.progress}%`,
                                                        background: project.progress === 100
                                                            ? "#10B981"
                                                            : "linear-gradient(90deg, #6366F1, #8B5CF6)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-auto">
                                        {/* Team Avatars */}
                                        <div className="flex -space-x-2">
                                            {project.team.slice(0, 4).map((member, i) => (
                                                <div
                                                    key={member.id}
                                                    title={member.name}
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white ${avatarColors[i % avatarColors.length]}`}
                                                >
                                                    {member.initials}
                                                </div>
                                            ))}
                                            {project.team.length > 4 && (
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white bg-gray-100 text-gray-600">
                                                    +{project.team.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">layers</span>
                                                {project.epicCount} epics
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">task_alt</span>
                                                {project.taskCount} tasks
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Create New Card */}
                        <Link
                            href="/projects/new"
                            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[200px]"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-600 text-2xl transition-colors">add</span>
                            </div>
                            <div className="font-semibold text-gray-600 group-hover:text-indigo-700 transition-colors">Create New Project</div>
                            <div className="text-sm text-gray-400 mt-1">Generate an AI-powered plan</div>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
