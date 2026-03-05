"use client";

import { useState, useEffect, use } from "react";
import AppNav from "@/components/AppNav";
import TabNav from "@/components/TabNav";
import MetricCard from "@/components/MetricCard";
import Badge from "@/components/Badge";
import Link from "next/link";
import { getProject } from "@/lib/api";

const priorityVariant: Record<string, "danger" | "warning" | "gray"> = {
    High: "danger",
    Medium: "warning",
    Low: "gray",
};

export default function EpicsPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedEpics, setExpandedEpics] = useState<string[]>([]);

    useEffect(() => {
        getProject(projectId).then(data => {
            setProject(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-indigo-500 text-4xl">refresh</span>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-gray-800">Project Not Found</h2>
                <Link href="/projects" className="mt-4 text-indigo-600 hover:underline">Return to Projects</Link>
            </div>
        );
    }

    const toggleEpic = (id: string) => {
        setExpandedEpics((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const totalTasks = project.epics.reduce((sum: number, e: any) => sum + e.taskCount, 0);
    const totalHours = project.epics.reduce((sum: number, e: any) => sum + e.totalHours, 0);
    const statusLabel = project.status === "IN_PLANNING" ? "In Planning" : project.status;

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />

            {/* Project Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold text-gray-900">{project.name}</h1>
                                    <Badge label={statusLabel} variant="warning" />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Created on {new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/projects/${projectId}/share`} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-base">share</span>
                                Share
                            </Link>
                            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-all"
                                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                                <span className="material-symbols-outlined text-base">download</span>
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <TabNav projectId={projectId} />

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <MetricCard icon="task_alt" value={totalTasks.toString()} label="Total Tasks" subtext={`Across ${project.epics.length} epics`} />
                    <MetricCard icon="schedule" iconColor="text-purple-600" iconBg="bg-purple-50" value={`${totalHours}h`} label="Estimated Hours" />
                    <MetricCard icon="calendar_month" iconColor="text-emerald-600" iconBg="bg-emerald-50" value={`${project.timeline || 8} wks`} label="Timeline" />
                    <MetricCard icon="group" iconColor="text-amber-600" iconBg="bg-amber-50" value={project.team.length.toString()} label="Team Members" />
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">Project Epics ({project.epics.length})</h2>
                    <button
                        onClick={() => setExpandedEpics(expandedEpics.length === project.epics.length ? [] : project.epics.map((e: any) => e.id))}
                        className="text-xs text-indigo-600 hover:underline"
                    >
                        {expandedEpics.length === project.epics.length ? "Collapse all" : "Expand all"}
                    </button>
                </div>

                {/* Epic Cards */}
                <div className="space-y-3">
                    {project.epics.map((epic: any) => {
                        const isExpanded = expandedEpics.includes(epic.id);
                        return (
                            <div key={epic.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Epic Header */}
                                <button onClick={() => toggleEpic(epic.id)} className="w-full text-left p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-indigo-600 text-base">layers</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-400">{epic.code}</span>
                                                <h3 className="font-semibold text-gray-900">{epic.name}</h3>
                                                <Badge label={epic.priority} variant={priorityVariant[epic.priority] || "gray"} />
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">task_alt</span>
                                                    {epic.taskCount} tasks
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                                    {epic.totalHours}h estimated
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-gray-100">
                                        <div className="py-4">
                                            <p className="text-sm text-gray-600 mb-3">{epic.goal}</p>
                                            {epic.scopeHighlights && Array.isArray(epic.scopeHighlights) && (
                                                <ul className="space-y-1.5">
                                                    {epic.scopeHighlights.map((s: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                            <span className="material-symbols-outlined text-indigo-500 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Task Preview */}
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="text-xs font-medium text-gray-500 mb-2">Task Preview</div>
                                            <div className="space-y-1.5">
                                                {epic.tasks?.slice(0, 5).map((task: any) => (
                                                    <div key={task.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-700">{task.name}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{task.effort}h</span>
                                                    </div>
                                                ))}
                                                {epic.tasks?.length > 5 && (
                                                    <div className="text-xs text-gray-400 italic mt-1">
                                                        + {epic.tasks.length - 5} more tasks
                                                    </div>
                                                )}
                                            </div>
                                            <Link href={`/projects/${projectId}/tasks`} className="mt-3 text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                                View all tasks
                                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI FAB */}
            <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl text-white flex items-center justify-center hover:scale-110 transition-all"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}>
                <span className="material-symbols-outlined text-2xl">smart_toy</span>
            </button>
        </div>
    );
}
