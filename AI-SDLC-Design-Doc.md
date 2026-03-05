# Design Document: AI SDLC Analyst

**Product Name:** AI SDLC Analyst  
**Version:** 1.0  
**Document Owner:** Design Team  
**Last Updated:** March 4, 2026  
**Status:** Initial Design Specification

---

## Executive Summary

This Design Document translates the Product Requirements Document (PRD) into comprehensive visual and interactive specifications for AI SDLC Analyst. The design draws inspiration from modern ERP/CRM dashboard patterns while tailoring the experience specifically for startup teams planning software development projects.

The design system emphasizes clarity, efficiency, and trust-building through transparent AI explanations. Every interface element serves the dual purpose of enabling rapid plan generation while educating inexperienced teams on SDLC best practices.

**Design Philosophy:** Professional yet approachable, data-rich yet uncluttered, AI-powered yet explainable.

---

## Design Inspiration & Reference

### Primary Design Reference

**Source:** Streamlined ERP/CRM Dashboard Design (Behance)  
**Key Takeaways:**
- Clean, modern aesthetic with generous white space
- Card-based information architecture for modular content
- Professional color palette with strategic accent colors
- Data visualization emphasis with charts and metrics
- Clear visual hierarchy with consistent typography
- Responsive grid layouts supporting multiple screen sizes

### Design Adaptation for AI SDLC Analyst

While ERP/CRM dashboards focus on data monitoring and reporting, AI SDLC Analyst requires a workflow-driven interface that guides users through multi-step processes. Our design adapts the clean, professional aesthetic while adding:

\begin{itemize}
\item \textbf{Wizard-style flows} for project setup (stepped progression)
\item \textbf{Explainability panels} showing AI reasoning (unique to our product)
\item \textbf{Drag-and-drop task assignment} (interactive manipulation)
\item \textbf{Warning and suggestion cards} (proactive guidance)
\item \textbf{Export and sharing modals} (collaboration focus)
\end{itemize}

---

## Design System

### Color Palette

#### Primary Colors

**Indigo (Primary Brand Color)**
- `#4F46E5` - Indigo 600 (Primary buttons, active states, links)
- `#6366F1` - Indigo 500 (Hover states)
- `#3730A3` - Indigo 700 (Pressed states, dark accents)
- `#EEF2FF` - Indigo 50 (Light backgrounds, hover surfaces)

**Rationale:** Indigo conveys trust, professionalism, and innovation—essential for an AI-powered planning tool. It stands out from typical SaaS blues while maintaining corporate credibility.

#### Secondary Colors

**Green (Success, Positive Actions)**
- `#10B981` - Green 500 (Success messages, completion badges)
- `#059669` - Green 600 (Success button hover)
- `#D1FAE5` - Green 100 (Success backgrounds)

**Amber (Warnings, Medium Priority)**
- `#F59E0B` - Amber 500 (Warning badges, medium priority)
- `#D97706` - Amber 600 (Warning hover states)
- `#FEF3C7` - Amber 100 (Warning backgrounds)

**Red (Errors, Critical Issues)**
- `#EF4444` - Red 500 (Error messages, critical warnings)
- `#DC2626` - Red 600 (Error hover states)
- `#FEE2E2` - Red 100 (Error backgrounds)

**Purple (AI Features, Explanations)**
- `#8B5CF6` - Purple 500 (AI explanation badges, intelligent features)
- `#7C3AED` - Purple 600 (AI feature hover)
- `#F3E8FF` - Purple 100 (AI explanation backgrounds)

#### Neutral Colors

**Grays (Text, Backgrounds, Borders)**
- `#111827` - Gray 900 (Primary text, headings)
- `#374151` - Gray 700 (Secondary text)
- `#6B7280` - Gray 500 (Tertiary text, icons)
- `#9CA3AF` - Gray 400 (Placeholder text)
- `#D1D5DB` - Gray 300 (Borders, dividers)
- `#E5E7EB` - Gray 200 (Light borders)
- `#F9FAFB` - Gray 50 (Page background)
- `#FFFFFF` - White (Card backgrounds, surfaces)

### Typography

#### Font Family

**Primary Font:** Inter (Sans-serif)  
**Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Rationale:** Inter is designed specifically for user interfaces with excellent readability at small sizes. Its open apertures and balanced letterforms work well for data-dense dashboards.

**Monospace Font (Code, Task IDs):** "Courier New", Courier, monospace

#### Type Scale

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
\textbf{Element} & \textbf{Size} & \textbf{Weight} & \textbf{Line Height} \\
\hline
H1 (Page titles) & 32px & 600 (Semibold) & 40px (125\%) \\
H2 (Section headings) & 24px & 600 (Semibold) & 32px (133\%) \\
H3 (Subsection headings) & 20px & 600 (Semibold) & 28px (140\%) \\
H4 (Card titles) & 18px & 600 (Semibold) & 24px (133\%) \\
Body Large & 16px & 400 (Regular) & 24px (150\%) \\
Body Regular & 14px & 400 (Regular) & 20px (143\%) \\
Body Small & 12px & 400 (Regular) & 16px (133\%) \\
Button Text & 14px & 500 (Medium) & 20px (143\%) \\
Caption & 12px & 400 (Regular) & 16px (133\%) \\
Overline (Labels) & 11px & 600 (Semibold) & 16px (145\%) \\
\hline
\end{tabular}
\caption{Typography scale specifications}
\end{table}

#### Text Colors

- **Primary text:** Gray 900 (`#111827`)
- **Secondary text:** Gray 700 (`#374151`)
- **Tertiary text / placeholders:** Gray 500 (`#6B7280`)
- **Disabled text:** Gray 400 (`#9CA3AF`)
- **Links:** Indigo 600 (`#4F46E5`)

### Spacing System

**Base Unit:** 4px (0.25rem)

**Spacing Scale:**
- `xs`: 4px (0.25rem)
- `sm`: 8px (0.5rem)
- `md`: 12px (0.75rem)
- `base`: 16px (1rem)
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)
- `2xl`: 48px (3rem)
- `3xl`: 64px (4rem)

**Usage Guidelines:**
- Internal card padding: `base` (16px) or `lg` (24px)
- Between sections: `xl` (32px) or `2xl` (48px)
- Between related elements: `sm` (8px) or `md` (12px)
- Button padding: `sm` (8px) vertical, `base` (16px) horizontal

### Layout Grid

#### Desktop (≥1280px)

**Grid System:** 12-column grid  
**Container max-width:** 1280px  
**Gutter width:** 24px  
**Margin:** 32px on each side

#### Tablet (768px - 1279px)

**Grid System:** 8-column grid  
**Container max-width:** 100% with padding  
**Gutter width:** 20px  
**Margin:** 24px on each side

#### Mobile (≤767px)

**Grid System:** 4-column grid  
**Container max-width:** 100% with padding  
**Gutter width:** 16px  
**Margin:** 16px on each side

### Border Radius

- **Small (buttons, badges, inputs):** 6px
- **Medium (cards, modals):** 8px
- **Large (panels, major containers):** 12px
- **Full (pills, avatars):** 9999px

### Shadows

**Elevation System:**

