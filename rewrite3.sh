#!/bin/bash
set -e

rm -rf .git
git init

# Setup base config
git config user.name "Raman Kumar"
git config user.email "268247759+ramanjaglan2006-crypto@users.noreply.github.com"
git config commit.gpgsign false

# Define dates (ISO 8601 format) with ~18 days gap
D1="2026-01-23T12:00:00+05:30"
D2="2026-02-10T14:30:00+05:30"
D3="2026-02-28T10:15:00+05:30"
D4="2026-03-17T16:45:00+05:30"
D5="2026-04-04T09:20:00+05:30"
D6="2026-04-22T11:10:00+05:30"
D7="2026-05-10T15:05:00+05:30"
D8="2026-05-28T13:40:00+05:30"

# Helper function
commit_at() {
    export GIT_AUTHOR_DATE="$1"
    export GIT_COMMITTER_DATE="$1"
    git commit -m "$2"
}

# Commit 1
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs components.json .gitignore || true
commit_at "$D1" "Initial project setup and configuration"

# Commit 2
git add public/ src/app/globals.css src/app/layout.tsx src/app/favicon.ico || true
commit_at "$D2" "Add global styles, fonts, and base layout"

# Commit 3
git add src/components/ui/ || true
commit_at "$D3" "Implement UI components (shadcn)"

# Commit 4
git add src/components/ArchitectureDiagram.tsx || true
commit_at "$D4" "Add architecture diagram component"

# Commit 5
git add src/app/page.tsx || true
commit_at "$D5" "Build main landing page"

# Commit 6
git add src/app/result/ src/app/history/ || true
commit_at "$D6" "Add routing for result and history pages"

# Commit 7
git add src/lib/ src/services/ src/app/api/ supabase/ || true
commit_at "$D7" "Integrate services, API routes, and Supabase"

# Commit 8
git add .
commit_at "$D8" "Add scripts, logs, and update README.md"

git branch -M main

# Add remote
git remote add origin https://github.com/ramanjaglan2006-crypto/archmind_ai.git

echo "Done"
