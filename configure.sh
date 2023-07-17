#!/bin/bash

# Generate ./next-app/.env file
cat << EOF > ./next-app/.env
DATABASE_URL=
NODE_ENV=
EOF

# Generate ./next-app/.env.local file
cat << EOF > ./next-app/.env.local
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

NEXT_PUBLIC_HASHID_SALT=
NEXT_PUBLIC_CONTACT_EMAIL=
EOF

echo "Configuration files generated: .env, .env.local"
