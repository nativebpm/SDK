[← Назад к корню платформы](../../README_ru.md)

# NativeBPM Go SDK

Официальный Go Client SDK для облачного движка NativeBPM.

## Установка

```bash
go get gitlab.com/nativebpm/sdk/go
```

## Запуск тестов

Для локального запуска тестов SDK выполните:

```bash
go test -v ./...
```

## Пример использования

Импортируйте SDK и используйте Fluent API для настройки и выполнения операций с процессами:

```go
package main

import (
	"context"
	"fmt"
	"log"

	"gitlab.com/nativebpm/sdk/go"
)

func main() {
	ctx := context.Background()

	// Инициализация Fluent-клиента
	client := nativebpm.NewClient("http://localhost:8080", "your-api-token")

	// Получение списка активных дефиниций процессов
	defs, err := client.Definitions().List().Send(ctx)
	if err != nil {
		log.Fatalf("failed to list definitions: %v", err)
	}

	for _, d := range defs {
		fmt.Printf("Definition: %s (ID: %s)\n", d.Name, d.Id)
	}

	// Запуск инстанса процесса с переменными
	vars := map[string]interface{}{
		"amount": 2500,
	}
	instance, err := client.Instances().
		Start("expense-approval-process").
		BusinessKey("EX-9002").
		Variables(vars).
		Send(ctx)
	if err != nil {
		log.Fatalf("failed to start instance: %v", err)
	}

	fmt.Printf("Started process instance: %s\n", instance.Id)
}
```

## Workflow-as-Code (Описание процессов на Go)

Вы можете описывать бизнес-процессы прямо в Go-коде, не создавая XML-файлы вручную.

```go
workflow := nativebpm.NewWorkflow("awesome-go-process", "Awesome Go Process")
workflow.
	When(nativebpm.V("isPremium").Eq(true)).
	Then(func(flow *nativebpm.Branch) {
		flow.User("vipService", "VIP Customer Support", nativebpm.M{"assignee": "vip_manager"})
	}).
	Else(func(flow *nativebpm.Branch) {
		flow.Service("standardNotify", "Send Regular Notification", "notification_topic")
	})

// Развертывание процесса на движке
definition, err := client.Deploy(ctx, workflow)
```

