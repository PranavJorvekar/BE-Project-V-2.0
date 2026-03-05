"use client";

import { useState, useEffect } from "react";
import AppNav from "@/components/AppNav";
import { getEmployees, createEmployee, deleteEmployee, updateEmployee } from "@/lib/api";
import Badge from "@/components/Badge";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newEmp, setNewEmp] = useState({
        name: "",
        role: "Full-Stack Engineer",
        experience: "mid",
        weeklyHours: 40,
        skills: "",
        availabilityStatus: "available"
    });

    const fetchEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data.employees);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...newEmp,
                skills: newEmp.skills.split(",").map(s => s.trim()).filter(s => s)
            };

            if (editingId) {
                await updateEmployee(editingId, payload);
            } else {
                await createEmployee(payload);
            }

            setShowAddModal(false);
            setEditingId(null);
            setNewEmp({ name: "", role: "Full-Stack Engineer", experience: "mid", weeklyHours: 40, skills: "", availabilityStatus: "available" });
            fetchEmployees();
        } catch (err) {
            console.error("Failed to save employee:", err);
        }
    };

    const openEditModal = (emp: any) => {
        setNewEmp({
            name: emp.name,
            role: emp.role,
            experience: emp.experience,
            weeklyHours: emp.weeklyHours,
            skills: emp.skills.join(", "),
            availabilityStatus: emp.availabilityStatus
        });
        setEditingId(emp.id);
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this employee?")) return;
        try {
            await deleteEmployee(id);
            fetchEmployees();
        } catch (err) {
            console.error("Failed to delete employee:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Global Employees</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your team pool for all projects.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">person_add</span>
                        Add Employee
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="material-symbols-outlined animate-spin text-indigo-500 text-4xl">refresh</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((emp) => (
                            <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                            {emp.initials}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{emp.name}</h3>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">{emp.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(emp)}
                                            className="text-gray-300 hover:text-indigo-600 transition-colors"
                                            title="Edit Employee"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(emp.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                            title="Delete Employee"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Status</span>
                                        <Badge
                                            label={emp.availabilityStatus.replace("_", " ")}
                                            variant={
                                                emp.availabilityStatus === "available" ? "success" :
                                                    emp.availabilityStatus === "busy" ? "warning" : "danger"
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Experience</span>
                                        <span className="font-semibold text-gray-700 capitalize">{emp.experience}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Current Load</span>
                                        <span className={`font-bold ${emp.assignedHours >= emp.weeklyHours ? 'text-red-500' : 'text-indigo-600'}`}>
                                            {emp.assignedHours}/{emp.weeklyHours}h
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Active Projects</span>
                                        <span className="font-semibold text-gray-700">{emp.projectCount}</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 uppercase font-bold mb-1.5">Skills</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {emp.skills.map((s: string) => (
                                                <Badge key={s} label={s} variant="indigo" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setEditingId(null); }} />
                    <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{editingId ? "Edit Employee" : "Add New Employee"}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    value={newEmp.name}
                                    onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                                    placeholder="e.g. Aarav Sharma"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Role</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                    value={newEmp.role}
                                    onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                                >
                                    <option>Full-Stack Engineer</option>
                                    <option>Frontend Developer</option>
                                    <option>Backend Developer</option>
                                    <option>UI/UX Designer</option>
                                    <option>Product Manager</option>
                                    <option>DevOps Engineer</option>
                                    <option>QA Engineer</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Experience</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                        value={newEmp.experience}
                                        onChange={e => setNewEmp({ ...newEmp, experience: e.target.value })}
                                    >
                                        <option value="junior">Junior</option>
                                        <option value="mid">Mid</option>
                                        <option value="senior">Senior</option>
                                        <option value="lead">Lead</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Hours/Week</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                        value={newEmp.weeklyHours}
                                        onChange={e => setNewEmp({ ...newEmp, weeklyHours: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Availability Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                    value={newEmp.availabilityStatus}
                                    onChange={e => setNewEmp({ ...newEmp, availabilityStatus: e.target.value })}
                                >
                                    <option value="available">Available</option>
                                    <option value="busy">Busy</option>
                                    <option value="on_leave">On Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Skills (Comma separated)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 h-20"
                                    placeholder="React, Node.js, TypeScript..."
                                    value={newEmp.skills}
                                    onChange={e => setNewEmp({ ...newEmp, skills: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => { setShowAddModal(false); setEditingId(null); }}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                {editingId ? "Save Changes" : "Add Employee"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
