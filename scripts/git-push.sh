#!/usr/bin/env bash

set -e

COMMIT_MSG=${1:-update}
BRANCH=$(git symbolic-ref --short HEAD)

echo "[git-push] Current branch: $BRANCH"

echo "[git-push] Staging all changes..."
git add .

if git diff --cached --quiet; then
  echo "[git-push] No changes to commit."
else
  echo "[git-push] Committing with message: '$COMMIT_MSG'"
  git commit -m "$COMMIT_MSG"
fi

echo "[git-push] Pushing branch '$BRANCH'..."
git push

echo "[git-push] Done."
