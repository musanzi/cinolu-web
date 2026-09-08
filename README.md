# Onestop Web

An opinionated Angular onestop for public websites, authentication flows, and role-based application areas. It includes standalone components, lazy-loaded routes, Angular Material, Tailwind CSS, NgRx Signal Store, and hybrid server/client rendering.

## Tech stack

- Angular 22.1 with standalone components and signals
- Angular SSR 22.1 with Express 5
- Angular Material and Angular CDK
- NgRx Signal Store 21
- Tailwind CSS 4 through PostCSS
- TypeScript 6 in strict mode
- pnpm 11 and Node.js 24
- ESLint 10, Prettier 3, Husky, and Commitlint

## Prerequisites

- Node.js 24
- pnpm 11 (Corepack can provide it)
- A compatible API running at `http://localhost:8000` for local development

Enable Corepack if pnpm is not already available:

```bash
corepack enable
```

## Getting started

Install the locked dependencies:

```bash
pnpm install --frozen-lockfile
```

Start the development server:

```bash
pnpm start
```

Open [http://localhost:4200](http://localhost:4200). The dev server reloads when source files change, and API requests are sent to `http://localhost:8000` with credentials enabled.

## Environment configuration

The API base URL is configured at build time:

| Configuration | File                                          | API URL                   |
| ------------- | --------------------------------------------- | ------------------------- |
| Development   | `src/environments/environment.development.ts` | `http://localhost:8000`   |
| Production    | `src/environments/environment.ts`             | `https://api.onestop.com` |

Angular replaces the production environment file during development builds. There is currently no runtime `.env` override, so customize the relevant environment file for your backend.

The functional HTTP interceptor prefixes relative `HttpClient` request URLs with `apiUrl` and sets `withCredentials: true`. The backend must therefore allow credentialed requests from the frontend origin.

## Application structure

```text
src/app/
├── core/                 # App-wide guards, HTTP, icons, storage, and theming
├── domains/
│   ├── website/          # Public website and landing page
│   ├── auth/             # Authentication flows and session state
│   ├── user/             # Authenticated user area
│   └── admin/            # Admin dashboard, users, roles, and profile
└── shared/               # Reusable UI, interfaces, and static data
```

Each domain can contain layouts, route definitions, and feature modules. Feature modules follow these boundaries:

- `data-access`: NgRx Signal Stores for stateful server interactions, especially mutations. Use Angular `httpResource` for GET requests that do not require local state management.
- `features`: routed screens and feature-level displays.
- `interfaces`: types and interfaces. Interface names start with `I`, are not declared inside components or services, and are exposed through barrel exports.
- `ui`: reusable visual elements that do not interact with a store directly.

Use the `@/` TypeScript alias for imports rooted at `src/`.

## Available commands

| Command             | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `pnpm start`        | Run the development server on port 4200                              |
| `pnpm build`        | Create production browser and server bundles in `dist/onestop-web`   |
| `pnpm watch`        | Rebuild continuously with the development configuration              |
| `pnpm start:prod`   | Run a previously built SSR bundle on `PORT`, or port 4000 by default |
| `pnpm lint`         | Lint TypeScript and Angular templates                                |
| `pnpm test`         | Run the Angular unit-test target                                     |
| `pnpm ng -- <args>` | Pass arguments to the local Angular CLI                              |

## Docker

Run the development container with source bind mounts and hot reload:

```bash
docker compose -f compose.dev.yml -p onestop-web up --build
```

Run a production build and the Express server:

```bash
docker compose -f compose.prod.yml -p onestop-web up --build
```

Both configurations expose the application at [http://localhost:4200](http://localhost:4200). The production container sets the Express server's `PORT` to `4200`.

During server rendering, `localhost` refers to the web container rather than the host machine. If the server-rendered public area needs an API running on the host, use a container-reachable API URL and configure the appropriate network or host mapping.

## Code quality

- TypeScript, dependency injection, and Angular templates use strict checking.
- ESLint checks TypeScript, Angular templates, accessibility, unused imports, and JSDoc rules.
- Prettier formats Angular templates and sorts Tailwind classes.
- The pre-commit hook runs `pnpm lint`.
- The commit-message hook enforces Conventional Commits with Commitlint.
- Production builds enforce a 1 MB initial bundle warning and a 4 kB component-style warning.
