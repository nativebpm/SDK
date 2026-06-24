[← Назад к корню платформы](../../README_ru.md)

# NativeBPM PHP SDK

Официальный PHP Client SDK для облачного движка NativeBPM. Использует `Guzzle` в качестве PSR-18-совместимого HTTP-транспорта.

## Установка

Добавьте зависимость от пакета в файл `composer.json` вашего PHP-проекта или установите его через Composer:

```bash
composer install
```

## Конфигурация Composer

Поскольку этот SDK структурирован внутри подпапки (`sdk/php/`), его нельзя напрямую опубликовать в стандартные реестры пакетов. Вместо этого вы можете безопасно импортировать его, используя тип репозитория `package` в Composer, указывая непосредственно на тег Git-репозитория:

```json
{
    "repositories": [
        {
            "type": "package",
            "package": {
                "name": "nativebpm/client",
                "version": "1.0.0",
                "source": {
                    "url": "https://gitlab.com/nativebpm/sdk.git",
                    "type": "git",
                    "reference": "sdk/php/v1.0.0"
                },
                "autoload": {
                    "psr-4": { "NativeBPM\\Client\\": "sdk/php/lib/" }
                }
            }
        }
    ],
    "require": {
        "nativebpm/client": "1.0.0"
    }
}
```

Если репозиторий GitLab является приватным, вам также потребуется настроить учетные данные в `auth.json`:
```json
{
    "gitlab-token": {
        "gitlab.com": "your_personal_access_or_deploy_token"
    }
}
```

## Пример использования

Инициализируйте конфигурацию, добавьте заголовок авторизации Bearer-токена и отправляйте запросы:

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');

use NativeBPM\Client\Configuration;
use NativeBPM\Client\Api\DefaultApi;
use NativeBPM\Client\Model\StartInstanceRequest;

// 1. Настройка API-клиента
$config = Configuration::getDefaultConfiguration()
    ->setHost('http://localhost:8080')
    ->setApiKey('Authorization', 'your-api-token')
    ->setApiKeyPrefix('Authorization', 'Bearer');

$apiInstance = new DefaultApi(
    new GuzzleHttp\Client(),
    $config
);

try {
    // 2. Получение списка развернутых определений процессов
    $definitions = $apiInstance->listDefinitions();
    foreach ($definitions as $def) {
        echo "Definition: " . $def->getName() . " (ID: " . $def->getId() . ")\n";
    }

    // 3. Запуск инстанса процесса с переменными
    $startRequest = new StartInstanceRequest([
        'business_key' => 'REQ-4402',
        'variables' => [
            'approved' => true,
            'amount' => 5000
        ]
    ]);

    $instance = $apiInstance->startInstance('expense-approval', $startRequest);
    echo "Started process instance: " . $instance->getId() . "\n";

} catch (Exception $e) {
    echo 'Exception when calling API: ', $e->getMessage(), PHP_EOL;
}
?>
```

## Workflow-as-Code (Описание процессов на PHP)

PHP SDK поддерживает Fluent API для декларативного описания бизнес-процессов непосредственно в коде:

```php
use NativeBPM\Client\Builder\Workflow;

// Декларативное описание процесса
$workflow = new Workflow("awesome-php-process", "Awesome PHP Process");
$workflow->when(Workflow::V('isPremium')->eq(true))->then(function($b) {
        $b->user("vipService", "VIP Customer Support", ["assignee" => "vip_manager"]);
    })
    ->else(function($b) {
        $b->service("standardNotify", "Send Regular Notification", "notification_topic");
    });

// Развертывание процесса
$definition = $apiInstance->deployWorkflow($workflow);
```

## Руководство для разработчиков: Выпуск версий и тегирование


Поскольку данный SDK находится в подпапке (`sdk/php/`), он не публикуется в реестры пакетов. Вместо этого просто установите тег в репозитории для выпуска новых версий:

```bash
git tag sdk/php/v1.0.0
git push origin sdk/php/v1.0.0
```

Потребители могут затем загрузить эту конкретную версию напрямую из Git с помощью настройки репозитория `package` в Composer.
