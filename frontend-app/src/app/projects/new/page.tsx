"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import StepperHeader from "@/components/StepperHeader";

const PRIORITIES = ["Performance", "Security", "Scalability", "Maintainability", "Cost Efficiency", "Developer Experience"];

export default function WizardStep1() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [features, setFeatures] = useState<string[]>(["User authentication & RBAC", "Real-time dashboard with filters"]);
    const [newFeature, setNewFeature] = useState("");
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["Performance", "Scalability"]);
    const [timeline, setTimeline] = useState(8);
    const [techTags, setTechTags] = useState<string[]>(["React", "Node.js", "PostgreSQL"]);
    const [techInput, setTechInput] = useState("");

    const handleNext = () => {
        const data = { name: name || "My New Project", description: description || "A new software project", features, techStack: techTags, priorities: selectedPriorities, timeline };
        sessionStorage.setItem("wizard_step1", JSON.stringify(data));
        router.push("/projects/new/team");
    };

    const togglePriority = (p: string) =>
        setSelectedPriorities((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );

    const addFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature("");
        }
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && techInput.trim()) {
            setTechTags([...techTags, techInput.trim()]);
            setTechInput("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <StepperHeader currentStep={1} />

            <main className="max-w-3xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Tell the AI about your product and what you want to build.</p>
                </div>

                <div className="space-y-6">
                    {/* Product Name */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="text-sm font-semibold text-gray-800 block mb-1">Product Name <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-500 mb-3">Give your product a clear, memorable name.</p>
                        <input
                            type="text"
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="e.g. SalesIQ Pro, NexaShip, PayStream"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="text-sm font-semibold text-gray-800 block mb-1">Product Description <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-500 mb-3">Describe your product in 2-3 sentences. Include the problem it solves and your target users.</p>
                        <textarea
                            rows={4}
                            maxLength={500}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                            placeholder="A real-time analytics dashboard for B2B SaaS companies that helps sales managers visualize pipeline health and forecast revenue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{description.length} / 500</div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="text-sm font-semibold text-gray-800 block mb-1">Key Features</label>
                        <p className="text-xs text-gray-500 mb-3">List the core features for the MVP. The AI will use these to generate epics and tasks.</p>
                        <div className="space-y-2 mb-3">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <span className="material-symbols-outlined text-indigo-500 text-base">check_circle</span>
                                    <span className="text-sm text-gray-700 flex-1">{f}</span>
                                    <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                                        <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addFeature()}
                                placeholder="Add a feature..."
                                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <button onClick={addFeature} className="px-4 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Non-functional priorities */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="text-sm font-semibold text-gray-800 block mb-1">Non-Functional Priorities</label>
                        <p className="text-xs text-gray-500 mb-4">Select the technical priorities the AI should optimize for.</p>
                        <div className="flex flex-wrap gap-2">
                            {PRIORITIES.map((p: string) => (
                                <button
                                    key={p}
                                    onClick={() => togglePriority(p)}
                                    className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${selectedPriorities.includes(p)
                                        ? "border-indigo-500 text-indigo-700 bg-indigo-50"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    {selectedPriorities.includes(p) && (
                                        <span className="material-symbols-outlined text-xs mr-1">check</span>
                                    )}
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="text-sm font-semibold text-gray-800 block mb-1">Tech Stack</label>
                        <p className="text-xs text-gray-500 mb-3">Press Enter to add. Leave blank to let AI recommend.</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {techTags.map((t) => (
                                <span key={t} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                                    {t}
                                    <button onClick={() => setTechTags(techTags.filter((x) => x !== t))}>
                                        <span className="material-symbols-outlined text-xs ml-0.5">close</span>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={addTag}
                            placeholder="e.g. Next.js, FastAPI, Redis..."
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-800">Target Timeline</label>
                                <p className="text-xs text-gray-500 mt-0.5">Drag to set your desired project duration.</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#EEF2FF" }}>
                                <span className="material-symbols-outlined text-indigo-600 text-sm">schedule</span>
                                <span className="text-indigo-700 font-semibold text-sm">{timeline} weeks</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={4} max={24} step={1}
                            value={timeline}
                            onChange={(e) => setTimeline(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>4 weeks (MVP)</span>
                            <span>24 weeks (Full Product)</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">save</span>
                        Save Draft
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                    >
                        Next: Team Composition
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
