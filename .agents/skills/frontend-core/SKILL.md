---
name: frontend-core
description: A unified, end-to-end frontend engineering skill that guides the AI agent through frontend architecture design, component modeling, state management, styling strategies, API integration, performance optimization, accessibility, testing, build tooling, and the production of maintainable, scalable, and resilient client-side applications following modern best practices.
---

# Skills

This skill serves as the AI agent's comprehensive framework for tackling any frontend engineering challenge — from greenfield application architecture to component design, performance tuning, accessibility remediation, and frontend infrastructure decisions. The agent should treat each phase as a structured checkpoint, producing concrete recommendations, code patterns, or architectural artifacts before advancing. All guidance must be practical, implementation-ready, and grounded in modern frontend best practices.

## When to use

Activate this skill when any of the following conditions are detected:

- A user asks for help designing or structuring a frontend application from scratch.
- A user asks about frontend architecture decisions: component hierarchy, state management strategy, routing patterns, or rendering strategy (CSR, SSR, SSG, ISR).
- A user needs help designing, building, or refactoring UI components (atomic design, compound components, render props, headless components, etc.).
- A user asks about state management approaches (local state, context, Redux, Zustand, Jotka, signals, URL state, server state, etc.).
- A user needs guidance on styling strategy (CSS modules, CSS-in-JS, Tailwind, design tokens, theming).
- A user asks about data fetching, API integration, caching, or real-time data in the frontend.
- A user requests help with frontend performance optimization (bundle size, rendering performance, Core Web Vitals, lazy loading, code splitting).
- A user asks about accessibility (WCAG compliance, ARIA patterns, keyboard navigation, screen reader support).
- A user needs help with frontend testing strategy (unit, integration, E2E, visual regression, accessibility testing).
- A user asks about build tooling, bundling, CI/CD for frontend, or developer experience improvements.
- A user needs help with responsive design, cross-browser compatibility, or progressive enhancement.
- A user asks about frontend security (XSS prevention, CSP, CSRF, dependency security, input sanitization).
- A user asks about internationalization (i18n), localization (l10n), or RTL support.
- A user asks about design systems, component libraries, or shared UI infrastructure.
- A user asks about error handling, error boundaries, fallback UIs, or frontend resilience patterns.
- A user presents existing frontend code or architecture and asks for a review, critique, or refactoring guidance.
- A conversation involves terms such as "component," "React," "Vue," "Angular," "Svelte," "Next.js," "Nuxt," "SvelteKit," "Astro," "SPA," "SSR," "SSG," "hydration," "virtual DOM," "signals," "hooks," "state management," "CSS," "Tailwind," "Webpack," "Vite," "Turbopack," "tree shaking," "code splitting," "lazy loading," "Core Web Vitals," "LCP," "CLS," "INP," "accessibility," "ARIA," "responsive," "breakpoint," "design tokens," or similar frontend language.

Do NOT activate this skill for backend-only architecture questions with no frontend dimension (use product-architecture-design instead), pure requirements elicitation with no frontend implementation context (use requirements-analysis instead), or mobile-native development (Swift, Kotlin, Flutter, React Native) unless the question explicitly involves shared web/hybrid concerns.

## Instructions

### Mandatory UI Code Generation Defaults (Apply before all phases)

These defaults exist to make LLM-generated frontend code consistent, modern, and production-ready when user requirements are incomplete.

- **Default UI Generation Profile (use unless user explicitly overrides):**
  - Framework/runtime: **React + TypeScript + Vite + NextJS**.
  - Styling: **Tailwind CSS + CSS custom properties design tokens**.
  - Component primitives: accessible, reusable primitives with variant-based APIs and tokenized styles.
  - Data fetching/server state: **TanStack Query**.
  - Forms/validation: **React Hook Form + Zod**.
  - Icons: one consistent icon set (e.g., Lucide) across the app.
  - Testing baseline: **Vitest + Testing Library + Playwright + axe-core**.
- **Fast-path implementation mode:** If the user asks to build UI code directly, generate code immediately using defaults. Ask clarifying questions only when blockers are critical (missing API contract, auth model, or deployment/runtime constraints that would make code incorrect).
- **Consistency-first rule:** The model must prioritize visual and structural consistency over novelty. Avoid one-off components and ad-hoc styles.

### Non-Negotiable UI Quality Checklist (Must pass for generated code)

