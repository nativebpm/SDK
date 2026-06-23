.PHONY: generate generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart
.PHONY: test test-go test-python test-typescript test-java test-kotlin test-php test-dotnet test-rust test-dart test-swift
.PHONY: push-images login-registry push-gradle push-composer push-php push-dotnet push-rust push-dart push-maven push-node push-docker-git push-docker-dind push-openapi-gen push-golang push-python push-node-alpine

# Registry-backed images to bypass Docker Hub rate limits in CI/CD
OPENAPI_GEN_IMG = registry.gitlab.com/nativebpm/sdk/openapi-generator-cli:latest
GOLANG_IMG = registry.gitlab.com/nativebpm/sdk/golang:1.26-alpine
PYTHON_IMG = registry.gitlab.com/nativebpm/sdk/python:3.11
NODE_IMG = registry.gitlab.com/nativebpm/sdk/node:20-alpine
GRADLE_IMG = registry.gitlab.com/nativebpm/sdk/gradle:8-jdk17
COMPOSER_IMG = registry.gitlab.com/nativebpm/sdk/composer:latest
PHP_IMG = registry.gitlab.com/nativebpm/sdk/php:8.2-cli
DOTNET_IMG = registry.gitlab.com/nativebpm/sdk/dotnet-sdk:8.0
RUST_IMG = registry.gitlab.com/nativebpm/sdk/rust:1.75
DART_IMG = registry.gitlab.com/nativebpm/sdk/dart:stable
MAVEN_IMG = registry.gitlab.com/nativebpm/sdk/maven:3.9-eclipse-temurin-17
NODE20_IMG = registry.gitlab.com/nativebpm/sdk/node:20
DOCKER_GIT_IMG = registry.gitlab.com/nativebpm/sdk/docker:24.0.9-git
DOCKER_DIND_IMG = registry.gitlab.com/nativebpm/sdk/docker:24.0.9-dind

# Unified code generator target for all polyglot SDKs using local openapi.yaml
generate: generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart

generate-go:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g go \
		-o /local/go \
		--additional-properties=packageName=nativebpm \
		--git-host gitlab.com \
		--git-user-id nativebpm \
		--git-repo-id sdk/go

generate-python:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g python \
		-o /local/python \
		--additional-properties=packageName=nativebpm_client

generate-typescript:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g typescript-fetch \
		-o /local/typescript/src/api \
		--additional-properties=npmName=@nativebpm/client,npmVersion=1.0.0

generate-java:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g java \
		-o /local/java \
		--additional-properties=library=okhttp-gson,serializationLibrary=gson,groupId=com.nativebpm,artifactId=nativebpm-java-client,artifactVersion=1.0.0,invokerPackage=com.nativebpm.client,apiPackage=com.nativebpm.client.api,modelPackage=com.nativebpm.client.model

generate-php:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g php \
		-o /local/php \
		--additional-properties=invokerPackage=NativeBPM\\Client,packageName=nativebpm/client

generate-dotnet:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g csharp \
		-o /local/dotnet \
		--additional-properties=packageName=NativeBPM.Client,targetFramework=net8.0

generate-rust:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g rust \
		-o /local/rust \
		--additional-properties=packageName=nativebpm-client

generate-kotlin:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g kotlin \
		-o /local/kotlin \
		--additional-properties=groupId=com.nativebpm,artifactId=nativebpm-kotlin-client,artifactVersion=1.0.0,packageName=com.nativebpm.client,library=jvm-okhttp4

generate-swift:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g swift5 \
		-o /local/swift \
		--additional-properties=projectName=NativeBPMClient,responseAs=AsyncAwait

generate-dart:
	docker run --rm -v "$$(pwd):/local" $(OPENAPI_GEN_IMG) generate \
		-i /local/openapi.yaml \
		-g dart \
		-o /local/dart \
		--additional-properties=pubName=nativebpm_client,pubVersion=1.0.0,pubDescription="NativeBPM Client SDK for Dart and Flutter"

test: test-go test-python test-typescript test-java test-kotlin test-php test-dotnet test-rust test-dart

test-go:
	docker run --rm -v "$$(pwd):/local" -w /local/go $(GOLANG_IMG) sh -c "go get github.com/stretchr/testify/assert && go test -v ./..."

test-python:
	docker run --rm -v "$$(pwd):/local" -w /local/python $(PYTHON_IMG) sh -c "pip install -r requirements.txt -r test-requirements.txt && python -m unittest discover -s test"

test-typescript:
	docker run --rm -v "$$(pwd):/local" -w /local/typescript $(NODE_IMG) sh -c "apk add --no-cache make && make test"

