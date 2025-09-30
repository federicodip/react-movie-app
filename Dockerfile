FROM node:20-alpine

WORKDIR /app
RUN corepack enable || true

# Copy manifest + any lockfile that may exist (wildcards make the lockfiles optional)
COPY package*.json yarn.lock* pnpm-lock.yaml* ./

# Install deps with the correct manager if its lockfile exists
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    npm install; \
  fi

# Copy the rest and build
COPY . .
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm run build; \
  elif [ -f yarn.lock ]; then yarn build; \
  else npm run build; \
  fi

EXPOSE 4173
# Make sure package.json has: "preview": "vite preview --host 0.0.0.0 --port 4173"
CMD [ "sh", "-c", "npm run preview" ]
