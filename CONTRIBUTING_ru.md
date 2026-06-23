# Руководство по разработке и контрибьюту в клиентские SDK NativeBPM

Спасибо за интерес к участию в разработке клиентских SDK для NativeBPM! В этом репозитории собраны клиенты и Fluent API конструкторы для всех поддерживаемых языков программирования.

Пожалуйста, ознакомьтесь с этим руководством, чтобы понять архитектуру проекта, рабочий процесс генерации кода и стандарты разработки.

---

## 🏗️ Обзор архитектуры

SDK в данном монорепозитории используют двухслойную архитектуру, чтобы оставаться легковесными, единообразными и производительными во всех 10 поддерживаемых языках программирования:

1. **Низкоуровневые сгенерированные клиенты (единственный источник правды)**:
   * Строятся полностью на основе файла спецификации OpenAPI 3.0: [openapi.yaml](file:///Users/user/github.com/nativebpm/sdk/openapi.yaml).
   * Автоматически генерируются с помощью `openapi-generator-cli` внутри Docker-контейнера.
   * Отвечают за выполнение HTTP-запросов, маршрутизацию эндпоинтов, сериализацию/десериализацию данных и стандартные модели схем.
2. **Высокоуровневые Fluent API обертки (написанные вручную)**:
   * Удобные обертки, написанные вручную на каждом языке, для обеспечения безопасного типов, идиоматичного Fluent API (конструкторы цепочек методов, билдеры и воркеры).
   * Основные файлы оберток:
     - **Go**: [go/fluent_client.go](file:///Users/user/github.com/nativebpm/sdk/go/fluent_client.go)
     - **TypeScript**: [typescript/src/client.ts](file:///Users/user/github.com/nativebpm/sdk/typescript/src/client.ts)
     - **Python**: [python/nativebpm/client.py](file:///Users/user/github.com/nativebpm/sdk/python/nativebpm/client.py)
     - **Dart**: [dart/lib/src/client.dart](file:///Users/user/github.com/nativebpm/sdk/dart/lib/src/client.dart)
     - **Kotlin**: [kotlin/src/main/kotlin/com/nativebpm/client/Client.kt](file:///Users/user/github.com/nativebpm/sdk/kotlin/src/main/kotlin/com/nativebpm/client/Client.kt)
     - **Swift**: [swift/NativeBPMClient/Classes/OpenAPIs/Client.swift](file:///Users/user/github.com/nativebpm/sdk/swift/NativeBPMClient/Classes/OpenAPIs/Client.swift)

---

## 🛠️ Настройка окружения и предварительные требования

Перед началом внесения изменений убедитесь, что в вашей системе установлены:
* **Docker** (необходим для работы контейнера генерации кода)
* **Make** (утилита для сборки)
* Среды выполнения для языков программирования, которые вы планируете изменять или тестировать (например, Go, Node.js, Python, Flutter/Dart, Kotlin/Java, Swift/Xcode).

---

## 🔄 Пошаговый процесс изменения и добавления API

Для добавления новых функций или изменения существующих эндпоинтов API следуйте этой последовательности шагов:

### Шаг 1: Обновление спецификации OpenAPI
* Отредактируйте центральный файл контракта: [openapi.yaml](file:///Users/user/github.com/nativebpm/sdk/openapi.yaml).
* Опишите новые пути (paths), HTTP-методы, параметры запросов, тела запросов и схемы ответов.
* Используйте понятные описания и обязательно указывайте корректный `operationId` (он сопоставляется с именами генерируемых методов клиента).

### Шаг 2: Регенерация кода клиентов
Запустите генератор кода для обновления низкоуровневых HTTP-клиентов:
```bash
# Регенерация базового кода для всех 10 языков
make generate
```
Если вы хотите сгенерировать код только для конкретного языка, выполните соответствующую команду:
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

### Шаг 3: Реализация Fluent API оберток (wrappers)
После завершения генерации обновите написанные вручную обертки клиентов. Эти обертки должны вызывать новые низкоуровневые методы API, предоставляя конечным разработчикам удобный интерфейс:
* Go обертка: Добавьте новые методы или свойства билдеров в `fluent_client.go`.
* TypeScript обертка: Обновите `client.ts`.
* Python обертка: Обновите `client.py`.
* Dart, Kotlin, Swift обертки: Добавьте новые методы в основные классы.

---

## 🧪 Тестирование и проверка

Всегда проверяйте компиляцию кода и запускайте тесты в директориях измененных языков:

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

## 📝 Правила оформления пулл-реквестов (Pull Requests)

1. **Единообразие**: Следите за тем, чтобы имена методов, структуры опций и поведение совпадали во всех обертках для 10 языков.
2. **Не редактируйте сгенерированные файлы вручную**: Любые изменения в файлах, помеченных аннотацией `@Generated` или расположенных в сгенерированных папках (например, `typescript/src/api`), будут стерты при следующей генерации. Всегда редактируйте `openapi.yaml` и запускайте генерацию заново.
3. **Пишите тесты**: Предоставляйте юнит-тесты для новых методов билдера и функций клиента.
4. **Обновляйте документацию**: Обновите README-файлы в соответствующих подпапках языков, если изменились требования к установке или базовые примеры использования.
