[← Назад к корню платформы](../../README_ru.md)

# NativeBPM Java SDK

Официальный Java Client SDK для облачного движка NativeBPM. Построен на базе библиотеки HTTP-клиента `okhttp-gson`.

## Установка и сборка

Для локальной компиляции SDK и его установки в ваш локальный репозиторий Maven (`~/.m2`):

```bash
mvn clean install
```

Или с использованием Gradle:

```bash
./gradlew build
```

## Конфигурация зависимостей

Чтобы использовать пакет из GitLab Maven Package Registry, добавьте конфигурацию репозитория в файл сборки проекта:

**Maven (`pom.xml`)**:
```xml
<repositories>
    <repository>
        <id>gitlab-maven</id>
        <url>https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/maven</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.nativebpm</groupId>
        <artifactId>nativebpm-java-client</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

**Gradle (`build.gradle`)**:
```groovy
repositories {
    maven {
        url "https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/maven"
    }
}

dependencies {
    implementation 'com.nativebpm:nativebpm-java-client:1.0.0'
}
```

## Пример использования

Импортируйте Java-классы из пространства имен пакета `com.nativebpm.client`:

```java
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.api.DefaultApi;
import com.nativebpm.client.model.ProcessDefinition;
import com.nativebpm.client.model.ProcessInstance;
import com.nativebpm.client.model.StartInstanceRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // Инициализация и настройка ApiClient
        ApiClient client = Configuration.getDefaultApiClient();
        client.setBasePath("http://localhost:8080");

        // Установка заголовка авторизации Bearer-токена
        client.addDefaultHeader("Authorization", "Bearer your-api-token");

        DefaultApi apiInstance = new DefaultApi(client);

        try {
            // 1. Получение списка активных дефиниций процессов
            List<ProcessDefinition> definitions = apiInstance.listDefinitions();
            for (ProcessDefinition def : definitions) {
                System.out.println("Definition: " + def.getName() + " (ID: " + def.getId() + ")");
            }

            // 2. Запуск инстанса процесса
            StartInstanceRequest startRequest = new StartInstanceRequest();
            startRequest.setBusinessKey("REQ-2201");
            
            Map<String, Object> variables = new HashMap<>();
            variables.put("approved", true);
            startRequest.setVariables(variables);

            ProcessInstance instance = apiInstance.startInstance("expense-process", startRequest);
            System.out.println("Started instance: " + instance.getId());

        } catch (ApiException e) {
            System.err.println("API error code: " + e.getCode());
            System.err.println("API error body: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

## Workflow-as-Code (Описание процессов на Java)

Java SDK предоставляет Fluent API для декларативного описания бизнес-процессов непосредственно в исходном коде:

```java
import com.nativebpm.client.builder.Workflow;
import static com.nativebpm.client.builder.Workflow.V;

// Декларативное описание процесса
Workflow workflow = new Workflow("awesome-java-process", "Awesome Java Process");
workflow
    .when(V("isPremium").eq(true)).then(b -> {
        b.user("vipService", "VIP Customer Support", ut -> {
            ut.assignee("vip_manager");
        });
    })
    .Else(b -> {
        b.service("standardNotify", "Send Regular Notification", "notification_topic");
    });
```

## Руководство для разработчиков: Публикация в GitLab Package Registry


### Автоматическая публикация через CI/CD
Этот пакет автоматически собирается, версионируется и публикуется в GitLab Maven Package Registry при каждом пуше git-тега, соответствующего шаблону `sdk/java/v*`. Например:
```bash
git tag sdk/java/v1.0.0
git push origin sdk/java/v1.0.0
```

### Ручная публикация
Для публикации релиза вручную:
1. Настройте локальный файл `~/.m2/settings.xml` для авторизации в GitLab:
   ```xml
   <settings>
     <servers>
       <server>
         <id>gitlab-maven</id>
         <configuration>
           <httpHeaders>
             <property>
               <name>Private-Token</name>
               <!-- Или Deploy-Token -->
               <value>your_personal_access_or_deploy_token</value>
             </property>
           </httpHeaders>
         </configuration>
       </server>
     </servers>
   </settings>
   ```
2. Выполните установку версии и деплой Maven:
   ```bash
   mvn versions:set -DnewVersion=1.0.0
   mvn deploy -DskipTests
   ```
