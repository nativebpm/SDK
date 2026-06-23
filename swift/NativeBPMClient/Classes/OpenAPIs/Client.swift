import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public class Client {
    public let baseURL: String
    public let apiToken: String

    public init(baseURL: String, apiToken: String) {
        self.baseURL = baseURL.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        self.apiToken = apiToken
        
        // Configure global API settings
        NativeBPMClientAPI.basePath = self.baseURL
        NativeBPMClientAPI.customHeaders = [
            "Authorization": "Bearer \(apiToken)"
        ]
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func deploy(_ workflow: Workflow) async throws -> ProcessDefinition {
        return try await definitions().deploy().withWorkflow(workflow).send()
    }

    public func definitions() -> DefinitionsService {
        return DefinitionsService(client: self)
    }

    public func instances() -> InstancesService {
        return InstancesService(client: self)
    }

    public func tasks() -> TasksService {
        return TasksService(client: self)
    }
}

public class DefinitionsService {
    private let client: Client
    
    public init(client: Client) {
        self.client = client
    }

    public func deploy() -> DeployDefinitionBuilder {
        return DeployDefinitionBuilder(client: client)
    }
}

public class DeployDefinitionBuilder {
    private let client: Client
    private var id: String?
    private var name: String?
    private var bpmnXML: Data?
    private var workflow: Workflow?

    public init(client: Client) {
        self.client = client
    }

    public func withID(_ id: String) -> Self {
        self.id = id
        return self
    }

    public func withName(_ name: String) -> Self {
        self.name = name
        return self
    }

    public func withBPMN(_ xml: String) -> Self {
        self.bpmnXML = xml.data(using: .utf8)
        return self
    }

    public func withBPMN(_ xmlData: Data) -> Self {
        self.bpmnXML = xmlData
        return self
    }

    public func withWorkflow(_ workflow: Workflow) -> Self {
        self.workflow = workflow
        return self
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func send() async throws -> ProcessDefinition {
        if let currentWorkflow = workflow {
            guard let jsonData = currentWorkflow.toJSONData() else {
                throw NSError(domain: "NativeBPMClient", code: 400, userInfo: [NSLocalizedDescriptionKey: "Failed to serialize workflow to JSON"])
            }

            let url = URL(string: "\(client.baseURL)/api/deploy")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("application/json", forHTTPHeaderField: "Accept")
            request.setValue("Bearer \(client.apiToken)", forHTTPHeaderField: "Authorization")
            request.httpBody = jsonData

            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw NSError(domain: "NativeBPMClient", code: 500, userInfo: [NSLocalizedDescriptionKey: "Invalid server response"])
            }

            if httpResponse.statusCode >= 300 {
                let errorMsg = String(data: data, encoding: .utf8) ?? "Unknown HTTP \(httpResponse.statusCode) error"
                throw NSError(domain: "NativeBPMClient", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: errorMsg])
            }

            let decoder = CodableHelper.jsonDecoder
            return try decoder.decode(ProcessDefinition.self, from: data)
        }

        guard let currentId = id else {
            throw NSError(domain: "NativeBPMClient", code: 400, userInfo: [NSLocalizedDescriptionKey: "missing deployment field: ID"])
        }
        guard let currentName = name else {
            throw NSError(domain: "NativeBPMClient", code: 400, userInfo: [NSLocalizedDescriptionKey: "missing deployment field: Name"])
        }
        guard let xmlData = bpmnXML else {
            throw NSError(domain: "NativeBPMClient", code: 400, userInfo: [NSLocalizedDescriptionKey: "missing deployment field: BPMN XML data"])
        }

        let boundary = "Boundary-\(UUID().uuidString)"
        var body = Data()

        // Append ID field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"id\"\r\n\r\n".data(using: .utf8)!)
        body.append("\(currentId)\r\n".data(using: .utf8)!)

        // Append Name field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"name\"\r\n\r\n".data(using: .utf8)!)
        body.append("\(currentName)\r\n".data(using: .utf8)!)

        // Append File field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(currentName).bpmn\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: application/xml\r\n\r\n".data(using: .utf8)!)
        body.append(xmlData)
        body.append("\r\n".data(using: .utf8)!)

        body.append("--\(boundary)--\r\n".data(using: .utf8)!)

        let url = URL(string: "\(client.baseURL)/api/deploy")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Bearer \(client.apiToken)", forHTTPHeaderField: "Authorization")
        request.httpBody = body

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NSError(domain: "NativeBPMClient", code: 500, userInfo: [NSLocalizedDescriptionKey: "Invalid server response"])
        }

        if httpResponse.statusCode >= 300 {
            let errorMsg = String(data: data, encoding: .utf8) ?? "Unknown HTTP \(httpResponse.statusCode) error"
            throw NSError(domain: "NativeBPMClient", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: errorMsg])
        }

        let decoder = CodableHelper.jsonDecoder
        return try decoder.decode(ProcessDefinition.self, from: data)
    }
}

