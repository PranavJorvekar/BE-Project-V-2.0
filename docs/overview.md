# Project Overview: AI SDLC Platform

## Vision

The **AI SDLC Platform** is an intelligent, agentic orchestration layer designed to automate and optimize the Software Development Lifecycle. It translates high-level product visions into granular, actionable engineering plans, complete with task assignments and risk assessments.

## Core Value Proposition

- **Automated Planning**: Go from a one-sentence idea to a full project backlog in seconds.
- **Agentic Intelligence**: Specialized AI agents handle distinct phases: requirements, architecture, task decomposition, and team assignment.
- **Risk Mitigation**: Proactive detection of staffing bottlenecks (Single Points of Failure) and timeline variances.
- **Premium UX**: A modern, responsive dashboard built with Next.js for clear visualization of project health.

## High-Level Workflow

1. **Input**: User defines project name, description, features, tech stack, and timeline.
2. **Team Setup**: User defines team members with specific skills and experience levels.
3. **Generation**: The AI Pipeline triggers a multi-agent workflow:
   - `RequirementsAgent` → `EpicGenerator` → `TaskBreaker` → `AssignmentAgent` → `RiskDetector`.
4. **Output**: A comprehensive project plan with Epics, Tasks, logic-based Assignments, and Warnings.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React, Radix UI.
- **Backend**: Fastify (TypeScript), LangChain (AI Orchestration).
- **Database**: Prisma ORM, PostgreSQL (Production) / SQLite (Development).
- **AI Models**: OpenAI GPT-4o and GPT-4o-mini.
