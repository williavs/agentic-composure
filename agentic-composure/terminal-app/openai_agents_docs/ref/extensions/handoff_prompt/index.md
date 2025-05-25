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
      * [ Tracing module  ](../../tracing/)
      * [ Creating traces/spans  ](../../tracing/create/)
      * [ Traces  ](../../tracing/traces/)
      * [ Spans  ](../../tracing/spans/)
      * [ Processor interface  ](../../tracing/processor_interface/)
      * [ Processors  ](../../tracing/processors/)
      * [ Scope  ](../../tracing/scope/)
      * [ Setup  ](../../tracing/setup/)
      * [ Span data  ](../../tracing/span_data/)
      * [ Util  ](../../tracing/util/)
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
      * [ Handoff filters  ](../handoff_filters/)
      * Handoff prompt  [ Handoff prompt  ](./) Table of contents 
        * handoff_prompt 
        * RECOMMENDED_PROMPT_PREFIX 
        * prompt_with_handoff_instructions 
      * [ LiteLLM Models  ](../litellm/)



Table of contents 

  * handoff_prompt 
  * RECOMMENDED_PROMPT_PREFIX 
  * prompt_with_handoff_instructions 



# `Handoff prompt`

###  RECOMMENDED_PROMPT_PREFIX `module-attribute`
    
    
    RECOMMENDED_PROMPT_PREFIX = "# System context\nYou are part of a multi-agent system called the Agents SDK, designed to make agent coordination and execution easy. Agents uses two primary abstraction: **Agents** and **Handoffs**. An agent encompasses instructions and tools and can hand off a conversation to another agent when appropriate. Handoffs are achieved by calling a handoff function, generally named `transfer_to_<agent_name>`. Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user.\n"
    

###  prompt_with_handoff_instructions
    
    
    prompt_with_handoff_instructions(prompt: str) -> str
    

Add recommended instructions to the prompt for agents that use handoffs.

Source code in `src/agents/extensions/handoff_prompt.py`
    
    
    15
    16
    17
    18
    19

| 
    
    
    def prompt_with_handoff_instructions(prompt: str) -> str:
        """
        Add recommended instructions to the prompt for agents that use handoffs.
        """
        return f"{RECOMMENDED_PROMPT_PREFIX}\n\n{prompt}"
      
  
---|---
