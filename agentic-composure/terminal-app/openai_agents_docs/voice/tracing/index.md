[ ![logo](../../assets/logo.svg) ](../.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](../..)
  * [ Quickstart  ](../../quickstart/)
  * [ Examples  ](../../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../../agents/)
    * [ Running agents  ](../../running_agents/)
    * [ Results  ](../../results/)
    * [ Streaming  ](../../streaming/)
    * [ Tools  ](../../tools/)
    * [ Model context protocol (MCP)  ](../../mcp/)
    * [ Handoffs  ](../../handoffs/)
    * [ Tracing  ](../../tracing/)
    * [ Context management  ](../../context/)
    * [ Guardrails  ](../../guardrails/)
    * [ Orchestrating multiple agents  ](../../multi_agent/)
    * Models  Models 
      * [ Models  ](../../models/)
      * [ Using any model via LiteLLM  ](../../models/litellm/)
    * [ Configuring the SDK  ](../../config/)
    * [ Agent Visualization  ](../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../quickstart/)
      * [ Pipelines and workflows  ](../pipeline/)
      * [ Tracing  ](./)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../../ref/)
      * [ Agents  ](../../ref/agent/)
      * [ Runner  ](../../ref/run/)
      * [ Tools  ](../../ref/tool/)
      * [ Results  ](../../ref/result/)
      * [ Streaming events  ](../../ref/stream_events/)
      * [ Handoffs  ](../../ref/handoffs/)
      * [ Lifecycle  ](../../ref/lifecycle/)
      * [ Items  ](../../ref/items/)
      * [ Run context  ](../../ref/run_context/)
      * [ Usage  ](../../ref/usage/)
      * [ Exceptions  ](../../ref/exceptions/)
      * [ Guardrails  ](../../ref/guardrail/)
      * [ Model settings  ](../../ref/model_settings/)
      * [ Agent output  ](../../ref/agent_output/)
      * [ Function schema  ](../../ref/function_schema/)
      * [ Model interface  ](../../ref/models/interface/)
      * [ OpenAI Chat Completions model  ](../../ref/models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../../ref/models/openai_responses/)
      * [ MCP Servers  ](../../ref/mcp/server/)
      * [ MCP Util  ](../../ref/mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../../ref/tracing/)
      * [ Creating traces/spans  ](../../ref/tracing/create/)
      * [ Traces  ](../../ref/tracing/traces/)
      * [ Spans  ](../../ref/tracing/spans/)
      * [ Processor interface  ](../../ref/tracing/processor_interface/)
      * [ Processors  ](../../ref/tracing/processors/)
      * [ Scope  ](../../ref/tracing/scope/)
      * [ Setup  ](../../ref/tracing/setup/)
      * [ Span data  ](../../ref/tracing/span_data/)
      * [ Util  ](../../ref/tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../../ref/voice/pipeline/)
      * [ Workflow  ](../../ref/voice/workflow/)
      * [ Input  ](../../ref/voice/input/)
      * [ Result  ](../../ref/voice/result/)
      * [ Pipeline Config  ](../../ref/voice/pipeline_config/)
      * [ Events  ](../../ref/voice/events/)
      * [ Exceptions  ](../../ref/voice/exceptions/)
      * [ Model  ](../../ref/voice/model/)
      * [ Utils  ](../../ref/voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../../ref/voice/models/openai_provider/)
      * [ OpenAI STT  ](../../ref/voice/models/openai_stt/)
      * [ OpenAI TTS  ](../../ref/voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../ref/extensions/handoff_filters/)
      * [ Handoff prompt  ](../../ref/extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../ref/extensions/litellm/)



# Tracing

Just like the way [agents are traced](../../tracing/), voice pipelines are also automatically traced.

You can read the tracing doc above for basic tracing information, but you can additionally configure tracing of a pipeline via [`VoicePipelineConfig`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig


  
      dataclass
  ").

Key tracing related fields are:

  * [`tracing_disabled`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  "): controls whether tracing is disabled. By default, tracing is enabled.
  * [`trace_include_sensitive_data`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.trace_include_sensitive_data "trace_include_sensitive_data


  
      class-attribute
      instance-attribute
  "): controls whether traces include potentially sensitive data, like audio transcripts. This is specifically for the voice pipeline, and not for anything that goes on inside your Workflow.
  * [`trace_include_sensitive_audio_data`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.trace_include_sensitive_audio_data "trace_include_sensitive_audio_data


  
      class-attribute
      instance-attribute
  "): controls whether traces include audio data.
  * [`workflow_name`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.workflow_name "workflow_name


  
      class-attribute
      instance-attribute
  "): The name of the trace workflow.
  * [`group_id`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.group_id "group_id


  
      class-attribute
      instance-attribute
  "): The `group_id` of the trace, which lets you link multiple traces.
  * [`trace_metadata`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  "): Additional metadata to include with the trace.


