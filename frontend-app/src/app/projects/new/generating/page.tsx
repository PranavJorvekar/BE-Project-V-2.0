"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generatePlan, getGenerationStatus } from "@/lib/api";

const steps = [
    { id: 1, label: "Parsing product requirements", icon: "description" },
    { id: 2, label: "Generating SDLC epics", icon: "layers" },
    { id: 3, label: "Breaking epics into tasks", icon: "task_alt" },
    { id: 4, label: "Assigning tasks to team", icon: "group" },
    { id: 5, label: "Detecting risks & warnings", icon: "warning" },
];

function GeneratingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");

    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [dotCount, setDotCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const triggered = useRef(false);

    // Animate loading dots
    useEffect(() => {
        intervalRef.current = setInterval(() => setDotCount((d) => (d + 1) % 4), 500);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    // Step animation while generating
    useEffect(() => {
        let step = 0;
        const stepInterval = setInterval(() => {
            step = Math.min(step + 1, steps.length - 1);
            setCurrentStep(step);
        }, 2200);
        return () => clearInterval(stepInterval);
    }, []);

    // Trigger generation + poll status
    useEffect(() => {
        if (!projectId || triggered.current) return;
        triggered.current = true;

        // Trigger the pipeline
        generatePlan(projectId).catch((err) => {
            console.error("Failed to trigger pipeline:", err);
        });

        // Poll for completion
        const poll = async () => {
            try {
                const status = await getGenerationStatus(projectId);
                if (status.status === "IN_PLANNING" || status.status === "IN_PROGRESS" || status.status === "COMPLETED") {
                    // Done! Navigate to the project dashboard
                    if (pollRef.current) clearInterval(pollRef.current);
                    router.push(`/projects/${projectId}`);
                } else if (status.status === "DRAFT") {
                    // Pipeline may have failed
                    setError("Plan generation failed. Please try again.");
                    if (pollRef.current) clearInterval(pollRef.current);
                }
            } catch {
                // keep polling
            }
        };

        pollRef.current = setInterval(poll, 2000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [projectId, router]);

    const progress = Math.round((currentStep / (steps.length - 1)) * 100);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)" }}>

            {/* Background circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="absolute rounded-full opacity-10"
                        style={{
                            width: `${300 + i * 150}px`, height: `${300 + i * 150}px`,
                            background: "radial-gradient(circle, #6366F1, transparent)",
                            top: `${10 + i * 20}%`, left: `${10 + i * 25}%`,
                            animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center">
                {/* AI Brain Icon */}
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
                    <span className="material-symbols-outlined text-white text-4xl"
                        style={{ animation: "pulse 2s ease-in-out infinite" }}>smart_toy</span>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Generating Your Plan</h1>
                <p className="text-indigo-200 text-sm mb-8">
                    AI agents are crafting your SDLC plan{".".repeat(dotCount + 1)}
                </p>

                {/* Progress Bar */}
                <div className="h-2 rounded-full mb-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(10, progress)}%`, background: "linear-gradient(90deg, #6366F1, #A855F7, #EC4899)" }}
                    />
                </div>

                {/* Step indicators */}
                <div className="space-y-3 mb-10">
                    {steps.map((step, i) => {
                        const done = i < currentStep;
                        const active = i === currentStep;
                        return (
                            <div key={step.id}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                                style={{
                                    background: active ? "rgba(255,255,255,0.15)" : done ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                                    opacity: i > currentStep + 1 ? 0.4 : 1,
                                }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : active ? "bg-indigo-500" : "bg-white/10"}`}>
                                    {done
                                        ? <span className="material-symbols-outlined text-white text-sm">check</span>
                                        : active
                                            ? <span className="material-symbols-outlined text-white text-sm" style={{ animation: "spin 1.5s linear infinite" }}>refresh</span>
                                            : <span className="material-symbols-outlined text-white/50 text-sm">{step.icon}</span>}
                                </div>
                                <span className={`text-sm font-medium ${done ? "text-emerald-300" : active ? "text-white" : "text-white/40"}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={() => { if (pollRef.current) clearInterval(pollRef.current); router.push("/projects"); }}
                    className="text-sm text-indigo-300 hover:text-white transition-colors"
                >
                    Cancel and return to projects
                </button>
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.1; transform:scale(1); } 50% { opacity:0.2; transform:scale(1.05); } }
      `}</style>
        </div>
    );
}

export default function GeneratingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#1e1b4b] flex items-center justify-center">
                <div className="text-white text-sm opacity-50">Initializing AI system...</div>
            </div>
        }>
            <GeneratingContent />
        </Suspense>
    );
}
