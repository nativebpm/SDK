[← Назад к корню платформы](../../README_ru.md)

# NativeBPM .NET SDK

Официальный .NET/C# Client SDK для облачного движка NativeBPM. Построен на базе `HttpClient` для современного асинхронного HTTP-транспорта.

## Сборка SDK

Для локальной компиляции проекта SDK:

```bash
dotnet build
```

Чтобы собрать SDK в пакет NuGet (`.nupkg`):

```bash
dotnet pack -c Release -o ./out
```

## Установка

Чтобы использовать пакет из GitLab NuGet Package Registry:

1. Добавьте источник NuGet (замените `<your_gitlab_token>` вашим токеном доступа, если требуется авторизация):
```bash
dotnet nuget add source "https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/nuget/index.json" \
  --name gitlab \
  --username gitlab-ci-token \
  --password your_personal_access_or_deploy_token \
  --store-password-in-clear-text
```

2. Добавьте зависимость в ваш проект:
```bash
dotnet add package NativeBPM.Client
```

## Пространства имен и импорты

Сгенерированные классы находятся в пространствах имен `NativeBPM.Client`:

```csharp
using NativeBPM.Client.Api;
using NativeBPM.Client.Client;
using NativeBPM.Client.Model;
```

## Пример использования

Инициализируйте конфигурацию и отправляйте запросы с использованием `IDefaultApi` из контейнера внедрения зависимостей:

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NativeBPM.Client.Api;
using NativeBPM.Client.Client;
using NativeBPM.Client.Extensions;
using NativeBPM.Client.Model;

class Program
{
    static async Task Main(string[] args)
    {
        var services = new ServiceCollection();

        // Регистрация API клиента
        services.AddApi(options =>
        {
            options.AddApiHttpClients(client =>
            {
                client.BaseAddress = new Uri("http://localhost:8080");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "your-api-token");
            });
        });

        var provider = services.BuildServiceProvider();
        var api = provider.GetRequiredService<IDefaultApi>();

        try
        {
            // 1. Получение списка развернутых определений процессов
            var definitionsResponse = await api.ListDefinitionsAsync();
            if (definitionsResponse.IsSuccessStatusCode && definitionsResponse.TryOk(out var definitions) && definitions != null)
            {
                foreach (var def in definitions)
                {
                    Console.WriteLine($"Definition: {def.Name} (ID: {def.Id})");
                }
            }

            // 2. Запуск нового инстанса процесса
            var startRequest = new StartInstanceRequest(
                instanceId: Guid.NewGuid(),
                businessKey: "REQ-8802",
                variables: new Dictionary<string, object>
                {
                    { "limit", 15000 },
                    { "escalate", false }
                }
            );

            var startResponse = await api.StartInstanceAsync("expense-claims-process", startRequest);
            if (startResponse.IsSuccessStatusCode && startResponse.TryOk(out var instance) && instance != null)

            {
                Console.WriteLine($"Started instance: {instance.Id}");
            }
        }
        catch (ApiException e)
        {
            Console.WriteLine($"API Error Code: {e.ErrorCode}");
            Console.WriteLine($"API Error Message: {e.Message}");
        }
    }
}
```

## Workflow-as-Code (Описание процессов на C#)

.NET SDK предоставляет Fluent API для декларативного описания бизнес-процессов:

```csharp
using NativeBPM.Client.Builder;
using static NativeBPM.Client.Builder.Workflow;

// Декларативное описание процесса
using var workflow = new Workflow("awesome-dotnet-process", "Awesome Dotnet Process");
workflow.Start()
    .When(V("isPremium").Eq(true)).Then(b => {
        b.User("vipService", "VIP Customer Support", new Dictionary<string, object> {
            { "assignee", "vip_manager" }
        });
    })
    .Else(b => {
        b.Service("standardNotify", "Send Regular Notification", "notification_topic");
    });
```

## Руководство для разработчиков: Публикация в GitLab Package Registry


### Автоматическая публикация через CI/CD
Этот пакет автоматически собирается, версионируется и публикуется в GitLab NuGet Package Registry при каждом пуше git-тега, соответствующего шаблону `sdk/dotnet/v*`. Например:
```bash
git tag sdk/dotnet/v1.0.0
git push origin sdk/dotnet/v1.0.0
```

### Ручная публикация
Для публикации релиза NuGet вручную:
1. Выполните сборку проекта локально с указанием версии релиза:
   ```bash
   dotnet pack -c Release -p:PackageVersion=1.0.0 -o out src/NativeBPM.Client/NativeBPM.Client.csproj
   ```
2. Добавьте источник GitLab NuGet и выполните push:
   ```bash
   dotnet nuget add source "https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/nuget/index.json" \
     --name gitlab \
     --username gitlab-ci-token \
     --password your_personal_access_or_deploy_token \
     --store-password-in-clear-text

   dotnet nuget push "out/*.nupkg" --source gitlab --api-key your_personal_access_or_deploy_token
   ```
