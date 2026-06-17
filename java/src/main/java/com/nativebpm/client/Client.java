package com.nativebpm.client;

import com.nativebpm.client.api.DefaultApi;
import com.nativebpm.client.model.ProcessDefinition;
import com.nativebpm.client.builder.Workflow;
import okhttp3.*;

import java.io.IOException;

/**
 * Client is a unified facade for the NativeBPM Java SDK.
 */
public class Client {
    private final String baseUrl;
    private final String apiToken;
    private final ApiClient apiClient;
    private final DefaultApi defaultApi;

    public Client(String baseUrl, String apiToken) {
        this.baseUrl = baseUrl;
        this.apiToken = apiToken;
        this.apiClient = new ApiClient();
        this.apiClient.setBasePath(baseUrl);
        if (apiToken != null && !apiToken.isEmpty()) {
            this.apiClient.addDefaultHeader("Authorization", "Bearer " + apiToken);
        }
        this.defaultApi = new DefaultApi(this.apiClient);
    }

    public DefaultApi getDefaultApi() {
        return defaultApi;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    /**
     * Compiles and deploys a process definition workflow directly as JSON AST.
     *
     * @param workflow The workflow to compile and deploy.
     * @return The deployed ProcessDefinition details.
     * @throws ApiException if an error occurs during the API call.
     */
    public ProcessDefinition deploy(Workflow workflow) throws ApiException {
        String jsonAst = workflow.toJSON();
        OkHttpClient httpClient = apiClient.getHttpClient();
        String url = baseUrl.replaceAll("/+$", "") + "/api/deploy";
        
        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"),
            jsonAst
        );
        
        Request.Builder requestBuilder = new Request.Builder()
            .url(url)
            .post(body)
            .header("Accept", "application/json")
            .header("Content-Type", "application/json");
            
        if (apiToken != null && !apiToken.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + apiToken);
        }
        
        Request request = requestBuilder.build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "";
                throw new ApiException("Failed to deploy: status=" + response.code() + ", body=" + errorBody, response.code(), null, errorBody);
            }
            
            String bodyString = response.body() != null ? response.body().string() : "";
            if (bodyString.isEmpty()) {
                throw new ApiException("Empty response body", response.code(), null, "");
            }
            
            return JSON.deserialize(bodyString, ProcessDefinition.class);
        } catch (IOException e) {
            throw new ApiException(e);
        }
    }
}
