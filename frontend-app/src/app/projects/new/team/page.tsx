"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import StepperHeader from "@/components/StepperHeader";
import { createProject, getEmployees } from "@/lib/api";
import Badge from "@/components/Badge";

interface TeamMemberOverride {
    id: string;
    role: string;
    skills: string;
    weeklyHours: number;
}

const ROLE_PRESETS: Record<string, { skills: string[]; experience: "mid" | "senior" }> = {
    "Full-Stack Engineer": { skills: ["React", "Node.js", "PostgreSQL", "TypeScript"], experience: "mid" },
    "Frontend Developer": { skills: ["React", "TypeScript", "CSS", "Figma"], experience: "mid" },
    "Backend Developer": { skills: ["Node.js", "PostgreSQL", "REST API", "Docker"], experience: "mid" },
    "Product Manager": { skills: ["Product Management", "Agile", "Jira", "Figma"], experience: "senior" },
    "DevOps Engineer": { skills: ["Docker", "CI/CD", "AWS", "Kubernetes"], experience: "mid" },
    "QA Engineer": { skills: ["Testing", "Playwright", "Jest", "Postman"], experience: "mid" },
    "UI/UX Designer": { skills: ["Figma", "User Research", "Prototyping", "CSS"], experience: "mid" },
};

export default function TeamPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [overrides, setOverrides] = useState<Record<string, TeamMemberOverride>>({});
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        getEmployees().then(data => {
            setAvailableEmployees(data.employees);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch employees:", err);
            setLoading(false);
        });
    }, []);

    const toggleEmployee = (emp: any) => {
        if (selectedIds.includes(emp.id)) {
            setSelectedIds(selectedIds.filter(i => i !== emp.id));
            const newOverrides = { ...overrides };
            delete newOverrides[emp.id];
            setOverrides(newOverrides);
            if (editingId === emp.id) setEditingId(null);
        } else {
            setSelectedIds([...selectedIds, emp.id]);
            setOverrides({
                ...overrides,
                [emp.id]: {
                    id: emp.id,
                    role: emp.role,
                    skills: emp.skills.join(", "),
                    weeklyHours: emp.weeklyHours
                }
            });
        }
    };

    const updateOverride = (id: string, field: keyof TeamMemberOverride, value: any) => {
        setOverrides({
            ...overrides,
            [id]: { ...overrides[id], [field]: value }
        });
    };

    const getStoredWizardData = () => {
        try {
            return JSON.parse(sessionStorage.getItem("wizard_step1") || "{}");
        } catch {
            return {};
        }
    };

    const handleNext = async () => {
        // Get step1 data from sessionStorage
        const step1 = getStoredWizardData();
        if (!step1.name) {
            router.push("/projects/new");
            return;
        }

        setSaving(true);
        try {
            const team = availableEmployees.filter(e => selectedIds.includes(e.id));
            const project = await createProject({
                name: step1.name,
                description: step1.description || "A new project",
                features: step1.features || [],
                techStack: step1.techStack || [],
                priorities: step1.priorities || [],
                timeline: step1.timeline || 8,
                teamMembers: selectedIds.map((id) => {
                    const m = availableEmployees.find(e => e.id === id);
                    const ovr = overrides[id];
                    return {
                        employeeId: m.id,
                        name: m.name,
                        role: ovr.role,
                        initials: m.initials,
                        skills: ovr.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s),
                        experience: m.experience,
                        weeklyHours: Number(ovr.weeklyHours),
                    };
                }),
            });

            // Save projectId and navigate to review
            sessionStorage.setItem("wizard_projectId", project.id);
            router.push("/projects/new/review");
        } catch (err) {
            console.error("Failed to create project:", err);
            // Fall back to review page anyway
            router.push("/projects/new/review");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <StepperHeader currentStep={2} />

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Build Your team</h2>
                        <p className="text-gray-500 text-sm mt-1">Select employees from your global directory to staff this project.</p>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                        {selectedIds.length} Selected
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="material-symbols-outlined animate-spin text-indigo-500 text-4xl">refresh</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {availableEmployees.map((emp) => {
                            const isSelected = selectedIds.includes(emp.id);
                            return (
                                <div className="flex flex-col w-full">
                                    <div
                                        onClick={() => toggleEmployee(emp)}
                                        className={`cursor-pointer group p-4 rounded-xl border-2 transition-all flex items-center justify-between ${isSelected
                                            ? "bg-indigo-50 border-indigo-500 shadow-sm"
                                            : "bg-white border-gray-100 hover:border-indigo-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    {emp.initials}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${emp.availabilityStatus === 'available' ? 'bg-green-500' :
                                                    emp.availabilityStatus === 'busy' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`} title={emp.availabilityStatus} />
                                            </div>
                                            <div>
                                                <div className={`font-bold text-sm ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                                                    {emp.name}
                                                </div>
                                                <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                                                    {overrides[emp.id]?.role || emp.role}
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    <span className={
                                                        emp.availabilityStatus === 'available' ? 'text-green-600' :
                                                            emp.availabilityStatus === 'busy' ? 'text-amber-600' : 'text-red-600'
                                                    }>
                                                        {emp.availabilityStatus.replace('_', ' ')}
                                                        {emp.availabilityStatus !== 'on_leave' && ` (${overrides[emp.id]?.weeklyHours || emp.weeklyHours}h)`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {isSelected && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingId(editingId === emp.id ? null : emp.id); }}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${editingId === emp.id ? "bg-indigo-100 text-indigo-700" : "text-gray-400 hover:bg-gray-100"}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">settings</span>
                                                </button>
                                            )}
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                ? "bg-indigo-600 border-indigo-600 text-white"
                                                : "bg-white border-gray-200"
                                                }`}>
                                                {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {isSelected && editingId === emp.id && (
                                        <div className="mt-2 p-4 bg-white border border-indigo-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Project Role</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                                        value={overrides[emp.id].role}
                                                        onChange={e => updateOverride(emp.id, "role", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Weekly Hours</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                                        value={overrides[emp.id].weeklyHours}
                                                        onChange={e => updateOverride(emp.id, "weeklyHours", Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Skills for this Project</label>
                                                <textarea
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 h-20"
                                                    value={overrides[emp.id].skills}
                                                    onChange={e => updateOverride(emp.id, "skills", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between mt-8">
                    <button onClick={() => router.push("/projects/new")}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        ← Back
                    </button>
                    <button onClick={handleNext} disabled={saving}
                        className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                        {saving && <span className="material-symbols-outlined text-sm animate-spin">refresh</span>}
                        {saving ? "Saving..." : "Next: Review →"}
                    </button>
                </div>
            </div>
        </div>
    );
}
