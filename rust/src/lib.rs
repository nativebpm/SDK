#![allow(unused_imports)]
#![allow(clippy::too_many_arguments)]

extern crate serde_repr;
extern crate serde;
extern crate serde_json;
extern crate url;
extern crate reqwest;

pub mod apis;
pub mod models;
pub mod builder;
pub use builder::{Workflow, Variable, Expression, v, var};

use serde::de::Error as _;

pub async fn deploy_workflow(
    configuration: &apis::configuration::Configuration,
    workflow: &builder::Workflow,
) -> Result<models::ProcessDefinition, apis::Error<apis::default_api::DeployDefinitionError>> {
    let uri_str = format!("{}/api/deploy", configuration.base_path);
    let mut req_builder = configuration.client.request(reqwest::Method::POST, &uri_str);

    if let Some(ref user_agent) = configuration.user_agent {
        req_builder = req_builder.header(reqwest::header::USER_AGENT, user_agent.clone());
    }

    req_builder = req_builder.json(workflow);

    let req = req_builder.build()?;
    let resp = configuration.client.execute(req).await?;

    let status = resp.status();
    let content_type = resp
        .headers()
        .get("content-type")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("application/octet-stream")
        .to_string();

    if !status.is_client_error() && !status.is_server_error() {
        let content = resp.text().await?;
        if content_type.starts_with("application") && content_type.contains("json") {
            serde_json::from_str(&content).map_err(apis::Error::from)
        } else {
            Err(apis::Error::from(serde_json::Error::custom(format!("Received `{}` content type response that cannot be converted to `models::ProcessDefinition`", content_type))))
        }
    } else {
        let content = resp.text().await?;
        let entity: Option<apis::default_api::DeployDefinitionError> = serde_json::from_str(&content).ok();
        Err(apis::Error::ResponseError(apis::ResponseContent { status, content, entity }))
    }
}

