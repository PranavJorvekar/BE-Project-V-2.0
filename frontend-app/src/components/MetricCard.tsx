"use client";

interface MetricCardProps {
    icon: string;
    iconColor?: string;
    iconBg?: string;
    value: string | number;
    label: string;
    subtext?: string;
}

export default function MetricCard({
    icon,
    iconColor = "text-indigo-600",
    iconBg = "bg-indigo-50",
    value,
    label,
    subtext,
}: MetricCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
                <div className="text-sm font-medium text-gray-600 mt-0.5">{label}</div>
                {subtext && <div className="text-xs text-gray-400 mt-0.5">{subtext}</div>}
            </div>
        </div>
    );
}
