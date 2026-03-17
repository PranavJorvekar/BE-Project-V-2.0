"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import Badge from "@/components/Badge";
import { getDashboardStats, DashboardStats, ProjectSummary } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────────
type DashboardView = "strategic" | "operational" | "analytical" | "tactical";

// ─── Config ────────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bar: string; variant: "success" | "warning" | "gray" | "primary" }> = {
    DRAFT: { label: "Draft", color: "#9CA3AF", bar: "bg-gray-400", variant: "gray" },
    GENERATING: { label: "Generating", color: "#F59E0B", bar: "bg-amber-400", variant: "warning" },
    IN_PLANNING: { label: "In Planning", color: "#6366F1", bar: "bg-indigo-500", variant: "primary" },
    IN_PROGRESS: { label: "In Progress", color: "#8B5CF6", bar: "bg-purple-500", variant: "primary" },
    COMPLETED: { label: "Completed", color: "#10B981", bar: "bg-emerald-500", variant: "success" },
};

const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
];

const DASHBOARD_VIEWS: { id: DashboardView; label: string; icon: string; desc: string; accent: string; accentBg: string }[] = [
    { id: "strategic", label: "Strategic", icon: "monitoring", desc: "Executive KPIs & long-term goals", accent: "text-indigo-600", accentBg: "bg-indigo-50" },
    { id: "operational", label: "Operational", icon: "settings_suggest", desc: "Real-time efficiency & health", accent: "text-emerald-600", accentBg: "bg-emerald-50" },
    { id: "analytical", label: "Analytical", icon: "analytics", desc: "Trends, drivers & deep analysis", accent: "text-purple-600", accentBg: "bg-purple-50" },
    { id: "tactical", label: "Tactical", icon: "checklist_rtl", desc: "Mid-management task tracking", accent: "text-amber-600", accentBg: "bg-amber-50" },
];

// ─── Shared Components ─────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
            {children}
        </div>
    );
}

function CardHeader({ icon, label, accent, accentBg, right }: { icon: string; label: string; accent: string; accentBg: string; right?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${accent} text-base`}>{icon}</span>
                </div>
                <h2 className="font-semibold text-gray-900">{label}</h2>
            </div>
            {right}
        </div>
    );
}

function KpiCard({ icon, label, value, sub, accentColor, accentBg, trend }: {
    icon: string; label: string; value: string | number; sub?: string;
    accentColor: string; accentBg: string; trend?: { val: string; up: boolean };
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined text-lg ${accentColor}`}>{icon}</span>
                </div>
                {trend && (
                    <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${trend.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        <span className="material-symbols-outlined text-xs">{trend.up ? "trending_up" : "trending_down"}</span>
                        {trend.val}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function StatusBar({ status, count, max }: { status: string; count: number; max: number }) {
    const cfg = statusConfig[status] || { label: status, bar: "bg-gray-400" };
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-24 flex-shrink-0">{cfg.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-gray-700 w-6 text-right flex-shrink-0">{count}</span>
        </div>
    );
}

function ProjectRow({ project, rank }: { project: ProjectSummary; rank?: number }) {
    const cfg = statusConfig[project.status] || { label: project.status, variant: "gray" };
    const href = project.status === "GENERATING" || project.status === "DRAFT"
        ? `/projects/new/generating?projectId=${project.id}`
        : `/projects/${project.id}`;
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
            {rank !== undefined && (
                <span className="w-5 text-xs font-bold text-gray-300 flex-shrink-0">#{rank}</span>
            )}
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)" }}>
                <span className="material-symbols-outlined text-indigo-600 text-sm">folder_open</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{project.name}</span>
                    <Badge label={cfg.label} variant={cfg.variant as any} />
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span>{project.epicCount} epics</span>
                    <span>{project.taskCount} tasks</span>
                    {project.warningCount > 0 && (
                        <span className="text-amber-600 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">warning</span>
                            {project.warningCount}
                        </span>
                    )}
                </div>
            </div>
            {project.status !== "DRAFT" && project.status !== "GENERATING" && project.status !== "IN_PLANNING" && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                            width: `${project.progress}%`,
                            background: project.progress === 100 ? "#10B981" : "linear-gradient(90deg,#6366F1,#8B5CF6)"
                        }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{project.progress}%</span>
                </div>
            )}
            <span className="material-symbols-outlined text-gray-300 group-hover:text-indigo-400 text-base flex-shrink-0">chevron_right</span>
        </Link>
    );
}

