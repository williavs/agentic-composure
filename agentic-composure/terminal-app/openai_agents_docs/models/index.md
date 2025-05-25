[ ![logo](../assets/logo.svg) ](.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](..)
  * [ Quickstart  ](../quickstart/)
  * [ Examples  ](../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../agents/)
    * [ Running agents  ](../running_agents/)
    * [ Results  ](../results/)
    * [ Streaming  ](../streaming/)
    * [ Tools  ](../tools/)
    * [ Model context protocol (MCP)  ](../mcp/)
    * [ Handoffs  ](../handoffs/)
    * [ Tracing  ](../tracing/)
    * [ Context management  ](../context/)
    * [ Guardrails  ](../guardrails/)
    * [ Orchestrating multiple agents  ](../multi_agent/)
    * Models  Models 
      * Models  [ Models  ](./) Table of contents 
        * Non-OpenAI models 
          * Other ways to use non-OpenAI models 
        * Mixing and matching models 
        * Common issues with using other LLM providers 
          * Tracing client error 401 
          * Responses API support 
          * Structured outputs support 
        * Mixing models across providers 
      * [ Using any model via LiteLLM  ](litellm/)
    * [ Configuring the SDK  ](../config/)
    * [ Agent Visualization  ](../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../voice/quickstart/)
      * [ Pipelines and workflows  ](../voice/pipeline/)
      * [ Tracing  ](../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../ref/)
      * [ Agents  ](../ref/agent/)
      * [ Runner  ](../ref/run/)
      * [ Tools  ](../ref/tool/)
      * [ Results  ](../ref/result/)
      * [ Streaming events  ](../ref/stream_events/)
      * [ Handoffs  ](../ref/handoffs/)
      * [ Lifecycle  ](../ref/lifecycle/)
      * [ Items  ](../ref/items/)
      * [ Run context  ](../ref/run_context/)
      * [ Usage  ](../ref/usage/)
      * [ Exceptions  ](../ref/exceptions/)
      * [ Guardrails  ](../ref/guardrail/)
      * [ Model settings  ](../ref/model_settings/)
      * [ Agent output  ](../ref/agent_output/)
      * [ Function schema  ](../ref/function_schema/)
      * [ Model interface  ](../ref/models/interface/)
      * [ OpenAI Chat Completions model  ](../ref/models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../ref/models/openai_responses/)
      * [ MCP Servers  ](../ref/mcp/server/)
      * [ MCP Util  ](../ref/mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../ref/tracing/)
      * [ Creating traces/spans  ](../ref/tracing/create/)
      * [ Traces  ](../ref/tracing/traces/)
      * [ Spans  ](../ref/tracing/spans/)
      * [ Processor interface  ](../ref/tracing/processor_interface/)
      * [ Processors  ](../ref/tracing/processors/)
      * [ Scope  ](../ref/tracing/scope/)
      * [ Setup  ](../ref/tracing/setup/)
      * [ Span data  ](../ref/tracing/span_data/)
      * [ Util  ](../ref/tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../ref/voice/pipeline/)
      * [ Workflow  ](../ref/voice/workflow/)
      * [ Input  ](../ref/voice/input/)
      * [ Result  ](../ref/voice/result/)
      * [ Pipeline Config  ](../ref/voice/pipeline_config/)
      * [ Events  ](../ref/voice/events/)
      * [ Exceptions  ](../ref/voice/exceptions/)
      * [ Model  ](../ref/voice/model/)
      * [ Utils  ](../ref/voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../ref/voice/models/openai_provider/)
      * [ OpenAI STT  ](../ref/voice/models/openai_stt/)
      * [ OpenAI TTS  ](../ref/voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../ref/extensions/handoff_filters/)
      * [ Handoff prompt  ](../ref/extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../ref/extensions/litellm/)



