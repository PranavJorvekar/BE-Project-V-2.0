"use client";

interface StepperHeaderProps {
    currentStep: 1 | 2 | 3;
}

const steps = [
    { num: 1, label: "Product Details", icon: "description" },
    { num: 2, label: "Team Composition", icon: "group" },
    { num: 3, label: "Review & Generate", icon: "rocket_launch" },
];

export default function StepperHeader({ currentStep }: StepperHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-6 py-6">
                <div className="flex items-center justify-center gap-2">
                    {steps.map((step, i) => {
                        const isDone = step.num < currentStep;
                        const isActive = step.num === currentStep;
                        const isFuture = step.num > currentStep;

                        return (
                            <div key={step.num} className="flex items-center gap-2">
                                {/* Circle */}
                                <div className={`flex items-center gap-2.5 ${isFuture ? "opacity-40" : ""}`}>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isDone
                                            ? "text-white"
                                            : isActive
                                                ? "text-white"
                                                : "bg-gray-200 text-gray-400"
                                        }`}
                                        style={isDone || isActive ? { background: "#4F46E5" } : {}}>
                                        {isDone ? (
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-sm">{step.icon}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Step {step.num}</div>
                                        <div className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                                            {step.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Connector */}
                                {i < steps.length - 1 && (
                                    <div className={`h-0.5 w-16 mx-2 rounded-full ${isDone ? "" : "bg-gray-200"}`}
                                        style={isDone ? { background: "#4F46E5" } : {}} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
