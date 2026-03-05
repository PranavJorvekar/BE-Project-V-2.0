# Backend Architecture

The backend is a high-performance, type-safe API built with **Fastify** and **TypeScript**, leveraging **Prisma** for database orchestration and **LangChain** for AI agent workflows.

## Server Structure

- **Entry Point**: `src/server.ts` - Initializes Fastify, registers plugins (CORS, sensible), and sets up routes.
- **Routes**: Located in `src/routes/`:
  - `projects.ts`: Multi-tenant project management (CRUD, stats, status polling).
  - `employees.ts`: Global employee directory management.
  - `generate.ts`: Entry point for the AI generation pipeline.
- **Lib**: Located in `src/lib/`:
  - `prisma.ts`: Shared Prisma client instance.
  - `llm.ts`: Centralized LLM configuration and `AI_MODE` (mock/real) toggling.

## Database (Prisma)

We use Prisma as a modern ORM to manage our relational data.

- **Schema**: `prisma/schema.prisma` defines the core entities:
  - `Project`: Root entity for a plan.
  - `TeamMember`: Project-specific copy of an employee with roles/tasks.
  - `Epic`: High-level SDLC phases.
  - `Task`: Granular engineering work items.
  - `Warning`: AI-detected risks.
  - `Employee`: Global directory for assignment sourcing.
- **Cascade Logic**: Deleting a project automatically cleans up all associated Epics, Tasks, and Warnings.

## AI Integration

The backend serves as the brain of the platform. It doesn't just call an API; it orchestrates a pipeline of specialized agents.

- **Mode Toggling**: Controlled via `AI_MODE` in `.env`.
  - `mock`: Uses deterministic local templates for rapid testing/demoing.
  - `real`: Connects to OpenAI via LangChain for dynamic, context-aware generation.

## Performance & Scaling

- **Background Processing**: The generation pipeline runs asynchronously (Fire-and-forget in the route) to keep the API responsive.
- **Polling Pattern**: Clients trigger generation and then poll `/api/v1/projects/:id/status` for updates.
