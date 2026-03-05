# Frontend Architecture

The frontend is a modern, high-performance web application built with **Next.js 15**, **Tailwind CSS**, and **TypeScript**. It prioritizes a premium user experience with real-time feedback and intuitive navigation.

## Core Framework

- **Framework**: Next.js (App Router) - Handles routing, server-side rendering, and API interactions.
- **Styling**: Tailwind CSS for a utility-first, responsive design.
- **Components**: Radix UI primitives for accessible, high-quality interactive elements.
- **Icons**: Lucide React for consistent, performant iconography.

## Routing Structure

The application follows the Next.js App Router pattern:

- `src/app/page.tsx`: Landing page.
- `src/app/projects/`: Core dashboard for viewing all projects.
- `src/app/projects/new/`: Multi-step project creation wizard.
- `src/app/projects/[id]/`: Dynamic sub-routes for project details:
  - `tasks/`: Kanban-style task board.
  - `team/`: Resource management and team dashboard.
  - `warnings/`: AI risk visualization.
  - `timeline/`: Gantt-style project roadmap.
- `src/app/employees/`: Global employee directory.

## API Client

The `src/lib/api.ts` file acts as the bridge between the React components and the backend. It uses `fetch` to interact with our Fastify server, providing typed functions for:

- Retrieving project lists and details.
- Creating/Deleting projects.
- Managing employees.
- Triggering the AI generation pipeline.

## State & Data Fetching

- **Client-Side Fetching**: Uses standard React `useEffect` and `useState` for dynamic data requirements.
- **Real-time Feedback**: Implementation of polling mechanisms to reflect the background AI generation status on the project dashboard.
- **Responsive Design**: The UI is optimized for both desktop and mobile views, ensuring accessibility across devices.