```css
/* Shadow Tokens */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

**Usage:**
- Cards: `shadow-sm`
- Hover cards: `shadow-md`
- Modals, dropdowns: `shadow-lg`
- Major overlays: `shadow-xl`

### Icons

**Icon Library:** Heroicons (by Tailwind Labs)  
**Style:** Outline for most UI elements, Solid for filled states  
**Sizes:**
- Small: 16px (1rem)
- Medium: 20px (1.25rem)
- Large: 24px (1.5rem)

**Common Icons:**
- **Navigation:** ChevronRight, ChevronLeft, Menu, XMark
- **Actions:** Plus, PencilSquare, TrashCan, DocumentDuplicate
- **Status:** CheckCircle, XCircle, ExclamationTriangle, InformationCircle
- **Data:** ChartBar, TableCells, DocumentText, ClipboardDocumentList
- **People:** User, UserGroup, UserCircle
- **AI Features:** Sparkles, LightBulb, CpuChip

---

## Component Library

### Buttons

#### Button Variants

**Primary Button**
- Background: Indigo 600 (`#4F46E5`)
- Text: White
- Hover: Indigo 500 (`#6366F1`)
- Active: Indigo 700 (`#3730A3`)
- Shadow: `shadow-sm`
- Border radius: 6px
- Padding: 8px 16px (Small), 10px 20px (Medium), 12px 24px (Large)

**Secondary Button**
- Background: Transparent
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Text: Gray 700 (`#374151`)
- Hover: Background Gray 50 (`#F9FAFB`)
- Active: Background Gray 100

**Success Button**
- Background: Green 500 (`#10B981`)
- Text: White
- Hover: Green 600 (`#059669`)

**Danger Button**
- Background: Red 500 (`#EF4444`)
- Text: White
- Hover: Red 600 (`#DC2626`)

**Ghost Button**
- Background: Transparent
- Text: Indigo 600
- Hover: Background Indigo 50
- No border

#### Button States

- **Default:** Standard appearance
- **Hover:** Slightly darker/lighter background
- **Active/Pressed:** Darker background, slight scale (98%)
- **Focus:** 2px outline in Indigo 500 with 4px offset
- **Disabled:** Opacity 50%, cursor not-allowed, no hover effects
- **Loading:** Spinner icon, disabled state

### Form Controls

#### Text Input

**Default State:**
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Background: White
- Text: Gray 900
- Padding: 10px 12px
- Border radius: 6px
- Font size: 14px

**Focus State:**
- Border: 2px solid Indigo 500 (`#6366F1`)
- Outline: None (border acts as focus indicator)
- Shadow: `0 0 0 3px rgba(79, 70, 229, 0.1)` (Indigo glow)

**Error State:**
- Border: 2px solid Red 500 (`#EF4444`)
- Background: Red 50 (`#FEF2F2`)

**Disabled State:**
- Background: Gray 50 (`#F9FAFB`)
- Text: Gray 400 (`#9CA3AF`)
- Cursor: not-allowed

#### Textarea

Same styling as text input, with:
- Min height: 80px
- Resize: vertical only
- Line height: 20px (143%)

#### Select Dropdown

- Same base styling as text input
- Chevron icon (down) on right side with 12px right padding
- Dropdown menu: White background, shadow-lg, max-height 300px with scroll

#### Checkbox

- Size: 16px × 16px
- Border: 2px solid Gray 300
- Border radius: 4px
- Checked: Background Indigo 600, white checkmark icon
- Focus: Indigo 500 outline with offset

#### Radio Button

- Size: 16px × 16px
- Border: 2px solid Gray 300
- Border radius: Full (9999px)
- Selected: Border Indigo 600 (4px), inner dot Indigo 600 (8px)

#### Toggle Switch

- Width: 44px
- Height: 24px
- Border radius: Full
- Off: Background Gray 200, circle left
- On: Background Indigo 600, circle right
- Circle: 20px diameter, white, shadow-sm

### Cards

**Standard Card**
- Background: White
- Border: 1px solid Gray 200 (`#E5E7EB`)
- Border radius: 8px
- Padding: 24px
- Shadow: `shadow-sm`
- Hover: `shadow-md`, border Gray 300

**Compact Card**
- Padding: 16px
- Same other properties

**Interactive Card** (clickable)
- Cursor: pointer
- Hover: Transform scale(1.01), shadow-md
- Transition: all 150ms ease

**Highlighted Card** (selected/active)
- Border: 2px solid Indigo 500
- Background: Indigo 50 (very subtle)

### Badges

**Pill Badge**
- Padding: 4px 12px
- Border radius: Full (9999px)
- Font size: 12px
- Font weight: 500

**Color Variants:**

\begin{table}
\begin{tabular}{|l|l|l|}
\hline
\textbf{Type} & \textbf{Background} & \textbf{Text Color} \\
\hline
Default & Gray 100 & Gray 700 \\
Primary & Indigo 100 & Indigo 700 \\
Success & Green 100 & Green 700 \\
Warning & Amber 100 & Amber 700 \\
Danger & Red 100 & Red 700 \\
AI/Special & Purple 100 & Purple 700 \\
\hline
\end{tabular}
\caption{Badge color variants}
\end{table}

### Modals

**Modal Overlay**
- Background: rgba(0, 0, 0, 0.5)
- Backdrop blur: 4px (optional, browser support)

**Modal Container**
- Background: White
- Border radius: 12px
- Shadow: `shadow-xl`
- Max width: 600px (default), 900px (large)
- Padding: 32px
- Centered vertically and horizontally

**Modal Header**
- H2 heading (24px, semibold)
- Close button (X icon) in top-right
- Margin bottom: 24px

**Modal Body**
- Content area with scroll if needed
- Max height: calc(100vh - 200px)

**Modal Footer**
- Padding top: 24px
- Border top: 1px solid Gray 200
- Buttons aligned right
- Gap between buttons: 12px

### Alerts / Notifications

**Toast Notification** (temporary)
- Position: Top-right, fixed
- Width: 360px
- Padding: 16px
- Border radius: 8px
- Shadow: `shadow-lg`
- Auto-dismiss: 5 seconds (configurable)
- Close button: X icon

**Inline Alert** (persistent)
- Width: 100%
- Padding: 12px 16px
- Border radius: 6px
- Border left: 4px solid (accent color)
- Icon on left (20px)
- Text: 14px

**Color Variants:**

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
\textbf{Type} & \textbf{Background} & \textbf{Border} & \textbf{Icon} \\
\hline
Info & Blue 50 & Blue 500 & InformationCircle \\
Success & Green 50 & Green 500 & CheckCircle \\
Warning & Amber 50 & Amber 500 & ExclamationTriangle \\
Error & Red 50 & Red 500 & XCircle \\
\hline
\end{tabular}
\caption{Alert color variants}
\end{table}

### Data Tables

**Table Container**
- Background: White
- Border: 1px solid Gray 200
- Border radius: 8px
- Overflow: hidden

**Table Header**
- Background: Gray 50 (`#F9FAFB`)
- Border bottom: 1px solid Gray 200
- Text: 12px, uppercase, semibold, Gray 500
- Padding: 12px 16px

**Table Row**
- Border bottom: 1px solid Gray 200
- Padding: 16px
- Hover: Background Gray 50

**Table Cell**
- Padding: 16px
- Text: 14px, Gray 900
- Vertical align: middle

**Sortable Column**
- Cursor: pointer
- Icon: ChevronUpDown (default), ChevronUp/Down (sorted)
- Hover: Text Indigo 600

### Progress Indicators

**Progress Bar**
- Height: 8px
- Background: Gray 200
- Border radius: Full
- Fill: Indigo 600 (animated)
- Transition: width 300ms ease

**Spinner**
- Size: 20px (small), 32px (medium), 48px (large)
- Border: 3px solid Gray 200
- Border-top: 3px solid Indigo 600
- Animation: spin 0.6s linear infinite

**Stepper** (Multi-step wizard)
- Horizontal layout
- Steps connected by lines
- Current step: Indigo 600 background, white text
- Completed step: Green 500 background, white checkmark
- Upcoming step: Gray 200 background, gray text
- Step number in circle (32px diameter)

