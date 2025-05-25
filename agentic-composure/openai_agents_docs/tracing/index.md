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
    * Tracing  [ Tracing  ](./) Table of contents 
      * Traces and spans 
      * Default tracing 
      * Higher level traces 
      * Creating traces 
      * Creating spans 
      * Sensitive data 
      * Custom tracing processors 
      * External tracing processors list 
    * [ Context management  ](../context/)
    * [ Guardrails  ](../guardrails/)
    * [ Orchestrating multiple agents  ](../multi_agent/)
    * Models  Models 
      * [ Models  ](../models/)
      * [ Using any model via LiteLLM  ](../models/litellm/)
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

  * Traces and spans 
  * Default tracing 
  * Higher level traces 
  * Creating traces 
  * Creating spans 
  * Sensitive data 
  * Custom tracing processors 
  * External tracing processors list 



# Tracing

The Agents SDK includes built-in tracing, collecting a comprehensive record of events during an agent run: LLM generations, tool calls, handoffs, guardrails, and even custom events that occur. Using the [Traces dashboard](https://platform.openai.com/traces), you can debug, visualize, and monitor your workflows during development and in production.

Note

Tracing is enabled by default. There are two ways to disable tracing:

  1. You can globally disable tracing by setting the env var `OPENAI_AGENTS_DISABLE_TRACING=1`
  2. You can disable tracing for a single run by setting [`agents.run.RunConfig.tracing_disabled`](../ref/run/#agents.run.RunConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  ") to `True`



**_For organizations operating under a Zero Data Retention (ZDR) policy using OpenAI's APIs, tracing is unavailable._**

## Traces and spans

  * **Traces** represent a single end-to-end operation of a "workflow". They're composed of Spans. Traces have the following properties:
    * `workflow_name`: This is the logical workflow or app. For example "Code generation" or "Customer service".
    * `trace_id`: A unique ID for the trace. Automatically generated if you don't pass one. Must have the format `trace_<32_alphanumeric>`.
    * `group_id`: Optional group ID, to link multiple traces from the same conversation. For example, you might use a chat thread ID.
    * `disabled`: If True, the trace will not be recorded.
    * `metadata`: Optional metadata for the trace.
  * **Spans** represent operations that have a start and end time. Spans have:
    * `started_at` and `ended_at` timestamps.
    * `trace_id`, to represent the trace they belong to
    * `parent_id`, which points to the parent Span of this Span (if any)
    * `span_data`, which is information about the Span. For example, `AgentSpanData` contains information about the Agent, `GenerationSpanData` contains information about the LLM generation, etc.



## Default tracing

By default, the SDK traces the following:

  * The entire `Runner.{run, run_sync, run_streamed}()` is wrapped in a `trace()`.
  * Each time an agent runs, it is wrapped in `agent_span()`
  * LLM generations are wrapped in `generation_span()`
  * Function tool calls are each wrapped in `function_span()`
  * Guardrails are wrapped in `guardrail_span()`
  * Handoffs are wrapped in `handoff_span()`
  * Audio inputs (speech-to-text) are wrapped in a `transcription_span()`
  * Audio outputs (text-to-speech) are wrapped in a `speech_span()`
  * Related audio spans may be parented under a `speech_group_span()`



By default, the trace is named "Agent trace". You can set this name if you use `trace`, or you can can configure the name and other properties with the [`RunConfig`](../ref/run/#agents.run.RunConfig "RunConfig


  
      dataclass
  ").

In addition, you can set up custom trace processors to push traces to other destinations (as a replacement, or secondary destination).

## Higher level traces

Sometimes, you might want multiple calls to `run()` to be part of a single trace. You can do this by wrapping the entire code in a `trace()`.
    
    
    from agents import Agent, Runner, trace
    
    async def main():
        agent = Agent(name="Joke generator", instructions="Tell funny jokes.")
    
        with trace("Joke workflow"): # (1)!
            first_result = await Runner.run(agent, "Tell me a joke")
            second_result = await Runner.run(agent, f"Rate this joke: {first_result.final_output}")
            print(f"Joke: {first_result.final_output}")
            print(f"Rating: {second_result.final_output}")
    

  1. Because the two calls to `Runner.run` are wrapped in a `with trace()`, the individual runs will be part of the overall trace rather than creating two traces.



## Creating traces

You can use the [`trace()`](../ref/tracing/#agents.tracing.trace "trace") function to create a trace. Traces need to be started and finished. You have two options to do so:

  1. **Recommended** : use the trace as a context manager, i.e. `with trace(...) as my_trace`. This will automatically start and end the trace at the right time.
  2. You can also manually call [`trace.start()`](../ref/tracing/#agents.tracing.Trace.start "start


  
      abstractmethod
  ") and [`trace.finish()`](../ref/tracing/#agents.tracing.Trace.finish "finish


  
      abstractmethod
  ").



The current trace is tracked via a Python [`contextvar`](https://docs.python.org/3/library/contextvars.html). This means that it works with concurrency automatically. If you manually start/end a trace, you'll need to pass `mark_as_current` and `reset_current` to `start()`/`finish()` to update the current trace.

## Creating spans

You can use the various [`*_span()`](../ref/tracing/create/#agents.tracing.create) methods to create a span. In general, you don't need to manually create spans. A [`custom_span()`](../ref/tracing/#agents.tracing.custom_span "custom_span") function is available for tracking custom span information.

Spans are automatically part of the current trace, and are nested under the nearest current span, which is tracked via a Python [`contextvar`](https://docs.python.org/3/library/contextvars.html).

## Sensitive data

Certain spans may capture potentially sensitive data.

The `generation_span()` stores the inputs/outputs of the LLM generation, and `function_span()` stores the inputs/outputs of function calls. These may contain sensitive data, so you can disable capturing that data via [`RunConfig.trace_include_sensitive_data`](../ref/run/#agents.run.RunConfig.trace_include_sensitive_data "trace_include_sensitive_data


  
      class-attribute
      instance-attribute
  ").

Similarly, Audio spans include base64-encoded PCM data for input and output audio by default. You can disable capturing this audio data by configuring [`VoicePipelineConfig.trace_include_sensitive_audio_data`](../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.trace_include_sensitive_audio_data "trace_include_sensitive_audio_data


  
      class-attribute
      instance-attribute
  ").

## Custom tracing processors

The high level architecture for tracing is:

  * At initialization, we create a global [`TraceProvider`](../ref/tracing/setup/#agents.tracing.setup.TraceProvider "TraceProvider"), which is responsible for creating traces.
  * We configure the `TraceProvider` with a [`BatchTraceProcessor`](../ref/tracing/processors/#agents.tracing.processors.BatchTraceProcessor "BatchTraceProcessor") that sends traces/spans in batches to a [`BackendSpanExporter`](../ref/tracing/processors/#agents.tracing.processors.BackendSpanExporter "BackendSpanExporter"), which exports the spans and traces to the OpenAI backend in batches.



To customize this default setup, to send traces to alternative or additional backends or modifying exporter behavior, you have two options:

  1. [`add_trace_processor()`](../ref/tracing/#agents.tracing.add_trace_processor "add_trace_processor") lets you add an **additional** trace processor that will receive traces and spans as they are ready. This lets you do your own processing in addition to sending traces to OpenAI's backend.
  2. [`set_trace_processors()`](../ref/tracing/#agents.tracing.set_trace_processors "set_trace_processors") lets you **replace** the default processors with your own trace processors. This means traces will not be sent to the OpenAI backend unless you include a `TracingProcessor` that does so.



## External tracing processors list

  * [Weights & Biases](https://weave-docs.wandb.ai/guides/integrations/openai_agents)
  * [Arize-Phoenix](https://docs.arize.com/phoenix/tracing/integrations-tracing/openai-agents-sdk)
  * [MLflow (self-hosted/OSS](https://mlflow.org/docs/latest/tracing/integrations/openai-agent)
  * [MLflow (Databricks hosted](https://docs.databricks.com/aws/en/mlflow/mlflow-tracing#-automatic-tracing)
  * [Braintrust](https://braintrust.dev/docs/guides/traces/integrations#openai-agents-sdk)
  * [Pydantic Logfire](https://logfire.pydantic.dev/docs/integrations/llms/openai/#openai-agents)
  * [AgentOps](https://docs.agentops.ai/v1/integrations/agentssdk)
  * [Scorecard](https://docs.scorecard.io/docs/documentation/features/tracing#openai-agents-sdk-integration)
  * [Keywords AI](https://docs.keywordsai.co/integration/development-frameworks/openai-agent)
  * [LangSmith](https://docs.smith.langchain.com/observability/how_to_guides/trace_with_openai_agents_sdk)
  * [Maxim AI](https://www.getmaxim.ai/docs/observe/integrations/openai-agents-sdk)
  * [Comet Opik](https://www.comet.com/docs/opik/tracing/integrations/openai_agents)
  * [Langfuse](https://langfuse.com/docs/integrations/openaiagentssdk/openai-agents)
  * [Langtrace](https://docs.langtrace.ai/supported-integrations/llm-frameworks/openai-agents-sdk)
  * [Okahu-Monocle](https://github.com/monocle2ai/monocle)


