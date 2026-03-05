# AI Agent Pipeline Deep Dive

The core innovation of the AI SDLC Platform is its **Agentic Pipeline**. Instead of a single LLM call, we use a sequenced choreography of specialized agents to ensure precision and architectural integrity.

## Pipeline Orchestration (`pipeline.ts`)

The pipeline follows a linear orchestration flow. Each agent builds upon the output of the previous one:
`Input` → `Requirements` → `Epics` → `Tasks` → `Assignments` → `Risks` → `Database`

## Specialized Agents

### 1. Requirements Agent (`requirementsAgent.ts`)

- **Input**: Raw project name, description, and list of features.
- **Logic**: Parses abstract ideas into a structured "Product Requirements Document" (PRD) format.
- **Output**: Core objective, target users, tech stack suggestions, and suggested epic count.

### 2. Epic Generator (`epicGenerator.ts`)

- **Input**: Structured requirements.
- **Logic**: Breaks the project into high-level SDLC phases (e.g., Discovery, Architecture, Core Dev).
- **Output**: A list of Epics with goals, estimated effort, and scope highlights.

### 3. Task Breaker (`taskBreaker.ts`)

- **Input**: Generated Epics + Requirements.
- **Logic**: Decomposes each Epic into 4-8 actionable engineering tasks.
- **Output**: Granular tasks (4-24h effort) with descriptions, skill requirements, and "Definition of Done" criteria.

### 4. Assignment Agent (`assignmentAgent.ts`)

- **Input**: Generated Tasks + Team Member data.
- **Logic**: Evaluates every team member against every task using a multi-factor fit score:
  - **Skill Match**: Weighted score based on required vs. available skills.
  - **Experience Bonus**: Higher fit for seniors on architectural tasks.
  - **Bandwidth**: Checks weekly available hours.
- **Output**: Tasks assigned to the best-fit member with AI-generated reasoning and alternatives.

### 5. Risk Detector (`riskDetector.ts`)

- **Input**: Final assigned task list + team data.
- **Logic**: Scans the entire plan for patterns of risk:
  - **Single Point of Failure**: One person holding > 50% of the project.
  - **Timeline Variance**: High average task complexity.
  - **Skill Gap**: Tasks assigned with low fit scores.
- **Output**: Actionable warnings with severity levels and recommendations.

## AI Modes

- **`mock` Mode**: Returns high-quality predefined templates for consistent demo performance.
- **`real` Mode**: Leverages GPT-4o via LangChain for truly dynamic, custom project planning.