- Clean architecture: feature-oriented structure, reusable components, no duplicated patterns.
- Visual consistency: shared tokens for typography, spacing, radius, color, shadow, and motion.
- Component state coverage: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`.
- Responsive integrity: mobile-first behavior validated across defined breakpoints.
- Accessibility baseline: semantic HTML, keyboard operability, visible focus, proper labels/ARIA, WCAG contrast.
- Production readiness: loading/empty/error states, defensive error handling, no placeholder-grade UI artifacts.
- Maintainability: strict typing, predictable naming, bounded component size, minimal prop complexity.

### LLM Output Contract for UI Code Tasks (Required output shape)

For direct frontend code generation tasks, structure the output in this order:

1. Defaults selected (and why).
2. File tree.
3. Implemented components and layout primitives.
4. Accessibility notes.
5. Responsive behavior notes.
6. Quality checklist compliance summary.

### Anti-Pattern Blacklist (Never generate these)

- Raw color/spacing/shadow/radius values in component code when tokens exist.
- Inconsistent spacing scale usage inside the same feature.
- Clickable non-semantic elements for primary actions (`div`/`span` instead of `button`/`a`).
- Custom interactive components without keyboard and ARIA behavior.
- Multiple divergent button/input/card styles across features without tokenized variants.
- Inline style sprawl in production components when a project styling system exists.

### Phase 1 — Frontend Context and Requirements Assessment

1. **Clarify the frontend challenge type.** Before producing any guidance, determine what the user needs. Classify the request into one of these categories and state it explicitly:
   - **Greenfield architecture:** Designing a new frontend application from scratch.
   - **Feature implementation:** Building a specific feature or UI within an existing application.
   - **Component design:** Designing or refining a specific UI component or component system.
   - **Refactoring/migration:** Improving, restructuring, or migrating existing frontend code.
   - **Performance optimization:** Diagnosing and fixing performance problems.
   - **Accessibility remediation:** Identifying and fixing accessibility gaps.
   - **Infrastructure/tooling:** Build system, CI/CD, developer experience improvements.
   - **Review/critique:** Evaluating existing frontend code or architecture.

   The classification determines which subsequent steps to execute at full depth versus which to summarize.

2. **Gather frontend-specific requirements.** Extract or establish the following. Ask clarifying questions for any critical gaps:
   - **Product type and interaction model:** Marketing site, content platform, SaaS dashboard, e-commerce storefront, data-heavy internal tool, real-time collaborative app, media/streaming app? This drives rendering strategy, state complexity, and performance priorities.
   - **Target users and devices:** Desktop-primary, mobile-first, or universal? Touch-heavy interactions? Offline requirements? Low-bandwidth environments?
   - **Browser and platform support matrix:** Define minimum supported browsers and versions. State whether legacy support (IE, older Safari) is required.
   - **Existing tech stack (if any):** Framework, language (TypeScript or JavaScript), styling approach, state management, build tools, testing tools, deployment platform. If greenfield, note that stack selection is required.
   - **Team context:** Team size, frontend experience level, familiarity with specific frameworks, existing conventions.
   - **Design assets:** Is there a design system, Figma files, brand guidelines, or component library? Or is the agent advising on design system creation?
   - **Performance targets:** Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1), bundle size budget, time-to-interactive target.
   - **Accessibility requirements:** WCAG conformance level (A, AA, AAA), legal requirements (ADA, EAA, Section 508).
   - **SEO requirements:** Is search engine discoverability critical? This drives rendering strategy decisions.
   - **Internationalization requirements:** Number of languages, RTL support, locale-specific formatting.
   - **Integration points:** Backend APIs (REST, GraphQL, gRPC-Web), third-party SDKs, analytics, auth providers, CMS, payment gateways.
   - **Real-time requirements:** WebSockets, Server-Sent Events, polling? What data must update in real time?
   - **Offline requirements:** Must the app work offline? Service worker needs? Local data persistence?

3. **Identify the critical user interactions.** List the 3–5 most important UI workflows from the user's perspective. For each:
   - Describe the interaction sequence (what the user sees, clicks, types, and expects).
   - Identify the data requirements (what data must be fetched, created, or updated).
   - Note the performance sensitivity (is this a first-impression flow? a high-frequency interaction?).
   - Note the complexity drivers (conditional rendering, multi-step forms, real-time updates, optimistic UI, drag-and-drop, animations).

   These critical interactions will serve as the primary validation lens for all architectural decisions.

### Phase 2 — Frontend Architecture Design

4. **Select the rendering strategy with justification.** Evaluate and choose the appropriate rendering approach. Assess each candidate against the product requirements:

   | Strategy                                  | Best For                               | SEO       | Initial Load | Interactivity          | Infrastructure                   |
   | ----------------------------------------- | -------------------------------------- | --------- | ------------ | ---------------------- | -------------------------------- |
   | **CSR (Client-Side Rendering)**           | Highly interactive apps behind auth    | Poor      | Slower       | Excellent              | Static hosting                   |
   | **SSR (Server-Side Rendering)**           | Dynamic content, personalization + SEO | Excellent | Fast TTFB    | Good (after hydration) | Node server required             |
   | **SSG (Static Site Generation)**          | Content sites, marketing pages         | Excellent | Fastest      | Limited without JS     | Static hosting / CDN             |
   | **ISR (Incremental Static Regeneration)** | Content sites with frequent updates    | Excellent | Fast         | Limited without JS     | Platform-specific (Vercel, etc.) |
   | **Streaming SSR**                         | Large pages, progressive loading       | Good      | Progressive  | Good                   | Node server required             |
   | **Islands Architecture**                  | Content-heavy with interactive widgets | Excellent | Fast         | Selective              | Framework-specific (Astro)       |
   | **Hybrid / Per-route**                    | Apps with mixed needs                  | Per-route | Per-route    | Per-route              | Framework-dependent              |

   State the chosen strategy, the top three reasons it fits, and the two biggest risks. If a hybrid per-route approach is chosen, specify which routes use which strategy.

5. **Select the framework and meta-framework with justification.** Based on the rendering strategy, requirements, and team context, evaluate:
   - **React ecosystem:** React + Next.js (App Router or Pages Router), React + Remix, React + Vite SPA.
   - **Vue ecosystem:** Vue + Nuxt, Vue + Vite SPA.
   - **Svelte ecosystem:** Svelte + SvelteKit.
   - **Angular ecosystem:** Angular + Angular Universal.
   - **Multi-page / lightweight:** Astro, Eleventy, vanilla JS.
   - **Other:** Solid, Qwik (resumability model), HTMX (hypermedia-driven).

   For the recommendation, address: rendering model fit, ecosystem maturity, hiring pool, learning curve, performance characteristics, and long-term maintenance trajectory. Acknowledge the top risk of the chosen framework.

6. **Design the project structure and code organization.** Define the directory structure and organizational principles. Provide a concrete file tree. Choose and justify the organizational pattern:

   **Option A — Feature-based (recommended for most apps):**

   ```
   src/
   ├── features/
   │   ├── auth/
   │   │   ├── components/
   │   │   ├── hooks/
   │   │   ├── services/
   │   │   ├── stores/
   │   │   ├── types/
   │   │   └── utils/
   │   ├── dashboard/
   │   └── settings/
   ├── shared/
   │   ├── components/
   │   ├── hooks/
   │   ├── services/
   │   ├── types/
   │   └── utils/
   ├── layouts/
   ├── pages/ (or app/ for Next.js App Router)
   ├── styles/
   └── config/
   ```

   **Option B — Layer-based (simpler apps or small teams):**

   ```
   src/
   ├── components/
   ├── hooks/
   ├── services/
   ├── stores/
   ├── pages/
   ├── types/
   ├── utils/
   └── styles/
   ```

   Define clear rules for each directory: what belongs, what doesn't, naming conventions, and maximum file size guidelines. Specify the import alias strategy (e.g., `@/features/auth`).

7. **Design the routing architecture.** Define:
   - **Route hierarchy:** List all top-level and nested routes with their URL patterns.
   - **Route grouping and layouts:** Which routes share layouts? Define the layout nesting structure.
   - **Protected routes:** Which routes require authentication? Define the auth guard pattern (redirect-based, wrapper component, middleware).
   - **Dynamic routes and parameters:** Which routes have dynamic segments? Define parameter validation.
   - **Code splitting at route level:** All routes should be lazy-loaded by default. Specify which routes, if any, should be eagerly loaded and why.
   - **Navigation patterns:** Client-side navigation with prefetching strategy. Define prefetch triggers (hover, viewport intersection, explicit).
   - **Route-level data loading:** Define data fetching strategy per route (loader functions, server components, `getServerSideProps`, `useEffect`, etc.).
   - **Error and 404 handling:** Define route-level error boundaries and the not-found page strategy.

### Phase 3 — Component Architecture

8. **Define the component design system and hierarchy.** Establish the component classification model using a layered approach:

   **Layer 1 — Primitive/Base Components (Design System Atoms):**
   Lowest-level, maximally reusable UI elements. No business logic, no data fetching. Fully controlled via props. Examples: `Button`, `Input`, `Text`, `Icon`, `Badge`, `Avatar`, `Spinner`.
   - Must be fully accessible out of the box.
   - Must support theming via design tokens.
   - Must have comprehensive prop types and default values.
   - Must be documented with all variant states.

   **Layer 2 — Composite Components (Design System Molecules/Organisms):**
   Composed from primitives. Still generic, but represent a recognizable UI pattern. Minimal or no business logic. Examples: `SearchInput`, `Modal`, `DataTable`, `Dropdown`, `Tabs`, `Card`, `Pagination`, `Toast`.
   - Define composition API (children, slots, render props, compound components).
   - Define controlled vs. uncontrolled behavior.

   **Layer 3 — Feature Components:**
   Business-logic-aware components scoped to a specific feature. May fetch data, manage local state, orchestrate user workflows. Examples: `LoginForm`, `InvoiceTable`, `UserProfileCard`, `CheckoutSummary`.
   - Should compose Layer 1 and Layer 2 components.
   - Should not be reused across unrelated features.

   **Layer 4 — Page/View Components:**
   Top-level components that correspond to routes. Responsible for layout composition, data orchestration, and assembling feature components. Minimal UI logic of their own.

   For each layer, define: naming conventions, prop design rules, file co-location strategy, and export patterns.

9. **Establish component design principles and patterns.** Define the rules the agent will follow and recommend:

   - **Single Responsibility:** Each component does one thing. If a component file exceeds ~200 lines or its name requires "And" (e.g., `HeaderAndNavigation`), it should be split.
   - **Props interface design:**
     - Use TypeScript interfaces or types for all props. No `any`.
     - Prefer specific prop types over generic ones (`variant: 'primary' | 'secondary'` over `variant: string`).
     - Use discriminated unions for complex conditional props.
     - Default values for optional props must be documented.
     - Event handler props follow the `on[Event]` naming convention.
   - **Composition over configuration:** Prefer composable components (`<Card><Card.Header /><Card.Body /></Card>`) over mega-components with dozens of boolean props.
   - **Render logic separation:** Separate data/logic concerns from presentation. Patterns by framework:
     - React: Custom hooks for logic extraction; presentational components receive data via props.
     - Vue: Composables for logic extraction; `<script setup>` for clean composition.
     - Svelte: Reactive stores and derived stores for logic extraction.
   - **Controlled vs. Uncontrolled:** Form elements and interactive components should support both patterns. Default to uncontrolled with an option to control via props.
   - **Forwarding and extensibility:** Components should forward `ref`, `className`/`class`, and spread remaining HTML attributes to the root element.
   - **Conditional rendering:** Avoid deeply nested ternaries. Extract conditions into descriptive boolean variables or early-return patterns.
   - **No visual drift rule:** Do not introduce one-off visual patterns for core controls (buttons, inputs, cards, form feedback, badges). Extend variants in shared components instead.
   - **Semantic interaction rule:** Primary actions must use semantic controls (`button`, `a`, form elements). Never rely on `onClick` on non-interactive tags for core workflows.

10. **Design the component API for critical components.** For each complex or widely-used component identified in the critical user interactions (Step 3), produce a detailed component specification:
    - **Component name and purpose.**
    - **Props interface** (TypeScript type definition with descriptions for each prop).
    - **State** (internal state variables and their types).
    - **Events emitted** (callbacks with payload types).
    - **Slots/children API** (what content can be injected).
    - **Accessibility contract** (ARIA role, keyboard interactions, focus management — reference WAI-ARIA Authoring Practices).
    - **Visual variants** (sizes, colors, states: default, hover, active, disabled, loading, error).
    - **Usage example** (code snippet showing the most common usage).
    - **Edge cases** (empty state, overflow content, loading state, error state, truncation behavior).

10A. **Use canonical component blueprints for foundational UI.** For code generation tasks, always scaffold and reuse canonical blueprints for: - **Button:** `variant`, `size`, `loading`, `disabled`, `icon`, `iconPosition`; keyboard/focus-visible behavior and accessible loading text. - **Input + FormField wrapper:** label, description, error text, required state, `aria-describedby` wiring, invalid state behavior. - **Card:** header/body/footer slots, elevation and border variants from tokens. - **Modal/Dialog:** open state, title/description, focus trap, escape key handling, focus restore on close. - **List/Table shell:** loading/empty/error/data states; responsive behavior (table-to-cards strategy when required).

10B. **Standardize UI state messaging patterns.** All generated UI must use consistent message and interaction patterns: - Form errors: concise, field-specific, actionable. - Empty states: explain context + primary next action. - Loading states: skeletons/spinners that preserve layout stability. - Success/error feedback: consistent toast/inline banner patterns with predictable severity semantics.

### Phase 4 — State Management Architecture

11. **Analyze state categories and ownership.** Classify every piece of state in the application into the following categories. For each category, recommend the management approach:

    | State Category               | Description                                         | Examples                                                                 | Recommended Approach                                                                             |
    | ---------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
    | **Local UI state**           | State scoped to a single component                  | Modal open/closed, input focus, hover state, accordion expanded          | Component-local state (`useState`, `ref`, `$:`)                                                  |
    | **Shared UI state**          | UI state needed by multiple components in a subtree | Sidebar collapsed, active tab in a panel, filter visibility              | Lift state to nearest common ancestor, or lightweight context                                    |
    | **Server/remote state**      | Data fetched from backend APIs                      | User profile, product list, order history                                | Server state library (TanStack Query, SWR, Apollo Client, tRPC)                                  |
    | **Global application state** | Cross-cutting app-level state                       | Current authenticated user, theme preference, feature flags, permissions | Global store (Zustand, Pinia, Redux Toolkit, Svelte stores) or context                           |
    | **URL state**                | State encoded in the URL                            | Search query, filters, pagination, active tab, selected item             | URL search params and route params — URL is the source of truth                                  |
    | **Form state**               | Complex form data with validation                   | Multi-step forms, dynamic field arrays, dependent validations            | Form library (React Hook Form, Formik, VeeValidate, Superforms) or controlled component patterns |
    | **Derived/computed state**   | State calculated from other state                   | Filtered list, total price, display name                                 | Derived/computed values (`useMemo`, `computed`, `$derived`) — never store what you can compute   |
    | **Persistent client state**  | State that survives page reload                     | User preferences, draft content, cart items                              | `localStorage` / `sessionStorage` / IndexedDB with sync to state layer                           |

    **Critical rule:** Never duplicate server state into a global client store. Use a server state cache (TanStack Query pattern) as the single source of truth for remote data. Global stores should only hold truly client-side, application-level state.

12. **Design the server state (data fetching) architecture.** This is typically the most complex state category. Define:
    - **Data fetching library:** Recommend and justify (TanStack Query, SWR, Apollo Client, urql, tRPC, or framework-native like Remix loaders, Next.js Server Components, SvelteKit `load` functions).
    - **Cache key strategy:** Define a consistent, hierarchical key structure (e.g., `['users', userId, 'orders', { status, page }]`).
    - **Stale time and cache time:** Define defaults and per-resource overrides. Explain the stale-while-revalidate model.
    - **Optimistic updates:** For which mutations? Define the rollback strategy on failure.
    - **Pagination strategy:** Offset-based, cursor-based, or infinite scroll? Define the data model for paginated queries.
    - **Real-time data sync:** If applicable, define how WebSocket/SSE events update the cache (cache invalidation vs. direct cache mutation).
    - **Error handling for data fetching:** Define retry policy (count, backoff), error UI patterns (inline error, toast, full-page error), and stale data display policy (show stale data with error indicator vs. show error state).
    - **Request deduplication and batching:** How are duplicate in-flight requests handled?
    - **Prefetching strategy:** Which data should be prefetched on hover, route transition, or viewport intersection?

13. **Design the global state architecture (if needed).** If the application requires global client state beyond server state cache:
    - **Store selection:** Recommend and justify (Zustand, Redux Toolkit, Pinia, Jotai, Nanostores, Svelte stores, or built-in context).
    - **Store structure:** Define the shape of the global store. Organize by domain slice, not by data type.
    - **Action/mutation patterns:** Define how state is updated (actions, reducers, direct mutation with Immer, etc.).
    - **Selector patterns:** Define how components subscribe to state slices to prevent unnecessary re-renders.
    - **Persistence:** Which slices persist to `localStorage`? Define serialization and hydration strategy.
    - **DevTools integration:** Ensure time-travel debugging and state inspection are available in development.

    **Rule:** Keep the global store as small as possible. If state can be URL state, make it URL state. If it can be server state, use the server state cache. If it can be local, keep it local.

### Phase 5 — Styling and Design System Architecture

14. **Select and justify the styling strategy.** Evaluate against the project requirements:

    | Approach                                                         | Strengths                                                                            | Weaknesses                                                     | Best For                                            |
    | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------- |
    | **CSS Modules**                                                  | Scoped by default, standard CSS, good performance, no runtime cost                   | No dynamic styling from props, limited theming                 | Apps prioritizing performance and standard CSS      |
    | **Tailwind CSS**                                                 | Rapid prototyping, consistent constraints, small production CSS, no naming decisions | Verbose class strings, learning curve, design system coupling  | Teams wanting utility-first with strong conventions |
    | **CSS-in-JS (runtime: styled-components, Emotion)**              | Dynamic styling, co-located, TypeScript integration                                  | Runtime cost, SSR complexity, bundle size                      | Highly dynamic component libraries                  |
    | **CSS-in-JS (zero-runtime: Vanilla Extract, Panda CSS, StyleX)** | Type-safe, no runtime cost, dynamic via CSS variables                                | Build step complexity, newer ecosystem                         | Performance-sensitive apps wanting type-safe styles |
    | **Plain CSS / Sass with BEM**                                    | Universal, no tooling, full control                                                  | Manual scoping, naming conventions required, global scope risk | Simple projects, teams with strong CSS skills       |

    State the chosen approach and justify against: performance budget, team familiarity, design system needs, SSR compatibility, and dynamic styling requirements.

15. **Design the theming and design token architecture.** Define the design token system:
    - **Token hierarchy:**
      - **Global tokens:** Raw values (colors, font sizes, spacing scale, radii, shadows, z-indices, breakpoints, animation durations).
      - **Semantic tokens:** Intent-mapped tokens referencing global tokens (e.g., `color.text.primary`, `color.bg.surface`, `color.border.error`, `spacing.component.padding`).
      - **Component tokens:** Component-specific overrides (e.g., `button.primary.bg`, `input.border.radius`).
    - **Token format:** CSS custom properties (recommended for runtime theming), or build-time constants for zero-runtime approaches.
    - **Dark mode / theming strategy:** CSS custom properties swapped via `data-theme` attribute or `prefers-color-scheme` media query. Define the theme toggle mechanism and persistence.
    - **Responsive design tokens:** Define breakpoints and the mobile-first vs. desktop-first approach. Specify the breakpoint values and usage pattern (media queries, container queries, or utility classes).
    - **Typography scale:** Define the type scale (sizes, weights, line heights, letter spacing) as tokens. Ensure fluid typography if required (`clamp()`).
    - **Spacing scale:** Define a consistent spacing scale (e.g., 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80).
    - **Token enforcement rules (mandatory):**
      - No raw hex/rgb/hsl colors in component-level code when token variables exist.
      - No ad-hoc spacing/radius/shadow values in component-level code; consume tokenized scales only.
      - Every component variant must map to semantic/component tokens, not hard-coded visual values.
      - Define required token namespaces and naming convention once, then reuse consistently across all features.

16. **Define responsive design strategy.** Specify:
    - **Approach:** Mobile-first (recommended) or desktop-first. Justify.
    - **Breakpoint system:** Define breakpoint values and names (e.g., `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`).
    - **Layout strategy:** CSS Grid for page-level layout, Flexbox for component-level layout. Define the grid system (columns, gutters, margins per breakpoint).
    - **Container queries:** Identify components that should respond to their container size rather than viewport size.
    - **Responsive component patterns:** Define how components adapt (hide/show elements, stack/unstack, resize, simplify). Avoid separate mobile/desktop components — prefer responsive adaptation within a single component.
    - **Touch targets:** Minimum 44×44px for interactive elements on touch devices (WCAG 2.5.8).
    - **Responsive images:** `srcset` and `sizes` strategy, art direction with `<picture>`, lazy loading with `loading="lazy"`.
    - **Strict layout primitives (mandatory):**
      - Define standard container widths per breakpoint and use them consistently.
      - Define default page shells (marketing, dashboard, form-heavy workflow, content detail).
      - Define section spacing rhythm (vertical spacing scale) and enforce it across pages.
      - Define standard grid columns and gutter values per breakpoint.
      - Define reusable empty/loading/error layout blocks to avoid inconsistent state presentation.

### Phase 6 — API Integration and Data Layer

17. **Design the API integration layer.** Define the architecture for communicating with backend services:
    - **API client setup:** Create a centralized, configured HTTP client (Axios instance, custom `fetch` wrapper, or generated client from OpenAPI/GraphQL schema). Define:
      - Base URL configuration per environment.
      - Default headers (Content-Type, Accept, correlation/request ID).
      - Authentication token injection (interceptor/middleware that attaches the access token).
      - Request/response transformation (camelCase ↔ snake_case if needed).
    - **API layer organization:** One service module per backend domain or resource. Each module exports typed functions:
      ```typescript
      // services/users.ts
      export const usersApi = {
        getById: (id: string): Promise<User> => client.get(`/users/${id}`),
        update: (id: string, data: UpdateUserDto): Promise<User> =>
          client.put(`/users/${id}`, data),
        list: (params: ListUsersParams): Promise<PaginatedResponse<User>> =>
          client.get("/users", { params }),
      };
      ```
    - **Type safety:** All API request and response types must be defined in TypeScript. Prefer auto-generated types from OpenAPI specs (`openapi-typescript`, `orval`) or GraphQL codegen (`graphql-codegen`). Manual types are the fallback.
    - **Error handling:** Define a unified error handling strategy:
      - Categorize errors: network errors, 4xx client errors, 5xx server errors, timeout errors.
      - Transform API errors into a consistent application error shape.
      - Map specific error codes to user-facing messages.
      - Handle 401 (trigger token refresh or redirect to login) and 403 (show forbidden state) globally.

18. **Design form handling and validation.** For applications with significant form interactions:
    - **Form library:** Recommend and justify (React Hook Form, Formik, VeeValidate, Superforms, native form handling). Prefer libraries that minimize re-renders and support schema validation.
    - **Validation strategy:**
      - **Schema validation library:** Zod, Yup, Valibot, or ArkType. Define shared schemas between frontend and backend if possible.
      - **Validation timing:** Define when validation runs (onChange, onBlur, onSubmit). Recommend onBlur for individual fields and onSubmit for the full form.
      - **Server-side validation integration:** All client-side validation must be duplicated on the server. Define how server validation errors are mapped back to specific fields.
    - **Complex form patterns:** Define approaches for:
      - Multi-step/wizard forms (state preservation across steps, step validation, navigation).
      - Dynamic field arrays (add/remove items, reorder).
      - Dependent fields (field B options change based on field A value).
      - File uploads (progress tracking, preview, size/type validation, chunked upload for large files).
      - Autosave (debounce interval, conflict resolution, dirty state tracking).
    - **Form UX consistency rules:**
      - Keep label/help/error placement consistent for all fields.
      - Use one validation message style guide (tone, length, actionability) across the product.
      - Keep button labels and CTA hierarchy consistent across all forms (`primary`, `secondary`, `destructive`, `ghost`).

### Phase 7 — Performance Architecture

19. **Design the bundle optimization strategy.** Define the approach to minimize JavaScript delivered to the client:
    - **Code splitting:**
      - Route-level splitting (every route is a separate chunk — this should be the default).
      - Component-level splitting (heavy components like rich text editors, charts, maps loaded on demand).
      - Library-level splitting (large third-party libraries isolated into separate chunks).
    - **Tree shaking:** Ensure all imports are ESM-compatible. Audit dependencies for tree-shaking support. Prefer libraries that offer modular imports (e.g., `import { debounce } from 'lodash-es'` not `import _ from 'lodash'`).
    - **Bundle budget:** Define a maximum bundle size per route (e.g., "initial JS < 150KB gzipped for landing page, < 250KB gzipped for app shell"). Configure bundler warnings when budgets are exceeded.
    - **Dependency audit:** Evaluate each dependency for size impact. Use `bundlephobia` or `source-map-explorer` to identify heavy dependencies. Recommend lighter alternatives where available.
    - **Dynamic imports and lazy loading:** Define the lazy loading trigger strategy (viewport intersection via `IntersectionObserver`, user interaction, idle time via `requestIdleCallback`).
    - **Font optimization:** Define the font loading strategy (`font-display: swap`, preloading critical fonts, subsetting, variable fonts vs. multiple weights).

20. **Design the rendering performance strategy.** Define approaches to ensure smooth, responsive UI:
    - **Avoid unnecessary re-renders:**
      - React: `React.memo` for expensive pure components, `useMemo`/`useCallback` only when measured as necessary, proper key usage in lists, state colocation.
      - Vue: Computed properties for derived data, `v-once` for static content, `shallowRef` for large objects.
      - Svelte: Reactive declarations are inherently optimized; avoid unnecessary store subscriptions.
    - **Virtualization:** For long lists or large tables (>100 items), use windowed rendering (`@tanstack/virtual`, `react-window`, `vue-virtual-scroller`). Define the item height estimation strategy (fixed vs. variable).
    - **Debounce and throttle:** Define which user interactions are debounced (search input: 300ms) or throttled (scroll handlers: 16ms, resize: 100ms).
    - **Web Workers:** Identify CPU-intensive operations that should be offloaded (data transformation, complex filtering/sorting, encryption, parsing large files).
    - **Animation performance:** CSS transitions/animations preferred over JS animations. Use `transform` and `opacity` for GPU-accelerated animations. Use `will-change` sparingly. For complex animations, recommend Framer Motion, GSAP, or the Web Animations API.
    - **Image optimization:** Serve modern formats (WebP, AVIF) with fallbacks. Use responsive images (`srcset`). Lazy load below-the-fold images. Define placeholder strategy (blur hash, LQIP, skeleton, dominant color).

21. **Define Core Web Vitals optimization plan.** For each metric, specify the measurement and optimization strategy:
    - **LCP (Largest Contentful Paint) — Target < 2.5s:**
      - Identify the LCP element for each critical page (hero image, main heading, feature graphic).
      - Preload the LCP resource (`<link rel="preload">`).
      - Eliminate render-blocking resources (inline critical CSS, defer non-critical JS).
      - Optimize server response time (TTFB < 800ms).
      - Use `fetchpriority="high"` on the LCP image.
    - **INP (Interaction to Next Paint) — Target < 200ms:**
      - Identify high-frequency interactions (clicks, key presses, form inputs).
      - Break long tasks (>50ms) into smaller chunks using `scheduler.yield()`, `setTimeout`, or `requestIdleCallback`.
      - Minimize main thread blocking during interactions.
      - Use `startTransition` (React) or equivalent for non-urgent updates.
    - **CLS (Cumulative Layout Shift) — Target < 0.1:**
      - Set explicit `width` and `height` (or `aspect-ratio`) on all images and videos.
      - Reserve space for dynamically loaded content (ads, embeds, lazy-loaded components).
      - Use `font-display: optional` or preload fonts to prevent layout shifts from font loading.
      - Avoid inserting content above existing content after initial render.
    - **Measurement:** Define the monitoring strategy (Lighthouse CI in CI/CD pipeline, Real User Monitoring via `web-vitals` library, Chrome UX Report for field data).

### Phase 8 — Accessibility Architecture

22. **Design the accessibility (a11y) architecture.** Accessibility is not a feature — it is a quality attribute woven into every component and interaction. Define the comprehensive strategy:

    - **Semantic HTML first:** Enforce the rule that the correct HTML element is always the first choice before ARIA. `<button>` not `<div onClick>`. `<nav>` not `<div class="nav">`. `<input type="email">` not `<input type="text">`. Headings (`h1`–`h6`) must form a logical hierarchy per page.
    - **ARIA patterns for custom widgets:** For every custom interactive component (dropdown, modal, tabs, accordion, combobox, datepicker, toast, slider), specify the WAI-ARIA Authoring Practices pattern to follow. Define:
      - Required ARIA roles, states, and properties.
      - Keyboard interaction model (which keys do what).
      - Focus management (where does focus go when the widget opens? where when it closes?).
    - **Focus management strategy:**
      - Define the focus trapping pattern for modals and dialogs.
      - Define the focus restoration pattern (return focus to the trigger element when a modal closes).
      - Define skip navigation links for page-level navigation.
      - Ensure all interactive elements are reachable via Tab and operable via Enter/Space.
      - Define visible focus indicator style (must meet 3:1 contrast ratio, WCAG 2.4.11).
    - **Color and contrast:** All text must meet WCAG contrast ratios (4.5:1 for normal text, 3:1 for large text). UI components and graphical objects must meet 3:1 contrast against adjacent colors. Information must never be conveyed by color alone.
    - **Screen reader strategy:**
      - Define how dynamic content updates are announced (`aria-live` regions: `polite` for non-urgent updates, `assertive` for urgent updates like errors).
      - Define how loading states are communicated (`aria-busy`, status messages).
      - Define how form errors are associated with fields (`aria-describedby`, `aria-invalid`).
    - **Motion and animation:** Respect `prefers-reduced-motion`. Provide a mechanism to pause, stop, or hide any auto-playing content.
    - **Testing integration:**
      - Automated: `axe-core` integration in unit tests and CI pipeline. `eslint-plugin-jsx-a11y` or equivalent linting.
      - Manual: Define a keyboard testing checklist (tab through every interactive element, operate every widget with keyboard only). Screen reader testing cadence (NVDA on Windows, VoiceOver on macOS/iOS, TalkBack on Android).

### Phase 9 — Error Handling and Resilience

23. **Design the frontend error handling architecture.** Define a layered error handling strategy:

    - **Layer 1 — Component error boundaries:**
      - Place error boundaries at strategic component tree levels: page-level (catch everything within a page), feature-level (isolate feature failures), and widget-level (critical widgets fail independently).
      - Design fallback UIs for each level: page-level shows a full-page error with retry; feature-level shows an inline error with retry; widget-level shows a minimal placeholder.
      - Error boundaries must log the error to the monitoring service and provide a recovery action (retry, refresh, navigate away).
    - **Layer 2 — API error handling:**
      - Global interceptor catches network failures, timeouts, and authentication errors.
      - Per-request error handling for business logic errors (display inline validation, toast messages, or contextual error states).
      - Retry policy: automatic retry for network errors and 5xx responses (max 3 retries, exponential backoff). No retry for 4xx responses.
    - **Layer 3 — Unhandled errors:**
      - Global `window.onerror` and `unhandledrejection` handlers as the last safety net.
      - Log all unhandled errors to the error monitoring service (Sentry, Datadog, Bugsnag).
      - Display a non-technical, user-friendly global error toast or banner.
    - **Layer 4 — Graceful degradation:**
      - Define the degradation strategy for each third-party dependency failure (analytics fails silently, payment gateway shows manual fallback, chat widget hides).
      - For non-critical features, wrap in error boundaries that render nothing on failure rather than crashing the page.
    - **Error monitoring integration:**
      - Define the error reporting service and configuration.
      - Capture: error message, stack trace, component tree (for framework errors), user action breadcrumbs, browser/device info, application version, user ID (if authenticated).
      - Define source map upload strategy for production error symbolication.
      - Define alerting thresholds (e.g., alert if error rate exceeds 1% of sessions in 15 minutes).

### Phase 10 — Testing Strategy

24. **Design the frontend testing architecture.** Define a comprehensive, pragmatic testing strategy using the testing trophy model (or testing pyramid adapted for frontend):

    - **Static Analysis (base layer — runs on every save):**
      - TypeScript in strict mode (`"strict": true`) — the most cost-effective bug prevention.
      - ESLint with framework-specific plugin, accessibility plugin, and import-order plugin.
      - Prettier for formatting (remove style debates from code reviews).
      - Husky + lint-staged for pre-commit enforcement.

    - **Unit Tests (for complex logic, not trivial components):**
      - **What to unit test:** Custom hooks, utility functions, state management logic, data transformation functions, validation schemas, complex conditional logic.
      - **What NOT to unit test:** Simple presentational components, trivial getters/setters, framework internals.
      - **Tools:** Vitest (recommended for Vite-based projects) or Jest.
      - **Coverage target:** 80%+ for utility and logic modules. Do not mandate coverage for component files.

    - **Component/Integration Tests (highest value layer):**
      - **What to test:** Component behavior as the user experiences it. Render the component, simulate user interactions (click, type, select), and assert on visible outcomes (text appears, element is hidden, callback is called with correct args).
      - **Tools:** Testing Library (`@testing-library/react`, `@testing-library/vue`, `@testing-library/svelte`) + Vitest or Jest. Use `msw` (Mock Service Worker) for API mocking.
      - **Principles:** Test behavior, not implementation. Query by accessible role, label, or text — never by CSS class or test ID unless no accessible alternative exists. Each test should read like a user scenario.
      - **Coverage target:** Every critical user interaction from Step 3 must have at least one integration test covering the happy path and one covering the primary error path.

    - **End-to-End Tests (critical paths only):**
      - **What to test:** The 3–5 critical user journeys identified in Step 3, run against a staging environment with real (or realistic) backend services.
      - **Tools:** Playwright (recommended) or Cypress.
      - **Strategy:** Keep E2E tests minimal and focused on high-value flows. Each test should validate a complete user journey, not a single component. Use Page Object Model or equivalent abstraction for maintainability.
      - **Execution:** Run in CI on every PR merge to main. Parallelize across browsers (Chromium, Firefox, WebKit).

    - **Visual Regression Tests (for design system and critical UI):**
      - **What to test:** Design system components in all variant states, critical page layouts.
      - **Tools:** Playwright visual comparisons, Chromatic (for Storybook), or Percy.
      - **Strategy:** Snapshot each component variant. Review visual diffs on PRs.

    - **Accessibility Tests (automated layer):**
      - Integrate `axe-core` into component tests: every component test should include an accessibility assertion (`expect(await axe(container)).toHaveNoViolations()`).
      - Run Lighthouse accessibility audit in CI against critical pages.

### Phase 11 — Frontend Security

25. **Design the frontend security architecture.** Define protections against common client-side attack vectors:

    - **Cross-Site Scripting (XSS) prevention:**
      - Use framework-native output encoding (React's JSX auto-escaping, Vue's template auto-escaping). Never use `dangerouslySetInnerHTML` / `v-html` / `{@html}` unless the content is sanitized with DOMPurify or equivalent.
      - Define a Content Security Policy (CSP) header strategy: `script-src 'self'`, restrict `style-src`, disable `eval()`. Document any required exceptions (e.g., analytics scripts) and the justification.
      - Sanitize all user-generated content before rendering, even if received from the backend.
    - **Cross-Site Request Forgery (CSRF) protection:**
      - If using cookie-based authentication: ensure the backend sets `SameSite=Strict` or `SameSite=Lax` cookies and implements CSRF tokens. The frontend must include the CSRF token in state-changing requests.
      - If using token-based authentication (Bearer tokens in headers): CSRF is inherently mitigated. Ensure tokens are never stored in `localStorage` (prefer `httpOnly` cookies or in-memory storage with refresh token rotation).
    - **Authentication token security:**
      - Define the token storage strategy and justify: `httpOnly` cookies (most secure for web), in-memory variable with refresh via `httpOnly` cookie (good balance), `sessionStorage` (acceptable for low-risk apps), `localStorage` (discouraged — vulnerable to XSS).
      - Define the token refresh flow: silent refresh before expiration, retry on 401, redirect to login on refresh failure.
      - Define session timeout behavior: inactivity timeout, absolute session timeout, user notification before logout.
    - **Dependency security:**
      - Enable `npm audit` or `pnpm audit` in CI pipeline. Fail the build on high/critical severity vulnerabilities.
      - Use Dependabot, Renovate, or Socket for automated dependency update PRs.
      - Define the policy for evaluating new dependencies: check bundle size, maintenance status, known vulnerabilities, license compatibility.
    - **Sensitive data handling:**
      - Never log sensitive data (passwords, tokens, PII) to the browser console in production.
      - Mask sensitive fields in error reporting payloads.
      - Clear sensitive in-memory state on logout.
      - Disable autocomplete on sensitive form fields where appropriate.

### Phase 12 — Build, Tooling, and Developer Experience

26. **Design the build and development tooling architecture.** Define the complete frontend toolchain:

    - **Build tool:** Recommend and justify (Vite, Turbopack, Webpack, esbuild, Rspack). Vite is the default recommendation for most new projects due to fast dev server (native ESM) and optimized production builds (Rollup).
    - **TypeScript configuration:** Strict mode enabled. Define path aliases. Define `tsconfig.json` structure for monorepos if applicable.
    - **Linting and formatting:** ESLint flat config with framework-specific rules. Prettier with project-wide config. Define the rule severity philosophy: errors for bugs and accessibility issues, warnings for style preferences.
    - **Git hooks:** Husky + lint-staged for pre-commit (lint + format staged files). Commitlint for conventional commits if enforcing semantic versioning.
    - **Environment configuration:** Define how environment variables are managed (`.env` files per environment, validated at build time with Zod or `@t3-oss/env`). List required and optional variables.
    - **Development server:** Hot Module Replacement (HMR) must work reliably. Define proxy configuration for API requests during development.
    - **Storybook or component playground:** Recommend for design system and component development. Define the story structure (one story file per component, stories for each variant and state).
    - **Monorepo tooling (if applicable):** Nx, Turborepo, or pnpm workspaces. Define the package boundary strategy (shared UI library, shared types, shared utilities, app packages).

27. **Design the CI/CD pipeline for frontend.** Define the complete pipeline:

    - **On every PR:**
      1. Install dependencies (cached).
      2. Type check (`tsc --noEmit`).
      3. Lint (`eslint`).
      4. Unit and integration tests (`vitest run`).
      5. Build (`vite build` or equivalent) — verify the build succeeds.
      6. Bundle size check — compare against budget, fail or warn on regression.
      7. Accessibility audit on critical pages (Lighthouse CI).
      8. Visual regression tests (if configured).
      9. Preview deployment (Vercel preview, Netlify deploy preview, or equivalent) with a link in the PR.

    - **On merge to main:**
      1. All PR checks.
      2. E2E tests against the preview or staging deployment.
      3. Deploy to staging automatically.
      4. Smoke tests against staging.

    - **Production deployment:**
      1. Promote staging to production (blue/green or canary).
      2. Source map upload to error monitoring service.
      3. Cache invalidation on CDN.
      4. Post-deployment smoke tests.
      5. Rollback procedure: revert to previous deployment within 5 minutes.

    - **Performance monitoring:**
      - Real User Monitoring (RUM) via `web-vitals` library reporting to analytics.
      - Synthetic monitoring via scheduled Lighthouse runs against production.
      - Bundle size tracking over time (graph trend in CI dashboard).

### Phase 13 — Internationalization and Localization (if applicable)

28. **Design the i18n/l10n architecture (if required).** If the application must support multiple languages or locales:

    - **i18n library:** Recommend and justify (`next-intl`, `react-i18next`, `vue-i18n`, `svelte-i18n`, `FormatJS`).
    - **Message format:** ICU Message Format for complex pluralization, gender, and interpolation. Simple key-value JSON for basic translations.
    - **Translation file structure:** One JSON/YAML file per locale per feature (or per page) to enable code-split loading of translations.
    - **Key naming convention:** Hierarchical, dot-separated keys matching feature and component structure (e.g., `auth.login.emailLabel`, `auth.login.submitButton`, `auth.login.errors.invalidCredentials`).
    - **Locale detection and switching:** Define the priority order: URL path prefix (`/en/`, `/fr/`) → user preference (stored in profile or cookie) → browser `Accept-Language` header → default locale.
    - **RTL support:** If required, define the CSS logical properties strategy (`margin-inline-start` instead of `margin-left`), the `dir` attribute management, and component-level RTL adjustments.
    - **Number, date, and currency formatting:** Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` — never hardcode format patterns.
    - **Translation workflow:** Define how translators receive and return translations (JSON export/import, translation management platform like Crowdin or Lokalise, or inline editing).

