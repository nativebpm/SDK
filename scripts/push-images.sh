#!/bin/bash
set -e

if [ -z "$GL_PAT" ]; then
  echo "Error: GL_PAT environment variable is not set."
  exit 1
fi

docker login -u sauran -p "$GL_PAT" registry.gitlab.com

# Define image mapping: "source_image|target_image"
images=(
  "mirror.gcr.io/library/composer:latest|composer:latest"
  "mirror.gcr.io/library/php:8.2-cli|php:8.2-cli"
  "mcr.microsoft.com/dotnet/sdk:8.0|dotnet-sdk:8.0"
  "mirror.gcr.io/library/rust:1.75|rust:1.75"
  "mirror.gcr.io/library/dart:stable|dart:stable"
  "mirror.gcr.io/library/maven:3.9-eclipse-temurin-17|maven:3.9-eclipse-temurin-17"
  "mirror.gcr.io/library/node:20|node:20"
  "mirror.gcr.io/library/docker:24.0.9-git|docker:24.0.9-git"
  "mirror.gcr.io/library/docker:24.0.9-dind|docker:24.0.9-dind"
  "openapitools/openapi-generator-cli:latest|openapi-generator-cli:latest"
  "mirror.gcr.io/library/golang:1.26-alpine|golang:1.26-alpine"
  "mirror.gcr.io/library/python:3.11|python:3.11"
  "mirror.gcr.io/library/node:20-alpine|node:20-alpine"
)

for entry in "${images[@]}"; do
  IFS="|" read -r src tgt <<< "$entry"
  echo "Mirroring $src -> registry.gitlab.com/nativebpm/sdk/$tgt"
  docker pull "$src"
  docker tag "$src" "registry.gitlab.com/nativebpm/sdk/$tgt"
  docker push "registry.gitlab.com/nativebpm/sdk/$tgt"
done

echo "All images pushed successfully!"
