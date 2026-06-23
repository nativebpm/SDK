.PHONY: generate generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart
.PHONY: test test-go test-python test-typescript test-java test-kotlin test-php test-dotnet test-rust test-dart test-swift

# Registry-backed images to bypass Docker Hub rate limits in CI/CD
OPENAPI_GEN_IMG = registry.gitlab.com/nativebpm/sdk/openapi-generator-cli:latest
GOLANG_IMG = registry.gitlab.com/nativebpm/sdk/golang:1.26-alpine
PYTHON_IMG = registry.gitlab.com/nativebpm/sdk/python:3.11
NODE_IMG = registry.gitlab.com/nativebpm/sdk/node:20-alpine

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
	docker run --rm -v "$$(pwd):/local" -w /local/java gradle:8-jdk17 gradle test

test-kotlin:
	docker run --rm -v "$$(pwd):/local" -w /local/kotlin gradle:8-jdk17 gradle test

test-php:
	docker run --rm -v "$$(pwd):/local" -w /local/php composer install --no-interaction
	docker run --rm -v "$$(pwd):/local" -w /local/php php:8.2-cli vendor/bin/phpunit

test-dotnet:
	docker run --rm -v "$$(pwd):/local" -w /local/dotnet mcr.microsoft.com/dotnet/sdk:8.0 dotnet test NativeBPM.Client.sln

test-rust:
	docker run --rm -v "$$(pwd):/local" -w /local/rust rust:1.75 cargo test

test-dart:
	docker run --rm -v "$$(pwd):/local" -w /local/dart dart:stable dart test

test-swift:
	@echo "No tests configured for Swift"
