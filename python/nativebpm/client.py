import requests
import threading
from typing import Any, Callable, Dict, List, Optional
from nativebpm_client.models import (
    ProcessDefinition,
    ProcessInstance,
    HistoryRecord,
    IncidentRecord,
    TaskRecord,
    WebhookRecord,
    WebhookDeliveryRecord,
    StartInstanceRequest,
    CompleteInstanceTaskRequest,
    CreateWebhookRequest,
    VisualizationData,
)

class Client:
    def __init__(self, base_url: str, api_token: str):
        self._base_url = base_url.rstrip('/')
        self._api_token = api_token
        self._headers = {
            'Authorization': f'Bearer {self._api_token}'
        }

    def deploy(self, workflow: Any) -> ProcessDefinition:
        return self.definitions().deploy().with_workflow(workflow).send()

    def definitions(self) -> 'DefinitionsService':
        return DefinitionsService(self)

    def instances(self) -> 'InstancesService':
        return InstancesService(self)

    def tasks(self) -> 'TasksService':
        return TasksService(self)

    def webhooks(self) -> 'WebhooksService':
        return WebhooksService(self)


class DefinitionsService:
    def __init__(self, client: Client):
        self.client = client

    def list(self) -> 'ListDefinitionsBuilder':
        return ListDefinitionsBuilder(self)

    def deploy(self) -> 'DeployDefinitionBuilder':
        return DeployDefinitionBuilder(self)


class ListDefinitionsBuilder:
    def __init__(self, service: DefinitionsService):
        self.service = service

    def send(self) -> List[ProcessDefinition]:
        url = f'{self.service.client._base_url}/api/definitions'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to list definitions: {resp.text}")
        return [ProcessDefinition.model_validate(x) for x in resp.json()]


class DeployDefinitionBuilder:
    def __init__(self, service: DefinitionsService):
        self.service = service
        self._id = None
        self._name = None
        self._bpmn_xml = None
        self._workflow = None

    def with_id(self, id_val: str) -> 'DeployDefinitionBuilder':
        self._id = id_val
        return self

    def with_name(self, name_val: str) -> 'DeployDefinitionBuilder':
        self._name = name_val
        return self

    def with_bpmn(self, bpmn_val: Any) -> 'DeployDefinitionBuilder':
        if isinstance(bpmn_val, str):
            self._bpmn_xml = bpmn_val.encode('utf-8')
        else:
            self._bpmn_xml = bpmn_val
        return self

    def with_workflow(self, workflow_val: Any) -> 'DeployDefinitionBuilder':
        self._workflow = workflow_val
        return self

    def send(self) -> ProcessDefinition:
        url = f'{self.service.client._base_url}/api/deploy'
        if self._workflow:
            headers = dict(self.service.client._headers)
            headers['Content-Type'] = 'application/json'
            resp = requests.post(url, headers=headers, data=self._workflow.to_json())
            if not resp.ok:
                raise RuntimeError(f"Failed to deploy: {resp.text}")
            return ProcessDefinition.model_validate(resp.json())

        if not self._id:
            raise ValueError("missing deployment field: ID")
        if not self._name:
            raise ValueError("missing deployment field: Name")
        if not self._bpmn_xml:
            raise ValueError("missing deployment field: BPMN XML data")

        files = {
            'file': (self._name + '.bpmn', self._bpmn_xml, 'application/xml')
        }
        data = {
            'id': self._id,
            'name': self._name
        }
        resp = requests.post(url, headers=self.service.client._headers, data=data, files=files)
        if not resp.ok:
            raise RuntimeError(f"Failed to deploy: {resp.text}")
        return ProcessDefinition.model_validate(resp.json())


