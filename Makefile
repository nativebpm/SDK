.PHONY: generate generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart

# Unified code generator target for all polyglot SDKs using local openapi.yaml
generate: generate-go generate-python generate-typescript generate-java generate-php generate-dotnet generate-rust generate-kotlin generate-swift generate-dart


generate-go:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g go \
		-o /local/sdk/go \
		--additional-properties=packageName=nativebpm

generate-python:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g python \
		-o /local/sdk/python \
		--additional-properties=packageName=nativebpm_client

generate-typescript:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g typescript-fetch \
		-o /local/sdk/typescript/src/api \
		--additional-properties=npmName=@nativebpm/client,npmVersion=1.0.0

generate-java:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g java \
		-o /local/sdk/java \
		--additional-properties=library=okhttp-gson,serializationLibrary=gson,groupId=com.nativebpm,artifactId=nativebpm-java-client,artifactVersion=1.0.0,invokerPackage=com.nativebpm.client,apiPackage=com.nativebpm.client.api,modelPackage=com.nativebpm.client.model

generate-php:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g php \
		-o /local/sdk/php \
		--additional-properties=invokerPackage=NativeBPM\\Client,packageName=nativebpm/client

generate-dotnet:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g csharp \
		-o /local/sdk/dotnet \
		--additional-properties=packageName=NativeBPM.Client,targetFramework=net8.0

generate-rust:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g rust \
		-o /local/sdk/rust \
		--additional-properties=packageName=nativebpm-client

generate-kotlin:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g kotlin \
		-o /local/sdk/kotlin \
		--additional-properties=groupId=com.nativebpm,artifactId=nativebpm-kotlin-client,artifactVersion=1.0.0,packageName=com.nativebpm.client,library=jvm-okhttp4

generate-swift:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g swift5 \
		-o /local/sdk/swift \
		--additional-properties=projectName=NativeBPMClient,responseAs=AsyncAwait

generate-dart:
	docker run --rm -v "$$(pwd)/..:/local" openapitools/openapi-generator-cli generate \
		-i /local/sdk/openapi.yaml \
		-g dart \
		-o /local/sdk/dart \
		--additional-properties=pubName=nativebpm_client,pubVersion=1.0.0,pubDescription="NativeBPM Client SDK for Dart and Flutter"



