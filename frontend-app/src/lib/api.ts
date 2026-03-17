const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectSummary {
    id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    timeline: number;
    createdAt: string;
    epicCount: number;
    taskCount: number;
    team: { id: string; name: string; initials: string }[];
    warningCount: number;
}

export interface CreateProjectPayload {
    name: string;
    description: string;
    features: string[];
    techStack: string[];
    priorities: string[];
    timeline: number;
    teamMembers: {
        name: string;
        role: string;
        initials?: string;
        specialization?: string;
        skills: string[];
        experience: "junior" | "mid" | "senior" | "lead";
        weeklyHours: number;
    }[];
}

export interface GenerationStatus {
    id: string;
    status: "DRAFT" | "GENERATING" | "IN_PLANNING" | "IN_PROGRESS" | "COMPLETED";
    progress: number;
}

// ─── API Functions ─────────────────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectSummary[]> {
    const res = await fetch(`${API_BASE}/api/v1/projects`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    return data.projects;
}

export async function createProject(payload: CreateProjectPayload): Promise<{ id: string; name: string }> {
    const res = await fetch(`${API_BASE}/api/v1/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create project");
    }
    const data = await res.json();
    return data.project;
}

export async function getProject(id: string) {
    const res = await fetch(`${API_BASE}/api/v1/projects/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project;
}

export async function generatePlan(projectId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/projects/${projectId}/generate`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to trigger generation");
}

export async function getGenerationStatus(projectId: string): Promise<GenerationStatus> {
    const res = await fetch(`${API_BASE}/api/v1/projects/${projectId}/status`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to get status");
    return res.json();
}

export interface PipelineProgressEvent {
    step: number;
    stepLabel: string;
    done: boolean;
    error?: string;
    startedAt?: number;
}

/** Subscribe to real-time pipeline progress via SSE.
 *  Returns a cleanup function — call it to close the connection. */
export function subscribeToProgress(
    projectId: string,
    onUpdate: (progress: PipelineProgressEvent) => void,
    onDone: () => void
): () => void {
    const source = new EventSource(`${API_BASE}/api/v1/projects/${projectId}/progress`);

    source.onmessage = (event) => {
        try {
            const data: PipelineProgressEvent = JSON.parse(event.data);
            onUpdate(data);
            if (data.done) {
                source.close();
                onDone();
            }
        } catch {
            // ignore malformed events
        }
    };

    source.onerror = () => {
        source.close();
    };

    return () => source.close();
}


export async function updateTask(taskId: string, updates: { teamMemberId: string | null }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
}

export async function getEmployees(): Promise<{ employees: any[] }> {
    const res = await fetch(`${API_BASE}/api/v1/employees`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to get employees");
    return res.json();
}

export async function createEmployee(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create employee");
    return res.json();
}

export async function deleteEmployee(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/employees/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete employee");
}

export async function deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/projects/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete project");
}

export interface DashboardStats {
    totalProjects: number;
    totalTasks: number;
    totalEpics: number;
    totalWarnings: number;
    totalTeamMembers: number;
    statusBreakdown: Record<string, number>;
    recentProjects: ProjectSummary[];
    allTeamMembers: { id: string; name: string; initials: string; projects: string[] }[];
    warningProjects: { id: string; name: string; warningCount: number; status: string }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const projects = await getProjects();

    const statusBreakdown: Record<string, number> = {};
    let totalTasks = 0;
    let totalEpics = 0;
    let totalWarnings = 0;
    const memberMap = new Map<string, { id: string; name: string; initials: string; projects: string[] }>();

    for (const p of projects) {
        statusBreakdown[p.status] = (statusBreakdown[p.status] || 0) + 1;
        totalTasks += p.taskCount;
        totalEpics += p.epicCount;
        totalWarnings += p.warningCount;
        for (const m of p.team) {
            if (!memberMap.has(m.id)) {
                memberMap.set(m.id, { ...m, projects: [p.name] });
            } else {
                memberMap.get(m.id)!.projects.push(p.name);
            }
        }
    }

    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const warningProjects = projects
        .filter(p => p.warningCount > 0)
        .sort((a, b) => b.warningCount - a.warningCount);

    return {
        totalProjects: projects.length,
        totalTasks,
        totalEpics,
        totalWarnings,
        totalTeamMembers: memberMap.size,
        statusBreakdown,
        recentProjects,
        allTeamMembers: Array.from(memberMap.values()),
        warningProjects,
    };
}

export async function updateEmployee(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update employee");
    return res.json();
}

export async function updateTeamMember(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/team-members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update team member");
    return res.json();
}
