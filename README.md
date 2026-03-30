<div align="center">

```
 █████╗ ██████╗ ██████╗ ██╗     ██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║     ██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
███████║██████╔╝██████╔╝██║     ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
██╔══██║██╔═══╝ ██╔═══╝ ██║     ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
██║  ██║██║     ██║     ███████╗██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                                    
                              T R A C K E R
```

### A full-stack job application tracker — containerized, automated, and deployed end-to-end.

[![CI](https://github.com/Conceal34/application-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Conceal34/application-tracker/actions/workflows/ci.yml)
[![Docker Hub](https://img.shields.io/docker/pulls/conceal34/application-tracker?style=flat-square&logo=docker&color=2496ED)](https://hub.docker.com/r/conceal34/application-tracker)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Pipeline](#pipeline)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
  - [Multi-Stage Dockerfile](#multi-stage-dockerfile)
  - [Docker Compose](#docker-compose)
- [CI/CD Pipeline](#cicd-pipeline)
- [Known Issues & War Stories](#known-issues--war-stories)
- [Warnings](#warnings)
- [Future Scope](#future-scope)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Overview

**Application Tracker** is a full-stack web application for tracking job applications — built as a hands-on DevOps portfolio project. The goal was not just to ship a working app, but to build the entire infrastructure around it: containerization, CI/CD automation, and cloud deployment.

The project covers the complete journey:

```
Local Dev  →  Dockerized App  →  GitHub Actions CI  →  Docker Hub  →  AWS EC2 (Production)
```

Every `git push` to `main` triggers an automated pipeline that builds the Docker image, pushes it to Docker Hub, SSHes into the EC2 instance, pulls the latest image, and redeploys — zero manual steps.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                        │
│                                                                 │
│   git push main  ──►  GitHub Actions CI  ──►  Docker Hub       │
│                              │                                  │
│                              │ SSH                              │
│                              ▼                                  │
│                    ┌─────────────────┐                          │
│                    │   AWS EC2       │                          │
│                    │                 │                          │
│                    │  ┌───────────┐  │                          │
│                    │  │  migrate  │  │  (runs first)            │
│                    │  └─────┬─────┘  │                          │
│                    │        │        │                          │
│                    │  ┌─────▼─────┐  │                          │
│                    │  │    app    │  │  Next.js on :3000        │
│                    │  └─────┬─────┘  │                          │
│                    │        │        │                          │
│                    │  ┌─────▼─────┐  │                          │
│                    │  │ postgres  │  │  Persistent volume       │
│                    │  └───────────┘  │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, Tailwind CSS, TypeScript |
| **Backend** | Next.js API Routes, Prisma 7 |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 7 with `@prisma/adapter-pg` |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Registry** | Docker Hub (`conceal34/application-tracker`) |
| **Cloud** | AWS EC2 |

---

## Pipeline

```
┌──────────┐    ┌─────────────────────────────────────────┐    ┌──────────────┐
│          │    │           GitHub Actions CI              │    │              │
│  Local   │    │                                         │    │  Docker Hub  │
│  Dev     │───►│  checkout → install → lint → build      │───►│   :latest    │
│          │    │            → docker build → push         │    │              │
└──────────┘    └──────────────────┬──────────────────────┘    └──────┬───────┘
                                   │                                   │
                                   │ SSH into EC2                      │
                                   ▼                                   │
                        ┌──────────────────────┐                       │
                        │      AWS EC2         │◄──────────────────────┘
                        │                      │   docker pull
                        │  docker compose up   │
                        │  (migrate → app)     │
                        └──────────────────────┘
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (for local dev without Docker)

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/Conceal34/application-tracker.git
cd application-tracker
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your local DATABASE_URL and other vars
```

**4. Run with Docker Compose (recommended)**

```bash
docker compose up --build
```

This spins up PostgreSQL, runs Prisma migrations, and starts the Next.js app at `http://localhost:3000`.

**5. Or run locally (without Docker)**

```bash
# Make sure PostgreSQL is running, then:
npx prisma migrate dev
npm run dev
```

---

### Production Deployment

Production runs on AWS EC2 via the automated CD pipeline. To set up a fresh EC2 instance:

**1. Install Docker on EC2**

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

> ⚠️ **Important**: The `newgrp docker` or a fresh SSH session is required for the group change to take effect. Without it, Docker commands will fail with a socket permission error.

**2. Copy `docker-compose.prod.yaml` and `.env` to the server**

```bash
scp docker-compose.prod.yaml ec2-user@<EC2_HOST>:~/
scp .env ec2-user@<EC2_HOST>:~/
```

**3. Add GitHub Secrets**

In your repository settings, add the following secrets:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Public IP or hostname of your EC2 instance |
| `EC2_USER` | SSH username (e.g. `ubuntu`, `ec2-user`) |
| `EC2_SSH_KEY` | Private SSH key (PEM format) |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password or access token |

**4. Push to `main`**

Every push to `main` automatically triggers the full pipeline.

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/apptracker"

# PostgreSQL container (used by Docker Compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=apptracker

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env` to version control.** The `.env` file must exist on the EC2 instance manually — it is not deployed by the pipeline.

---

## Docker

### Multi-Stage Dockerfile

The Dockerfile uses a 5-stage build to keep the final image lean:

```
base        →  Common Node.js Alpine base
  └── deps      →  All node_modules installed (including Prisma binaries)
        └── builder   →  Next.js production build
        └── migrator  →  Prisma migration runner
        └── runner    →  Minimal production image (copies from builder + deps)
```

**Critical**: The `runner` stage copies Prisma binaries explicitly from `deps`:

```dockerfile
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
```

Without this, the `migrate` container will fail silently at runtime.

---

### Docker Compose

Two Compose files are maintained:

| File | Purpose |
|------|---------|
| `docker-compose.yaml` | Local development — builds from Dockerfile |
| `docker-compose.prod.yaml` | Production — pulls from Docker Hub, no build context |

The `migrate` service is configured with:

```yaml
depends_on:
  postgres:
    condition: service_healthy

app:
  depends_on:
    migrate:
      condition: service_completed_successfully
```

This enforces the startup order: `postgres` → `migrate` → `app`. Without this, the app may boot before the schema exists.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main`:

```yaml
jobs:
  build-and-deploy:
    steps:
      - Checkout code
      - Set up Node.js
      - Install dependencies
      - Run lint / type check
      - Build Next.js app
      - Build Docker image
      - Push to Docker Hub
      - SSH into EC2
      - Pull latest image
      - Run docker compose up -d (prod)
```

The CD step uses absolute paths in the SSH exec command to avoid path resolution issues in the GitHub Actions remote execution context.

---

## Known Issues & War Stories

These are the real problems hit during the build — documented so you don't have to suffer through them again.

---

### 🔴 Issue 1 — Prisma 7 Breaking Changes

**What happened**: Prisma 7 introduced `prisma.config.ts` as the new configuration file and requires `@prisma/adapter-pg` for PostgreSQL connections. The classic `datasource db` block in `schema.prisma` alone is no longer sufficient.

**Symptom**: Database connection failures at runtime with cryptic adapter errors.

**Fix**:
```ts
// prisma.config.ts
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  adapter: () => new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})
```

**Lesson**: Always check the migration guide when upgrading major Prisma versions. The v7 changelog is a required read.

---

### 🔴 Issue 2 — Missing Prisma Binaries in Runner Stage (Silent Failure)

**What happened**: The `migrate` container exited immediately with no helpful error. After hours of `docker logs` digging, the root cause was that Prisma's native binaries were installed in the `deps` stage but never copied into the `runner` stage.

**Symptom**: `migrate` service exits with code 1 silently. App crashes on startup because no schema exists.

**Fix**: Explicitly copy Prisma binaries from `deps` in the runner stage:

```dockerfile
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
```

**Lesson**: Multi-stage Docker builds are not magic — you get exactly what you copy. Always verify that runtime-required binaries are present in the final stage.

---

### 🔴 Issue 3 — Docker Socket Permissions on EC2

**What happened**: The CD pipeline SSHed into EC2 and immediately failed with `permission denied` on `/var/run/docker.sock`. The EC2 user wasn't in the `docker` group.

**Symptom**: `Got permission denied while trying to connect to the Docker daemon socket`

**Fix**:
```bash
sudo usermod -aG docker $USER
newgrp docker   # or log out and SSH back in
```

**Lesson**: Group membership changes don't apply to active sessions. A fresh SSH session is required.

---

### 🔴 Issue 4 — Relative Paths Breaking in GitHub Actions SSH Context

**What happened**: The CD script used relative paths to reference `docker-compose.prod.yaml`. These paths worked fine in a manual shell session on EC2 but broke when executed via GitHub Actions SSH because the working directory is not `~` in that context.

**Symptom**: `no such file or directory: docker-compose.prod.yaml` in pipeline logs.

**Fix**: Use absolute paths in all CD script commands:

```bash
# Wrong
docker compose -f docker-compose.prod.yaml up -d

# Right
docker compose -f /home/ubuntu/docker-compose.prod.yaml up -d
```

**Lesson**: Never assume working directory in CI/CD SSH contexts. Always use absolute paths.

---

### 🔴 Issue 5 — Next.js Static Rendering vs Prisma Runtime Calls

**What happened**: Next.js attempted to statically render pages at build time. Pages that called Prisma (a runtime database client) failed because no database exists at build time inside the Docker builder stage.

**Symptom**: Build fails with `PrismaClientInitializationError` or similar during `next build`.

**Fix**: Add to any page or layout making Prisma calls:

```ts
export const dynamic = 'force-dynamic'
```

**Lesson**: Next.js defaults to static rendering wherever possible. Any page with server-side database access must opt out explicitly.

---

### 🔴 Issue 6 — Docker Compose Service Startup Race Condition

**What happened**: Without explicit dependency conditions, the `app` container would occasionally start before the `migrate` container finished applying the schema, crashing on missing tables.

**Symptom**: Intermittent `relation does not exist` errors on app startup.

**Fix**: Use `condition: service_completed_successfully` in `depends_on`:

```yaml
app:
  depends_on:
    migrate:
      condition: service_completed_successfully
```

**Lesson**: `depends_on` without a condition only waits for the container to *start*, not to *finish successfully*.

---

### 🔴 Issue 7 — Environment Variables Not Reaching Containers

**What happened**: The `.env` file existed locally but wasn't being picked up by containers in production because the `docker-compose.prod.yaml` wasn't explicitly referencing it via `env_file`.

**Symptom**: `DATABASE_URL` undefined inside the running container; connection refused.

**Fix**: Add `env_file` to each service in `docker-compose.prod.yaml`:

```yaml
services:
  app:
    env_file:
      - .env
```

And ensure `.env` is present on the EC2 instance at the same path as `docker-compose.prod.yaml`.

**Lesson**: Docker Compose does not automatically load `.env` into containers in all contexts. Be explicit.

---

### 🔴 Issue 8 — `docker-compose.prod.yaml` Build Context Confusion

**What happened**: The local `docker-compose.yaml` used `build: .` to build from source. The prod file must use `image: conceal34/application-tracker:latest` to pull from Docker Hub — no build context, no source code on the server.

**Symptom**: Production server trying to build from missing source files; or rebuilding unnecessarily.

**Fix**: Maintain two separate Compose files. The prod file must never contain a `build:` key — only `image:`.

---

## Warnings

> ⚠️ **Do not commit `.env` files.** Environment variables contain secrets and must never be version-controlled. Use GitHub Secrets for CI/CD and manually provision `.env` on the server.

> ⚠️ **Prisma binaries are platform-specific.** If you build the Docker image on an ARM Mac (M1/M2/M3), the Prisma binary target must match the EC2 platform (`linux-musl-openssl-3.0.x` for Alpine). Set `binaryTargets` in your Prisma config if cross-platform builds are needed.

> ⚠️ **`newgrp docker` is session-scoped.** Adding a user to the `docker` group with `usermod` won't take effect until a new login session is started. A common trap in automated setup scripts.

> ⚠️ **`docker compose up -d` does not pull by default.** On the EC2 instance, always run `docker compose pull` before `docker compose up -d` in the CD script to ensure the latest image is used.

> ⚠️ **`service_completed_successfully` requires Compose v2.** Make sure `docker compose` (v2, plugin) is used — not the legacy `docker-compose` (v1) binary.

> ⚠️ **EC2 free tier storage is limited.** Old Docker images accumulate on the instance over time. Run `docker image prune -f` periodically or add it to the CD script to avoid running out of disk space.

---

## Future Scope

### v2 Features

- [ ] **Authentication** — Add NextAuth.js with GitHub/Google OAuth so the tracker is multi-user ready
- [ ] **Email reminders** — Automated follow-up nudges via Resend or Nodemailer for applications with no response after N days
- [ ] **Analytics dashboard** — Application funnel visualization: applied → screening → interview → offer/rejection
- [ ] **Status timeline** — Per-application history log with timestamps for each status change
- [ ] **Resume versioning** — Track which resume version was sent to which company

### Infrastructure

- [ ] **DigitalOcean Droplet** — Migrate from AWS EC2 to a DigitalOcean Droplet (cheaper, simpler networking) once GitHub Student Pack activates
- [ ] **Custom domain** — Point a Namecheap domain to the deployed instance with HTTPS via Nginx + Certbot
- [ ] **Nginx reverse proxy** — Sit in front of Next.js for SSL termination and proper production-grade HTTP handling
- [ ] **Health checks** — Add `/api/health` endpoint and wire it into Docker Compose `healthcheck` for smarter container orchestration
- [ ] **Automated backups** — Daily PostgreSQL dumps to S3 or DigitalOcean Spaces
- [ ] **Monitoring** — Basic uptime monitoring via UptimeRobot or self-hosted Uptime Kuma

### DX Improvements

- [ ] **`docker image prune`** — Add to CD script to prevent disk bloat on the server
- [ ] **Staging environment** — Separate `staging` branch with its own EC2/Droplet and pipeline before promoting to `main`
- [ ] **Rollback mechanism** — Tag Docker images with commit SHA so broken deployments can be reverted instantly

---

## Project Structure

```
application-tracker/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD pipeline
├── prisma/
│   ├── schema.prisma            # Data models
│   └── migrations/              # Migration history
├── src/
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # React components
│   └── lib/
│       └── db.ts                # Prisma client singleton
├── prisma.config.ts             # Prisma 7 adapter configuration
├── Dockerfile                   # Multi-stage production Dockerfile
├── docker-compose.yaml          # Local development Compose
├── docker-compose.prod.yaml     # Production Compose (image pull only)
├── .env.example                 # Environment variable template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json
```

---

## Author

**Vinner Hooda**
MCA Student · Christ University Delhi NCR · IEEE Published Researcher · Full-Stack Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-vinner--portfolio.netlify.app-black?style=flat-square)](https://vinner-portfolio.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Conceal34-181717?style=flat-square&logo=github)](https://github.com/Conceal34)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vinnerhooda-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/vinnerhooda)
[![X](https://img.shields.io/badge/X-vinnerhooda-000000?style=flat-square&logo=x)](https://x.com/vinnerhooda)

---

<div align="center">

Built with too many `docker logs` and not enough sleep.

</div>