### Tooltips

**Default Tooltip**
- Background: Gray 900 (90% opacity)
- Text: White, 12px
- Padding: 6px 12px
- Border radius: 6px
- Max width: 200px
- Arrow: 6px triangle pointing to element
- Transition: opacity 150ms, transform 150ms

**Positioning:** Auto (top/bottom/left/right based on space)

### Dropdowns

**Dropdown Menu**
- Background: White
- Border: 1px solid Gray 200
- Border radius: 8px
- Shadow: `shadow-lg`
- Min width: 200px
- Max height: 400px (scroll if needed)

**Dropdown Item**
- Padding: 10px 16px
- Hover: Background Gray 50
- Active: Background Indigo 50, text Indigo 600
- Font size: 14px
- Cursor: pointer

**Dropdown Divider**
- Border top: 1px solid Gray 200
- Margin: 8px 0

---

## Screen Designs & Wireframes

### 1. Project Setup Wizard

The wizard uses a 3-step process with clear progression indicators. Each step is a full-screen experience with a stepper at the top showing progress.

#### Step 1: Product Details

**Layout:**
- **Stepper** at top: "1. Product Details" (active) → "2. Team" → "3. Review"
- **Main Content Area** (centered, max-width 800px)
- **Navigation Footer** (fixed bottom): "Save Draft" (ghost) | "Next" (primary)

**Form Fields:**

\begin{enumerate}
\item \textbf{Product Name} (required)
   - Text input, max 100 characters
   - Label: "Product Name"
   - Placeholder: "e.g., Sales Tracking Dashboard"

\item \textbf{Product Description} (required)
   - Rich text editor (bold, italic, lists)
   - Label: "Describe your product"
   - Placeholder: "Explain what your product does and who it's for..."
   - Character counter: "0 / 500"
   - Helper text: "100-500 words recommended"

\item \textbf{Key Features} (required, 5-10 items)
   - Dynamic bullet list with add/remove buttons
   - Label: "Key Features or User Stories"
   - Each feature: text input with trash icon to remove
   - "+ Add Feature" button (ghost) at bottom
   - Helper text: "List 5-10 essential features for your MVP"

\item \textbf{Non-Functional Priorities}
   - Label: "What matters most for your MVP?"
   - Multi-select checkboxes in 2-column grid:
     - ☐ Performance
     - ☐ Security
     - ☐ Scalability
     - ☐ Time-to-Market
     - ☐ Cost Efficiency
     - ☐ User Experience

\item \textbf{Tech Stack}
   - Label: "Target Technologies"
   - Tag input with suggestions dropdown
   - Common suggestions: React, Vue, Angular, Node.js, Django, Flask, Next.js, PostgreSQL, MongoDB, AWS, Azure
   - Placeholder: "Type to search or add custom..."

\item \textbf{Timeline}
   - Label: "MVP Timeline (weeks)"
   - Slider: 4 to 12+ weeks
   - Display: Large number showing selected value
   - Helper text: "Most startups target 6-10 weeks for MVP"
\end{enumerate}

**Visual Hierarchy:**
- Each field in a card with 24px padding
- 24px gap between cards
- Required fields marked with red asterisk
- Field focus: Indigo border highlight
- Auto-save indicator: Small "Saved" badge with checkmark in top-right

---

#### Step 2: Team Composition

**Layout:**
- **Stepper** at top: "1. Product Details" (complete, green checkmark) → "2. Team" (active) → "3. Review"
- **Header Section**: "Build Your Team" (H1) + "Add team members with their skills and availability" (subtitle)
- **Team Member Cards** (vertical list, max-width 800px)
- **Add Team Member Button** (primary, bottom of list)
- **Navigation Footer**: "Back" (secondary) | "Save Draft" (ghost) | "Next" (primary)

**Team Member Card:**

Each card (White background, shadow-sm, 24px padding) contains:

\begin{enumerate}
\item \textbf{Card Header} (flex row, space-between)
   - Left: "Team Member 1" (H4) with edit icon
   - Right: Delete icon button (ghost, red on hover)

\item \textbf{Name Field}
   - Text input
   - Label: "Name"
   - Placeholder: "e.g., Priya Sharma"

\item \textbf{Role Dropdown}
   - Label: "Role"
   - Options: Backend Developer, Frontend Developer, Full-Stack Developer, QA Engineer, DevOps Engineer, UI/UX Designer, Other

\item \textbf{Skills} (tag input)
   - Label: "Skills \& Technologies"
   - Tag pills with X to remove
   - Placeholder: "Type skills and press Enter..."
   - Helper text: "Add technologies they know (React, Python, AWS, etc.)"

\item \textbf{Experience Level}
   - Label: "Experience"
   - Radio buttons (horizontal):
     - ◯ Junior (0-2 yrs)
     - ◯ Mid-level (2-5 yrs)
     - ◯ Senior (5+ yrs)

\item \textbf{Weekly Capacity} (number input with slider)
   - Label: "Weekly Capacity (hours)"
   - Input: Number field (10-60 range)
   - Slider: Visual representation
   - Default: 40 hours
   - Helper text: "How many hours per week can they dedicate?"

\item \textbf{Current Workload} (percentage)
   - Label: "Current Workload (\%)"
   - Slider: 0-100\%
   - Visual bar showing filled percentage
   - Helper text: "0\% = fully available, 100\% = fully occupied"

\item \textbf{Available Capacity} (calculated, read-only)
   - Label: "Available Capacity"
   - Display: Large badge showing calculated hours
   - Formula shown in tooltip: Weekly Capacity × (1 - Workload \%)
   - Example: "16 hours/week" in green badge
\end{enumerate}

**Capacity Warning Card** (appears if total capacity seems low):
- Background: Amber 50
- Border: Left 4px Amber 500
- Icon: ExclamationTriangle
- Text: "Your team's total capacity (80 hours) may be insufficient for your 8-week timeline. Consider adding team members or extending the timeline."
- "Understood" button to dismiss

---

#### Step 3: Review & Generate

**Layout:**
- **Stepper** at top: All three steps with checkmarks
- **Summary Cards** (2-column grid on desktop, stack on mobile)
- **Generate Button** (large, primary, centered bottom)

**Summary Cards:**

**Card 1: Product Summary**
- Icon: DocumentText
- Title: "Product Details"
- Content:
  - Product Name (bold)
  - Description (first 150 chars + "...")
  - Feature count badge: "8 features"
  - Tech stack tags
  - Timeline badge: "8 weeks"
- Edit button (ghost, small) in top-right

**Card 2: Non-Functional Priorities**
- Icon: ListBullet
- Title: "Priorities"
- Checkmark list of selected priorities
- Edit button

**Card 3: Team Overview**
- Icon: UserGroup
- Title: "Team Composition"
- Team member count: "4 members"
- Breakdown by role (with counts):
  - 1 Senior Full-Stack Developer
  - 1 Mid-level Frontend Developer
  - 1 Mid-level Backend Developer
  - 1 Junior QA Engineer
- Total available capacity: "64 hours/week" (large badge)
- Edit button

**Card 4: Estimated Project Size**
- Icon: ChartBar
- Title: "Project Estimate"
- AI-generated estimate badge: "Medium Project"
- Estimated tasks: "35-50 tasks"
- Estimated epics: "5-6 epics"
- Confidence level: Progress bar with label "High Confidence"

**Generation Section** (full-width, centered):
- Headline: "Ready to Generate Your Plan?" (H2)
- Subtext: "This usually takes 30-60 seconds"
- Large primary button: "Generate Development Plan" with Sparkles icon
- Secondary button below: "Save Draft & Exit"

