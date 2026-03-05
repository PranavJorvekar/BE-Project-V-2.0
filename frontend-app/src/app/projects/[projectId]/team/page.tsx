"use client";

import { useState, useEffect, use } from "react";
import AppNav from "@/components/AppNav";
import TabNav from "@/components/TabNav";
import MetricCard from "@/components/MetricCard";
import Badge from "@/components/Badge";
import Link from "next/link";
import { getProject, updateTeamMember } from "@/lib/api";

export default function TeamPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

    const getCapacityColor = (capacity: number) => {
        if (capacity >= 90) return "#EF4444";
        if (capacity >= 75) return "#F59E0B";
        return "#10B981";
    };

    const [editingMember, setEditingMember] = useState<any>(null);
    const [updating, setUpdating] = useState(false);

    const fetchProject = () => {
        getProject(projectId).then(data => {
            setProject(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchProject();
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

    const team = project.team || [];
    const avgCapacity = Math.round(team.reduce((a: number, m: any) => a + (m.avgCapacity || 70), 0) / Math.max(1, team.length));
    const totalAvailHours = team.reduce((a: number, m: any) => a + (m.availableHours || 15), 0);

    // Compute total tasks and hours for metric cards
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
                    <MetricCard icon="group" iconColor="text-amber-600" iconBg="bg-amber-50" value={team.length.toString()} label="Team Members" />
                </div>

                {/* Team Health Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="material-symbols-outlined text-indigo-600">favorite</span>
                        <h2 className="font-semibold text-gray-900">Team Health Overview</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${avgCapacity > 80 ? "text-red-600" : avgCapacity > 60 ? "text-amber-600" : "text-emerald-600"}`}>
                                {avgCapacity}%
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Avg Capacity Used</div>
                            <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${avgCapacity}%`, backgroundColor: getCapacityColor(avgCapacity) }} />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">{totalAvailHours}h</div>
                            <div className="text-sm text-gray-500 mt-1">Available This Week</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">87%</div>
                            <div className="text-sm text-gray-500 mt-1">AI Confidence Score</div>
                            <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "#F3F4F6" }}>
                                <div className="h-full rounded-full" style={{ width: "87%", background: "linear-gradient(90deg, #6366F1, #A855F7)" }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {team.map((member: any) => {
                        // Backend data doesn't currently store the 8 week chart data statically, 
                        // so we map 8 weeks either from data or mock it to visualize average capacity
                        const weeklyCapRows = member.weeklyCapacity || [
                            member.avgCapacity,
                            member.avgCapacity + 5,
                            Math.max(0, member.avgCapacity - 10),
                            member.avgCapacity + 10,
                            member.avgCapacity,
                            member.avgCapacity - 5,
                            member.avgCapacity,
                            member.avgCapacity + 15
                        ];

                        return (
                            <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-5">
                                {/* Member Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-lg">
                                            {member.initials}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{member.name}</div>
                                            <div className="text-xs text-gray-500">{member.role}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{member.specialization}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="text-right mr-2">
                                            <div className={`text-lg font-bold ${member.avgCapacity >= 90 ? "text-red-600" : member.avgCapacity >= 70 ? "text-amber-600" : "text-emerald-600"}`}>
                                                {member.avgCapacity}%
                                            </div>
                                            <div className="text-xs text-gray-400">avg capacity</div>
                                        </div>
                                        <button
                                            onClick={() => setEditingMember({
                                                ...member,
                                                skills: member.skills.join(", ")
                                            })}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                                        <div className="text-sm font-semibold text-gray-800">{member.tasks}</div>
                                        <div className="text-xs text-gray-400">Assigned Tasks</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                                        <div className="text-sm font-semibold text-gray-800">{member.weeklyHours}h</div>
                                        <div className="text-xs text-gray-400">Weekly Target</div>
                                    </div>
                                    <div className={`rounded-lg p-2.5 text-center ${member.availableHours <= 5 ? "bg-red-50" : "bg-emerald-50"}`}>
                                        <div className={`text-sm font-semibold ${member.availableHours <= 5 ? "text-red-700" : "text-emerald-700"}`}>{member.availableHours}h</div>
                                        <div className={`text-xs ${member.availableHours <= 5 ? "text-red-500" : "text-emerald-500"}`}>Available</div>
                                    </div>
                                </div>

                                {/* Weekly Capacity Chart */}
                                <div>
                                    <div className="text-xs text-gray-400 mb-2 font-medium">Weekly Capacity (8 weeks)</div>
                                    <div className="flex items-end gap-1.5 h-16">
                                        {weeklyCapRows.slice(0, 8).map((cap: number, i: number) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full rounded-t-sm transition-all"
                                                    style={{
                                                        height: `${(Math.min(cap, 100) / 100) * 48}px`,
                                                        backgroundColor: getCapacityColor(cap),
                                                        opacity: 0.8,
                                                    }}
                                                />
                                                <span className="text-xs text-gray-400">{weeks[i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-1.5">
                                        {(member.skills || []).map((s: string) => (
                                            <Badge key={s} label={s} variant="gray" />
                                        ))}
                                        {(!member.skills || member.skills.length === 0) && (
                                            <span className="text-sm text-gray-400">No skills defined.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Edit Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingMember(null)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Edit Team Member</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Project Role</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    value={editingMember.role}
                                    onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Weekly Hours</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    value={editingMember.weeklyHours}
                                    onChange={e => setEditingMember({ ...editingMember, weeklyHours: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Skills (Comma separated)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 h-24"
                                    value={editingMember.skills}
                                    onChange={e => setEditingMember({ ...editingMember, skills: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setEditingMember(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={updating}
                                onClick={async () => {
                                    setUpdating(true);
                                    try {
                                        await updateTeamMember(editingMember.id, {
                                            role: editingMember.role,
                                            weeklyHours: editingMember.weeklyHours,
                                            skills: editingMember.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s)
                                        });
                                        setEditingMember(null);
                                        fetchProject();
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setUpdating(false);
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {updating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
