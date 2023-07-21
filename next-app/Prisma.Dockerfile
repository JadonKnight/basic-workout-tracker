# This dockerfile is used to deploy prisma migrations
FROM node:18.15-slim AS base

# Apparently required for prisma to work
# RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./

# TODO: Fix this, it's not ideal to copy everything
# should only copy the files needed for prisma to run the seed scripts
COPY . .

RUN npm ci

RUN npx prisma generate

# Perform migration and seeding
CMD sh -c "npx prisma migrate deploy && npx prisma db seed --preview-feature"