class InstancesService:
    def __init__(self, client: Client):
        self.client = client

    def list(self) -> 'ListInstancesBuilder':
        return ListInstancesBuilder(self)

    def get(self, instance_id: str) -> 'GetInstanceBuilder':
        return GetInstanceBuilder(self, instance_id)

    def start(self, process_id: str) -> 'StartInstanceBuilder':
        return StartInstanceBuilder(self, process_id)

    def complete(self, instance_id: str) -> 'CompleteInstanceTaskBuilder':
        return CompleteInstanceTaskBuilder(self, instance_id)

    def resume(self, instance_id: str) -> 'ResumeInstanceBuilder':
        return ResumeInstanceBuilder(self, instance_id)

    def history(self, instance_id: str) -> 'GetInstanceHistoryBuilder':
        return GetInstanceHistoryBuilder(self, instance_id)

    def incidents(self, instance_id: str) -> 'ListIncidentsBuilder':
        return ListIncidentsBuilder(self, instance_id)

    def resolve_incident(self, instance_id: str, incident_id: str) -> 'ResolveIncidentBuilder':
        return ResolveIncidentBuilder(self, instance_id, incident_id)

    def get_visualization(self, instance_id: str) -> VisualizationData:
        url = f'{self.client._base_url}/api/instances/{instance_id}/visualization'
        resp = requests.get(url, headers=self.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to get visualization: {resp.text}")
        return VisualizationData.model_validate(resp.json())

    def get_visualization_html(self, instance_id: str) -> str:
        url = f'{self.client._base_url}/api/instances/{instance_id}/visualization/widget'
        headers = dict(self.client._headers)
        headers['Accept'] = 'text/html'
        resp = requests.get(url, headers=headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to get visualization HTML: {resp.text}")
        return resp.text

    def subscribe(self, instance_id: str, on_update: Callable[[], None]) -> Callable[[], None]:
        url = f'{self.client._base_url}/ui/instances/{instance_id}/stream'
        stop_event = threading.Event()

        def listener():
            try:
                headers = dict(self.client._headers)
                headers['Accept'] = 'text/event-stream'
                with requests.get(url, headers=headers, stream=True, timeout=60) as r:
                    r.raise_for_status()
                    for line in r.iter_lines():
                        if stop_event.is_set():
                            break
                        if line:
                            decoded = line.decode('utf-8')
                            if decoded.startswith('data: refresh'):
                                on_update()
            except Exception:
                pass

        thread = threading.Thread(target=listener, daemon=True)
        thread.start()
        return lambda: stop_event.set()


class ListInstancesBuilder:
    def __init__(self, service: InstancesService):
        self.service = service

    def send(self) -> List[ProcessInstance]:
        url = f'{self.service.client._base_url}/api/instances'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to list instances: {resp.text}")
        return [ProcessInstance.model_validate(x) for x in resp.json()]


class GetInstanceBuilder:
    def __init__(self, service: InstancesService, instance_id: str):
        self.service = service
        self.instance_id = instance_id

    def send(self) -> ProcessInstance:
        url = f'{self.service.client._base_url}/api/instances/{self.instance_id}'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to get instance: {resp.text}")
        return ProcessInstance.model_validate(resp.json())


class StartInstanceBuilder:
    def __init__(self, service: InstancesService, process_id: str):
        self.service = service
        self.process_id = process_id
        self._instance_id = None
        self._business_key = None
        self._variables = {}

    def with_instance_id(self, instance_id: str) -> 'StartInstanceBuilder':
        self._instance_id = instance_id
        return self

    def with_business_key(self, business_key: str) -> 'StartInstanceBuilder':
        self._business_key = business_key
        return self

    def with_variable(self, name: str, value: Any) -> 'StartInstanceBuilder':
        self._variables[name] = value
        return self

    def with_variables(self, variables: Dict[str, Any]) -> 'StartInstanceBuilder':
        self._variables.update(variables)
        return self

    def send(self) -> ProcessInstance:
        url = f'{self.service.client._base_url}/api/definitions/{self.process_id}/start'
        req = StartInstanceRequest(
            instance_id=self._instance_id,
            business_key=self._business_key,
            variables=self._variables
        )
        resp = requests.post(
            url,
            headers=self.service.client._headers,
            json=req.model_dump(mode='json', exclude_none=True)
        )
        if not resp.ok:
            raise RuntimeError(f"Failed to start instance: {resp.text}")
        return ProcessInstance.model_validate(resp.json())


class CompleteInstanceTaskBuilder:
    def __init__(self, service: InstancesService, instance_id: str):
        self.service = service
        self.instance_id = instance_id
        self._node_id = None
        self._variables = {}

    def with_node_id(self, node_id: str) -> 'CompleteInstanceTaskBuilder':
        self._node_id = node_id
        return self

    def with_variable(self, name: str, value: Any) -> 'CompleteInstanceTaskBuilder':
        self._variables[name] = value
        return self

    def with_variables(self, variables: Dict[str, Any]) -> 'CompleteInstanceTaskBuilder':
        self._variables.update(variables)
        return self

    def send(self) -> ProcessInstance:
        if not self._node_id:
            raise ValueError("missing required field: node_id")
        url = f'{self.service.client._base_url}/api/instances/{self.instance_id}/complete'
        req = CompleteInstanceTaskRequest(
            node_id=self._node_id,
            variables=self._variables
        )
        resp = requests.post(
            url,
            headers=self.service.client._headers,
            json=req.model_dump(mode='json', exclude_none=True)
        )
        if not resp.ok:
            raise RuntimeError(f"Failed to complete task: {resp.text}")
        return ProcessInstance.model_validate(resp.json())


class ResumeInstanceBuilder:
    def __init__(self, service: InstancesService, instance_id: str):
        self.service = service
        self.instance_id = instance_id

    def send(self) -> ProcessInstance:
        url = f'{self.service.client._base_url}/api/instances/{self.instance_id}/resume'
        resp = requests.post(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to resume instance: {resp.text}")
        return ProcessInstance.model_validate(resp.json())


class GetInstanceHistoryBuilder:
    def __init__(self, service: InstancesService, instance_id: str):
        self.service = service
        self.instance_id = instance_id

    def send(self) -> List[HistoryRecord]:
        url = f'{self.service.client._base_url}/api/instances/{self.instance_id}/history'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to get instance history: {resp.text}")
        return [HistoryRecord.model_validate(x) for x in resp.json()]


class ListIncidentsBuilder:
    def __init__(self, service: InstancesService, instance_id: str):
        self.service = service
        self.instance_id = instance_id

    def send(self) -> List[IncidentRecord]:
        url = f'{self.service.client._base_url}/api/instances/{self.instance_id}/incidents'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to list incidents: {resp.text}")
        return [IncidentRecord.model_validate(x) for x in resp.json()]


class ResolveIncidentBuilder:
    def __init__(self, service: InstancesService, instance_id: str, incident_id: str):
        self.service = service
        self.instance_id = instance_id
        self.incident_id = incident_id

    def send(self) -> None:
        url = f'{self.service.client._base_url}/api/instances/{self.instance_id}/incidents/{self.incident_id}/resolve'
        resp = requests.post(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to resolve incident: {resp.text}")


class TasksService:
    def __init__(self, client: Client):
        self.client = client

    def list(self) -> 'ListTasksBuilder':
        return ListTasksBuilder(self)

    def claim(self, task_id: str) -> 'ClaimTaskBuilder':
        return ClaimTaskBuilder(self, task_id)

    def complete(self, task_id: str) -> 'CompleteTaskBuilder':
        return CompleteTaskBuilder(self, task_id)


class ListTasksBuilder:
    def __init__(self, service: TasksService):
        self.service = service
        self._assignee = None
        self._candidate_group = None
        self._status = None

    def with_assignee(self, assignee: str) -> 'ListTasksBuilder':
        self._assignee = assignee
        return self

    def with_candidate_group(self, candidate_group: str) -> 'ListTasksBuilder':
        self._candidate_group = candidate_group
        return self

    def with_status(self, status: str) -> 'ListTasksBuilder':
        self._status = status
        return self

    def send(self) -> List[TaskRecord]:
        url = f'{self.service.client._base_url}/api/tasks'
        params = {}
        if self._assignee:
            params['assignee'] = self._assignee
        if self._candidate_group:
            params['candidateGroup'] = self._candidate_group
        if self._status:
            params['status'] = self._status
        resp = requests.get(url, headers=self.service.client._headers, params=params)
        if not resp.ok:
            raise RuntimeError(f"Failed to list tasks: {resp.text}")
        return [TaskRecord.model_validate(x) for x in resp.json()]


class ClaimTaskBuilder:
    def __init__(self, service: TasksService, task_id: str):
        self.service = service
        self.task_id = task_id
        self._assignee = None

    def with_assignee(self, assignee: str) -> 'ClaimTaskBuilder':
        self._assignee = assignee
        return self

    def send(self) -> TaskRecord:
        if not self._assignee:
            raise ValueError("missing required field: assignee")
        url = f'{self.service.client._base_url}/api/tasks/{self.task_id}/claim'
        resp = requests.post(
            url,
            headers=self.service.client._headers,
            json={'assignee': self._assignee}
        )
        if not resp.ok:
            raise RuntimeError(f"Failed to claim task: {resp.text}")
        return TaskRecord.model_validate(resp.json())


class CompleteTaskBuilder:
    def __init__(self, service: TasksService, task_id: str):
        self.service = service
        self.task_id = task_id
        self._variables = {}

    def with_variable(self, name: str, value: Any) -> 'CompleteTaskBuilder':
        self._variables[name] = value
        return self

    def with_variables(self, variables: Dict[str, Any]) -> 'CompleteTaskBuilder':
        self._variables.update(variables)
        return self

    def send(self) -> ProcessInstance:
        url = f'{self.service.client._base_url}/api/tasks/{self.task_id}/complete'
        resp = requests.post(
            url,
            headers=self.service.client._headers,
            json={'variables': self._variables}
        )
        if not resp.ok:
            raise RuntimeError(f"Failed to complete task: {resp.text}")
        return ProcessInstance.model_validate(resp.json())


class WebhooksService:
    def __init__(self, client: Client):
        self.client = client

    def list(self) -> 'ListWebhooksBuilder':
        return ListWebhooksBuilder(self)

    def create(self) -> 'CreateWebhookBuilder':
        return CreateWebhookBuilder(self)

    def update(self, webhook_id: str) -> 'UpdateWebhookBuilder':
        return UpdateWebhookBuilder(self, webhook_id)

    def delete(self, webhook_id: str) -> 'DeleteWebhookBuilder':
        return DeleteWebhookBuilder(self, webhook_id)

    def test(self, webhook_id: str) -> 'TestWebhookBuilder':
        return TestWebhookBuilder(self, webhook_id)

    def deliveries(self, webhook_id: str) -> 'ListWebhookDeliveriesBuilder':
        return ListWebhookDeliveriesBuilder(self, webhook_id)


class ListWebhooksBuilder:
    def __init__(self, service: WebhooksService):
        self.service = service

    def send(self) -> List[WebhookRecord]:
        url = f'{self.service.client._base_url}/api/webhooks'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to list webhooks: {resp.text}")
        return [WebhookRecord.model_validate(x) for x in resp.json()]


class CreateWebhookBuilder:
    def __init__(self, service: WebhooksService):
        self.service = service
        self._url = None
        self._secret = None
        self._events = []
        self._process_id = None
        self._is_active = None
        self._enable_audit = None

    def with_url(self, url: str) -> 'CreateWebhookBuilder':
        self._url = url
        return self

    def with_secret(self, secret: str) -> 'CreateWebhookBuilder':
        self._secret = secret
        return self

    def with_events(self, events: List[str]) -> 'CreateWebhookBuilder':
        self._events = events
        return self

    def with_process_id(self, process_id: str) -> 'CreateWebhookBuilder':
        self._process_id = process_id
        return self

    def with_active(self, active: bool) -> 'CreateWebhookBuilder':
        self._is_active = active
        return self

    def with_audit(self, audit: bool) -> 'CreateWebhookBuilder':
        self._enable_audit = audit
        return self

    def send(self) -> WebhookRecord:
        if not self._url:
            raise ValueError("missing required field: url")
        url = f'{self.service.client._base_url}/api/webhooks'
        req = CreateWebhookRequest(
            url=self._url,
            secret=self._secret,
            events=self._events,
            process_id=self._process_id,
            is_active=self._is_active,
            enable_audit=self._enable_audit
        )
        resp = requests.post(
            url,
            headers=self.service.client._headers,
            json=req.model_dump(mode='json', exclude_none=True)
        )
        if not resp.ok:
            raise RuntimeError(f"Failed to create webhook: {resp.text}")
        return WebhookRecord.model_validate(resp.json())


class UpdateWebhookBuilder:
    def __init__(self, service: WebhooksService, webhook_id: str):
        self.service = service
        self.webhook_id = webhook_id
        self._url = None
        self._secret = None
        self._events = []
        self._process_id = None
        self._is_active = None
        self._enable_audit = None

    def with_url(self, url: str) -> 'UpdateWebhookBuilder':
        self._url = url
        return self

    def with_secret(self, secret: str) -> 'UpdateWebhookBuilder':
        self._secret = secret
        return self

    def with_events(self, events: List[str]) -> 'UpdateWebhookBuilder':
        self._events = events
        return self

    def with_process_id(self, process_id: str) -> 'UpdateWebhookBuilder':
        self._process_id = process_id
        return self

    def with_active(self, active: bool) -> 'UpdateWebhookBuilder':
        self._is_active = active
        return self

    def with_audit(self, audit: bool) -> 'UpdateWebhookBuilder':
        self._enable_audit = audit
        return self

    def send(self) -> WebhookRecord:
        if not self._url:
            raise ValueError("missing required field: url")
        url = f'{self.service.client._base_url}/api/webhooks/{self.webhook_id}'
        req = CreateWebhookRequest(
            url=self._url,
            secret=self._secret,
            events=self._events,
            process_id=self._process_id,
            is_active=self._is_active,
            enable_audit=self._enable_audit
        )
        resp = requests.put(
            url,
            headers=self.service.client._headers,
            json=req.model_dump(mode='json', exclude_none=True)
        )
        if not resp.ok:
            raise RuntimeError(f"Failed to update webhook: {resp.text}")
        return WebhookRecord.model_validate(resp.json())


class DeleteWebhookBuilder:
    def __init__(self, service: WebhooksService, webhook_id: str):
        self.service = service
        self.webhook_id = webhook_id

    def send(self) -> None:
        url = f'{self.service.client._base_url}/api/webhooks/{self.webhook_id}'
        resp = requests.delete(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to delete webhook: {resp.text}")


class TestWebhookBuilder:
    def __init__(self, service: WebhooksService, webhook_id: str):
        self.service = service
        self.webhook_id = webhook_id

    def send(self) -> None:
        url = f'{self.service.client._base_url}/api/webhooks/{self.webhook_id}/test'
        resp = requests.post(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to test webhook: {resp.text}")


class ListWebhookDeliveriesBuilder:
    def __init__(self, service: WebhooksService, webhook_id: str):
        self.service = service
        self.webhook_id = webhook_id

    def send(self) -> List[WebhookDeliveryRecord]:
        url = f'{self.service.client._base_url}/api/webhooks/{self.webhook_id}/deliveries'
        resp = requests.get(url, headers=self.service.client._headers)
        if not resp.ok:
            raise RuntimeError(f"Failed to list webhook deliveries: {resp.text}")
        return [WebhookDeliveryRecord.model_validate(x) for x in resp.json()]