**Loading State** (after clicking Generate):
- Modal overlay appears
- Centered spinner (48px)
- Progress messages that change every 10 seconds:
  - "Analyzing your product requirements..."
  - "Generating SDLC-aligned epics..."
  - "Breaking down tasks..."
  - "Assigning tasks to team members..."
  - "Finalizing your plan..."
- Cancel button (ghost, below spinner)

---

### 2. Plan Overview Dashboard

This is the main dashboard users see after plan generation. It uses a tab-based navigation to organize different views of the plan.

#### Dashboard Layout

**Top Navigation Bar** (fixed, full-width)
- Logo + "AI SDLC Analyst" (left)
- Project name dropdown (center)
- User profile menu (right)

**Dashboard Header** (below nav bar)
- **Left Side:**
  - Project name (H1): "Sales Dashboard MVP"
  - Status badge: "In Planning" / "In Progress" / "Completed"
  - Last updated: "Updated 5 minutes ago" (gray text)
- **Right Side (Action Buttons):**
  - "Export" (secondary button with download icon)
  - "Share" (secondary button with share icon)
  - "Edit Project" (secondary button with pencil icon)

**Metrics Cards Row** (4 cards, responsive grid)

**Card 1: Total Tasks**
- Icon: ClipboardDocumentList (Indigo)
- Number: "45" (large, bold)
- Label: "Total Tasks"
- Subtext: "8 completed" with progress bar

**Card 2: Total Hours**
- Icon: Clock (Purple)
- Number: "320" (large, bold)
- Label: "Estimated Hours"
- Subtext: "64 hrs/week capacity"

**Card 3: Timeline**
- Icon: Calendar (Green)
- Number: "8" (large, bold)
- Label: "Weeks"
- Subtext: "Starts Mar 10, 2026"

**Card 4: Team Members**
- Icon: UserGroup (Amber)
- Number: "4" (large, bold)
- Label: "Team Members"
- Subtext: Avatar group (overlapping circles)

**Tab Navigation** (below metrics)
- Tabs: Epics | Tasks | Team | Timeline | Warnings
- Active tab: Indigo 600 underline (3px), bold text
- Inactive: Gray 500 text, hover Gray 700

---

#### Tab 1: Epics View

**Layout:** Vertical list of expandable epic cards

**Epic Card** (collapsed state):
- **Header Row** (flex, space-between):
  - Left:
    - Epic number badge: "1" (circle, Indigo background)
    - Epic name: "Discovery & MVP Scoping" (H3)
    - Duration badge: "1 week"
  - Right:
    - Chevron icon (down when collapsed, up when expanded)
    - Task count: "5 tasks"
    - Status icon: CheckCircle (green) if all done, else InProgress icon

**Epic Card** (expanded state):
- **Goal Section:**
  - Label: "Goal" (overline style)
  - Text: Epic goal description (2-3 lines)
- **Scope Section:**
  - Label: "What's Included" (overline style)
  - Bullet list of scope items (3-5 items)
- **Definition of Done:**
  - Label: "Done When" (overline style)
  - Checklist items (each with checkbox icon)
- **Tasks Preview:**
  - Label: "Tasks in this Epic" (overline style)
  - Mini task list (first 3 tasks):
    - Task name
    - Assignee avatar + name
    - Effort badge: "8 hrs"
  - "View all 5 tasks →" link (if more tasks)
- **Edit Button** (ghost, in card footer)

**Example Epic Cards:**

1. **Discovery & MVP Scoping** (Indigo accent)
2. **Architecture & Technical Setup** (Purple accent)
3. **Core Feature Implementation** (Blue accent)
4. **Testing & Basic Security** (Green accent)
5. **Deployment & Release** (Amber accent)
6. **Post-Release Improvements** (Gray accent)

---

#### Tab 2: Tasks View

**Header Actions:**
- Search input (left): "Search tasks..."
- Filter dropdown: "All Tasks" / "By Epic" / "By Priority" / "By Assignee"
- Sort dropdown: "Priority" / "Effort" / "Epic Order"

**Tasks Table:**

\begin{table}
\begin{tabular}{|l|l|l|l|l|l|l|}
\hline
\textbf{ID} & \textbf{Task Name} & \textbf{Epic} & \textbf{Assignee} & \textbf{Effort} & \textbf{Priority} & \textbf{Actions} \\
\hline
TASK-001 & User research & Discovery & Priya & 4h & High & ⋯ \\
TASK-002 & Database design & Architecture & Amit & 8h & Critical & ⋯ \\
... & ... & ... & ... & ... & ... & ... \\
\hline
\end{tabular}
\caption{Tasks table example}
\end{table}

**Table Columns:**

\begin{enumerate}
\item \textbf{ID}: Monospace font, Gray 500, small (e.g., "TASK-023")
\item \textbf{Task Name}: Primary text, bold on hover, clickable
\item \textbf{Epic}: Badge with epic name (colored by epic)
\item \textbf{Assignee}: Avatar (24px) + name
\item \textbf{Effort}: Badge showing hours (e.g., "8 hrs")
\item \textbf{Priority}: Colored badge (Critical: Red, High: Amber, Medium: Blue, Low: Gray)
\item \textbf{Actions}: Three-dot menu icon (Edit, View Details, Delete)
\end{enumerate}

**Row Hover:** Background Gray 50, shadow-sm, scale(1.005)

**Click Task Row:** Opens task detail modal

---

**Task Detail Modal:**

**Header:**
- Task ID (overline)
- Task name (H2)
- Close button (X)

**Content Tabs:**
- Details | Assignment | Dependencies

**Details Tab:**
- **Description** (rich text)
- **Acceptance Criteria** (checklist)
- **Required Skills** (tag pills)
- **Required Role** (badge)
- **Estimated Effort** (large number with hours label)
- **Priority** (badge)

**Assignment Tab:**
- **Assigned To** (avatar + name + role)
- **Fit Score** (large number with progress ring visualization)
  - Example: "92" in center of donut chart
  - Chart segments: Skill (40%), Experience (30%), Capacity (20%), Balance (10%)
- **Explanation Card:**
  - Background: Purple 50
  - Icon: Sparkles
  - Label: "AI Assignment Reasoning"
  - Text: Full explanation (50-100 words)
  - Example: "Assigned to Priya because she has strong React skills (skill match: 95), has previously implemented drag-and-drop features (experience: 90), and has 12 hours available this week (capacity: 90)."
- **Alternative Assignments:**
  - Label: "Other Options Considered"
  - List of 2-3 other team members with fit scores
  - Each row: Avatar, name, fit score badge, "Reassign" button

**Dependencies Tab:**
- **Prerequisites** (tasks that must be done first)
  - Card list showing task IDs, names, status
  - If incomplete: Warning badge
- **Dependents** (tasks blocked by this one)
  - Card list
- **Dependency Graph** (visual flowchart)
  - SVG diagram showing task relationships
  - Current task highlighted in center
  - Arrows showing flow

**Modal Footer:**
- "Edit Task" (secondary)
- "Mark Complete" (primary, if in progress)
- "Delete Task" (danger, ghost)

---

#### Tab 3: Team View

**Layout:** Grid of team member cards (2 columns on desktop, 1 on mobile)

**Team Member Card:**

**Header:**
- Avatar (64px, colored ring)
- Name (H3)
- Role badge below name
- Edit icon button (top-right corner)

**Stats Row** (3 metric badges):
- Total Tasks: "8" (with icon)
- Total Hours: "64 hrs" (with icon)
- Capacity Used: Progress bar "80%" (Green if <80%, Amber if 80-95%, Red if >95%)

