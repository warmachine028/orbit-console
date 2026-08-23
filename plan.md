# Orbit Console Recreation Plan

## 1. Project goal

Recreate a modern, minimalist CRUD admin workspace named **Orbit Console** with:

- A React + TypeScript frontend.
- React Router protected navigation.
- A Gradle-based Spring Boot backend.
- Spring Data JPA and PostgreSQL persistence.
- Neon Postgres as the database provider.
- Demo client authentication using `admin` / `password`.
- Responsive desktop and mobile layouts.
- Light, dark, and system themes.
- Glass effects and animated hot-pink/bright-blue accents.

The v0 preview can run the frontend independently. The backend remains a separate service under `springboot/` and should be connected through a typed HTTP API client.

## 2. Technology baseline

### Frontend

- React latest stable release compatible with the project.
- Latest TypeScript compatible with the selected React release.
- `react-router-dom` latest compatible release.
- Tailwind CSS latest compatible release.
- shadcn/ui latest compatible components and configuration.
- `sonner` for toast notifications.
- The icon library selected by shadcn configuration; use `lucide-react` when configured.
- Existing Next.js preview wrapper may remain only to host the React application in v0. Do not add Next server actions or Drizzle data access.

### Backend

- Latest stable Spring Boot release confirmed at implementation time.
- Latest stable Java LTS/toolchain required by that Spring Boot release.
- Gradle build.
- Spring Boot starter dependencies.
- Spring Web.
- Spring Data JPA.
- PostgreSQL JDBC driver.
- Lombok for safe boilerplate reduction.
- Jakarta Bean Validation.
- Spring Boot test dependencies.

### Database

- Neon Postgres integration.
- Schema provisioned and verified through the Neon MCP before writing dependent data-access code.
- Environment-based configuration; never commit credentials.

## 3. Frontend structure

Use conventional TypeScript and React naming:

```text
app/
  page.tsx                 # Preview entry point / React bootstrap
  globals.css              # Theme tokens and global visual system
  layout.tsx               # Metadata, fonts, root background
components/
  app-shell.tsx            # Authenticated workspace shell
  login-form.tsx           # Demo login form
  sidebar.tsx              # Desktop and mobile navigation
  topbar.tsx               # Sticky top navigation
  records-table.tsx        # Desktop table and mobile cards
  record-form.tsx          # Create/edit form
  theme-selector.tsx       # Light/dark/system selector
  ui/                      # shadcn/ui source components
lib/
  api-client.ts            # Typed Spring Boot API requests
  types.ts                 # Shared frontend models
springboot/
  settings.gradle
  build.gradle
  app/
    build.gradle
    src/main/java/com/orbit/api/
      OrbitApplication.java
      config/
      controller/
      dto/
      entity/
      exception/
      repository/
      service/
    src/main/resources/application.yaml
```

Naming rules:

- PascalCase for React components, Java classes, and TypeScript types.
- camelCase for TypeScript variables, props, functions, and Java members.
- Lowercase Java package names.
- CONSTANT_CASE only for true constants.
- Kebab-case filenames where idiomatic for frontend components.
- Keep API models typed and avoid `any`.

## 4. Authentication and routing

Implement client-only demo authentication because the requested credentials are explicitly dummy credentials.

### Login

- Route: `/login`.
- Inputs: `username` and `password`.
- Accept only `admin` / `password`.
- Display success/error toast with Sonner.
- Persist the demo session in `sessionStorage` so a browser refresh does not unexpectedly lose the session.
- Logout clears the session and routes to `/login`.

### Strict route behavior

- Unauthenticated users attempting `/`, `/records`, `/settings`, or any protected path are redirected to `/login`.
- Authenticated users attempting `/login` are redirected to `/`.
- Authenticated users attempting an unknown path see a custom 404 page with a dashboard link.
- Unauthenticated users attempting an unknown path see the 404 page with a login link, or are redirected according to the desired strict-guard policy.
- Do not rely on server-side Next routing for application routes; the React Router fallback must support direct refreshes of client routes.

## 5. Application shell and responsive behavior

### Desktop

- Sticky top navbar pinned during scrolling.
- Left sidebar with logo/brand, uppercase `WORKSPACE` label, navigation links, theme/settings access, and a bottom “Secure by design” card.
- Small circular collapse/expand control at the top of the sidebar.
- Collapsed sidebar hides all text labels, badges, and the complete security card; icons remain centered.
- Current navigation item is derived from `location.pathname`, not hardcoded to Overview.

### Mobile

- Navbar includes a menu trigger.
- Sidebar opens as a shadcn Sheet/drawer.
- Mobile title uses the same visual treatment as desktop: uppercase `WORKSPACE`, blue accent, matching font size, tracking, and padding.
- Mobile drawer includes the same navigation items and the complete “Secure by design” section as desktop.
- The security card must remain visible on mobile and be hidden only when the desktop sidebar is collapsed.

### Footer

- Minimal footer pinned to the bottom of the page using a flex column shell and `flex-1` content region.
- Footer top divider must be visible in light and dark modes.
- Use semantic border tokens instead of `border-white/*` so borders are theme-aware.

## 6. Visual system

Use a restrained minimalist style with no more than five core colors:

- Primary: bright blue `#00AEEF`.
- Accent: hot pink `#E23CA9`.
- Dark neutral.
- Light neutral.
- Muted foreground/border neutral.

### Theme tokens

Define all semantic tokens in `globals.css`:

