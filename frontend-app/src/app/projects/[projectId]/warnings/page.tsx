"use client";

import { useState, useEffect, use } from "react";
import AppNav from "@/components/AppNav";
import TabNav from "@/components/TabNav";
import MetricCard from "@/components/MetricCard";
import Badge from "@/components/Badge";
import Link from "next/link";
import { getProject } from "@/lib/api";

const severityConfig: Record<string, { borderColor: string; iconBg: string; iconColor: string; badgeVariant: "danger" | "warning" | "primary" }> = {
    Critical: { borderColor: "#EF4444", iconBg: "bg-red-100", iconColor: "text-red-600", badgeVariant: "danger" },
    High: { borderColor: "#F59E0B", iconBg: "bg-amber-100", iconColor: "text-amber-600", badgeVariant: "warning" },
    Medium: { borderColor: "#6366F1", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", badgeVariant: "primary" },
};

export default function WarningsPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);

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

    const allWarnings = project.warnings || [];
    const activeWarnings = allWarnings.filter((w: any) => !dismissedWarnings.includes(w.id));

    const dismiss = (id: string) => setDismissedWarnings([...dismissedWarnings, id]);

    const critical = activeWarnings.filter((w: any) => w.severity === "Critical").length;
    const high = activeWarnings.filter((w: any) => w.severity === "High").length;
    const medium = activeWarnings.filter((w: any) => w.severity === "Medium").length;

    const allTasks = project.epics.flatMap((e: any) => e.tasks || []);
    const totalTasks = allTasks.length;
    const totalHours = allTasks.reduce((s: number, t: any) => s + (t.effort || 0), 0);
    const statusLabel = project.status === "IN_PLANNING" ? "In Planning" : project.status;

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link href="/projects" className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-lg">arrow_back</span></Link>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-gray-900">{project.name}</h1>
                            <Badge label={statusLabel} variant="warning" />
                        </div>
                    </div>
                </div>
            </div>
            <TabNav projectId={projectId} warnCount={activeWarnings.length} />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard icon="task_alt" value={totalTasks.toString()} label="Total Tasks" />
                    <MetricCard icon="schedule" iconColor="text-purple-600" iconBg="bg-purple-50" value={`${totalHours}h`} label="Estimated Hours" />
                    <MetricCard icon="calendar_month" iconColor="text-emerald-600" iconBg="bg-emerald-50" value={`${project.timeline || 8} wks`} label="Timeline" />
                    <MetricCard icon="group" iconColor="text-amber-600" iconBg="bg-amber-50" value={project.team.length.toString()} label="Team Members" />
                </div>

                {/* Risk Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                <h2 className="font-semibold text-gray-900">Risk Overview</h2>
                            </div>
                            <p className="text-sm text-gray-500">{activeWarnings.length} active risk{activeWarnings.length !== 1 ? "s" : ""} detected. Address critical items first.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{critical}</div>
                                <div className="text-xs text-gray-400">Critical</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-600">{high}</div>
                                <div className="text-xs text-gray-400">High</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600">{medium}</div>
                                <div className="text-xs text-gray-400">Medium</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Cards */}
                {activeWarnings.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-emerald-400 mb-3 block">check_circle</span>
                        <h3 className="font-semibold text-gray-700 text-lg">No active warnings</h3>
                        <p className="text-gray-400 text-sm mt-1">All risks have been addressed.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {activeWarnings.map((warning: any) => {
                        const config = severityConfig[warning.severity] || severityConfig.Medium;
                        return (
                            <div
                                key={warning.id}
                                className="bg-white rounded-xl border-l-4 border border-gray-200 p-5"
                                style={{ borderLeftColor: config.borderColor }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                                        <span className={`material-symbols-outlined text-xl ${config.iconColor}`}>{warning.icon || "warning"}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{warning.title}</h3>
                                            <Badge label={warning.severity} variant={config.badgeVariant} />
                                            <span className="text-xs text-gray-400">{warning.affectedArea}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{warning.problem}</p>

                                        <div className="p-3 rounded-lg" style={{ background: "#EEF2FF" }}>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <span className="material-symbols-outlined text-indigo-600 text-sm">smart_toy</span>
                                                <span className="text-xs font-semibold text-indigo-700">AI Recommendations</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {(warning.recommendations || []).map((rec: string, i: number) => (
                                                    <li key={i} className="text-xs text-indigo-700 flex items-start gap-1.5">
                                                        <span className="text-indigo-400 flex-shrink-0 mt-0.5">•</span>
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3">
                                            <button className="px-3 py-1.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-all"
                                                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                                                {warning.actionLabel || "Review"}
                                            </button>
                                            <button
                                                onClick={() => dismiss(warning.id)}
                                                className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
