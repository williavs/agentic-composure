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
      * Agents module  [ Agents module  ](./) Table of contents 
        * agents 
        * set_default_openai_key 
        * set_default_openai_client 
        * set_default_openai_api 
        * set_tracing_export_api_key 
        * set_tracing_disabled 
        * set_trace_processors 
        * enable_verbose_stdout_logging 
      * [ Agents  ](agent/)
      * [ Runner  ](run/)
      * [ Tools  ](tool/)
      * [ Results  ](result/)
      * [ Streaming events  ](stream_events/)
      * [ Handoffs  ](handoffs/)
      * [ Lifecycle  ](lifecycle/)
      * [ Items  ](items/)
      * [ Run context  ](run_context/)
      * [ Usage  ](usage/)
      * [ Exceptions  ](exceptions/)
      * [ Guardrails  ](guardrail/)
      * [ Model settings  ](model_settings/)
      * [ Agent output  ](agent_output/)
      * [ Function schema  ](function_schema/)
      * [ Model interface  ](models/interface/)
      * [ OpenAI Chat Completions model  ](models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](models/openai_responses/)
      * [ MCP Servers  ](mcp/server/)
      * [ MCP Util  ](mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](tracing/)
      * [ Creating traces/spans  ](tracing/create/)
      * [ Traces  ](tracing/traces/)
      * [ Spans  ](tracing/spans/)
      * [ Processor interface  ](tracing/processor_interface/)
      * [ Processors  ](tracing/processors/)
      * [ Scope  ](tracing/scope/)
      * [ Setup  ](tracing/setup/)
      * [ Span data  ](tracing/span_data/)
      * [ Util  ](tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](voice/pipeline/)
      * [ Workflow  ](voice/workflow/)
      * [ Input  ](voice/input/)
      * [ Result  ](voice/result/)
      * [ Pipeline Config  ](voice/pipeline_config/)
      * [ Events  ](voice/events/)
      * [ Exceptions  ](voice/exceptions/)
      * [ Model  ](voice/model/)
      * [ Utils  ](voice/utils/)
      * [ OpenAIVoiceModelProvider  ](voice/models/openai_provider/)
      * [ OpenAI STT  ](voice/models/openai_stt/)
      * [ OpenAI TTS  ](voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](extensions/handoff_filters/)
      * [ Handoff prompt  ](extensions/handoff_prompt/)
      * [ LiteLLM Models  ](extensions/litellm/)



Table of contents 

  * agents 
  * set_default_openai_key 
  * set_default_openai_client 
  * set_default_openai_api 
  * set_tracing_export_api_key 
  * set_tracing_disabled 
  * set_trace_processors 
  * enable_verbose_stdout_logging 



# Agents module

###  set_default_openai_key
    
    
    set_default_openai_key(
        key: str, use_for_tracing: bool = True
    ) -> None
    