- `background`, `foreground`.
- `card`, `card-foreground`.
- `muted`, `muted-foreground`.
- `primary`, `primary-foreground`.
- `border`, `input`, `ring`.

Light-mode and dark-mode borders must both have enough contrast. Avoid hardcoded white borders for structural dividers.

### Shape and typography

- All UI elements use a consistent `7px` radius.
- Set shadcn radius tokens (`--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, and `--radius-xl`) to `7px`.
- Use a simple sans-serif family with no more than two font families total.
- Apply readable line height and accessible contrast.

### Background

- Use animated blurred radial accents based on hot pink and bright blue.
- Increase accent intensity enough to remain visible in both light and dark modes without reducing readability.
- Keep glass effects restrained: translucent surfaces, border tokens, backdrop blur, and shadows.
- Do not use unrelated decorative blobs or additional accent colors.

## 7. CRUD feature

Use a `RecordItem` domain model:

```ts
{
  id: number;
  name: string;
  category: string;
  status: "Active" | "Draft" | "Paused";
  updated: string;
}
```

### UI behavior

- Overview page shows summary metrics and recent records.
- Records page shows searchable records.
- Desktop uses a shadcn Table.
- Mobile uses responsive cards.
- Create and edit use a shadcn Dialog or dedicated responsive form.
- Delete uses AlertDialog confirmation.
- Empty state uses a shadcn Empty component where available.
- Loading state uses Skeleton.
- Buttons and actions use semantic icons.
- Every create, update, delete, fetch failure, login, and logout action gives Sonner feedback.

### API behavior

Create a typed client with methods such as:

```ts
getRecords(): Promise<RecordItem[]>;
createRecord(input: RecordInput): Promise<RecordItem>;
updateRecord(id: number, input: RecordInput): Promise<RecordItem>;
deleteRecord(id: number): Promise<void>;
```

- Configure the backend base URL through a public frontend environment variable.
- Use `fetch` with explicit methods, JSON headers, and error parsing.
- Keep loading/error state in the React feature component.
- Do not use localStorage for database persistence.
- A preview-only fallback may be used when the backend is unreachable, but it must be clearly separated from production API behavior and must not replace Neon persistence.

## 8. Spring Boot backend

Create a standalone Gradle project under `springboot/`.

### Dependencies

Include:

- Spring Boot starter parent/plugin.
- Spring Boot starter web.
- Spring Boot starter data JPA.
- PostgreSQL driver.
- Lombok.
- Spring Boot starter validation.
- Spring Boot starter test.

### Package responsibilities

- `entity`: JPA entity mapped to the records table.
- `dto`: request/response DTOs with validation annotations.
- `repository`: `JpaRepository<RecordEntity, Long>`.
- `service`: business operations and entity/DTO mapping.
- `controller`: REST endpoints under `/api/records`.
- `config`: CORS configuration for the React origin.
- `exception`: structured not-found and validation error handling.

Use Lombok for constructors, getters/setters, builders, and logging only where it keeps the API clear. Avoid hiding important business behavior behind excessive generated code.

### REST contract

```text
GET    /api/records
POST   /api/records
PUT    /api/records/{id}
DELETE /api/records/{id}
```

Validate required fields and return appropriate HTTP status codes:

- `200 OK` for successful reads/updates.
- `201 Created` for successful creates.
- `204 No Content` for successful deletes.
- `400 Bad Request` for validation failures.
- `404 Not Found` for missing records.

## 9. Neon Postgres setup

1. Confirm the Neon integration and available environment variables.
2. Use the Neon MCP to inspect the live database.
3. Create or verify the records table before implementing repository-dependent code.
4. Keep schema changes as one SQL statement per MCP call.
5. Configure `application.yaml` using environment variables, for example:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
server:
  port: ${PORT:8080}
```

6. Do not expose or commit database credentials.
7. Verify the backend can connect and perform CRUD operations against Neon.

## 10. Validation checklist

### Frontend

- Install dependencies before importing them.
- Run the production build.
- Confirm `/login`, `/`, `/records`, `/settings`, and unknown routes.
- Verify refresh behavior on authenticated routes.
- Verify login/logout toasts.
- Verify active sidebar item changes with navigation.
- Verify sidebar collapse hides text and the security card.
- Verify mobile Sheet includes the security card.
- Verify sticky navbar and bottom-pinned footer.
- Verify Light, Dark, and System colors and divider contrast.
- Verify all corner radii are `7px`.
- Use browser verification with desktop and mobile screenshots.

### Backend

- Run Gradle compilation and tests.
- Confirm Spring Boot starts with `application.yaml`.
- Verify CORS from the frontend origin.
- Verify Neon connection.
- Exercise all CRUD endpoints.
- Confirm validation and not-found responses.

## 11. Known implementation boundary

The existing v0 conversation produced a preview-oriented React UI and a Spring Boot scaffold. To fully recreate the intended production project, the remaining critical step is replacing any preview-only in-memory CRUD behavior with the typed Spring Boot API client and verifying that the backend is connected to the provisioned Neon schema. Demo authentication should remain explicitly non-production unless a real authentication system is later requested.

## 12. Completion criteria

The project is complete when the frontend is a polished, responsive, theme-aware React application; all protected routes behave correctly on navigation and refresh; CRUD actions call the Spring Boot API and persist to Neon Postgres; the Gradle backend compiles and passes tests; and desktop/mobile browser verification confirms the final layout and interactions.
