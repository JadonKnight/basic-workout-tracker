#!/bin/bash

# Generate ./next-app/.env file
cat << EOF > .env
DATABASE_URL=
EOF

# Generate ./next-app/.env.local file
cat << EOF > .env.local
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
