package com.nativebpm.client

import com.nativebpm.client.apis.DefaultApi
import com.nativebpm.client.infrastructure.Serializer
import com.nativebpm.client.models.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class Client(val baseUrl: String, val apiToken: String) {
    val defaultApi: DefaultApi
    val okHttpClient: OkHttpClient

    init {
        okHttpClient = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .header("Authorization", "Bearer $apiToken")
                    .build()
                chain.proceed(request)
            }
            .build()

        defaultApi = DefaultApi(baseUrl, okHttpClient)
    }

    fun deploy(workflow: com.nativebpm.client.builder.Workflow): ProcessDefinition {
        return definitions().deploy().withWorkflow(workflow).send()
    }

    fun definitions(): DefinitionsService {
        return DefinitionsService(this)
    }

    fun instances(): InstancesService {
        return InstancesService(this)
    }

    fun tasks(): TasksService {
        return TasksService(this)
    }
}

class DefinitionsService(private val client: Client) {
    fun deploy(): DeployDefinitionBuilder {
        return DeployDefinitionBuilder(client)
    }
}

class DeployDefinitionBuilder(private val client: Client) {
    private var id: String? = null
    private var name: String? = null
    private var bpmnXml: ByteArray? = null
    private var workflow: com.nativebpm.client.builder.Workflow? = null

    fun withID(id: String): DeployDefinitionBuilder {
        this.id = id
        return this
    }

    fun withName(name: String): DeployDefinitionBuilder {
        this.name = name
        return this
    }

    fun withBPMN(xml: String): DeployDefinitionBuilder {
        this.bpmnXml = xml.toByteArray(Charsets.UTF_8)
        return this
    }

    fun withBPMN(xmlBytes: ByteArray): DeployDefinitionBuilder {
        this.bpmnXml = xmlBytes
        return this
    }

    fun withWorkflow(workflow: com.nativebpm.client.builder.Workflow): DeployDefinitionBuilder {
        this.workflow = workflow
        return this
    }

    fun send(): ProcessDefinition {
        val workflowInstance = workflow
        if (workflowInstance != null) {
            val jsonAst = workflowInstance.toJSON()
            val mediaType = "application/json".toMediaTypeOrNull()
            val requestBody = jsonAst.toRequestBody(mediaType)
            val request = Request.Builder()
                .url("${client.baseUrl.trimEnd('/')}/api/deploy")
                .post(requestBody)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .build()

            client.okHttpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    throw IOException("Failed to deploy definition: ${response.body?.string()}")
                }
                val bodyString = response.body?.string() ?: throw IOException("Empty response body")
                return Serializer.moshi.adapter(ProcessDefinition::class.java).fromJson(bodyString)
                    ?: throw IOException("Failed to parse deployment response")
            }
        }

        val currentId = id ?: throw IllegalArgumentException("missing deployment field: ID")
        val currentName = name ?: throw IllegalArgumentException("missing deployment field: Name")
        val xmlData = bpmnXml ?: throw IllegalArgumentException("missing deployment field: BPMN XML data")

        val filePart = MultipartBody.Part.createFormData(
            "file",
            "$currentName.bpmn",
            xmlData.toRequestBody(MultipartBody.FORM)
        )

        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("id", currentId)
            .addFormDataPart("name", currentName)
            .addPart(filePart)
            .build()

        val request = Request.Builder()
            .url("${client.baseUrl.trimEnd('/')}/api/deploy")
            .post(requestBody)
            .header("Accept", "application/json")
            .build()

        client.okHttpClient.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IOException("Failed to deploy definition: ${response.body?.string()}")
            }
            val bodyString = response.body?.string() ?: throw IOException("Empty response body")
            return Serializer.moshi.adapter(ProcessDefinition::class.java).fromJson(bodyString)
                ?: throw IOException("Failed to parse deployment response")
        }
    }
}

class InstancesService(private val client: Client) {
    fun start(definitionId: String): StartInstanceBuilder {
        return StartInstanceBuilder(client, definitionId)
    }

    fun getVisualization(instanceId: String): VisualizationData {
        return client.defaultApi.getInstanceVisualization(instanceId)
    }

    fun getVisualizationHTML(instanceId: String): String {
        return client.defaultApi.getInstanceVisualizationWidget(instanceId)
    }
}

class StartInstanceBuilder(private val client: Client, private val definitionId: String) {
    private var businessKey: String? = null
    private val variables = mutableMapOf<String, Any>()

    fun withBusinessKey(key: String): StartInstanceBuilder {
        this.businessKey = key
        return this
    }

    fun withVariable(name: String, value: Any): StartInstanceBuilder {
        this.variables[name] = value
        return this
    }

    fun send(): ProcessInstance {
        val request = StartInstanceRequest(
            instanceId = null,
            businessKey = businessKey,
            variables = variables
        )
        return client.defaultApi.startInstance(definitionId, request)
    }
}

class TasksService(private val client: Client) {
    fun list(): ListTasksBuilder {
        return ListTasksBuilder(client)
    }

    fun claim(taskId: String): ClaimTaskBuilder {
        return ClaimTaskBuilder(client, taskId)
    }

    fun complete(taskId: String): CompleteTaskBuilder {
        return CompleteTaskBuilder(client, taskId)
    }
}

class ListTasksBuilder(private val client: Client) {
    private var assignee: String? = null
    private var candidateGroup: String? = null
    private var status: String? = null

    fun withAssignee(assignee: String): ListTasksBuilder {
        this.assignee = assignee
        return this
    }

    fun withCandidateGroup(candidateGroup: String): ListTasksBuilder {
        this.candidateGroup = candidateGroup
        return this
    }

    fun withStatus(status: String): ListTasksBuilder {
        this.status = status
        return this
    }

    fun send(): List<TaskRecord> {
        val mappedStatus = status?.let {
            DefaultApi.StatusListTasks.values().firstOrNull { enumVal ->
                enumVal.value.equals(it, ignoreCase = true)
            }
        }
        return client.defaultApi.listTasks(assignee, candidateGroup, mappedStatus)
    }
}

class ClaimTaskBuilder(private val client: Client, private val taskId: String) {
    private var assignee: String? = null

    fun withAssignee(assignee: String): ClaimTaskBuilder {
        this.assignee = assignee
        return this
    }

    fun send(): TaskRecord {
        val currentAssignee = assignee ?: throw IllegalArgumentException("Assignee is required to claim a task")
        val request = ClaimTaskRequest(assignee = currentAssignee)
        return client.defaultApi.claimTask(taskId, request)
    }
}

class CompleteTaskBuilder(private val client: Client, private val taskId: String) {
    private val variables = mutableMapOf<String, Any>()

    fun withVariable(name: String, value: Any): CompleteTaskBuilder {
        this.variables[name] = value
        return this
    }

    fun send() {
        val request = CompleteTaskRequest(variables = variables)
        client.defaultApi.completeTask(taskId, request)
    }
}
