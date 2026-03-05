"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import templates from "@/data/templates.json";
import Badge from "@/components/Badge";

const categories = ["All", "SaaS", "E-commerce", "Mobile App", "Enterprise", "Fintech"];

export default function TemplatesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = templates.filter((t) => {
        const matchSearch =
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || t.category === activeCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                        style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Start Faster with Templates
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Project Templates</h1>
                    <p className="text-gray-500 max-w-md mx-auto">Pick a template and the AI will pre-populate your project with epics, best practices, and a proven SDLC structure for your project type.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search templates..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                        ? "text-white"
                                        : "border border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                                style={activeCategory === cat ? { background: "linear-gradient(135deg, #4F46E5, #7C3AED)" } : {}}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((template) => (
                        <div key={template.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col">
                            {/* Card Header */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${template.iconBg}`}>
                                <span className={`material-symbols-outlined text-2xl ${template.iconColor}`}>{template.icon}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                <Badge label={template.category} variant="gray" />
                            </div>
                            <p className="text-sm text-gray-500 mb-4 flex-1">{template.description}</p>

                            {/* Epics Preview */}
                            <div className="mb-4">
                                <div className="text-xs font-medium text-gray-400 mb-2">Included Epics</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {template.epics.map((epic) => (
                                        <span key={epic} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">{epic}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    {template.timeline}
                                </div>
                                <button
                                    onClick={() => router.push("/projects/new")}
                                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-all"
                                    style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                                >
                                    Use Template
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Create from Scratch */}
                    <div
                        onClick={() => router.push("/projects/new")}
                        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[240px]"
                    >
                        <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-600 text-3xl transition-colors">add</span>
                        </div>
                        <div className="font-semibold text-gray-600 group-hover:text-indigo-700 transition-colors">Create from Scratch</div>
                        <div className="text-sm text-gray-400 mt-1">Let the AI build a custom plan from your description.</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
