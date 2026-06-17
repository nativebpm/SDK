using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NativeBPM.Client.Builder;
using NativeBPM.Client.Client;
using NativeBPM.Client.Model;

namespace NativeBPM.Client.Api
{
    public sealed partial class DefaultApi
    {
        /// <summary>
        /// Deploy a Workflow directly as JSON AST.
        /// </summary>
        /// <param name="workflow">The workflow definition to deploy.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>IDeployDefinitionApiResponse</returns>
        public async Task<IDeployDefinitionApiResponse> DeployWorkflowAsync(Workflow workflow, CancellationToken cancellationToken = default)
        {
            if (workflow == null) throw new ArgumentNullException(nameof(workflow));

            UriBuilder uriBuilderLocalVar = new UriBuilder();

            try
            {
                using (HttpRequestMessage httpRequestMessageLocalVar = new HttpRequestMessage())
                {
                    uriBuilderLocalVar.Host = HttpClient.BaseAddress!.Host;
                    uriBuilderLocalVar.Port = HttpClient.BaseAddress.Port;
                    uriBuilderLocalVar.Scheme = HttpClient.BaseAddress.Scheme;
                    uriBuilderLocalVar.Path = HttpClient.BaseAddress.AbsolutePath == "/"
                        ? "/api/deploy"
                        : string.Concat(HttpClient.BaseAddress.AbsolutePath.TrimEnd('/'), "/api/deploy");

                    string astJson = JsonSerializer.Serialize(workflow.ToAST());
                    httpRequestMessageLocalVar.Content = new StringContent(astJson, Encoding.UTF8, "application/json");

                    httpRequestMessageLocalVar.RequestUri = uriBuilderLocalVar.Uri;
                    httpRequestMessageLocalVar.Method = HttpMethod.Post;

                    string[] acceptLocalVars = new string[] {
                        "application/json"
                    };

                    IEnumerable<MediaTypeWithQualityHeaderValue> acceptHeaderValuesLocalVar = ClientUtils.SelectHeaderAcceptArray(acceptLocalVars);

                    foreach (var acceptLocalVar in acceptHeaderValuesLocalVar)
                        httpRequestMessageLocalVar.Headers.Accept.Add(acceptLocalVar);

                    DateTime requestedAtLocalVar = DateTime.UtcNow;

                    var httpResponseMessageLocalVar = await HttpClient.SendAsync(httpRequestMessageLocalVar, cancellationToken).ConfigureAwait(false);

                    string responseContentLocalVar = await httpResponseMessageLocalVar.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

                    Microsoft.Extensions.Logging.ILogger<DeployDefinitionApiResponse> apiResponseLoggerLocalVar = LoggerFactory.CreateLogger<DeployDefinitionApiResponse>();
                    DeployDefinitionApiResponse apiResponseLocalVar = new(apiResponseLoggerLocalVar, httpRequestMessageLocalVar, httpResponseMessageLocalVar, responseContentLocalVar, "/api/deploy", requestedAtLocalVar, _jsonSerializerOptions);

                    Events.ExecuteOnDeployDefinition(apiResponseLocalVar);
                    return apiResponseLocalVar;
                }
            }
            catch (Exception e)
            {
                Events.ExecuteOnErrorDeployDefinition(e);
                throw;
            }
        }
    }
}
