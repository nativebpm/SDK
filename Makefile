.PHONY: generate generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart
.PHONY: test test-go test-python test-typescript test-java test-kotlin test-php test-dotnet test-rust test-dart test-swift

# Detect if running in GitLab CI
ifneq ($(CI),)
  DOCKER_RUN = docker run --rm --volumes-from $${HOSTNAME}
  OUT_PATH = $$(pwd)
else
  DOCKER_RUN = docker run --rm -v "$$(pwd):/local"
  OUT_PATH = /local
endif

# Unified code generator target for all polyglot SDKs using local openapi.yaml
generate: generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart

generate-go:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g go \
		-o $(OUT_PATH)/go \
		--additional-properties=packageName=nativebpm \
		--git-host gitlab.com \
		--git-user-id nativebpm \
		--git-repo-id sdk/go

generate-python:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g python \
		-o $(OUT_PATH)/python \
		--additional-properties=packageName=nativebpm_client

generate-typescript:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g typescript-fetch \
		-o $(OUT_PATH)/typescript/src/api \
		--additional-properties=npmName=@nativebpm/client,npmVersion=1.0.0

generate-java:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g java \
		-o $(OUT_PATH)/java \
		--additional-properties=library=okhttp-gson,serializationLibrary=gson,groupId=com.nativebpm,artifactId=nativebpm-java-client,artifactVersion=1.0.0,invokerPackage=com.nativebpm.client,apiPackage=com.nativebpm.client.api,modelPackage=com.nativebpm.client.model

generate-php:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g php \
		-o $(OUT_PATH)/php \
		--additional-properties=invokerPackage=NativeBPM\\Client,packageName=nativebpm/client

generate-dotnet:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g csharp \
		-o $(OUT_PATH)/dotnet \
		--additional-properties=packageName=NativeBPM.Client,targetFramework=net8.0

generate-rust:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g rust \
		-o $(OUT_PATH)/rust \
		--additional-properties=packageName=nativebpm-client

generate-kotlin:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g kotlin \
		-o $(OUT_PATH)/kotlin \
		--additional-properties=groupId=com.nativebpm,artifactId=nativebpm-kotlin-client,artifactVersion=1.0.0,packageName=com.nativebpm.client,library=jvm-okhttp4

generate-swift:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g swift5 \
		-o $(OUT_PATH)/swift \
		--additional-properties=projectName=NativeBPMClient,responseAs=AsyncAwait

generate-dart:
	$(DOCKER_RUN) openapitools/openapi-generator-cli generate \
		-i $(OUT_PATH)/openapi.yaml \
		-g dart \
		-o $(OUT_PATH)/dart \
		--additional-properties=pubName=nativebpm_client,pubVersion=1.0.0,pubDescription="NativeBPM Client SDK for Dart and Flutter"

test: test-go test-python test-typescript test-java test-kotlin test-php test-dotnet test-rust test-dart

test-go:
	$(DOCKER_RUN) -w $(OUT_PATH)/go golang:1.26-alpine sh -c "go get github.com/stretchr/testify/assert && go test -v ./..."

test-python:
	$(DOCKER_RUN) -w $(OUT_PATH)/python python:3.11 sh -c "pip install -r requirements.txt -r test-requirements.txt && python -m unittest discover -s test"

test-typescript:
	$(DOCKER_RUN) -w $(OUT_PATH)/typescript node:20-alpine sh -c "apk add --no-cache make && make test"

test-java:
	$(DOCKER_RUN) -w $(OUT_PATH)/java gradle:8-jdk17 gradle test

test-kotlin:
	$(DOCKER_RUN) -w $(OUT_PATH)/kotlin gradle:8-jdk17 gradle test

test-php:
	$(DOCKER_RUN) -w $(OUT_PATH)/php composer install --no-interaction
	$(DOCKER_RUN) -w $(OUT_PATH)/php php:8.2-cli vendor/bin/phpunit

test-dotnet:
	$(DOCKER_RUN) -w $(OUT_PATH)/dotnet mcr.microsoft.com/dotnet/sdk:8.0 dotnet test NativeBPM.Client.sln

test-rust:
	$(DOCKER_RUN) -w $(OUT_PATH)/rust rust:1.75 cargo test

test-dart:
	$(DOCKER_RUN) -w $(OUT_PATH)/dart dart:stable dart test

test-swift:
	@echo "No tests configured for Swift"
