# Quick Ship Server

Quick Ship Server is the backend for the Quick Ship app. It uses Express, TypeScript, Sequelize, GraphQL, and Firebase Admin.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the values you need.
3. Start the app with `npm run dev`.

## What It Does

- Serves the main API from `src/index.ts`.
- Exposes a GraphQL endpoint at `/graphql`.
- Exposes mobile REST routes under `/api`.
- Serves a health check at `/status`.
- Serves uploaded files from `/uploads/:dir/:name`.

## Main API Areas

- Auth: register, login, email verification, and password reset.
- Data: FAQs, feeds, user stats, and notifications.
- Trips, packages, requests, and orders.
- Transactions and M-Pesa callback handling.

## Scripts

- `npm run dev` - Start the server in development mode.
- `npm start` - Start the server with `ts-node`.
- `npm run build` - Build the server bundle.
- `npm test` - Run the TypeScript tests in `tests/`.
- `npm run migrate` - Run database migrations.
- `npm run seed` - Seed the database.

## Tests

The tests are split by area and cover small pieces that do not need a live database, like the route token middleware, async error handling, and the GraphQL auth checker.

## Environment

The app expects values such as `PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_HOST`, `SECRET_KEY`, `ROUTE_TOKEN`, email settings, and M-Pesa credentials.