### Phase 14 — Frontend Deliverable Assembly

29. **Compose the frontend architecture document.** Organize all outputs into a structured deliverable:
    1. **Executive Summary** — One-paragraph overview of the frontend application, its purpose, and the architectural approach.
    2. **Requirements Summary** — Product type, target users, device/browser support, performance targets, accessibility requirements (from Steps 1–3).
    3. **Technology Decisions** — Rendering strategy, framework, key library selections with justifications (from Steps 4–5).
    4. **Project Structure** — Directory layout, organizational principles, naming conventions (from Step 6).
    5. **Routing Architecture** — Route map, layout hierarchy, auth guards, code splitting, data loading (from Step 7).
    6. **Component Architecture** — Component hierarchy, design principles, critical component specifications (from Steps 8–10).
    7. **State Management Architecture** — State categorization, server state strategy, global state strategy, form handling (from Steps 11–13).
    8. **Styling and Design System** — Styling approach, design tokens, theming, responsive strategy (from Steps 14–16).
    9. **API Integration Layer** — HTTP client setup, API module organization, type safety, error handling, form/validation strategy (from Steps 17–18).
    10. **Performance Plan** — Bundle optimization, rendering performance, Core Web Vitals targets and strategies (from Steps 19–21).
    11. **Accessibility Plan** — Semantic HTML rules, ARIA patterns, focus management, testing plan (from Step 22).
    12. **Error Handling and Resilience** — Error boundary strategy, API error handling, monitoring integration (from Step 23).
    13. **Testing Strategy** — Test layers, tools, coverage targets, CI integration (from Step 24).
    14. **Security Plan** — XSS, CSRF, token management, dependency security, CSP (from Step 25).
    15. **Build and CI/CD** — Toolchain, pipeline stages, deployment strategy (from Steps 26–27).
    16. **Internationalization** — i18n architecture if applicable (from Step 28).
    17. **Open Questions and Next Steps** — Unresolved decisions, deferred optimizations, recommended spikes.

