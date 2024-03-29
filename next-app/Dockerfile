# Taken from the official Next.js Docker example except we don't use alpine due to issues deploying to pi.
#FROM node:lts-slim AS base

# This specific image is currently required, see - https://github.com/prisma/prisma/issues/19729#issuecomment-1590734304

FROM node:18.15-slim AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder
# Apparently required for prisma to work
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

# TODO: Re introduce this when we move to /src
# COPY src ./src
# COPY public ./public
# COPY next.config.js .
# COPY tsconfig.json .

# Ideally I'd like to use the above, but since I'm not ready to restructure
# the project to /src yet, I'll copy all files.
COPY . .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# Make sure we generate the client to prevent type errors
# FIXME: I don't think this is ideal either,
# requires the CI/CD to have database access... (uh oh)
# Either I fix it by removing here or our CI/CD needs to be able to spin
# up a database before building the image.
RUN npx prisma generate

# Build Next.js based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else yarn build; \
  fi

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

RUN npm install prisma

# Generate the client
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate --schema ./prisma/schema.prisma

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Environment variables must be redefined at run time
# The point of these is that we need build and run time env vars,
# I'm handling this currently by just copying them in, but obviously
# this is bad practice, if the image was uploaded to a public image reop
# FIXME: Find a better way to do this.
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

USER nextjs

# Run migrate and seed and then start the app
CMD ["node", "server.js"]
