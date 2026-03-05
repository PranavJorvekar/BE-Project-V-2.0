"use client";

import { useState, useEffect, use } from "react";
import AppNav from "@/components/AppNav";
import TabNav from "@/components/TabNav";
import MetricCard from "@/components/MetricCard";
import Badge from "@/components/Badge";
import Link from "next/link";
import { getProject } from "@/lib/api";

const TOTAL_WEEKS = 8;
const WEEK_WIDTH = 90;

export default function TimelinePage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"sprint" | "weekly" | "monthly">("weekly");
    const [showTasks, setShowTasks] = useState(true);
    const todayWeek = 0.3; // 30% into week 1

    const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => `W${i + 1}`);

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

    // Generate mock timeline layout data from API payload
    let currentStart = 0;
    const colors = ["#6366F1", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"];

    const epics = project.epics.map((epic: any, idx: number) => {
        const duration = Math.max(1.5, Math.ceil(epic.totalHours / 60)); // Rough heuristic
        const epicData = {
            id: epic.id,
            code: epic.code || `E${idx + 1}`,
            name: epic.name,
            start: currentStart,
            duration: duration,
            color: colors[idx % colors.length]
        };
        currentStart += duration * 0.75; // overlap Epics slightly
        return epicData;
    });

    const tasks = project.epics.flatMap((epic: any, idx: number) => {
        const parentEpic = epics.find((e: any) => e.id === epic.id);
        const epicColor = parentEpic.color;
        let taskStart = parentEpic.start;

        return (epic.tasks || []).map((task: any, tIdx: number) => {
            const taskDuration = Math.max(0.5, task.effort / 40);
            const taskObj = {
                id: task.id,
                code: `T${tIdx + 1}`,
                name: task.name,
                epicId: epic.id,
                start: taskStart,
                duration: taskDuration,
                color: epicColor
            };
            taskStart += taskDuration; // sequence tasks linearly within epic
            return taskObj;
        });
    });

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
            <TabNav projectId={projectId} />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard icon="task_alt" value={totalTasks.toString()} label="Total Tasks" />
                    <MetricCard icon="schedule" iconColor="text-purple-600" iconBg="bg-purple-50" value={`${totalHours}h`} label="Estimated Hours" />
                    <MetricCard icon="calendar_month" iconColor="text-emerald-600" iconBg="bg-emerald-50" value={`${project.timeline || 8} wks`} label="Timeline" />
                    <MetricCard icon="group" iconColor="text-amber-600" iconBg="bg-amber-50" value={project.team.length.toString()} label="Team Members" />
                </div>

                {/* Timeline Controls */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-2">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {(["sprint", "weekly", "monthly"] as const).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowTasks(!showTasks)}
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
                            >
                                <span className="material-symbols-outlined text-sm">{showTasks ? "visibility" : "visibility_off"}</span>
                                {showTasks ? "Hide" : "Show"} tasks
                            </button>
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                Today
                            </div>
                        </div>
                    </div>

                    {/* Gantt Chart */}
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: `${200 + TOTAL_WEEKS * WEEK_WIDTH}px` }}>
                            {/* Header Row */}
                            <div className="flex border-b border-gray-100">
                                <div className="w-64 flex-shrink-0 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Epic / Task</div>
                                <div className="flex flex-1">
                                    {weeks.map((w, i) => (
                                        <div key={w} style={{ width: WEEK_WIDTH }} className="flex-shrink-0 px-2 py-3 text-xs text-center text-gray-400 font-medium border-l border-gray-100">
                                            {w}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Epic + Task Rows */}
                            {epics.map((epic: any) => (
                                <div key={epic.id}>
                                    {/* Epic Row */}
                                    <div className="flex items-center border-b border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="w-64 flex-shrink-0 px-5 py-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm" style={{ color: epic.color }}>layers</span>
                                            <span className="text-xs font-semibold text-gray-700 truncate">{epic.name}</span>
                                        </div>
                                        <div className="flex flex-1 relative h-10 items-center">
                                            {/* Today line */}
                                            <div className="absolute top-0 bottom-0 w-0.5 bg-red-400/60 z-10" style={{ left: `${todayWeek * WEEK_WIDTH}px` }} />
                                            {/* Grid lines */}
                                            {weeks.map((_, i) => (
                                                <div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${i * WEEK_WIDTH}px` }} />
                                            ))}
                                            {/* Epic Bar */}
                                            <div
                                                className="absolute h-6 rounded-lg flex items-center px-2 text-white text-xs font-medium"
                                                style={{
                                                    left: `${epic.start * WEEK_WIDTH + 4}px`,
                                                    width: `${epic.duration * WEEK_WIDTH - 8}px`,
                                                    backgroundColor: epic.color,
                                                    opacity: 0.85,
                                                }}
                                            >
                                                <span className="truncate">{epic.code}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task Rows */}
                                    {showTasks &&
                                        tasks
                                            .filter((t: any) => t.epicId === epic.id)
                                            .map((task: any) => (
                                                <div key={task.id} className="flex items-center border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <div className="w-64 flex-shrink-0 px-5 py-2.5 flex items-center gap-2">
                                                        <span className="text-gray-200 text-xs">└</span>
                                                        <span className="text-xs text-gray-600 truncate">{task.name}</span>
                                                    </div>
                                                    <div className="flex flex-1 relative h-9 items-center">
                                                        <div className="absolute top-0 bottom-0 w-0.5 bg-red-400/60 z-10" style={{ left: `${todayWeek * WEEK_WIDTH}px` }} />
                                                        {weeks.map((_, i) => (
                                                            <div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${i * WEEK_WIDTH}px` }} />
                                                        ))}
                                                        <div
                                                            className="absolute h-5 rounded flex items-center px-2 text-white text-xs opacity-80"
                                                            style={{
                                                                left: `${task.start * WEEK_WIDTH + 4}px`,
                                                                width: `${task.duration * WEEK_WIDTH - 8}px`,
                                                                backgroundColor: task.color,
                                                            }}
                                                        >
                                                            <span className="truncate">{task.code}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
