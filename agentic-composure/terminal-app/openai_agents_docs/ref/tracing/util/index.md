[ ![logo](../../../assets/logo.svg) ](../../.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](../../..)
  * [ Quickstart  ](../../../quickstart/)
  * [ Examples  ](../../../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../../../agents/)
    * [ Running agents  ](../../../running_agents/)
    * [ Results  ](../../../results/)
    * [ Streaming  ](../../../streaming/)
    * [ Tools  ](../../../tools/)
    * [ Model context protocol (MCP)  ](../../../mcp/)
    * [ Handoffs  ](../../../handoffs/)
    * [ Tracing  ](../../../tracing/)
    * [ Context management  ](../../../context/)
    * [ Guardrails  ](../../../guardrails/)
    * [ Orchestrating multiple agents  ](../../../multi_agent/)
    * Models  Models 
      * [ Models  ](../../../models/)
      * [ Using any model via LiteLLM  ](../../../models/litellm/)
    * [ Configuring the SDK  ](../../../config/)
    * [ Agent Visualization  ](../../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../../voice/pipeline/)
      * [ Tracing  ](../../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../../)
      * [ Agents  ](../../agent/)
      * [ Runner  ](../../run/)
      * [ Tools  ](../../tool/)
      * [ Results  ](../../result/)
      * [ Streaming events  ](../../stream_events/)
      * [ Handoffs  ](../../handoffs/)
      * [ Lifecycle  ](../../lifecycle/)
      * [ Items  ](../../items/)
      * [ Run context  ](../../run_context/)
      * [ Usage  ](../../usage/)
      * [ Exceptions  ](../../exceptions/)
      * [ Guardrails  ](../../guardrail/)
      * [ Model settings  ](../../model_settings/)
      * [ Agent output  ](../../agent_output/)
      * [ Function schema  ](../../function_schema/)
      * [ Model interface  ](../../models/interface/)
      * [ OpenAI Chat Completions model  ](../../models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../../models/openai_responses/)
      * [ MCP Servers  ](../../mcp/server/)
      * [ MCP Util  ](../../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../)
      * [ Creating traces/spans  ](../create/)
      * [ Traces  ](../traces/)
      * [ Spans  ](../spans/)
      * [ Processor interface  ](../processor_interface/)
      * [ Processors  ](../processors/)
      * [ Scope  ](../scope/)
      * [ Setup  ](../setup/)
      * [ Span data  ](../span_data/)
      * Util  [ Util  ](./) Table of contents 
        * util 
        * time_iso 
        * gen_trace_id 
        * gen_span_id 
        * gen_group_id 
    * Voice  Voice 
      * [ Pipeline  ](../../voice/pipeline/)
      * [ Workflow  ](../../voice/workflow/)
      * [ Input  ](../../voice/input/)
      * [ Result  ](../../voice/result/)
      * [ Pipeline Config  ](../../voice/pipeline_config/)
      * [ Events  ](../../voice/events/)
      * [ Exceptions  ](../../voice/exceptions/)
      * [ Model  ](../../voice/model/)
      * [ Utils  ](../../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../../voice/models/openai_provider/)
      * [ OpenAI STT  ](../../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../extensions/litellm/)



Table of contents 

  * util 
  * time_iso 
  * gen_trace_id 
  * gen_span_id 
  * gen_group_id 



# `Util`

###  time_iso
    
    
    time_iso() -> str
    

Returns the current time in ISO 8601 format.

Source code in `src/agents/tracing/util.py`
    
    
    5
    6
    7

| 
    
    
    def time_iso() -> str:
        """Returns the current time in ISO 8601 format."""
        return datetime.now(timezone.utc).isoformat()
      
  
---|---  
  
###  gen_trace_id
    
    
    gen_trace_id() -> str
    

Generates a new trace ID.

Source code in `src/agents/tracing/util.py`
    
    
    10
    11
    12

| 
    
    
    def gen_trace_id() -> str:
        """Generates a new trace ID."""
        return f"trace_{uuid.uuid4().hex}"
      
  
---|---  
  
###  gen_span_id
    
    
    gen_span_id() -> str
    

Generates a new span ID.

Source code in `src/agents/tracing/util.py`
    
    
    15
    16
    17

| 
    
    
    def gen_span_id() -> str:
        """Generates a new span ID."""
        return f"span_{uuid.uuid4().hex[:24]}"
      
  
---|---  
  
###  gen_group_id
    
    
    gen_group_id() -> str
    

Generates a new group ID.

Source code in `src/agents/tracing/util.py`
    
    
    20
    21
    22

| 
    
    
    def gen_group_id() -> str:
        """Generates a new group ID."""
        return f"group_{uuid.uuid4().hex[:24]}"
      
  
---|---
