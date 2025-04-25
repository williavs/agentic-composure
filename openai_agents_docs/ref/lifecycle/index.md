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
      * [ Quickstart  ](../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../voice/pipeline/)
      * [ Tracing  ](../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../)
      * [ Agents  ](../agent/)
      * [ Runner  ](../run/)
      * [ Tools  ](../tool/)
      * [ Results  ](../result/)
      * [ Streaming events  ](../stream_events/)
      * [ Handoffs  ](../handoffs/)
      * Lifecycle  [ Lifecycle  ](./) Table of contents 
        * lifecycle 
        * RunHooks 
          * on_agent_start 
          * on_agent_end 
          * on_handoff 
          * on_tool_start 
          * on_tool_end 
        * AgentHooks 
          * on_start 
          * on_end 
          * on_handoff 
          * on_tool_start 
          * on_tool_end 
      * [ Items  ](../items/)
      * [ Run context  ](../run_context/)
      * [ Usage  ](../usage/)
      * [ Exceptions  ](../exceptions/)
      * [ Guardrails  ](../guardrail/)
      * [ Model settings  ](../model_settings/)
      * [ Agent output  ](../agent_output/)
      * [ Function schema  ](../function_schema/)
      * [ Model interface  ](../models/interface/)
      * [ OpenAI Chat Completions model  ](../models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../models/openai_responses/)
      * [ MCP Servers  ](../mcp/server/)
      * [ MCP Util  ](../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../tracing/)
      * [ Creating traces/spans  ](../tracing/create/)
      * [ Traces  ](../tracing/traces/)
      * [ Spans  ](../tracing/spans/)
      * [ Processor interface  ](../tracing/processor_interface/)
      * [ Processors  ](../tracing/processors/)
      * [ Scope  ](../tracing/scope/)
      * [ Setup  ](../tracing/setup/)
      * [ Span data  ](../tracing/span_data/)
      * [ Util  ](../tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../voice/pipeline/)
      * [ Workflow  ](../voice/workflow/)
      * [ Input  ](../voice/input/)
      * [ Result  ](../voice/result/)
      * [ Pipeline Config  ](../voice/pipeline_config/)
      * [ Events  ](../voice/events/)
      * [ Exceptions  ](../voice/exceptions/)
      * [ Model  ](../voice/model/)
      * [ Utils  ](../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../voice/models/openai_provider/)
      * [ OpenAI STT  ](../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../extensions/handoff_filters/)
      * [ Handoff prompt  ](../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../extensions/litellm/)



Table of contents 

  * lifecycle 
  * RunHooks 
    * on_agent_start 
    * on_agent_end 
    * on_handoff 
    * on_tool_start 
    * on_tool_end 
  * AgentHooks 
    * on_start 
    * on_end 
    * on_handoff 
    * on_tool_start 
    * on_tool_end 



# `Lifecycle`

###  RunHooks

Bases: `Generic[TContext]`

A class that receives callbacks on various lifecycle events in an agent run. Subclass and override the methods you need.

####  on_agent_start `async`
    
    
    on_agent_start(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called before the agent is invoked. Called each time the current agent changes.

####  on_agent_end `async`
    
    
    on_agent_end(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        output: Any,
    ) -> None
    

Called when the agent produces a final output.

####  on_handoff `async`
    
    
    on_handoff(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        from_agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        to_agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called when a handoff occurs.

####  on_tool_start `async`
    
    
    on_tool_start(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
    ) -> None
    

Called before a tool is invoked.

####  on_tool_end `async`
    
    
    on_tool_end(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
        result: str,
    ) -> None
    

Called after a tool is invoked.

###  AgentHooks

Bases: `Generic[TContext]`

A class that receives callbacks on various lifecycle events for a specific agent. You can set this on `agent.hooks` to receive events for that specific agent.

Subclass and override the methods you need.

####  on_start `async`
    
    
    on_start(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called before the agent is invoked. Called each time the running agent is changed to this agent.

####  on_end `async`
    
    
    on_end(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        output: Any,
    ) -> None
    

Called when the agent produces a final output.

####  on_handoff `async`
    
    
    on_handoff(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        source: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called when the agent is being handed off to. The `source` is the agent that is handing off to this agent.

####  on_tool_start `async`
    
    
    on_tool_start(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
    ) -> None
    

Called before a tool is invoked.

####  on_tool_end `async`
    
    
    on_tool_end(
        context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
        result: str,
    ) -> None
    

Called after a tool is invoked.
