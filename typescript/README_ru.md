[← Назад к корню платформы](../../README_ru.md)

# NativeBPM TypeScript SDK

Официальный TypeScript Client SDK для облачного движка NativeBPM.

## Установка

Чтобы установить пакет из GitLab npm Package Registry:

1. Настройте ваш файл `.npmrc` (если репозиторий требует авторизации, укажите ваш токен, иначе публичный доступ открыт для чтения):
```text
@nativebpm:registry=https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/
//gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/:_authToken="your_gitlab_token"
```

2. Установите зависимость:
```bash
npm install @nativebpm/sdk
```

Для локальной разработки и компиляции:

```bash
npm install
npm run build
```

## Запуск тестов

Для локального запуска unit-тестов TypeScript:

```bash
npm test
```

## Пример использования

TypeScript SDK предоставляет Fluent API интерфейс клиента. Он использует встроенный `fetch` под капотом и полностью совместим с Node.js 18+, Edge-средами и браузерами.

```typescript
import { Client } from "@nativebpm/sdk";

// Инициализация клиента
const client = new Client("http://localhost:8080", "your-api-token");

// 1. Получение списка дефиниций процессов
const definitions = await client.definitions().list().send();
for (const d of definitions) {
    console.log(`Definition: ${d.name} (ID: ${d.id})`);
}

// 2. Запуск нового инстанса процесса
const variables = { approvalRequired: true, department: "Finance" };
const instance = await client.instances()
    .start("purchase-requisition")
    .businessKey("REQ-9901")
    .variables(variables)
    .send();

console.log(`Started process instance: ${instance.id}`);
```

## Workflow-as-Code (Описание процессов в коде)

Вы можете описывать бизнес-процессы непосредственно в TypeScript-коде:

```typescript
import { Workflow, v } from "@nativebpm/sdk";

// Описание процесса
const workflow = new Workflow('awesome-ts-process', 'Awesome TS Process');
workflow
  .when(v('isPremium').eq(true))
  .then(flow => {
    flow.user('vipService', 'VIP Customer Support', { assignee: 'vip_manager' });
  })
  .else(flow => {
    flow.service('standardNotify', 'Send Regular Notification', 'notification_topic');
  });

// Развертывание процесса
const definition = await client.deploy(workflow);
```


## Руководство для разработчиков: Публикация в GitLab Package Registry

### Автоматическая публикация через CI/CD
Этот пакет автоматически собирается и публикуется в GitLab npm Package Registry при каждом пуше git-тега, соответствующего шаблону `sdk/typescript/v*`. Например:
```bash
git tag sdk/typescript/v1.0.0
git push origin sdk/typescript/v1.0.0
```

### Ручная публикация
Для публикации релиза вручную:
1. Увеличьте версию в `package.json` или запустите `npm version`:
   ```bash
   npm version 1.0.0 --no-git-tag-version
   ```
2. Настройте аутентификацию и опубликуйте пакет:
   ```bash
   npm config set @nativebpm:registry https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/
   npm config set -- //gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/:_authToken your_personal_access_or_deploy_token
   npm publish
   ```
