# Contributing to NativeBPM Client SDKs

Thank you for your interest in contributing to the NativeBPM Client SDKs! This repository houses the client libraries and Fluent Workflow builders for all supported programming languages.

Please read through this guide to understand our architecture, code generation workflow, and development practices.

---

## 🏗️ Architecture Overview

The SDK monorepo uses a dual-layer architecture to keep the client libraries lightweight, consistent, and performant across all 10 supported programming languages:

1. **Low-Level Generated Clients (Single Source of Truth)**:
   * Built entirely from the OpenAPI 3.0 specification file: [openapi.yaml](file:///Users/user/github.com/nativebpm/sdk/openapi.yaml).
   * Automatically generated using the `openapi-generator-cli` inside a Docker container.
   * Handles raw HTTP transport, endpoint routing, serialization/deserialization, and standard schema models.
2. **High-Level Fluent Wrappers (Hand-written)**:
   * Ergonomic wrappers written manually for each language to provide a type-safe, idiomatic Fluent builder experience (method chaining, builders, workers).
   * Key wrapper files:
     - **Go**: [go/fluent_client.go](file:///Users/user/github.com/nativebpm/sdk/go/fluent_client.go)
     - **TypeScript**: [typescript/src/client.ts](file:///Users/user/github.com/nativebpm/sdk/typescript/src/client.ts)
     - **Python**: [python/nativebpm/client.py](file:///Users/user/github.com/nativebpm/sdk/python/nativebpm/client.py)
     - **Dart**: [dart/lib/src/client.dart](file:///Users/user/github.com/nativebpm/sdk/dart/lib/src/client.dart)
     - **Kotlin**: [kotlin/src/main/kotlin/com/nativebpm/client/Client.kt](file:///Users/user/github.com/nativebpm/sdk/kotlin/src/main/kotlin/com/nativebpm/client/Client.kt)
     - **Swift**: [swift/NativeBPMClient/Classes/OpenAPIs/Client.swift](file:///Users/user/github.com/nativebpm/sdk/swift/NativeBPMClient/Classes/OpenAPIs/Client.swift)

---

## 🛠️ Development Setup & Prerequisites

Before you begin making changes, ensure your environment has:
* **Docker** (required for the code generator container)
* **Make** (build tool)
* Language runtimes for the SDKs you plan to modify or test (e.g. Go, Node.js, Python, Flutter/Dart, Kotlin/Java, Swift/Xcode).

---

## 🔄 Step-by-Step API Modification Workflow

To add new features or modify existing API endpoints, follow this sequence:

### Step 1: Update the OpenAPI Specification
* Edit the central OpenAPI contract: [openapi.yaml](file:///Users/user/github.com/nativebpm/sdk/openapi.yaml).
* Define the paths, HTTP verbs, path/query parameters, request payloads, and response models.
* Provide clean, clear descriptions and specify correct `operationId` tags (these map to the generated method names in the client).

### Step 2: Regenerate the Client Code
Run the code generator to update the low-level generated HTTP clients:
```bash
# Regenerate base code for all 10 languages
make generate
```
If you only want to regenerate code for a specific language, run the language-specific target:
* Go: `make generate-go`
* TypeScript: `make generate-typescript`
* Python: `make generate-python`
* Dart: `make generate-dart`
* Kotlin: `make generate-kotlin`
* Swift: `make generate-swift`
* PHP: `make generate-php`
* Rust: `make generate-rust`
* Java: `make generate-java`
* .NET: `make generate-dotnet`

### Step 3: Implement Fluent API Wrappers
Once generation completes, update the hand-written client wrappers. These wrappers should wrap the new low-level API calls to offer developers an idiomatic fluent interface:
* Go wrapper: Add the new methods or configuration builders to `fluent_client.go`.
* TypeScript wrapper: Update `client.ts`.
* Python wrapper: Update `client.py`.
* Dart, Kotlin, Swift wrappers: Extend the main classes with matching new endpoints.

---

## 🧪 Testing & Verification

Always verify your changes compile and pass tests in the respective language directory:

### Go SDK
```bash
cd go
go test ./...
```

### TypeScript SDK
```bash
cd typescript
npm install
npm run build
npm test
```

### Python SDK
```bash
cd python
pip install -r requirements.txt
python3 test_client.py
```

### Dart / Flutter SDK
```bash
cd dart
dart pub get
dart test
```

### Kotlin SDK
```bash
cd kotlin
./gradlew test
```

---

## 📝 Pull Request & Contribution Guidelines

1. **Keep it Consistent**: Ensure that method names, option structures, and behavior are aligned across all 10 language wrappers.
2. **Do Not Manually Edit Generated Files**: Any changes to files marked with `@Generated` or managed under generation folders (like `typescript/src/api`) will be overwritten. Always modify `openapi.yaml` and regenerate instead.
3. **Write Tests**: Provide unit tests for new builder methods or client functions.
4. **Document Changes**: Update the respective language subdirectory README files if the usage patterns or setup prerequisites change.