**Assigned Tasks Section:**
- Label: "Current Assignments" (overline)
- List of tasks (max 5 visible, scroll or "Show all" link):
  - Task name
  - Effort badge
  - Priority badge
- Empty state: "No tasks assigned yet" with illustration

**Skills Section:**
- Label: "Skills" (overline)
- Tag pills (scrollable horizontal if many)

**Experience Badge:**
- "Senior (7 years)" or "Mid-level (3 years)" or "Junior (1 year)"
- Icon: Star (filled based on level)

**Card Footer:**
- "View Details" link (ghost)

---

**Team Member Detail Modal:**

Opens when clicking "View Details" on team card.

**Content:**
- Full profile information
- Editable fields (same as wizard)
- **Workload Chart:**
  - Bar chart showing weekly capacity breakdown
  - Assigned hours vs. available hours
  - Week-by-week view (if timeline extended)
- **Task List:**
  - All tasks assigned to this person
  - Sortable by priority, effort, epic
- **Reassignment Section:**
  - "Reassign Tasks" button
  - Opens task reassignment interface

**Footer:**
- "Save Changes" (primary)
- "Cancel" (secondary)

---

#### Tab 4: Timeline View

**Visualization Type:** Interactive Gantt Chart

**Header:**
- View selector: "Sprint View" / "Weekly View" / "Monthly View"
- Zoom controls: +/- buttons
- Today indicator: Badge showing current date

**Gantt Chart:**

**Y-Axis (left side):**
- Epic names (grouped)
  - Task names (indented under epics)

**X-Axis (top):**
- Time scale (weeks or sprints)
- Grid lines for each week

**Task Bars:**
- Color-coded by epic
- Width = effort (time duration)
- Position = start time based on dependencies
- Hover: Tooltip showing task details
- Dependencies: Gray arrows connecting dependent tasks

**Critical Path Highlighting:**
- Tasks on critical path: Red border
- Warning icon if path is at risk

**Milestones:**
- Diamond markers at key dates
- Examples: "MVP Kickoff", "Feature Complete", "Launch"

**Interactive Features:**
- Drag task bars to reschedule (with warning if breaks dependencies)
- Click task bar to open task detail modal
- Zoom in/out for detail levels

---

#### Tab 5: Warnings View

**Layout:** List of warning cards (vertical stack)

**Warning Card Structure:**

**Header:**
- Severity icon (left):
  - Critical: Red XCircle
  - High: Amber ExclamationTriangle
  - Medium: Blue InformationCircle
- Title (H4): Warning description
- Status badge (right): "Open" / "Acknowledged" / "Resolved"

**Body:**
- **Problem Description:** 2-3 sentences explaining the issue
- **Impact:** Bullet list of potential consequences
- **Recommendation:** Specific action items (numbered list)

**Example Warning Cards:**

**Warning 1: Scope Creep Risk** (Critical)
- Background: Red 50, Red 500 left border
- Description: "Your project has 10 features planned for an 8-week timeline, but your team only has 64 hours/week capacity. This requires 400 total hours, but you only have 512 available."
- Impact:
  - Likely to miss deadline
  - Team burnout risk
  - Quality may suffer
- Recommendation:
  1. Remove 2-3 non-essential features
  2. Extend timeline to 10 weeks
  3. Add one more developer

**Footer Actions:**
- "Apply Suggested Fix" (primary button)
- "Acknowledge" (secondary) - marks as acknowledged
- "Dismiss" (ghost)

**Warning 2: Insufficient Testing** (High)
- Background: Amber 50, Amber 500 left border
- Description: "Testing tasks account for only 10% of total effort. Industry best practice is 15-20% for quality MVP delivery."
- Recommendation:
  1. Add API integration tests to Epic 4
  2. Add performance testing tasks
  3. Allocate more time for QA review

**Warning 3: Single Point of Failure** (Medium)
- Background: Blue 50, Blue 500 left border
- Description: "Priya is assigned 45% of all critical path tasks. If she becomes unavailable, your timeline is at severe risk."
- Recommendation:
  1. Distribute 2-3 tasks to Amit
  2. Cross-train team members on React
  3. Document critical technical decisions

**Empty State** (when no warnings):
- Illustration: Checkmark with confetti
- Text: "Great job! No issues detected in your plan."
- Subtext: "Your plan follows SDLC best practices."

---

### 3. Task Assignment View

This specialized view allows manual task reassignment with drag-and-drop interaction.

**Access:** Button in main dashboard: "Adjust Assignments" (opens full-screen view)

**Layout:** Kanban-style board

**Column Structure:**

- **Unassigned Tasks** (leftmost column, if any)
- **Team Member 1 Column**
- **Team Member 2 Column**
- **Team Member 3 Column**
- **Team Member 4 Column**

**Column Header:**
- Avatar (40px)
- Name (H4)
- Role (caption)
- Capacity bar:
  - Visual progress bar
  - "48 / 60 hrs" (assigned / total)
  - Color: Green (<80%), Amber (80-95%), Red (>95%)

**Task Card** (draggable):
- Task ID (overline, Gray 500)
- Task name (bold, 14px)
- Epic badge (colored, small)
- Effort badge: "8 hrs"
- Priority badge: colored dot + text
- Fit score indicator: Small "92" with star icon (shown when hovering over column)

**Drag & Drop Interactions:**

1. **Pick up card:** Card lifts with shadow-xl, cursor grab
2. **Dragging:** Ghost card follows cursor, original position shows placeholder
3. **Hover over column:** Column highlights with Indigo 100 background
4. **Valid drop:** Green border on column
5. **Invalid drop (capacity exceeded):** Red border, warning toast
6. **Drop:** Smooth animation, card slides into position
7. **Fit score tooltip:** Appears during drag showing fit score for hovered column

**Warning Indicator:**
- If dragging to person with lower fit score: Yellow warning icon appears
- Tooltip: "This person has lower fit (65) compared to current assignee (92). Proceed anyway?"

**Action Bar** (bottom, fixed):
- "Auto-Assign All" (secondary) - resets to AI assignments
- "Reset Changes" (ghost) - undo manual changes
- "Save Assignments" (primary, large) - saves and returns to dashboard
- Changes counter: "3 tasks reassigned" (badge)

---

### 4. Export & Share Screen

Opens as full-screen modal or dedicated page.

**Header:**
- "Export & Share Your Plan" (H1)
- Project name (subtitle)

**Two Column Layout:**

#### Left Column: Export Options

**Card: Download Formats**
- Radio button list:
  - ◯ CSV (Universal format)
  - ◯ PDF Report (Presentation-ready)
  - ◯ Jira CSV (Import to Jira)
  - ◯ Trello JSON (Import to Trello)
  - ◯ Notion Database (Import to Notion)
  - ◯ Linear CSV (Import to Linear)
  - ◯ Asana CSV (Import to Asana)

**Preview Section:**
- Label: "Preview Export"
- Scrollable preview of export data
- For CSV: Table view with rows/columns
- For PDF: Thumbnail pages

**Customize Export:**
- Checkboxes:
  - ☑ Include epic descriptions
  - ☑ Include task acceptance criteria
  - ☑ Include assignment explanations
  - ☑ Include team member profiles
  - ☐ Include timeline visualizations

**Download Button:**
- Large primary button: "Download [Format]" with download icon
- Shows file size estimate: "~2.4 MB"

---

**Card: Integration Setup**

For tools requiring OAuth (Jira, Linear, Asana):

**Not Connected State:**
- Tool logo (48px)
- Tool name (H4)
- Description: "Connect your [Tool] account to automatically create your plan"
- "Connect [Tool]" button (primary with tool brand color)

**Connected State:**
- Tool logo + checkmark badge
- "Connected as user@email.com" (small text)
- "Export to [Tool]" button (primary)
- "Disconnect" link (ghost, small)

