# Iraq Catalog Backend

This folder is self-contained so it can be copied to another workspace or repository without depending on root project files.

## Run

```bash
npm install
npm run build
npm run test
```

## Main scripts

- `npm run dev:api`
- `npm run dev:sqlite-api`
- `npm run dev:worker`
- `npm run refresh:all`
- `npm run refresh:retry-report`

## Default local stack

The backend now defaults to a private SQLite catalog database at
`.catalog-data/catalog.sqlite`. Public site reads continue to use the existing
`/public/*` API, while internal routes stay bearer-token + request-signature
protected.

City payloads and supporting Google review area lookups are also imported into
the same SQLite database, so the public API no longer depends on JSON files at
runtime.

Swagger UI is available at `/docs` and the generated OpenAPI document at
`/docs/json`.

In production, Swagger is disabled by default unless `CATALOG_DOCS_ENABLED=true`
is set explicitly.

For local API-only work without Postgres/Typesense, run:

```bash
npm run dev:sqlite-api
```

## Security

The backend now includes:

- public route throttling and search-specific rate limits
- security headers via Fastify helmet
- request URL/body size guards
- not-found throttling to reduce route enumeration
- outbound fetch protection against SSRF, private-network targets, and oversized remote responses
- runtime import of city/review support data into SQLite so public reads do not depend on loose JSON files

## Infra

The local Docker Compose stack lives under `infra/docker-compose.catalog.yml`.

## Data

Seed data required by the backend lives under `data/cities`.
