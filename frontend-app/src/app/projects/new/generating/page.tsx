"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generatePlan, getGenerationStatus, subscribeToProgress } from "@/lib/api";

// The 5 real pipeline steps — labels must match what pipeline.ts emits
const STEPS = [
    { step: 1, label: "Parsing product requirements", icon: "description" },
    { step: 2, label: "Generating SDLC epics", icon: "layers" },
    { step: 3, label: "Breaking epics into tasks", icon: "task_alt" },
    { step: 4, label: "Assigning tasks to team", icon: "group" },
    { step: 5, label: "Detecting risks & warnings", icon: "warning" },
];

// Format elapsed seconds as m:ss
function formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function GeneratingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");

    const [currentStep, setCurrentStep] = useState(0); // 0 = not started, 1-5 = active, 6 = done
    const [statusLabel, setStatusLabel] = useState("Starting AI pipeline…");
    const [error, setError] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [done, setDone] = useState(false);

    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const cleanupSSE = useRef<(() => void) | null>(null);
    const triggered = useRef(false);
    const startRef = useRef<number>(Date.now());

    // Elapsed timer
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Trigger generation + subscribe to SSE progress + poll as fallback
    useEffect(() => {
        if (!projectId || triggered.current) return;
        triggered.current = true;
        startRef.current = Date.now();

        // 1. Trigger the pipeline
        generatePlan(projectId).catch((err) => {
            console.error("Failed to trigger pipeline:", err);
        });

        // 2. Subscribe to SSE for real-time progress
        cleanupSSE.current = subscribeToProgress(
            projectId,
            (progress) => {
                setCurrentStep(progress.step);
                setStatusLabel(progress.stepLabel);
                if (progress.error) {
                    setError("Plan generation failed. Please try again.");
                    setDone(true);
                }
                if (progress.done && !progress.error) {
                    setDone(true);
                }
            },
            () => {
                // SSE said done — wait 600ms then navigate
                setTimeout(() => router.push(`/projects/${projectId}`), 600);
            }
        );

        // 3. Fallback polling in case SSE fails/isn't supported
        const poll = async () => {
            try {
                const status = await getGenerationStatus(projectId);
                if (
                    status.status === "IN_PLANNING" ||
                    status.status === "IN_PROGRESS" ||
                    status.status === "COMPLETED"
                ) {
                    if (pollRef.current) clearInterval(pollRef.current);
                    router.push(`/projects/${projectId}`);
                } else if (status.status === "DRAFT" && done) {
                    setError("Plan generation failed. Please try again.");
                    if (pollRef.current) clearInterval(pollRef.current);
                }
            } catch {
                // keep polling
            }
        };
        pollRef.current = setInterval(poll, 3000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (cleanupSSE.current) cleanupSSE.current();
        };
    }, [projectId, router, done]);

    // Progress bar: 0-100 based on step
    const progress = currentStep === 0
        ? 5
        : currentStep >= 6
            ? 100
            : Math.round((currentStep / STEPS.length) * 95) + 5;

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}
        >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${250 + i * 120}px`,
                            height: `${250 + i * 120}px`,
                            background: `radial-gradient(circle, ${["#6366F1", "#8B5CF6", "#A855F7", "#EC4899"][i]}, transparent)`,
                            top: `${5 + i * 22}%`,
                            left: `${5 + i * 22}%`,
                            opacity: 0.08,
                            animation: `orb-pulse ${4 + i * 1.5}s ease-in-out infinite alternate`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center">

                {/* AI Icon */}
                <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 0 40px rgba(99,102,241,0.3)",
                    }}
                >
                    <span
                        className="material-symbols-outlined text-white text-4xl"
                        style={{ animation: done ? "none" : "icon-spin 3s linear infinite" }}
                    >
                        {done ? "check_circle" : "smart_toy"}
                    </span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-1">
                    {done ? "Plan Ready!" : "Generating Your Plan"}
                </h1>
                <p className="text-indigo-300 text-sm mb-2">{statusLabel}</p>

                {/* Elapsed time */}
                {!done && (
                    <p className="text-indigo-400 text-xs mb-6 font-mono">
                        ⏱ {formatElapsed(elapsed)} elapsed
                    </p>
                )}

                {/* Progress Bar */}
                <div
                    className="h-2 rounded-full mb-6 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${progress}%`,
                            background: done
                                ? "linear-gradient(90deg, #10b981, #34d399)"
                                : "linear-gradient(90deg, #6366F1, #A855F7, #EC4899)",
                        }}
                    />
                </div>

                {/* Step indicators — real steps from backend */}
                <div className="space-y-2 mb-8">
                    {STEPS.map((s) => {
                        const isDone = s.step < currentStep || (done && !error);
                        const isActive = s.step === currentStep && !done;
                        const isPending = s.step > currentStep;

                        return (
                            <div
                                key={s.step}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500"
                                style={{
                                    background: isActive
                                        ? "rgba(99,102,241,0.2)"
                                        : isDone
                                            ? "rgba(16,185,129,0.1)"
                                            : "rgba(255,255,255,0.03)",
                                    border: isActive
                                        ? "1px solid rgba(99,102,241,0.4)"
                                        : isDone
                                            ? "1px solid rgba(16,185,129,0.2)"
                                            : "1px solid transparent",
                                    opacity: isPending ? 0.35 : 1,
                                    transform: isActive ? "scale(1.02)" : "scale(1)",
                                }}
                            >
                                {/* Step circle */}
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{
                                        background: isDone
                                            ? "#10b981"
                                            : isActive
                                                ? "#6366F1"
                                                : "rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {isDone ? (
                                        <span className="material-symbols-outlined text-white" style={{ fontSize: "16px" }}>check</span>
                                    ) : isActive ? (
                                        <span
                                            className="material-symbols-outlined text-white"
                                            style={{ fontSize: "16px", animation: "icon-spin 1.2s linear infinite" }}
                                        >
                                            refresh
                                        </span>
                                    ) : (
                                        <span className="material-symbols-outlined text-white/40" style={{ fontSize: "16px" }}>{s.icon}</span>
                                    )}
                                </div>

                                {/* Step label */}
                                <span
                                    className="text-sm font-medium text-left flex-1"
                                    style={{
                                        color: isDone ? "#6ee7b7" : isActive ? "#fff" : "rgba(255,255,255,0.35)",
                                    }}
                                >
                                    {s.label}
                                </span>

                                {/* Status badge */}
                                {isDone && (
                                    <span className="text-xs text-emerald-400 font-semibold">Done</span>
                                )}
                                {isActive && (
                                    <span className="text-xs text-indigo-300 font-semibold animate-pulse">Running</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Background notice */}
                <p className="text-indigo-400/60 text-xs mb-4">
                    💡 You can navigate away — generation continues in the background
                </p>

                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/15 border border-red-400/30 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={() => {
                        if (pollRef.current) clearInterval(pollRef.current);
                        if (cleanupSSE.current) cleanupSSE.current();
                        router.push("/projects");
                    }}
                    className="text-sm text-indigo-400 hover:text-white transition-colors underline underline-offset-4"
                >
                    Return to projects
                </button>
            </div>

            <style>{`
                @keyframes orb-pulse {
                    0% { transform: scale(1); opacity: 0.06; }
                    100% { transform: scale(1.15); opacity: 0.12; }
                }
                @keyframes icon-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default function GeneratingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
                <div className="text-white text-sm opacity-40">Initializing AI pipeline…</div>
            </div>
        }>
            <GeneratingContent />
        </Suspense>
    );
}