**Export Flow:**
1. Click "Export to [Tool]"
2. Modal appears: "Exporting to Jira..."
3. Progress bar with steps:
   - Creating epics
   - Creating tasks
   - Setting assignments
   - Configuring dependencies
4. Success screen: "Successfully exported!" with link to project in Jira

---

#### Right Column: Share Options

**Card: Share Link**

**Generate Link Section:**
- "Create a shareable link" (H4)
- Description: "Anyone with the link can view this plan"
- "Generate Link" button (primary)

**After Generation:**
- Link input (read-only): https://aisdlc.app/share/abc123def456
- "Copy Link" button (with clipboard icon)
- Copy success: Green checkmark toast "Link copied!"

**Access Control:**
- Label: "Who can access?"
- Radio buttons:
  - ◯ Anyone with the link (Public)
  - ◯ Only team members (login required)
  - ◯ Specific people (enter emails)

**If "Specific people" selected:**
- Email input field: "Add email addresses"
- Tag input with chips for each added email
- "Send Invites" button

**Permissions:**
- Label: "What can they do?"
- Radio buttons:
  - ◯ View only
  - ◯ View and comment
  - ◯ View and edit (team members only)

**Expiration:**
- Checkbox: "Link expires after:"
- Dropdown: 7 days / 30 days / 90 days / Never

---

**Card: Team Collaboration**

**Invite Team Members:**
- Email input: "Enter team member email"
- "+ Add" button
- List of invited members:
  - Avatar placeholder
  - Email
  - Role dropdown: Viewer / Commentor / Editor
  - Remove (X) button

**Activity Log:**
- Label: "Recent Activity"
- List of recent views/edits:
  - "priya@startup.com viewed plan" - 5 min ago
  - "amit@startup.com edited task TASK-023" - 1 hour ago
  - "neha@startup.com commented on Epic 2" - 2 hours ago
- "View Full Activity" link

**Notification Settings:**
- Toggle: "Notify me when someone views the plan"
- Toggle: "Notify me when someone makes changes"
- Toggle: "Daily summary email"

---

### 5. Plan Refinement & Iteration

**Access:** "Edit Plan" button from main dashboard

**Layout:** Side-by-side view (left: current plan, right: changes panel)

#### Left Panel: Current Plan

- Epic and task list (same as main view)
- Each item has "Edit" icon on hover
- Status badges: Completed (green checkmark), In Progress (blue dot), Not Started (gray)

#### Right Panel: Change Manager

**Tabs:** Edit | History | Re-Generate

**Edit Tab:**

When clicking edit on any item, form appears in right panel:

**Edit Epic:**
- Name (text input)
- Goal (textarea)
- Scope (rich text)
- Duration (number input with weeks)
- Order (up/down arrows to reorder)
- "Save Changes" button

**Edit Task:**
- All task fields editable (same as task detail modal)
- "Split Task" button - creates 2 subtasks
- "Merge with..." dropdown - combines with another task
- "Move to Epic" dropdown - reassign to different epic

**Add New Task/Epic:**
- "+ Add Custom Task" button (primary)
- "+ Add Custom Epic" button (secondary)
- Opens form in right panel with all required fields

---

**History Tab:**

**Version Timeline:**
- Vertical timeline showing plan versions
- Each version node:
  - Date/time
  - User who made change
  - Summary: "Added 3 tasks, modified 1 epic"
  - "View" and "Restore" buttons

**Diff View:**
- When clicking "View" on version:
  - Shows side-by-side comparison
  - Green highlighting: Added items
  - Red highlighting: Removed items
  - Yellow highlighting: Modified items
- "Restore This Version" button (with confirmation)

---

**Re-Generate Tab:**

**Partial Re-Generation:**
- Headline: "Update Your Plan with AI"
- Description: "Tell us what changed and we'll adjust your plan accordingly"

**Change Input:**
- Label: "What changed?"
- Checkboxes:
  - ☐ Added new features
  - ☐ Removed features
  - ☐ Timeline changed
  - ☐ Team composition changed
  - ☐ Different tech stack
  - ☐ Other (specify)

**If features changed:**
- Text area: "List added/removed features"

**If timeline changed:**
- Slider: New timeline

**If team changed:**
- "Update Team" button opens team wizard

**Re-Generate Scope:**
- Radio buttons:
  - ◯ Re-generate entire plan
  - ◯ Re-generate specific epic (dropdown)
  - ◯ Re-generate task assignments only

**Warning:**
- Background: Amber 50
- Icon: ExclamationTriangle
- Text: "Completed tasks will not be modified. In-progress tasks may be reassigned or merged."

**Action:**
- Large primary button: "Re-Generate Plan" with Sparkles icon
- Loading state (same as initial generation)

**Diff Review:**
- After re-generation completes:
  - Shows diff view (old vs. new)
  - Side-by-side comparison
  - User can accept or reject each change
  - "Accept All" / "Reject All" buttons
  - Individual "Accept" / "Reject" on each diff
- Final "Apply Changes" button

---

### 6. SDLC Educational Components

Contextual help embedded throughout the interface.

**Tooltip Pattern:**

When hovering over labels with info icon:
- Small popup (max 200px width)
- Title: Term name (bold)
- Body: 1-2 sentence explanation
- "Learn more" link to guide

**Examples:**

**"Epic" Tooltip:**
- **Title:** What's an Epic?
- **Body:** "A large body of work that can be broken into smaller tasks. Each epic typically represents a major phase or feature area."
- **Link:** Learn about epics →

**"Acceptance Criteria" Tooltip:**
- **Title:** Acceptance Criteria
- **Body:** "Specific conditions that must be met for a task to be considered complete. These should be clear and testable."
- **Link:** Writing good acceptance criteria →

**"Fit Score" Tooltip:**
- **Title:** How Fit Scores Work
- **Body:** "AI calculates how well each team member matches a task based on skills (40%), experience (30%), capacity (20%), and workload balance (10%)."
- **Link:** Understanding task assignment →

---

**Onboarding Hints:**

First-time users see dismissible hint cards:

**In Project Setup:**
- Hint card above feature input:
  - Background: Indigo 50
  - Icon: LightBulb
  - Title: "Pro Tip"
  - Text: "Focus on core features that deliver the most value. You can always add more later!"
  - "Got it" button to dismiss

**In Dashboard:**
- First visit: Spotlight tour
  - Semi-transparent overlay
  - Spotlight circle highlighting feature
  - Popup explaining feature
  - "Next" / "Skip Tour" buttons
  - Steps: Epics tab → Tasks tab → Warnings tab → Export

---

**SDLC Guide (Help Center):**

Accessible from top nav menu: "?" icon → "SDLC Guide"

**Guide Structure:**

\begin{itemize}
\item \textbf{What is SDLC?}
  - Overview of software development life cycle
  - Why it matters for startups
  - Common phases explained

\item \textbf{Planning Your MVP}
  - Defining minimum viable product
  - Feature prioritization techniques
  - Timeline estimation tips

\item \textbf{Understanding Epics \& Tasks}
  - Epic structure and purpose
  - Task sizing best practices
  - Writing acceptance criteria

\item \textbf{Team Capacity \& Workload}
  - Calculating realistic capacity
  - Avoiding overallocation
  - Balancing workload

\item \textbf{Testing \& Quality Assurance}
  - Why testing matters for MVPs
  - Types of testing to include
  - When to involve QA

\item \textbf{Deployment \& DevOps}
  - Setting up CI/CD
  - Monitoring and logging basics
  - Security essentials

\item \textbf{Working with AI Assignments}
  - How the AI assigns tasks
  - When to override assignments
  - Building trust in AI recommendations