test-java:
	docker run --rm -v "$$(pwd):/local" -w /local/java $(GRADLE_IMG) gradle test

test-kotlin:
	docker run --rm -v "$$(pwd):/local" -w /local/kotlin $(GRADLE_IMG) gradle test

test-php:
	docker run --rm -v "$$(pwd):/local" -w /local/php $(COMPOSER_IMG) composer install --no-interaction
	docker run --rm -v "$$(pwd):/local" -w /local/php $(PHP_IMG) vendor/bin/phpunit

test-dotnet:
	docker run --rm -v "$$(pwd):/local" -w /local/dotnet $(DOTNET_IMG) dotnet test NativeBPM.Client.sln

test-rust:
	docker run --rm -v "$$(pwd):/local" -w /local/rust $(RUST_IMG) cargo test

test-dart:
	docker run --rm -v "$$(pwd):/local" -w /local/dart $(DART_IMG) dart test

test-swift:
	@echo "No tests configured for Swift"

push-images: login-registry push-gradle push-composer push-php push-dotnet push-rust push-dart push-maven push-node push-docker-git push-docker-dind push-openapi-gen push-golang push-python push-node-alpine

login-registry:
	@if [ -z "$$GL_PAT" ]; then echo "Error: GL_PAT environment variable is not set." && exit 1; fi
	docker login -u sauran -p $$GL_PAT registry.gitlab.com

push-gradle:
	docker pull mirror.gcr.io/library/gradle:8-jdk17
	docker tag mirror.gcr.io/library/gradle:8-jdk17 $(GRADLE_IMG)
	docker push $(GRADLE_IMG)

push-composer:
	docker pull mirror.gcr.io/library/composer:latest
	docker tag mirror.gcr.io/library/composer:latest $(COMPOSER_IMG)
	docker push $(COMPOSER_IMG)

push-php:
	docker pull mirror.gcr.io/library/php:8.2-cli
	docker tag mirror.gcr.io/library/php:8.2-cli $(PHP_IMG)
	docker push $(PHP_IMG)

push-dotnet:
	docker pull mcr.microsoft.com/dotnet/sdk:8.0
	docker tag mcr.microsoft.com/dotnet/sdk:8.0 $(DOTNET_IMG)
	docker push $(DOTNET_IMG)

push-rust:
	docker pull mirror.gcr.io/library/rust:1.75
	docker tag mirror.gcr.io/library/rust:1.75 $(RUST_IMG)
	docker push $(RUST_IMG)

push-dart:
	docker pull mirror.gcr.io/library/dart:stable
	docker tag mirror.gcr.io/library/dart:stable $(DART_IMG)
	docker push $(DART_IMG)

push-maven:
	docker pull mirror.gcr.io/library/maven:3.9-eclipse-temurin-17
	docker tag mirror.gcr.io/library/maven:3.9-eclipse-temurin-17 $(MAVEN_IMG)
	docker push $(MAVEN_IMG)

push-node:
	docker pull mirror.gcr.io/library/node:20
	docker tag mirror.gcr.io/library/node:20 $(NODE20_IMG)
	docker push $(NODE20_IMG)

push-docker-git:
	docker pull mirror.gcr.io/library/docker:24.0.9-git
	docker tag mirror.gcr.io/library/docker:24.0.9-git $(DOCKER_GIT_IMG)
	docker push $(DOCKER_GIT_IMG)

push-docker-dind:
	docker pull mirror.gcr.io/library/docker:24.0.9-dind
	docker tag mirror.gcr.io/library/docker:24.0.9-dind $(DOCKER_DIND_IMG)
	docker push $(DOCKER_DIND_IMG)

push-openapi-gen:
	docker pull openapitools/openapi-generator-cli:latest
	docker tag openapitools/openapi-generator-cli:latest $(OPENAPI_GEN_IMG)
	docker push $(OPENAPI_GEN_IMG)

push-golang:
	docker pull mirror.gcr.io/library/golang:1.26-alpine
	docker tag mirror.gcr.io/library/golang:1.26-alpine $(GOLANG_IMG)
	docker push $(GOLANG_IMG)

push-python:
	docker pull mirror.gcr.io/library/python:3.11
	docker tag mirror.gcr.io/library/python:3.11 $(PYTHON_IMG)
	docker push $(PYTHON_IMG)

push-node-alpine:
	docker pull mirror.gcr.io/library/node:20-alpine
	docker tag mirror.gcr.io/library/node:20-alpine $(NODE_IMG)
	docker push $(NODE_IMG)


