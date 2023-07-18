# This dockerfile is used to deploy prisma migrations
FROM node:18.15-slim AS base

# Apparently required for prisma to work
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma
COPY .env ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

RUN npx prisma generate

# Perform migration and seeding
CMD ["npx", "prisma", "migrate", "deploy", "&&", "npx", "prisma", "db", "seed", "--preview-feature"]