\end{itemize}

Each article: 300-500 words, 2-3 illustrations, "Was this helpful?" feedback at bottom

---

## Responsive Design Specifications

### Breakpoints

- **Desktop:** ≥ 1280px
- **Laptop:** 1024px - 1279px
- **Tablet:** 768px - 1023px
- **Mobile:** ≤ 767px

### Desktop (≥1280px)

**Project Setup Wizard:**
- Single column, centered (max-width 800px)
- Full stepper visible at top

**Dashboard:**
- Full layout with all elements
- 4-column metrics card row
- Side-by-side tabs and content
- Gantt chart fully interactive

**Task Assignment:**
- 4-5 columns side-by-side
- Full drag-and-drop experience

---

### Laptop (1024px - 1279px)

**Dashboard:**
- 3-column metrics (4th wraps)
- Slightly narrower content area
- Same functionality as desktop

---

### Tablet (768px - 1023px)

**Project Setup Wizard:**
- Same as desktop (centered column)

**Dashboard:**
- 2-column metrics cards
- Tabs remain horizontal
- Table becomes horizontally scrollable
- Task cards stack in assignment view (no drag-drop, use modal)

**Gantt Chart:**
- Horizontal scroll for timeline
- Pinned Y-axis for task names

---

### Mobile (≤767px)

**Project Setup Wizard:**
- Full-width forms (no max-width restriction)
- Stepper becomes compact (numbers only, no labels)
- One field per viewport height when possible

**Dashboard:**
- Single column metrics (stack vertically)
- Tabs become dropdown selector
- Tables become card list:
  - Each task as card
  - Key info visible: name, assignee, effort, priority
  - "View Details" button
- Gantt chart becomes simplified list view

**Task Assignment:**
- List view only (no columns)
- Each team member section expandable
- Reassign via modal (select person dropdown)

**Modals:**
- Full-screen on mobile
- Slide in from bottom
- Close button top-left
- Content scrolls

---

## Interaction Patterns

### Hover States

- **Cards:** Shadow increases (sm → md), slight scale (1.01)
- **Buttons:** Background lightens/darkens by 10%, shadow sm
- **Links:** Underline appears, color darkens
- **Table rows:** Background Gray 50, border Gray 300
- **Icons:** Opacity 70% → 100%, scale 1.05

### Focus States

**Keyboard Navigation:**
- 2px solid outline in Indigo 500
- 4px offset from element
- Visible on tab, not on click
- Focus trap in modals (tab cycles through modal elements)

### Loading States

**Buttons:**
- Replace text/icon with spinner
- Maintain button width (no layout shift)
- Disabled state (no click)

**Content:**
- Skeleton screens for cards and lists
- Pulsing gray rectangles matching layout
- No spinners for content loading (skeletons only)

**Progress:**
- Determinate: Progress bar with percentage
- Indeterminate: Animated spinner or dots

### Success/Error States

**Form Validation:**
- Inline validation on blur
- Success: Green check icon on right side of input
- Error: Red border + error message below input
- Error icon on right side

**Action Feedback:**
- Toast notifications (top-right)
- Auto-dismiss in 5 seconds
- Manual dismiss with X button
- Success: Green with CheckCircle icon
- Error: Red with XCircle icon

### Animations

**Timing:**
- Micro-interactions: 150ms
- Standard transitions: 250ms
- Page transitions: 300ms
- Loading states: 400ms

**Easing:**
- Enter: ease-out (cubic-bezier(0, 0, 0.2, 1))
- Exit: ease-in (cubic-bezier(0.4, 0, 1, 1))
- Move: ease-in-out (cubic-bezier(0.4, 0, 0.2, 1))

**Animations to Implement:**

- **Fade in:** Opacity 0 → 1, ease-out 250ms
- **Slide up:** TranslateY(20px) → 0, opacity 0 → 1, ease-out 300ms
- **Scale in:** Scale(0.95) → 1, opacity 0 → 1, ease-out 200ms
- **Slide in (sidebar):** TranslateX(-100%) → 0, ease-out 300ms
- **Pulse (loading):** Scale(1) → 1.05 → 1, infinite, ease-in-out 1000ms

**Reduced Motion:**
- Respect `prefers-reduced-motion: reduce`
- Replace animations with instant state changes
- Keep essential transitions (duration 50ms)

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Text: 4.5:1 minimum (normal text), 3:1 (large text ≥18px or bold ≥14px)
- UI components: 3:1 minimum
- Current palette tested and compliant

**Keyboard Navigation:**
- All interactive elements reachable via Tab
- Logical tab order (left-to-right, top-to-bottom)
- Skip links: "Skip to main content" at page top
- Modal focus trap: Tab cycles within modal
- Escape closes modals and dropdowns

**Screen Reader Support:**

**ARIA Labels:**
- All icons have aria-label or aria-labelledby
- Form inputs have associated labels (visible or aria-label)
- Buttons describe action: "Edit task TASK-023" not just "Edit"
- Status announcements: aria-live regions for toasts

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3, no skips)
- Lists use `<ul>` / `<ol>` elements
- Tables use proper markup (thead, tbody, th, td)
- Buttons use `<button>`, links use `<a>`

**Focus Management:**
- Focus moves to modal on open
- Focus returns to trigger on close
- Skip links for bypassing navigation
- Focus visible indicator (2px outline)

**Alternative Text:**
- All images have alt text
- Decorative images: alt="" (empty)
- Icons paired with text or aria-label

**Forms:**
- Error messages associated with inputs (aria-describedby)
- Required fields marked (aria-required="true")
- Invalid fields marked (aria-invalid="true")
- Helper text associated with inputs

**Dynamic Content:**
- Loading states announced (aria-busy="true")
- Success/error toasts announced (role="alert")
- Route changes announced (aria-live="polite")

---

## Performance Targets

### Load Time Goals

- **First Contentful Paint (FCP):** < 1.5 seconds
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **Time to Interactive (TTI):** < 3.5 seconds
- **Cumulative Layout Shift (CLS):** < 0.1

### Optimization Strategies

**Images:**
- Use WebP format with fallbacks
- Responsive images (srcset)
- Lazy loading below fold
- Max size: 200KB per image

**Fonts:**
- Load Inter from Google Fonts with font-display: swap
- Subset fonts (Latin only unless needed)
- Preload critical fonts

**JavaScript:**
- Code splitting by route
- Lazy load modals and heavy components
- Tree shaking unused code
- Bundle size target: < 200KB (gzipped)

**CSS:**
- Critical CSS inline in HTML
- Defer non-critical CSS
- Purge unused styles
- Use CSS containment for performance

**Data:**
- Paginate long lists (50 items per page)
- Virtual scrolling for 100+ items
- Debounce search inputs (300ms)
- Cache API responses (5 minutes)

**API Calls:**
- Batch related requests
- Use GraphQL for flexible data fetching
- Implement request deduplication
- Show optimistic updates for mutations

---

## Design Deliverables

### High-Fidelity Mockups

**Tools:** Figma

**Screens to Design:**
1. Project Setup Wizard (all 3 steps)
2. Plan Overview Dashboard (all 5 tabs)
3. Task Detail Modal
4. Task Assignment View
5. Export & Share Screen
6. Team Member Detail Modal
7. Plan Refinement View
8. Empty States (no tasks, no team, no warnings)
9. Error States (404, 500, network error)
10. Mobile versions of all key screens

**States to Show:**
- Default
- Hover
- Active/Focus
- Disabled
- Loading
- Success
- Error
- Empty

### Interactive Prototypes

**Tool:** Figma with prototype links

