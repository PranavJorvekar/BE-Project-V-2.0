"use client";

import { useState } from "react";
import { use } from "react";
import AppNav from "@/components/AppNav";
import TabNav from "@/components/TabNav";
import Badge from "@/components/Badge";
import Link from "next/link";

export default function SharePage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [copied, setCopied] = useState(false);
    const [expiry, setExpiry] = useState("7");
    const [jiraConnected] = useState(false);
    const [linearConnected] = useState(false);

    const shareUrl = `https://aisdlc.app/share/${projectId}?token=abc123preview`;

    const copy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNav />
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                    <Link href="/projects" className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-lg">arrow_back</span></Link>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-gray-900">Sales Dashboard MVP</h1>
                        <Badge label="In Planning" variant="warning" />
                    </div>
                </div>
            </div>
            <TabNav projectId={projectId} />

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Share & Export</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Share your plan with stakeholders or export to your favorite tools.</p>
                </div>

                {/* Share Link */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-indigo-600">link</span>
                        <h3 className="font-semibold text-gray-900">Shareable Link</h3>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 truncate">
                            <span className="material-symbols-outlined text-gray-400 text-base flex-shrink-0">lock</span>
                            <span className="truncate">{shareUrl}</span>
                        </div>
                        <button
                            onClick={copy}
                            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${copied ? "bg-emerald-500 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="material-symbols-outlined text-base">{copied ? "check" : "content_copy"}</span>
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Link expires in:</span>
                            <select value={expiry} onChange={(e) => setExpiry(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 bg-white">
                                <option value="7">7 days</option>
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="0">Never</option>
                            </select>
                        </div>
                        <div className="flex -space-x-2">
                            {["SC", "AR", "JK"].map((i, idx) => (
                                <div key={idx} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white bg-indigo-100 text-indigo-700">{i}</div>
                            ))}
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white bg-gray-100 text-gray-600">+2</div>
                        </div>
                    </div>
                </div>

                {/* Export */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-indigo-600">download</span>
                        <h3 className="font-semibold text-gray-900">Export Plan</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <span className="material-symbols-outlined text-red-500 text-xl">picture_as_pdf</span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-gray-800">Export as PDF</div>
                                <div className="text-xs text-gray-400">Full plan with Gantt</div>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-gray-600 text-xl">article</span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-gray-800">Export as Markdown</div>
                                <div className="text-xs text-gray-400">For Notion, Confluence</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Tool Integrations */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-indigo-600">integration_instructions</span>
                        <h3 className="font-semibold text-gray-900">Tool Integrations</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: "Jira", icon: "🔵", desc: "Sync epics and tasks to your Jira board", connected: jiraConnected, soon: false },
                            { name: "Linear", icon: "🟣", desc: "Import tasks to Linear as issues", connected: linearConnected, soon: false },
                            { name: "Slack", icon: "💬", desc: "Get plan updates in your Slack channels", connected: false, soon: true },
                        ].map((tool) => (
                            <div key={tool.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-xl">{tool.icon}</div>
                                    <div>
                                        <div className="font-medium text-gray-800 text-sm">{tool.name}</div>
                                        <div className="text-xs text-gray-400">{tool.desc}</div>
                                    </div>
                                </div>
                                {tool.soon ? (
                                    <Badge label="Soon" variant="gray" />
                                ) : tool.connected ? (
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">check_circle</span>
                                            Connected
                                        </span>
                                        <button className="text-xs text-gray-400 hover:text-red-500 transition-colors">Disconnect</button>
                                    </div>
                                ) : (
                                    <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                                        Connect
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
