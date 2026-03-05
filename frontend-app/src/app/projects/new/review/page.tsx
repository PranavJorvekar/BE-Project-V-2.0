"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import StepperHeader from "@/components/StepperHeader";
import Badge from "@/components/Badge";

export default function ReviewPage() {
    const router = useRouter();
    const [step1, setStep1] = useState<Record<string, unknown>>({});
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        try {
            setStep1(JSON.parse(sessionStorage.getItem("wizard_step1") || "{}"));
        } catch { }
    }, []);

    const projectId = typeof window !== "undefined" ? sessionStorage.getItem("wizard_projectId") : null;

    const handleGenerate = () => {
        if (!projectId) {
            router.push("/projects/new");
            return;
        }
        setGenerating(true);
        router.push(`/projects/new/generating?projectId=${projectId}`);
    };

    const features = (step1.features as string[]) || [];
    const techStack = (step1.techStack as string[]) || [];
    const priorities = (step1.priorities as string[]) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <StepperHeader currentStep={3} />

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Review & Generate</h2>
                    <p className="text-gray-500 text-sm mt-1">Confirm your project details before the AI builds your plan.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Product */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-600 text-base">description</span>
                            </div>
                            <span className="font-semibold text-gray-900">Product Details</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800 mb-1">{(step1.name as string) || "Untitled Project"}</div>
                        <div className="text-sm text-gray-500 mb-3">{(step1.description as string)?.slice(0, 120) || "No description"}...</div>
                        {features.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {features.slice(0, 4).map((f) => <Badge key={f} label={f} variant="gray" />)}
                                {features.length > 4 && <Badge label={`+${features.length - 4} more`} variant="gray" />}
                            </div>
                        )}
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600 text-base">code</span>
                            </div>
                            <span className="font-semibold text-gray-900">Tech Stack</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {techStack.length > 0
                                ? techStack.map((t) => <Badge key={t} label={t} variant="primary" />)
                                : <span className="text-sm text-gray-400">Not specified</span>}
                        </div>
                    </div>

                    {/* Priorities */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-600 text-base">star</span>
                            </div>
                            <span className="font-semibold text-gray-900">Priorities</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {priorities.length > 0
                                ? priorities.map((p) => <Badge key={p} label={p} variant="warning" />)
                                : <span className="text-sm text-gray-400">Not specified</span>}
                        </div>
                    </div>
                </div>

                {/* AI Confidence */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-purple-600 text-base">smart_toy</span>
                        <span className="font-semibold text-gray-900">AI Confidence Estimate</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: "87%", background: "linear-gradient(90deg, #6366F1, #A855F7)" }} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">87%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Based on the completeness of your project details.</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <button onClick={() => router.push("/projects/new/team")}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        ← Back to Team
                    </button>
                    <button onClick={handleGenerate} disabled={generating}
                        className="px-6 py-3 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                        <span className="material-symbols-outlined text-base">smart_toy</span>
                        {generating ? "Starting..." : "Generate Development Plan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