**Flows to Prototype:**
1. Complete wizard flow (Step 1 → Step 2 → Step 3 → Generation → Dashboard)
2. Browse plan (Dashboard → view epic → view task details)
3. Reassign task (Assignment view → drag task → drop → warning → confirm)
4. Export plan (Dashboard → Export screen → select format → download)
5. Share plan (Dashboard → Share screen → generate link → copy)

**Prototype Fidelity:**
- Clickable buttons and links
- Hover states visible
- Modal open/close
- Form interactions (type, select, toggle)
- Toast notifications appear
- Loading states simulate wait time (2-3 seconds)

### Component Documentation

**Figma Component Library:**
- All reusable components as Figma components
- Variants for different states
- Auto-layout for responsive behavior
- Tokens for colors, spacing, typography
- Documentation annotations in Figma

**Handoff Documentation:**
- Component specs (sizes, spacing, colors in code values)
- Interaction descriptions
- Animation specifications (duration, easing, properties)
- Accessibility requirements per component
- Edge cases and error states

### Design System Documentation

**Living Style Guide:**
- HTML/CSS examples of all components
- Code snippets for implementation
- Usage guidelines (when to use each variant)
- Do's and don'ts with visual examples
- Accessibility notes per component

**Tool:** Storybook or similar

---

## Design Quality Checklist

### Before Handoff

**Visual Design:**
- [ ] All screens use design system components
- [ ] Color palette consistent throughout
- [ ] Typography scale followed exactly
- [ ] Spacing system used (no arbitrary values)
- [ ] Icons consistent size and style
- [ ] Shadows applied correctly
- [ ] Border radius consistent

**Layout:**
- [ ] Responsive breakpoints defined
- [ ] Grid system followed
- [ ] Content hierarchy clear
- [ ] White space used effectively
- [ ] Alignment checked (everything on grid)
- [ ] No orphaned or awkward elements

**Content:**
- [ ] All text placeholder realistic (not Lorem Ipsum)
- [ ] Button labels action-oriented
- [ ] Error messages helpful and specific
- [ ] Empty states designed and friendly
- [ ] Loading states designed
- [ ] Microcopy reviewed for clarity

**Interaction:**
- [ ] All clickable elements look clickable
- [ ] Hover states designed
- [ ] Focus states designed
- [ ] Loading states designed
- [ ] Success/error feedback designed
- [ ] Animations specified (duration, easing)

**Accessibility:**
- [ ] Color contrast checked (WCAG AA)
- [ ] Focus indicators visible
- [ ] Text resizes without breaking layout
- [ ] Touch targets ≥ 44px × 44px (mobile)
- [ ] Alt text considerations noted
- [ ] Keyboard navigation flow logical

**Responsiveness:**
- [ ] Mobile designs complete
- [ ] Tablet designs complete
- [ ] Desktop designs complete
- [ ] Breakpoint behavior specified
- [ ] No horizontal scroll on mobile

**Edge Cases:**
- [ ] Very long text (names, descriptions)
- [ ] Very short text (one word)
- [ ] Many items (100+ tasks)
- [ ] Few items (1-2 tasks)
- [ ] Empty states (no data)
- [ ] Error states (network failure, API error)
- [ ] Loading states (slow connection)

---

## Future Enhancements

### Phase 2 Features

**Advanced Data Visualization:**
- Burn-down charts for sprint tracking
- Velocity graphs for team performance
- Capacity heatmaps across timeline
- Dependency network diagrams

**Collaboration Features:**
- Real-time commenting on tasks
- @mentions and notifications
- Activity feed showing team actions
- Task discussion threads

**AI Improvements:**
- Natural language task input ("Add a login feature")
- AI-suggested task breakdowns
- Predictive timeline estimates based on progress
- Risk prediction based on velocity

**Customization:**
- Custom epic templates
- Custom task types (bug, feature, chore)
- Custom fields for tasks
- Branding (logo, colors) for shared plans

### Phase 3 Features

**Advanced PM Tools:**
- Resource leveling algorithms
- What-if scenario planning
- Budget tracking and cost estimation
- Time tracking integration

**Integrations:**
- Slack notifications and updates
- GitHub/GitLab commit tracking
- Calendar sync (Google, Outlook)
- Video call scheduling (Zoom, Meet)

**Enterprise Features:**
- Multi-project dashboards
- Portfolio management
- Role-based permissions (viewer, editor, admin)
- SSO (SAML, LDAP)
- Audit logs
- On-premise deployment option

---

## Appendix A: Design System Resources

**Figma File Structure:**
```
AI-SDLC-Analyst-Design-System/
├── 00-Foundation/
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Shadows
│   └── Icons
├── 01-Components/
│   ├── Buttons
│   ├── Forms
│   ├── Cards
│   ├── Badges
│   ├── Modals
│   ├── Alerts
│   ├── Tables
│   └── Progress
├── 02-Patterns/
│   ├── Navigation
│   ├── Page Headers
│   ├── Empty States
│   ├── Error States
│   └── Loading States
└── 03-Screens/
    ├── Wizard
    ├── Dashboard
    ├── Modals
    └── Mobile Views
```

**Color Tokens (CSS Variables):**
```css
:root {
  /* Primary */
  --color-primary-50: #EEF2FF;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #3730A3;
  
  /* Success */
  --color-success-100: #D1FAE5;
  --color-success-500: #10B981;
  --color-success-600: #059669;
  
  /* Warning */
  --color-warning-100: #FEF3C7;
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;
  
  /* Error */
  --color-error-100: #FEE2E2;
  --color-error-500: #EF4444;
  --color-error-600: #DC2626;
  
  /* Neutral */
  --color-gray-50: #F9FAFB;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
}
```

---

## Appendix B: Sample UI Component Code

### Button Component (React)

```jsx
// Button.jsx
import React from 'react';
import './Button.css';

const Button = ({ 
  variant = 'primary', 
  size = 'medium',
  children,
  disabled = false,
  loading = false,
  onClick,
  icon,
  ...props 
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading'
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn__spinner" />
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          <span className="btn__text">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
```

```css
/* Button.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  transition: all 150ms ease;
  position: relative;
}

.btn--primary {
  background-color: #4F46E5;
  color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn--primary:hover:not(:disabled) {
  background-color: #6366F1;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.btn--primary:active:not(:disabled) {
  background-color: #3730A3;
  transform: scale(0.98);
}

.btn--secondary {
  background-color: transparent;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.btn--secondary:hover:not(:disabled) {
  background-color: #F9FAFB;
}

.btn--small {
  padding: 8px 16px;
}

.btn--medium {
  padding: 10px 20px;
}

.btn--large {
  padding: 12px 24px;
  font-size: 16px;
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--loading .btn__text {
  opacity: 0;
}

.btn__spinner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn:focus-visible {
  outline: 2px solid #6366F1;
  outline-offset: 2px;
}
```

---

## Appendix C: Wireframe Evolution

### Low-Fidelity → High-Fidelity

**Iteration 1: Paper Sketches**
- Basic layout concepts
- User flow mapping
- Component placement exploration

**Iteration 2: Low-Fidelity Wireframes**
- Grayscale boxes and placeholders
- Focus on structure and hierarchy
- Content zones defined

**Iteration 3: Mid-Fidelity Wireframes**
- Actual copy instead of Lorem Ipsum
- Real icon shapes
- Spacing refinement

**Iteration 4: High-Fidelity Mockups**
- Full design system applied
- Real colors and typography
- Interactive states shown

**Iteration 5: Interactive Prototype**
- Clickable flows
- Animations specified
- User testing ready

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Mar 4, 2026 | Design Team | Initial design document created based on PRD |

---

**End of Design Document**
