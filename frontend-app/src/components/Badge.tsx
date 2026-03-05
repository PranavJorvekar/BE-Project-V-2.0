"use client";

interface BadgeProps {
    label: string;
    variant?: "primary" | "success" | "warning" | "danger" | "ai" | "gray" | "indigo" | "purple" | "blue";
    size?: "sm" | "md";
}

export default function Badge({ label, variant = "gray", size = "sm" }: BadgeProps) {
    const styles: Record<string, string> = {
        primary: "bg-blue-50 text-blue-700",
        success: "bg-green-50 text-green-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
        ai: "bg-purple-50 text-purple-700",
        gray: "bg-gray-100 text-gray-700",
        indigo: "bg-indigo-50 text-indigo-700",
        purple: "bg-purple-50 text-purple-700",
        blue: "bg-blue-50 text-blue-700",
    };

    const sizeStyles: Record<string, string> = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${styles[variant]} ${sizeStyles[size]}`}>
            {label}
        </span>
    );
}