30. **Adapt the depth and format to the user's need.** Not every request requires all preceding steps at full depth. Apply these guidelines:
    - **Quick consultation** (user asks a focused question, e.g., "should I use Zustand or Redux?"): Jump to the relevant step (Step 13 for state management), provide a concise tradeoff analysis considering the user's context, and give a clear recommendation.
    - **Component design** (user asks about a specific component): Execute Steps 8–10 for that component, with attention to accessibility (Step 22) and testing (Step 24).
    - **Performance issue** (user reports a performance problem): Execute Steps 19–21 as a diagnostic and optimization workflow. Ask for Lighthouse scores, bundle analysis output, or specific symptoms.
    - **Full frontend architecture** (user asks for a complete frontend design): Execute all steps sequentially, producing the full deliverable from Step 29.
    - **Code review / architecture review** (user presents existing code or architecture): Map the existing implementation against the framework, identify gaps against each step, and provide a prioritized list of improvements with effort estimates.
    - **Direct UI code implementation** (user asks to build frontend code now): Use fast-path implementation mode with the Default UI Generation Profile unless the user has explicitly specified alternatives. Ask questions only for critical blockers.

    Always state which depth level you are operating at and why.
    For direct UI code tasks, also follow the mandatory LLM Output Contract defined at the top of this section.

31. **Maintain an iterative, collaborative approach.** Frontend architecture evolves as the product evolves. After delivering the initial architecture:
    - Invite the user to challenge any decision with their specific constraints.
    - Be prepared to re-enter any phase when new information emerges (e.g., a new performance requirement may change the rendering strategy in Step 4, which cascades to framework choice in Step 5, routing in Step 7, and build optimization in Step 19).
    - When revising, trace the impact through all dependent steps and flag any inconsistencies.
    - Provide code examples, configuration snippets, and concrete file structures — not just abstract guidance. The output should be directly actionable by a developer.