Table of contents 

  * Non-OpenAI models 
    * Other ways to use non-OpenAI models 
  * Mixing and matching models 
  * Common issues with using other LLM providers 
    * Tracing client error 401 
    * Responses API support 
    * Structured outputs support 
  * Mixing models across providers 



# Models

The Agents SDK comes with out-of-the-box support for OpenAI models in two flavors:

  * **Recommended** : the [`OpenAIResponsesModel`](../ref/models/openai_responses/#agents.models.openai_responses.OpenAIResponsesModel "OpenAIResponsesModel"), which calls OpenAI APIs using the new [Responses API](https://platform.openai.com/docs/api-reference/responses).
  * The [`OpenAIChatCompletionsModel`](../ref/models/openai_chatcompletions/#agents.models.openai_chatcompletions.OpenAIChatCompletionsModel "OpenAIChatCompletionsModel"), which calls OpenAI APIs using the [Chat Completions API](https://platform.openai.com/docs/api-reference/chat).



## Non-OpenAI models

You can use most other non-OpenAI models via the [LiteLLM integration](litellm/). First, install the litellm dependency group:
    
    
    pip install "openai-agents[litellm]"
    

Then, use any of the [supported models](https://docs.litellm.ai/docs/providers) with the `litellm/` prefix:
    
    
    claude_agent = Agent(model="litellm/anthropic/claude-3-5-sonnet-20240620", ...)
    gemini_agent = Agent(model="litellm/gemini/gemini-2.5-flash-preview-04-17", ...)
    

### Other ways to use non-OpenAI models

You can integrate other LLM providers in 3 more ways (examples [here](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/)):

  1. [`set_default_openai_client`](../ref/#agents.set_default_openai_client "set_default_openai_client") is useful in cases where you want to globally use an instance of `AsyncOpenAI` as the LLM client. This is for cases where the LLM provider has an OpenAI compatible API endpoint, and you can set the `base_url` and `api_key`. See a configurable example in [examples/model_providers/custom_example_global.py](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/custom_example_global.py).
  2. [`ModelProvider`](../ref/models/interface/#agents.models.interface.ModelProvider "ModelProvider") is at the `Runner.run` level. This lets you say "use a custom model provider for all agents in this run". See a configurable example in [examples/model_providers/custom_example_provider.py](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/custom_example_provider.py).
  3. [`Agent.model`](../ref/agent/#agents.agent.Agent.model "model


  
      class-attribute
      instance-attribute
  ") lets you specify the model on a specific Agent instance. This enables you to mix and match different providers for different agents. See a configurable example in [examples/model_providers/custom_example_agent.py](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/custom_example_agent.py). An easy way to use most available models is via the [LiteLLM integration](litellm/).



In cases where you do not have an API key from `platform.openai.com`, we recommend disabling tracing via `set_tracing_disabled()`, or setting up a [different tracing processor](../tracing/).

Note

In these examples, we use the Chat Completions API/model, because most LLM providers don't yet support the Responses API. If your LLM provider does support it, we recommend using Responses.

## Mixing and matching models

Within a single workflow, you may want to use different models for each agent. For example, you could use a smaller, faster model for triage, while using a larger, more capable model for complex tasks. When configuring an [`Agent`](../ref/agent/#agents.agent.Agent "Agent


  
      dataclass
  "), you can select a specific model by either:

  1. Passing the name of a model.
  2. Passing any model name + a [`ModelProvider`](../ref/models/interface/#agents.models.interface.ModelProvider "ModelProvider") that can map that name to a Model instance.
  3. Directly providing a [`Model`](../ref/models/interface/#agents.models.interface.Model "Model") implementation.



Note

While our SDK supports both the [`OpenAIResponsesModel`](../ref/models/openai_responses/#agents.models.openai_responses.OpenAIResponsesModel "OpenAIResponsesModel") and the [`OpenAIChatCompletionsModel`](../ref/models/openai_chatcompletions/#agents.models.openai_chatcompletions.OpenAIChatCompletionsModel "OpenAIChatCompletionsModel") shapes, we recommend using a single model shape for each workflow because the two shapes support a different set of features and tools. If your workflow requires mixing and matching model shapes, make sure that all the features you're using are available on both.
    
    
    from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel
    import asyncio
    
    spanish_agent = Agent(
        name="Spanish agent",
        instructions="You only speak Spanish.",
        model="o3-mini", # (1)!
    )
    
    english_agent = Agent(
        name="English agent",
        instructions="You only speak English",
        model=OpenAIChatCompletionsModel( # (2)!
            model="gpt-4o",
            openai_client=AsyncOpenAI()
        ),
    )
    
    triage_agent = Agent(
        name="Triage agent",
        instructions="Handoff to the appropriate agent based on the language of the request.",
        handoffs=[spanish_agent, english_agent],
        model="gpt-3.5-turbo",
    )
    
    async def main():
        result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
        print(result.final_output)
    

  1. Sets the name of an OpenAI model directly.
  2. Provides a [`Model`](../ref/models/interface/#agents.models.interface.Model "Model") implementation.



When you want to further configure the model used for an agent, you can pass [`ModelSettings`](../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings


  
      dataclass
  "), which provides optional model configuration parameters such as temperature.
    
    
    from agents import Agent, ModelSettings
    
    english_agent = Agent(
        name="English agent",
        instructions="You only speak English",
        model="gpt-4o",
        model_settings=ModelSettings(temperature=0.1),
    )
    

## Common issues with using other LLM providers

### Tracing client error 401

If you get errors related to tracing, this is because traces are uploaded to OpenAI servers, and you don't have an OpenAI API key. You have three options to resolve this:

  1. Disable tracing entirely: [`set_tracing_disabled(True)`](../ref/#agents.set_tracing_disabled "set_tracing_disabled").
  2. Set an OpenAI key for tracing: [`set_tracing_export_api_key(...)`](../ref/#agents.set_tracing_export_api_key "set_tracing_export_api_key"). This API key will only be used for uploading traces, and must be from [platform.openai.com](https://platform.openai.com/).
  3. Use a non-OpenAI trace processor. See the [tracing docs](../tracing/#custom-tracing-processors).



### Responses API support

The SDK uses the Responses API by default, but most other LLM providers don't yet support it. You may see 404s or similar issues as a result. To resolve, you have two options:

  1. Call [`set_default_openai_api("chat_completions")`](../ref/#agents.set_default_openai_api "set_default_openai_api"). This works if you are setting `OPENAI_API_KEY` and `OPENAI_BASE_URL` via environment vars.
  2. Use [`OpenAIChatCompletionsModel`](../ref/models/openai_chatcompletions/#agents.models.openai_chatcompletions.OpenAIChatCompletionsModel "OpenAIChatCompletionsModel"). There are examples [here](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/).



### Structured outputs support

Some model providers don't have support for [structured outputs](https://platform.openai.com/docs/guides/structured-outputs). This sometimes results in an error that looks something like this:
    
    
    BadRequestError: Error code: 400 - {'error': {'message': "'response_format.type' : value is not one of the allowed values ['text','json_object']", 'type': 'invalid_request_error'}}
    

This is a shortcoming of some model providers - they support JSON outputs, but don't allow you to specify the `json_schema` to use for the output. We are working on a fix for this, but we suggest relying on providers that do have support for JSON schema output, because otherwise your app will often break because of malformed JSON.

## Mixing models across providers

You need to be aware of feature differences between model providers, or you may run into errors. For example, OpenAI supports structured outputs, multimodal input, and hosted file search and web search, but many other providers don't support these features. Be aware of these limitations:

  * Don't send unsupported `tools` to providers that don't understand them
  * Filter out multimodal inputs before calling models that are text-only
  * Be aware that providers that don't support structured JSON outputs will occasionally produce invalid JSON.


