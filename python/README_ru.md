[← Назад к корню платформы](../../README_ru.md)

# NativeBPM Python SDK

Официальный Python Client SDK для облачного движка NativeBPM.

## Установка

Чтобы установить пакет из публичного реестра GitLab PyPI Package Registry:

```bash
pip install nativebpm-client --extra-index-url https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/pypi/simple
```

Для локальной разработки:

```bash
pip install -e .
```

## Запуск тестов

Для локального запуска тестов Python SDK:

```bash
# Убедитесь, что установлен pytest
pip install pytest pytest-asyncio
pytest
```

## Пример использования

Python SDK содержит полностью типизированную обертку Fluent API вокруг моделей данных Pydantic V2.

```python
from nativebpm import Client

# Инициализация клиента
client = Client(base_url="http://localhost:8080", api_token="your-api-token")

# 1. Получение списка развернутых определений процессов
definitions = client.definitions().list().send()
for d in definitions:
    print(f"Process: {d.name} (ID: {d.id})")

# 2. Запуск нового инстанса процесса с бизнес-ключом и переменными
variables = {"priority": "high", "amount": 1200}
instance = (
    client.instances()
    .start("order-processing")
    .business_key("ORD-4501")
    .variables(variables)
    .send()
)
print(f"Started instance: {instance.id}")
```

## Workflow-as-Code (Описание процессов на Python)

Вы можете описывать логику ваших бизнес-процессов на чистом Python:

```python
from nativebpm import Workflow, V

# Описание процесса
workflow = Workflow("awesome-python-process", "Awesome Python Process")
workflow.when(V("isPremium").eq(True)).then(
    lambda flow: flow.user("vipService", "VIP Customer Support", assignee="vip_manager")
).Else(
    lambda flow: flow.service("standardNotify", "Send Regular Notification", "notification_topic")
)

# Развертывание процесса на движке
definition = client.deploy(workflow)
```


## Запуск внешнего воркера (External Worker)

В папке `examples` находится готовый пример долгоживущего процесса-воркера, который опрашивает NativeBPM на наличие задач, закрепленных за ним (например, ИИ-расчеты или квантовое возмущение), берет их в работу и завершает:

```bash
python examples/python_worker.py
```

## Руководство для разработчиков: Публикация в GitLab Package Registry

### Автоматическая публикация через CI/CD
Этот пакет автоматически собирается и публикуется в GitLab Package Registry при каждом пуше git-тега, соответствующего шаблону `sdk/python/v*`. Например:
```bash
git tag sdk/python/v1.0.0
git push origin sdk/python/v1.0.0
```

### Ручная публикация
Для публикации релиза вручную:
1. Выполните сборку:
   ```bash
   pip install build twine
   python -m build
   ```
2. Загрузите собранные пакеты с помощью Twine:
   - **Используя личный токен доступа (Personal Access Token)**:
     ```bash
     twine upload --repository-url https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/pypi \
       -u your_gitlab_username \
       -p your_personal_access_token \
       dist/*
     ```
   - **Используя токен развертывания проекта (Deploy Token)**:
     ```bash
     twine upload --repository-url https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/pypi \
       -u gitlab+deploy-token-name \
       -p deploy_token_password \
       dist/*
     ```