public class InstancesService {
    private let client: Client

    public init(client: Client) {
        self.client = client
    }

    public func start(_ definitionID: String) -> StartInstanceBuilder {
        return StartInstanceBuilder(client: client, definitionID: definitionID)
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func getVisualization(_ instanceID: String) async throws -> VisualizationData {
        return try await DefaultAPI.getInstanceVisualization(id: instanceID)
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func getVisualizationHTML(_ instanceID: String) async throws -> String {
        return try await DefaultAPI.getInstanceVisualizationWidget(id: instanceID)
    }
}

public class StartInstanceBuilder {
    private let client: Client
    private let definitionID: String
    private var businessKey: String?
    private var variables: [String: AnyCodable] = [:]

    public init(client: Client, definitionID: String) {
        self.client = client
        self.definitionID = definitionID
    }

    public func withBusinessKey(_ key: String) -> Self {
        self.businessKey = key
        return self
    }

    public func withVariable(_ name: String, _ value: AnyCodable) -> Self {
        self.variables[name] = value
        return self
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func send() async throws -> ProcessInstance {
        let request = StartInstanceRequest(
            instanceId: nil,
            businessKey: businessKey,
            variables: variables
        )
        return try await DefaultAPI.startInstance(id: definitionID, startInstanceRequest: request)
    }
}

public class TasksService {
    private let client: Client

    public init(client: Client) {
        self.client = client
    }

    public func list() -> ListTasksBuilder {
        return ListTasksBuilder(client: client)
    }

    public func claim(_ taskID: String) -> ClaimTaskBuilder {
        return ClaimTaskBuilder(client: client, taskID: taskID)
    }

    public func complete(_ taskID: String) -> CompleteTaskBuilder {
        return CompleteTaskBuilder(client: client, taskID: taskID)
    }
}

public class ListTasksBuilder {
    private let client: Client
    private var assignee: String?
    private var candidateGroup: String?
    private var status: String?

    public init(client: Client) {
        self.client = client
    }

    public func withAssignee(_ assignee: String) -> Self {
        self.assignee = assignee
        return self
    }

    public func withCandidateGroup(_ candidateGroup: String) -> Self {
        self.candidateGroup = candidateGroup
        return self
    }

    public func withStatus(_ status: String) -> Self {
        self.status = status
        return self
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func send() async throws -> [TaskRecord] {
        var mappedStatus: DefaultAPI.Status_listTasks? = nil
        if let currentStatus = status {
            mappedStatus = DefaultAPI.Status_listTasks(rawValue: currentStatus)
        }
        return try await DefaultAPI.listTasks(assignee: assignee, candidateGroup: candidateGroup, status: mappedStatus)
    }
}

public class ClaimTaskBuilder {
    private let client: Client
    private let taskID: String
    private var assignee: String?

    public init(client: Client, taskID: String) {
        self.client = client
        self.taskID = taskID
    }

    public func withAssignee(_ assignee: String) -> Self {
        self.assignee = assignee
        return self
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func send() async throws -> TaskRecord {
        guard let currentAssignee = assignee else {
            throw NSError(domain: "NativeBPMClient", code: 400, userInfo: [NSLocalizedDescriptionKey: "Assignee is required to claim a task"])
        }
        let request = ClaimTaskRequest(assignee: currentAssignee)
        return try await DefaultAPI.claimTask(id: taskID, claimTaskRequest: request)
    }
}

public class CompleteTaskBuilder {
    private let client: Client
    private let taskID: String
    private var variables: [String: AnyCodable] = [:]

    public init(client: Client, taskID: String) {
        self.client = client
        self.taskID = taskID
    }

    public func withVariable(_ name: String, _ value: AnyCodable) -> Self {
        self.variables[name] = value
        return self
    }

    @available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
    public func send() async throws {
        let request = CompleteTaskRequest(variables: variables)
        _ = try await DefaultAPI.completeTask(id: taskID, completeTaskRequest: request)
    }
}