function DonutChart({ stats }: { stats: DashboardStats }) {
    const total = stats.totalProjects || 1;
    const circumference = 2 * Math.PI * 15.9;
    const segments = Object.entries(stats.statusBreakdown);
    let offset = 0;
    return (
        <div className="relative w-32 h-32 mx-auto">
            <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                {segments.map(([status, count]) => {
                    const pct = count / total;
                    const dash = pct * circumference;
                    const cfg = statusConfig[status];
                    const el = (
                        <circle key={status} cx="18" cy="18" r="15.9" fill="none"
                            stroke={cfg?.color || "#9CA3AF"} strokeWidth="3"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset} strokeLinecap="butt" />
                    );
                    offset += dash;
                    return el;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{stats.totalProjects}</span>
                <span className="text-xs text-gray-400">total</span>
            </div>
        </div>
    );
}

// ─── Strategic Dashboard (Executive Overview) ──────────────────────────────────
function StrategicView({ stats }: { stats: DashboardStats }) {
    const completedCount = stats.statusBreakdown["COMPLETED"] || 0;
    const activeCount = (stats.statusBreakdown["IN_PROGRESS"] || 0) + (stats.statusBreakdown["IN_PLANNING"] || 0);
    const draftCount = (stats.statusBreakdown["DRAFT"] || 0) + (stats.statusBreakdown["GENERATING"] || 0);
    const completionRate = stats.totalProjects > 0 ? Math.round((completedCount / stats.totalProjects) * 100) : 0;
    const healthScore = stats.totalProjects > 0
        ? Math.max(0, 100 - Math.round((stats.totalWarnings / stats.totalProjects) * 20) - (draftCount > 0 ? 5 : 0))
        : 100;
    const maxStatus = Math.max(...Object.values(stats.statusBreakdown), 1);

    return (
        <div className="space-y-6">
            {/* Executive KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon="folder_open" label="Total Projects" value={stats.totalProjects}
                    sub={`${activeCount} active · ${completedCount} done`}
                    accentColor="text-indigo-600" accentBg="bg-indigo-50" trend={{ val: `${activeCount} live`, up: true }} />
                <KpiCard icon="check_circle" label="Completion Rate" value={`${completionRate}%`}
                    sub={`${completedCount} of ${stats.totalProjects} projects`}
                    accentColor="text-emerald-600" accentBg="bg-emerald-50" trend={{ val: completionRate >= 50 ? "On track" : "Lagging", up: completionRate >= 50 }} />
                <KpiCard icon="group" label="Team Size" value={stats.totalTeamMembers}
                    sub={`Across ${stats.totalProjects} projects`}
                    accentColor="text-blue-600" accentBg="bg-blue-50" />
                <KpiCard icon="health_and_safety" label="Portfolio Health" value={`${healthScore}%`}
                    sub={stats.totalWarnings === 0 ? "No active risks" : `${stats.totalWarnings} open risks`}
                    accentColor={healthScore >= 80 ? "text-emerald-600" : "text-amber-600"}
                    accentBg={healthScore >= 80 ? "bg-emerald-50" : "bg-amber-50"}
                    trend={{ val: healthScore >= 80 ? "Healthy" : "At risk", up: healthScore >= 80 }} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Portfolio Status Donut */}
                <Card>
                    <CardHeader icon="donut_small" label="Portfolio Status" accent="text-indigo-600" accentBg="bg-indigo-50" />
                    <DonutChart stats={stats} />
                    <div className="mt-5 space-y-2.5">
                        {Object.entries(statusConfig).map(([key, cfg]) => {
                            const count = stats.statusBreakdown[key] || 0;
                            if (count === 0) return null;
                            return <StatusBar key={key} status={key} count={count} max={maxStatus} />;
                        })}
                    </div>
                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(statusConfig).map(([key, cfg]) => {
                            if (!stats.statusBreakdown[key]) return null;
                            return (
                                <div key={key} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                                    <span className="text-xs text-gray-500">{cfg.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Strategic Goals */}
                <Card className="xl:col-span-2">
                    <CardHeader icon="flag" label="Strategic Priorities" accent="text-purple-600" accentBg="bg-purple-50"
                        right={<Link href="/projects" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View all <span className="material-symbols-outlined text-xs">arrow_forward</span></Link>} />
                    <div className="space-y-1">
                        {stats.recentProjects.length === 0 ? (
                            <p className="text-sm text-gray-400 py-8 text-center">No projects yet.</p>
                        ) : (
                            stats.recentProjects.map((p, i) => <ProjectRow key={p.id} project={p} rank={i + 1} />)
                        )}
                    </div>
                </Card>
            </div>

            {/* Risk Matrix */}
            <Card>
                <CardHeader icon="shield_with_heart" label="Risk Overview" accent="text-amber-600" accentBg="bg-amber-50"
                    right={stats.totalWarnings > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{stats.totalWarnings} risks</span>
                    ) : undefined} />
                {stats.warningProjects.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                        <div>
                            <p className="text-sm font-medium text-emerald-800">Portfolio is risk-free</p>
                            <p className="text-xs text-emerald-600">No open warnings across any projects.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stats.warningProjects.map(wp => {
                            const dest = wp.status === "GENERATING" || wp.status === "DRAFT"
                                ? `/projects/new/generating?projectId=${wp.id}`
                                : `/projects/${wp.id}/warnings`;
                            const severity = wp.warningCount >= 3 ? "high" : wp.warningCount === 2 ? "medium" : "low";
                            const sevColors = { high: "border-red-200 bg-red-50", medium: "border-amber-200 bg-amber-50/60", low: "border-yellow-100 bg-yellow-50/50" };
                            const sevBadge = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-yellow-100 text-yellow-700" };
                            return (
                                <Link key={wp.id} href={dest}
                                    className={`flex items-start gap-3 p-4 rounded-xl border ${sevColors[severity]} hover:opacity-80 transition-opacity group`}>
                                    <span className="material-symbols-outlined text-amber-500 text-lg flex-shrink-0 mt-0.5">report_problem</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-amber-800">{wp.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${sevBadge[severity]}`}>{severity.toUpperCase()} RISK</span>
                                            <span className="text-xs text-gray-400">{wp.warningCount} warning{wp.warningCount !== 1 ? "s" : ""}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}

// ─── Operational Dashboard (Real-time health & activity) ───────────────────────
function OperationalView({ stats }: { stats: DashboardStats }) {
    const completedCount = stats.statusBreakdown["COMPLETED"] || 0;
    const inProgressCount = stats.statusBreakdown["IN_PROGRESS"] || 0;
    const planningCount = stats.statusBreakdown["IN_PLANNING"] || 0;
    const generatingCount = stats.statusBreakdown["GENERATING"] || 0;
    const draftCount = stats.statusBreakdown["DRAFT"] || 0;
    const throughput = stats.totalProjects > 0 ? Math.round((completedCount / stats.totalProjects) * 100) : 0;
    const wip = inProgressCount + planningCount;
    const avgTasksPerMember = stats.totalTeamMembers > 0 ? Math.round(stats.totalTasks / stats.totalTeamMembers) : 0;

    const statusGroups = [
        { key: "IN_PROGRESS", label: "In Progress", count: inProgressCount, icon: "play_circle", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
        { key: "IN_PLANNING", label: "In Planning", count: planningCount, icon: "edit_note", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
        { key: "GENERATING", label: "Generating", count: generatingCount, icon: "autorenew", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { key: "DRAFT", label: "Draft", count: draftCount, icon: "draft", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-100" },
        { key: "COMPLETED", label: "Completed", count: completedCount, icon: "task_alt", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    ];

    return (
        <div className="space-y-6">
            {/* Operational Gauges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon="play_circle" label="Active Projects" value={wip} sub="In progress or planning" accentColor="text-purple-600" accentBg="bg-purple-50" trend={{ val: "Live", up: wip > 0 }} />
                <KpiCard icon="repeat" label="Throughput Rate" value={`${throughput}%`} sub={`${completedCount} projects done`} accentColor="text-emerald-600" accentBg="bg-emerald-50" trend={{ val: throughput >= 50 ? "Good" : "Low", up: throughput >= 50 }} />
                <KpiCard icon="person_search" label="Avg Tasks/Member" value={avgTasksPerMember} sub={`Across ${stats.totalTeamMembers} members`} accentColor="text-blue-600" accentBg="bg-blue-50" />
                <KpiCard icon="warning" label="Active Issues" value={stats.totalWarnings} sub={stats.totalWarnings === 0 ? "All systems clear" : `${stats.warningProjects.length} projects`} accentColor={stats.totalWarnings > 0 ? "text-amber-600" : "text-emerald-600"} accentBg={stats.totalWarnings > 0 ? "bg-amber-50" : "bg-emerald-50"} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Pipeline Status */}
                <Card>
                    <CardHeader icon="account_tree" label="Project Pipeline" accent="text-purple-600" accentBg="bg-purple-50" />
                    <div className="space-y-3">
                        {statusGroups.map(({ key, label, count, icon, color, bg, border }) => (
                            <div key={key} className={`flex items-center gap-4 p-3 rounded-xl border ${border} ${bg}`}>
                                <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0`}>
                                    <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{label}</span>
                                        <span className="text-sm font-bold text-gray-800">{count}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${statusConfig[key]?.bar || "bg-gray-300"}`}
                                            style={{ width: `${stats.totalProjects > 0 ? Math.round(count / stats.totalProjects * 100) : 0}%` }} />
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0 font-medium w-8 text-right">
                                    {stats.totalProjects > 0 ? Math.round(count / stats.totalProjects * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Team Capacity */}
                <Card>
                    <CardHeader icon="people_alt" label="Team Load" accent="text-emerald-600" accentBg="bg-emerald-50"
                        right={<Link href="/employees" className="text-xs text-indigo-600 hover:underline">Manage</Link>} />
                    {stats.allTeamMembers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No team members yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {stats.allTeamMembers.slice(0, 7).map((m, i) => {
                                const load = Math.min(100, m.projects.length * 33);
                                const loadColor = load >= 80 ? "bg-red-400" : load >= 50 ? "bg-amber-400" : "bg-emerald-400";
                                return (
                                    <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>{m.initials}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-800 truncate">{m.name}</span>
                                                <span className={`text-xs font-semibold flex-shrink-0 ml-2 ${load >= 80 ? "text-red-600" : load >= 50 ? "text-amber-600" : "text-emerald-600"}`}>{load}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all ${loadColor}`} style={{ width: `${load}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {stats.allTeamMembers.length > 7 && (
                                <Link href="/employees" className="flex items-center justify-center gap-1 pt-1 text-xs text-indigo-600 hover:underline">
                                    +{stats.allTeamMembers.length - 7} more <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </Link>
                            )}
                        </div>
                    )}
                </Card>
            </div>

            {/* Live Issues */}
            <Card>
                <CardHeader icon="warning" label="Live Issues & Blockers" accent="text-amber-600" accentBg="bg-amber-50"
                    right={stats.totalWarnings > 0 ? <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">{stats.totalWarnings} open</span> : undefined} />
                {stats.warningProjects.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                        <p className="text-sm font-medium text-emerald-800">No blockers — all systems operational</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {stats.warningProjects.map(wp => {
                            const dest = wp.status === "GENERATING" || wp.status === "DRAFT"
                                ? `/projects/new/generating?projectId=${wp.id}`
                                : `/projects/${wp.id}/warnings`;
                            return (
                                <Link key={wp.id} href={dest}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/60 hover:bg-amber-50 transition-all group">
                                    <span className="material-symbols-outlined text-amber-500 text-base">report_problem</span>
                                    <span className="text-sm font-medium text-gray-800 flex-1 truncate">{wp.name}</span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-800">
                                        {wp.warningCount} {wp.warningCount === 1 ? "issue" : "issues"}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-amber-500 text-base">chevron_right</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}

// ─── Analytical Dashboard (Trends, slice-and-dice) ─────────────────────────────
function AnalyticalView({ stats }: { stats: DashboardStats }) {
    const completedCount = stats.statusBreakdown["COMPLETED"] || 0;
    const inProgressCount = stats.statusBreakdown["IN_PROGRESS"] || 0;
    const planningCount = stats.statusBreakdown["IN_PLANNING"] || 0;
    const total = stats.totalProjects || 1;
    const avgTasksPerProject = total > 0 ? Math.round(stats.totalTasks / total) : 0;
    const avgEpicsPerProject = total > 0 ? Math.round(stats.totalEpics / total) : 0;
    const warningRate = total > 0 ? Math.round((stats.warningProjects.length / total) * 100) : 0;
    const activeRate = total > 0 ? Math.round(((inProgressCount + planningCount) / total) * 100) : 0;

    const taskBuckets = stats.recentProjects.map(p => ({
        name: p.name.length > 16 ? p.name.slice(0, 14) + "…" : p.name,
        tasks: p.taskCount,
        epics: p.epicCount,
        maxBar: Math.max(...stats.recentProjects.map(x => x.taskCount), 1),
    }));

    return (
        <div className="space-y-6">
            {/* Analysis KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon="avg_pace" label="Avg Tasks / Project" value={avgTasksPerProject} sub="Mean task density" accentColor="text-indigo-600" accentBg="bg-indigo-50" />
                <KpiCard icon="layers" label="Avg Epics / Project" value={avgEpicsPerProject} sub="Mean epic count" accentColor="text-purple-600" accentBg="bg-purple-50" />
                <KpiCard icon="dangerous" label="Risk Rate" value={`${warningRate}%`} sub={`${stats.warningProjects.length}/${total} projects at risk`} accentColor={warningRate > 30 ? "text-red-600" : "text-emerald-600"} accentBg={warningRate > 30 ? "bg-red-50" : "bg-emerald-50"} />
                <KpiCard icon="speed" label="Active Rate" value={`${activeRate}%`} sub="Projects in motion" accentColor="text-blue-600" accentBg="bg-blue-50" trend={{ val: `${inProgressCount + planningCount} active`, up: activeRate > 40 }} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Task Distribution Bar Chart */}
                <Card>
                    <CardHeader icon="bar_chart" label="Task Distribution by Project" accent="text-indigo-600" accentBg="bg-indigo-50" />
                    {taskBuckets.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">No data yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {taskBuckets.map(({ name, tasks, epics, maxBar }) => (
                                <div key={name}>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span className="truncate">{name}</span>
                                        <span className="font-medium ml-2">{tasks} tasks · {epics} epics</span>
                                    </div>
                                    <div className="flex gap-1 h-3">
                                        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden relative">
                                            <div className="absolute inset-y-0 left-0 rounded-full"
                                                style={{ width: `${Math.round(tasks / maxBar * 100)}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6)" }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Project Health Matrix */}
                <Card>
                    <CardHeader icon="grid_view" label="Project Health Matrix" accent="text-purple-600" accentBg="bg-purple-50" />
                    <div className="space-y-2">
                        {stats.recentProjects.map(p => {
                            const health = p.warningCount === 0 ? "healthy" : p.warningCount === 1 ? "at-risk" : "critical";
                            const healthCfg = {
                                healthy: { label: "Healthy", dot: "bg-emerald-400", row: "bg-emerald-50/30" },
                                "at-risk": { label: "At Risk", dot: "bg-amber-400", row: "bg-amber-50/30" },
                                critical: { label: "Critical", dot: "bg-red-400", row: "bg-red-50/30" },
                            }[health];
                            const href = p.status === "DRAFT" || p.status === "GENERATING"
                                ? `/projects/new/generating?projectId=${p.id}`
                                : `/projects/${p.id}`;
                            return (
                                <Link key={p.id} href={href}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${healthCfg.row} hover:opacity-80 transition-opacity`}>
                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${healthCfg.dot}`} />
                                    <span className="text-sm font-medium text-gray-800 flex-1 truncate">{p.name}</span>
                                    <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-500">
                                        <span>{p.epicCount}E · {p.taskCount}T</span>
                                        <span className="font-semibold text-gray-700">{healthCfg.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Team Analytics */}
            <Card>
                <CardHeader icon="group_work" label="Team Analytics" accent="text-emerald-600" accentBg="bg-emerald-50"
                    right={<span className="text-xs text-gray-400">{stats.totalTeamMembers} members total</span>} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Workload distribution */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Workload Distribution</p>
                        <div className="space-y-2">
                            {[
                                { label: "Low load (1 project)", count: stats.allTeamMembers.filter(m => m.projects.length === 1).length, color: "bg-emerald-400" },
                                { label: "Medium load (2 projects)", count: stats.allTeamMembers.filter(m => m.projects.length === 2).length, color: "bg-amber-400" },
                                { label: "High load (3+ projects)", count: stats.allTeamMembers.filter(m => m.projects.length >= 3).length, color: "bg-red-400" },
                            ].map(({ label, count, color }) => {
                                const pct = stats.totalTeamMembers > 0 ? Math.round(count / stats.totalTeamMembers * 100) : 0;
                                return (
                                    <div key={label}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">{label}</span>
                                            <span className="font-medium text-gray-700">{count} ({pct}%)</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Cross-project members */}
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cross-Project Members</p>
                        <div className="space-y-2">
                            {stats.allTeamMembers.filter(m => m.projects.length > 1).slice(0, 6).map((m, i) => (
                                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>{m.initials}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{m.projects.join(" · ")}</p>
                                    </div>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex-shrink-0">{m.projects.length}×</span>
                                </div>
                            ))}
                            {stats.allTeamMembers.filter(m => m.projects.length > 1).length === 0 && (
                                <p className="text-sm text-gray-400">No cross-project members found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// ─── Tactical Dashboard (Mid-management task tracking) ─────────────────────────
function TacticalView({ stats }: { stats: DashboardStats }) {
    const [selectedProject, setSelectedProject] = useState<string>("all");
    const inProgressCount = stats.statusBreakdown["IN_PROGRESS"] || 0;
    const planningCount = stats.statusBreakdown["IN_PLANNING"] || 0;

    const filteredProjects = selectedProject === "all"
        ? stats.recentProjects
        : stats.recentProjects.filter(p => p.id === selectedProject);

    return (
        <div className="space-y-6">
            {/* Tactical KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon="task_alt" label="Total Tasks" value={stats.totalTasks} sub={`Across ${stats.totalEpics} epics`} accentColor="text-indigo-600" accentBg="bg-indigo-50" />
                <KpiCard icon="layers" label="Total Epics" value={stats.totalEpics} sub={`${stats.totalProjects} projects`} accentColor="text-purple-600" accentBg="bg-purple-50" />
                <KpiCard icon="pending_actions" label="Active Workstreams" value={inProgressCount + planningCount} sub="Projects in execution" accentColor="text-blue-600" accentBg="bg-blue-50" />
                <KpiCard icon="person_check" label="Team Coverage" value={stats.totalTeamMembers} sub="Members assigned" accentColor="text-emerald-600" accentBg="bg-emerald-50" />
            </div>

            {/* Project Filter */}
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter by project:</span>
                <button
                    onClick={() => setSelectedProject("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedProject === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}
                >
                    All Projects
                </button>
                {stats.recentProjects.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedProject(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedProject === p.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}
                    >
                        {p.name.length > 20 ? p.name.slice(0, 18) + "…" : p.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Project Workplan */}
                <div className="xl:col-span-2 space-y-4">
                    {filteredProjects.map(p => {
                        const cfg = statusConfig[p.status] || { label: p.status, bar: "bg-gray-400", variant: "gray" };
                        const href = p.status === "DRAFT" || p.status === "GENERATING"
                            ? `/projects/new/generating?projectId=${p.id}`
                            : `/projects/${p.id}`;
                        return (
                            <Card key={p.id} className="!p-0 overflow-hidden">
                                {/* Project Header */}
                                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)" }}>
                                        <span className="material-symbols-outlined text-indigo-600 text-sm">folder_open</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{p.name}</span>
                                            <Badge label={cfg.label} variant={cfg.variant as any} />
                                        </div>
                                    </div>
                                    <Link href={href} className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium">
                                        Open <span className="material-symbols-outlined text-xs">open_in_new</span>
                                    </Link>
                                </div>

                                {/* Metrics Row */}
                                <div className="grid grid-cols-4 divide-x divide-gray-100">
                                    {[
                                        { label: "Epics", value: p.epicCount, icon: "layers" },
                                        { label: "Tasks", value: p.taskCount, icon: "task_alt" },
                                        { label: "Members", value: p.team.length, icon: "group" },
                                        { label: "Warnings", value: p.warningCount, icon: "warning" },
                                    ].map(({ label, value, icon }) => (
                                        <div key={label} className="p-3 flex flex-col items-center">
                                            <span className="material-symbols-outlined text-gray-300 text-base mb-0.5">{icon}</span>
                                            <span className="text-base font-bold text-gray-800">{value}</span>
                                            <span className="text-xs text-gray-400">{label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress */}
                                {p.status !== "DRAFT" && p.status !== "GENERATING" && p.status !== "IN_PLANNING" && (
                                    <div className="px-4 pb-4">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                            <span>Completion</span>
                                            <span className="font-semibold">{p.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${p.progress}%`,
                                                    background: p.progress === 100 ? "#10B981" : "linear-gradient(90deg,#6366F1,#8B5CF6)"
                                                }} />
                                        </div>
                                    </div>
                                )}

                                {/* Team Row */}
                                {p.team.length > 0 && (
                                    <div className="flex items-center gap-2 px-4 pb-4">
                                        <div className="flex -space-x-2">
                                            {p.team.slice(0, 5).map((m, i) => (
                                                <div key={m.id} title={m.name}
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white ${avatarColors[i % avatarColors.length]}`}>
                                                    {m.initials}
                                                </div>
                                            ))}
                                            {p.team.length > 5 && (
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white bg-gray-100 text-gray-600">
                                                    +{p.team.length - 5}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">{p.team.length} team member{p.team.length !== 1 ? "s" : ""} assigned</span>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                    {/* Milestone Tracker */}
                    <Card>
                        <CardHeader icon="milestone" label="Milestone Tracker" accent="text-indigo-600" accentBg="bg-indigo-50" />
                        <div className="space-y-3">
                            {[
                                { label: "Projects Planned", done: (stats.statusBreakdown["IN_PLANNING"] || 0) + (stats.statusBreakdown["IN_PROGRESS"] || 0) + (stats.statusBreakdown["COMPLETED"] || 0), total: stats.totalProjects },
                                { label: "Projects Executing", done: (stats.statusBreakdown["IN_PROGRESS"] || 0) + (stats.statusBreakdown["COMPLETED"] || 0), total: stats.totalProjects },
                                { label: "Projects Delivered", done: stats.statusBreakdown["COMPLETED"] || 0, total: stats.totalProjects },
                            ].map(({ label, done, total }) => {
                                const pct = total > 0 ? Math.round(done / total * 100) : 0;
                                return (
                                    <div key={label}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-gray-600">{label}</span>
                                            <span className="font-semibold text-gray-700">{done}/{total}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{
                                                width: `${pct}%`,
                                                background: pct === 100 ? "#10B981" : "linear-gradient(90deg,#6366F1,#8B5CF6)"
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Assignments */}
                    <Card>
                        <CardHeader icon="assignment_ind" label="Assignments" accent="text-blue-600" accentBg="bg-blue-50"
                            right={<Link href="/employees" className="text-xs text-indigo-600 hover:underline">View all</Link>} />
                        <div className="space-y-2">
                            {stats.allTeamMembers.slice(0, 6).map((m, i) => (
                                <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>{m.initials}</div>
                                    <span className="text-sm text-gray-800 flex-1 truncate">{m.name}</span>
                                    <span className="text-xs text-gray-400 flex-shrink-0">{m.projects.length}P</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Navigate */}
                    <Card>
                        <CardHeader icon="bolt" label="Quick Navigate" accent="text-gray-500" accentBg="bg-gray-100" />
                        <div className="space-y-1.5">
                            {[
                                { href: "/projects/new", icon: "add_circle", label: "New Project", color: "text-indigo-600" },
                                { href: "/projects", icon: "folder_open", label: "All Projects", color: "text-purple-600" },
                                { href: "/employees", icon: "group", label: "Employees", color: "text-emerald-600" },
                                { href: "/templates", icon: "grid_view", label: "Templates", color: "text-blue-600" },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <span className={`material-symbols-outlined text-base ${link.color}`}>{link.icon}</span>
                                    <span className="text-sm text-gray-700">{link.label}</span>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-gray-500 text-base ml-auto">chevron_right</span>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<DashboardView>("strategic");

    useEffect(() => {
        getDashboardStats()
            .then(data => { setStats(data); setLoading(false); })
            .catch(err => { console.error(err); setError("Failed to load dashboard data."); setLoading(false); });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppNav />
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
                        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                        <span className="material-symbols-outlined text-white text-2xl">dashboard</span>
                    </div>
                    <p className="text-gray-500 text-sm">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppNav />
                <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
                    <span className="material-symbols-outlined text-red-400 text-4xl">error</span>
                    <p className="text-gray-600">{error || "Something went wrong."}</p>
                    <Link href="/projects" className="text-indigo-600 hover:underline text-sm">Go to Projects</Link>
                </div>
            </div>
        );
    }

    const activeView = DASHBOARD_VIEWS.find(v => v.id === view)!;

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />

            {/* Hero header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {DASHBOARD_VIEWS.find(v => v.id === view)?.desc}
                            </p>
                        </div>
                        <Link
                            href="/projects/new"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 self-start sm:self-auto"
                            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Project
                        </Link>
                    </div>

                    {/* View Switcher Tabs */}
                    <div className="flex gap-2 mt-5 flex-wrap">
                        {DASHBOARD_VIEWS.map(v => (
                            <button
                                key={v.id}
                                onClick={() => setView(v.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${view === v.id
                                        ? `border-transparent text-white shadow-sm`
                                        : `border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50`
                                    }`}
                                style={view === v.id ? { background: "linear-gradient(135deg, #4F46E5, #7C3AED)" } : {}}
                            >
                                <span className="material-symbols-outlined text-base">{v.icon}</span>
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {view === "strategic" && <StrategicView stats={stats} />}
                {view === "operational" && <OperationalView stats={stats} />}
                {view === "analytical" && <AnalyticalView stats={stats} />}
                {view === "tactical" && <TacticalView stats={stats} />}
            </main>
        </div>
    );
}
