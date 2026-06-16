# NativeBPM Polyglot Client SDKs

<p align="center">
  <a href="https://gitlab.com/nativebpm/sdk">
    <img src="https://img.shields.io/badge/NativeBPM-Platform-blueviolet?style=for-the-badge" alt="NativeBPM Platform" />
  </a>
</p>

Welcome to the official **NativeBPM Client SDKs** monorepo. NativeBPM is a cloud-native, high-performance BPMN 2.0 execution engine designed for modern microservice architectures. 

This repository houses the client libraries and Fluent Workflow builders for all major programming languages, allowing you to define, deploy, and interact with process definitions and human-in-the-loop tasks using your favorite language.

---

## 📖 API Documentation & Resources

* **Interactive Swagger UI**: Accessible at `http://localhost:8080/ui/docs` (choose topic *6. REST API Reference* inside your local NativeBPM Console).
* **Raw OpenAPI Specification**: Exposed dynamically by the engine at `http://localhost:8080/api/openapi.json`.
* **Central Repo Resources**:
  - [openapi.yaml](file:///Users/user/github.com/nativebpm/sdk/openapi.yaml): The platform OpenAPI 3.0 specification file.
  - [core.wasm](file:///Users/user/github.com/nativebpm/sdk/core.wasm): The pre-compiled WebAssembly Workflow-as-Code core builder.

---

## 🚀 Supported Languages

Click on the language badges below to navigate to their respective subdirectories and check out the documentation and runnable examples:

| Language | Badge | Quick Link |
| :--- | :--- | :--- |
| **Go** | ![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white) | [Go Client & Builder](./go) |
| **Python** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) | [Python Client & Builder](./python) |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | [TypeScript Client & Builder](./typescript) |
| **Java** | ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | [Java Client & Builder](./java) |
| **.NET (C#)** | ![.NET](https://img.shields.io/badge/.NET-512BD4?style=flat-square&logo=dotnet&logoColor=white) | [.NET Client & Builder](./dotnet) |
| **PHP** | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white) | [PHP Client & Builder](./php) |
| **Rust** | ![Rust](https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white) | [Rust Client & Builder](./rust) |
| **Kotlin** | ![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white) | [Kotlin Client](./kotlin) |
| **Swift** | ![Swift](https://img.shields.io/badge/Swift-F05138?style=flat-square&logo=swift&logoColor=white) | [Swift Client](./swift) |

---

## 🛠️ WebAssembly-Powered Workflow-as-Code Compiler

NativeBPM features a state-of-the-art **Workflow-as-Code** builder. Instead of writing verbose BPMN 2.0 XML by hand or using external visual tools, developers can write type-safe, fluent code in their host language.

To ensure strict parity, identical schema output, and instant local validation across all 7 languages (Go, Python, JS/TS, Java, .NET, PHP, Rust), NativeBPM compiles these code-defined ASTs using a single **embedded WebAssembly (WASM) core compiler** (`core.wasm`). 

### How it Works

```mermaid
flowchart TD
    subgraph "Host Application (Go, Python, JS, Rust, etc.)"
        API[Fluent Workflow API Builder] -->|Builds AST| AST[Workflow AST Struct]
    end

    subgraph "Embedded Sandbox"
        WASM_RUN[WASM Runtime: Wazero / Wasmtime] -->|Instantiates| CORE[core.wasm Compiler]
    end

    AST -->|Passes Schema to| WASM_RUN
    CORE -->|Compiles & Validates| BPMN[BPMN 2.0 XML]
    BPMN -->|Returns to Host| REST[REST API Client]
    REST -->|Deploys to| ENGINE[NativeBPM Engine Server]

    style CORE fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
    style BPMN fill:#10B981,stroke:#fff,stroke-width:2px,color:#fff
    style ENGINE fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
```

Using lightweight runtimes like `wazero` in Go or `wasmtime` in Python, TypeScript, and Rust, the SDK loads and executes the compiled `core.wasm` binary in-memory. This guarantees:
* **Zero Host Dependencies**: No local CLI tools or external compilation services required.
* **Flawless parity**: The exact same BPMN validation and compilation logic runs identically on every platform.
* **Blazing speed**: Compilation and validation run in milliseconds, in-process.

---

## 🌟 Why NativeBPM Loves Your Language

Every language has its unique ecosystem, strengths, and philosophy. NativeBPM embraces this diversity and optimizes the developer experience for each stack:

### 🐹 Go (Golang)
* **Native Cohesion**: Since the core NativeBPM execution engine is written in Go, the Go client features direct and seamless integration.
* **Concurrency-First**: Take full advantage of Go's lightweight goroutines and channels to write high-concurrency topic workers.
* **Minimal Footprint**: Compiles into a single statically linked binary with absolute zero runtime dependencies.

### 🐍 Python
* **Outstanding Ergonomics**: Clear, readable syntax makes writing workflows as code feel natural and pleasant.
* **Rapid Prototyping**: Ideal for fast iterations, scripts, and startups.
* **AI & Agentic Ecosystem**: Python is the lingua franca of AI. NativeBPM's first-class `AITask` integrates beautifully with LangChain, LlamaIndex, and GenAI libraries.

### ⚡ TypeScript / JavaScript
* **Universal Reach**: Integrates natively with Node.js microservices, Edge runtimes, and frontend dashboards.
* **Asynchronous Mastery**: Fits perfectly within the JS async/await event-loop model for event-driven workflows.
* **Type Safety**: Full TypeScript typings for all REST APIs and workflow builders ensure autocomplete and compile-time correctness.

### ☕ Java
* **Enterprise Powerhouse**: Perfect for robust, long-running enterprise applications and high-throughput systems.
* **Strict Type Safety**: Protects complex orchestrations with Java's mature object-oriented compiler.
* **Familiar Migration**: Provides a modern, cloud-native migration path for legacy BPM (e.g. Camunda, Activiti) architectures.

### 💎 .NET (C#)
* **High Performance**: Native asynchronous tasks (`async/await`) and Linq integrations make backend execution extremely performant.
* **Premium Tooling**: Integrates natively with Visual Studio and the modern .NET Core / ASP.NET ecosystem.
* **Robust Enterprise Layout**: Type-safe client configurations and dependency injection patterns match enterprise architecture standards.

### 🐘 PHP
* **Web Native**: Perfect for PHP-centric applications, frameworks (like Laravel), and rapid-delivery web backends.
* **Simple Execution Model**: The straightforward, request-lifecycle PHP model makes queuing background tasks and invoking workflows highly intuitive.
* **Easy Integration**: Perfect for transactional backends that need process orchestration without complex microservice overhead.

### 🦀 Rust
* **Maximum Performance**: Zero runtime cost and zero-garbage-collector execution for absolute memory safety and speed.
* **Direct WASM Synergy**: Rust compiles to and interacts with WASM runtimes (like Wasmtime) with the highest possible efficiency.
* **Bulletproof Safety**: The compiler enforces strict ownership rules, preventing runtime data races in distributed workers.

### 🚀 Kotlin (Android / JVM)
* **Mobile & Backend Ready**: Native Kotlin REST client, perfect for Android apps, backend microservices, or Kotlin Multiplatform projects.
* **Modern Concurrency**: Built with OkHttp and coroutines compatibility for lightweight asynchronous requests.
* **Clean Syntax**: Elegant Kotlin properties and builders that map directly to the platform API.

### 🍎 Swift (iOS / macOS)
* **Native Apple Integration**: Native Swift implementation using URLSession and modern async/await for smooth integration into iOS, macOS, or watchOS apps.
* **Strict Type Safety**: Fully compatible with Swift Codable schemas and AnyCodable variables, avoiding JSON deserialization issues.
* **Lightweight Bundle**: REST-only client, avoiding WebAssembly and runtime overhead to keep your mobile application binary size tiny.

---

## 🤖 AI Service Task Integration (`aiServiceTask`)

To facilitate seamless AI and LLM orchestration without breaking BPMN 2.0 standards:
* Every client SDK provides a fluent `.AITask(...)` (or `.ai()`) helper.
* Under the hood, this compiles into a standard BPMN `<serviceTask>` element with the type `"aiServiceTask"` and topic `"ai_assistant"`.
* System instructions, prompts, and target schemas are automatically serialized into `<extensionElements>` (matching standard Camunda input/output structures).
* This keeps your process schemas fully compatible with standard BPMN 2.0 visual modelers while giving your developers a clean, type-safe API wrapper.

---

## 📝 License

This project is licensed under the terms of the **Unlicense** (see individual directories for details).
