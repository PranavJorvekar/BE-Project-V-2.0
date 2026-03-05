"use client";

import { useState, useEffect, use } from "react";
import AppNav from "@/components/AppNav";
import TabNav from "@/components/TabNav";
import MetricCard from "@/components/MetricCard";
import Badge from "@/components/Badge";
import Link from "next/link";
import { getProject } from "@/lib/api";

interface Task {
    id: string;
    name: string;
    epicName: string;
    assignee: { id?: string; name: string; initials: string; role: string };
    effort: number;
    priority: string;
    fitScore: number;
    description: string;
    skills: string[];
    aiReasoning: string;
    definitionOfDone: { id: number; text: string; done: boolean }[];
    prerequisites: { id: string; name: string; status: string }[];
    blockedBy: string[];
    blocks: { id: string; name: string; status: string }[];
    alternatives: { name: string; role: string; score: number }[];
}

const priorityVariant: Record<string, "danger" | "warning" | "gray"> = {
    High: "danger",
    Medium: "warning",
    Low: "gray",
};

export default function TasksPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [activeTab, setActiveTab] = useState<"details" | "assignment" | "dependencies">("details");
    const [reassigning, setReassigning] = useState(false);

    const handleReassign = async (taskId: string, teamMemberId: string) => {
        setReassigning(true);
        try {
            const { updateTask } = await import("@/lib/api");
            const result = await updateTask(taskId, { teamMemberId });

            // Update local state
            const updatedProject = { ...project };
            updatedProject.epics = updatedProject.epics.map((epic: any) => ({
                ...epic,
                tasks: epic.tasks.map((t: any) => {
                    if (t.id === taskId) {
                        return { ...t, teamMemberId: result.task.teamMemberId, assignee: result.task.assignee };
                    }
                    return t;
                })
            }));

            setProject(updatedProject);

            // Update selected task for modal
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask({
                    ...selectedTask,
                    assignee: result.task.assignee || { name: "Unassigned", initials: "?", role: "Pending Assignment" }
                });
            }
        } catch (err) {
            console.error("Failed to reassign task:", err);
            alert("Failed to reassign task. Please try again.");
        } finally {
            setReassigning(false);
        }
    };

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

    // Flatten tasks from all epics
    const allTasks: Task[] = project.epics.flatMap((epic: any) =>
        (epic.tasks || []).map((t: any) => ({
            ...t,
            epicName: epic.name,
            assignee: t.assignee || { id: "unassigned", name: "Unassigned", initials: "?", role: "Pending Assignment" }
        }))
    );

    const filtered = allTasks.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.epicName.toLowerCase().includes(search.toLowerCase()) ||
            t.assignee.name.toLowerCase().includes(search.toLowerCase())
    );

    const openTask = (task: Task) => {
        setSelectedTask(task);
        setActiveTab("details");
    };

    const totalHours = allTasks.reduce((sum, t) => sum + (t.effort || 0), 0);
    const statusLabel = project.status === "IN_PLANNING" ? "In Planning" : project.status;

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link href="/projects" className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-lg">arrow_back</span></Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-gray-900">{project.name}</h1>
                                <Badge label={statusLabel} variant="warning" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TabNav projectId={projectId} />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard icon="task_alt" value={allTasks.length.toString()} label="Total Tasks" />
                    <MetricCard icon="schedule" iconColor="text-purple-600" iconBg="bg-purple-50" value={`${totalHours}h`} label="Estimated Hours" />
                    <MetricCard icon="calendar_month" iconColor="text-emerald-600" iconBg="bg-emerald-50" value={`${project.timeline || 8} wks`} label="Timeline" />
                    <MetricCard icon="group" iconColor="text-amber-600" iconBg="bg-amber-50" value={project.team.length.toString()} label="Team Members" />
                </div>

                {/* Search & filters */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 focus:outline-none focus:border-indigo-500">
                        <option>All Epics</option>
                        {project.epics.map((e: any) => <option key={e.id}>{e.name}</option>)}
                    </select>
                    <select className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 focus:outline-none focus:border-indigo-500">
                        <option>All Priority</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Epic</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assignee</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Effort</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((task) => (
                                <tr
                                    key={task.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => openTask(task)}
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{task.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Badge label={task.epicName} variant="indigo" />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold">
                                                {task.assignee.initials}
                                            </div>
                                            <span className="text-sm text-gray-700">{task.assignee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-600">{task.effort}h</td>
                                    <td className="px-4 py-3.5">
                                        <Badge label={task.priority} variant={priorityVariant[task.priority] || "gray"} />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <span className="material-symbols-outlined text-base">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-sm text-gray-500">No tasks found</div>
                    )}
                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <h2 className="font-semibold text-gray-900 text-lg">{selectedTask.name}</h2>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-gray-100 px-6">
                            {(["details", "assignment", "dependencies"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {activeTab === "details" && (
                                <div className="space-y-5">
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-2">Description</div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{selectedTask.description}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">Effort</div>
                                            <div className="font-semibold text-gray-800">{selectedTask.effort}h</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">Priority</div>
                                            <Badge label={selectedTask.priority} variant={priorityVariant[selectedTask.priority] || "gray"} />
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">Epic</div>
                                            <div className="font-semibold text-gray-800 text-sm">{selectedTask.epicName}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-2">Required Skills</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(selectedTask.skills || []).map((s) => (
                                                <Badge key={s} label={s} variant="gray" />
                                            ))}
                                            {(!selectedTask.skills || selectedTask.skills.length === 0) && (
                                                <span className="text-sm text-gray-400">None specified</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-2">Definition of Done</div>
                                        <div className="space-y-2">
                                            {(selectedTask.definitionOfDone || []).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 border-gray-300`}>
                                                    </div>
                                                    <span className={`text-sm text-gray-700`}>{typeof item === 'string' ? item : item.text || JSON.stringify(item)}</span>
                                                </div>
                                            ))}
                                            {(!selectedTask.definitionOfDone || selectedTask.definitionOfDone.length === 0) && (
                                                <span className="text-sm text-gray-400">No specific criteria.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "assignment" && (
                                <div className="space-y-5">
                                    {/* Fit Score Ring */}
                                    <div className="flex items-center gap-6 p-5 bg-gray-50 rounded-xl">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                                <circle cx="40" cy="40" r="32" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                                                <circle
                                                    cx="40" cy="40" r="32" fill="none"
                                                    stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 32}`}
                                                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - (selectedTask.fitScore || 0) / 100)}`}
                                                />
                                                <defs>
                                                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#6366F1" />
                                                        <stop offset="100%" stopColor="#A855F7" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-xl font-bold text-gray-900">{selectedTask.fitScore || 0}</span>
                                                <span className="text-xs text-gray-400">fit</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{selectedTask.assignee.name}</div>
                                            <div className="text-sm text-gray-500">{selectedTask.assignee.role}</div>
                                            <div className="mt-2">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">AI Recommended</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Reasoning */}
                                    <div className="p-4 rounded-xl border" style={{ background: "#FAF5FF", borderColor: "#E9D5FF" }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-purple-600 text-base">smart_toy</span>
                                            <span className="text-sm font-semibold text-purple-800">AI Assignment Reasoning</span>
                                        </div>
                                        <p className="text-sm text-purple-700">{selectedTask.aiReasoning || "No reasoning provided."}</p>
                                    </div>

                                    {/* Manual Reassignment */}
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-3">Manually Reassign</div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {project.team.map((m: any) => {
                                                const isCurrent = (selectedTask.assignee?.id || selectedTask.assignee?.name) === m.id || (selectedTask.assignee?.id || selectedTask.assignee?.name) === m.name;
                                                return (
                                                    <button
                                                        key={m.id}
                                                        disabled={reassigning}
                                                        onClick={() => handleReassign(selectedTask.id, m.id)}
                                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isCurrent
                                                            ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                                                            : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                            } ${reassigning ? "opacity-60 cursor-not-allowed" : ""}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-indigo-700 text-xs font-bold shadow-sm">
                                                                {m.initials}
                                                            </div>
                                                            <div className="text-left">
                                                                <div className={`text-sm font-semibold ${isCurrent ? "text-indigo-900" : "text-gray-900"}`}>{m.name}</div>
                                                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{m.role}</div>
                                                            </div>
                                                        </div>
                                                        {isCurrent ? (
                                                            <span className="material-symbols-outlined text-indigo-600 text-lg">check_circle</span>
                                                        ) : reassigning ? (
                                                            <span className="material-symbols-outlined text-gray-400 text-lg animate-spin">refresh</span>
                                                        ) : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Alternatives */}
                                    {(selectedTask.alternatives || []).length > 0 && (
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-2">Other Options Considered</div>
                                            <div className="space-y-2">
                                                {selectedTask.alternatives.map((alt) => (
                                                    <div key={alt.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-700">{alt.name}</div>
                                                            <div className="text-xs text-gray-400">{alt.role}</div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-600">{alt.score}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "dependencies" && (
                                <div className="space-y-5">
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-3">Prerequisites (Blocked by)</div>
                                        {(!selectedTask.prerequisites || selectedTask.prerequisites.length === 0) ? (
                                            <p className="text-sm text-gray-400">No prerequisites.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedTask.prerequisites.map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-700">{p.name || (typeof p === "string" ? p : JSON.stringify(p))}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-3">Blocks (Tasks waiting on this)</div>
                                        {(!selectedTask.blocks || selectedTask.blocks.length === 0) ? (
                                            <p className="text-sm text-gray-400">This task doesn&apos;t block any other tasks.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedTask.blocks.map((b, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-700">{b.name || (typeof b === "string" ? b : JSON.stringify(b))}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-100">
                            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                Reassign Task
                            </button>
                            <button onClick={() => setSelectedTask(null)} className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-all"
                                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
