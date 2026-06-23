#!/usr/bin/env bash
set -euo pipefail

if [ -z "${GL_PAT:-}" ]; then
  echo "Error: GL_PAT environment variable is not set."
  exit 1
fi

PROJECT="nativebpm%2Fsdk"
API_URL="https://gitlab.com/api/v4/projects/${PROJECT}/registry/repositories"

# List of "repo_id:tag" pairs
DELETIONS=(
  "11745711:1.26-alpine"
  "11745715:20"
  "11745715:20-alpine"
  "11745718:3.11"
  "11745744:8-jdk17"
  "11745760:8.2-cli"
  "11745762:8.0"
  "11745773:1.75"
  "11745773:1.82"
  "11745781:3.9-eclipse-temurin-17"
  "11745787:24.0.9-dind"
  "11745787:24.0.9-git"
)

echo "Starting GitLab Container Registry cleanup..."

for item in "${DELETIONS[@]}"; do
  repo_id="${item%%:*}"
  tag="${item#*:}"
  
  echo "Deleting tag '${tag}' from repository '${repo_id}'..."
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    --request DELETE \
    --header "PRIVATE-TOKEN: ${GL_PAT}" \
    "${API_URL}/${repo_id}/tags/${tag}")
  
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "204" ]; then
    echo "Successfully deleted '${tag}' from repo '${repo_id}' (HTTP ${STATUS})."
  elif [ "$STATUS" = "404" ]; then
    echo "Tag '${tag}' not found in repo '${repo_id}' (HTTP 404). Already deleted?"
  else
    echo "Failed to delete tag '${tag}' from repo '${repo_id}' (HTTP ${STATUS})."
    exit 1
  fi
done

echo "Cleanup complete."