Set the default OpenAI API key to use for LLM requests (and optionally tracing(). This is only necessary if the OPENAI_API_KEY environment variable is not already set.

If provided, this key will be used instead of the OPENAI_API_KEY environment variable.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`key` |  `str` |  The OpenAI key to use. |  _required_  
`use_for_tracing` |  `bool` |  Whether to also use this key to send traces to OpenAI. Defaults to True If False, you'll either need to set the OPENAI_API_KEY environment variable or call set_tracing_export_api_key() with the API key you want to use for tracing. |  `True`  
Source code in `src/agents/__init__.py`
    
    
    106
    107
    108
    109
    110
    111
    112
    113
    114
    115
    116
    117
    118

| 
    
    
    def set_default_openai_key(key: str, use_for_tracing: bool = True) -> None:
        """Set the default OpenAI API key to use for LLM requests (and optionally tracing(). This is
        only necessary if the OPENAI_API_KEY environment variable is not already set.
    
        If provided, this key will be used instead of the OPENAI_API_KEY environment variable.
    
        Args:
            key: The OpenAI key to use.
            use_for_tracing: Whether to also use this key to send traces to OpenAI. Defaults to True
                If False, you'll either need to set the OPENAI_API_KEY environment variable or call
                set_tracing_export_api_key() with the API key you want to use for tracing.
        """
        _config.set_default_openai_key(key, use_for_tracing)
      
  
---|---  
  
###  set_default_openai_client
    
    
    set_default_openai_client(
        client: AsyncOpenAI, use_for_tracing: bool = True
    ) -> None
    

Set the default OpenAI client to use for LLM requests and/or tracing. If provided, this client will be used instead of the default OpenAI client.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`client` |  `AsyncOpenAI` |  The OpenAI client to use. |  _required_  
`use_for_tracing` |  `bool` |  Whether to use the API key from this client for uploading traces. If False, you'll either need to set the OPENAI_API_KEY environment variable or call set_tracing_export_api_key() with the API key you want to use for tracing. |  `True`  
Source code in `src/agents/__init__.py`
    
    
    121
    122
    123
    124
    125
    126
    127
    128
    129
    130
    131

| 
    
    
    def set_default_openai_client(client: AsyncOpenAI, use_for_tracing: bool = True) -> None:
        """Set the default OpenAI client to use for LLM requests and/or tracing. If provided, this
        client will be used instead of the default OpenAI client.
    
        Args:
            client: The OpenAI client to use.
            use_for_tracing: Whether to use the API key from this client for uploading traces. If False,
                you'll either need to set the OPENAI_API_KEY environment variable or call
                set_tracing_export_api_key() with the API key you want to use for tracing.
        """
        _config.set_default_openai_client(client, use_for_tracing)
      
  
---|---  
  
###  set_default_openai_api
    
    
    set_default_openai_api(
        api: Literal["chat_completions", "responses"],
    ) -> None
    

Set the default API to use for OpenAI LLM requests. By default, we will use the responses API but you can set this to use the chat completions API instead.

Source code in `src/agents/__init__.py`
    
    
    134
    135
    136
    137
    138

| 
    
    
    def set_default_openai_api(api: Literal["chat_completions", "responses"]) -> None:
        """Set the default API to use for OpenAI LLM requests. By default, we will use the responses API
        but you can set this to use the chat completions API instead.
        """
        _config.set_default_openai_api(api)
      
  
---|---  
  
###  set_tracing_export_api_key
    
    
    set_tracing_export_api_key(api_key: str) -> None
    

Set the OpenAI API key for the backend exporter.

Source code in `src/agents/tracing/__init__.py`
    
    
    100
    101
    102
    103
    104

| 
    
    
    def set_tracing_export_api_key(api_key: str) -> None:
        """
        Set the OpenAI API key for the backend exporter.
        """
        default_exporter().set_api_key(api_key)
      
  
---|---  
  
###  set_tracing_disabled
    
    
    set_tracing_disabled(disabled: bool) -> None
    

Set whether tracing is globally disabled.

Source code in `src/agents/tracing/__init__.py`
    
    
    93
    94
    95
    96
    97

| 
    
    
    def set_tracing_disabled(disabled: bool) -> None:
        """
        Set whether tracing is globally disabled.
        """
        GLOBAL_TRACE_PROVIDER.set_disabled(disabled)
      
  
---|---  
  
###  set_trace_processors
    
    
    set_trace_processors(
        processors: list[[TracingProcessor](tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)")],
    ) -> None
    

Set the list of trace processors. This will replace the current list of processors.

Source code in `src/agents/tracing/__init__.py`
    
    
    86
    87
    88
    89
    90

| 
    
    
    def set_trace_processors(processors: list[TracingProcessor]) -> None:
        """
        Set the list of trace processors. This will replace the current list of processors.
        """
        GLOBAL_TRACE_PROVIDER.set_processors(processors)
      
  
---|---  
  
###  enable_verbose_stdout_logging
    
    
    enable_verbose_stdout_logging()
    

Enables verbose logging to stdout. This is useful for debugging.

Source code in `src/agents/__init__.py`
    
    
    141
    142
    143
    144
    145

| 
    
    
    def enable_verbose_stdout_logging():
        """Enables verbose logging to stdout. This is useful for debugging."""
        logger = logging.getLogger("openai.agents")
        logger.setLevel(logging.DEBUG)
        logger.addHandler(logging.StreamHandler(sys.stdout))
      
  
---|---
