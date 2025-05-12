# Deployment Guide

*(This document is a placeholder. It should detail the steps required to deploy the Exam Buddy application to staging and production environments.)*

## Prerequisites

*   Docker & Docker Compose installed on the deployment server.
*   Access to the deployment server.
*   Production environment variables set (see below).
*   Configured DNS records pointing to the server IP.
*   (Optional) SSL certificates obtained (e.g., via Let's Encrypt / Certbot).

## Environments

*   **Staging:** Used for testing releases before production.
*   **Production:** Live environment for end-users.

## Environment Variables (Production)

*   List required environment variables (`NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`, Email/Cloudinary creds if used).
*   Explain how to securely provide these (e.g., server environment variables, secrets management tools).

## Deployment Steps (Using Docker Compose)

1.  **Clone/Pull Repository:** Get the latest code from the `main` branch.
2.  **Set Environment Variables:** Ensure production variables are accessible to the `docker compose` command.
3.  **Build Images:** `docker compose -f docker-compose.prod.yml build`
4.  **Start Services:** `docker compose -f docker-compose.prod.yml up -d`
5.  **(First Time) Database Setup / Migrations:** Detail any steps needed to initialize or migrate the database schema.
6.  **Nginx Configuration:** Explain how to configure Nginx, especially for SSL termination (provide example snippets or link to `docker/nginx/`).
7.  **Verification:** Steps to verify the deployment is successful.

## Database Backups & Restore

*   Strategy for regular MongoDB backups.
*   Procedure for restoring from backup.

## Monitoring & Logging

*   How to access application logs (e.g., `docker compose logs`).
*   Recommended monitoring tools/setup (e.g., Prometheus, Grafana, uptime monitoring).

## Rollback Strategy

*   Procedure for rolling back to a previous stable version if deployment fails. 