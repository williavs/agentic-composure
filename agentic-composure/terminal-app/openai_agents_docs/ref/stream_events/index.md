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
      * Streaming events  [ Streaming events  ](./) Table of contents 
        * stream_events 
        * StreamEvent 
        * RawResponsesStreamEvent 
          * data 
          * type 
        * RunItemStreamEvent 
          * name 
          * item 
        * AgentUpdatedStreamEvent 
          * new_agent 
      * [ Handoffs  ](../handoffs/)
      * [ Lifecycle  ](../lifecycle/)
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

  * stream_events 
  * StreamEvent 
  * RawResponsesStreamEvent 
    * data 
    * type 
  * RunItemStreamEvent 
    * name 
    * item 
  * AgentUpdatedStreamEvent 
    * new_agent 



# `Streaming events`

###  StreamEvent `module-attribute`
    
    
    StreamEvent: TypeAlias = Union[
        RawResponsesStreamEvent,
        RunItemStreamEvent,
        AgentUpdatedStreamEvent,
    ]
    

A streaming event from an agent.

###  RawResponsesStreamEvent `dataclass`

Streaming event from the LLM. These are 'raw' events, i.e. they are directly passed through from the LLM.

Source code in `src/agents/stream_events.py`
    
    
    12
    13
    14
    15
    16
    17
    18
    19
    20
    21
    22

| 
    
    
    @dataclass
    class RawResponsesStreamEvent:
        """Streaming event from the LLM. These are 'raw' events, i.e. they are directly passed through
        from the LLM.
        """
    
        data: TResponseStreamEvent
        """The raw responses streaming event from the LLM."""
    
        type: Literal["raw_response_event"] = "raw_response_event"
        """The type of the event."""
      
  
---|---  
  
####  data `instance-attribute`
    
    
    data: [TResponseStreamEvent](../items/#agents.items.TResponseStreamEvent "TResponseStreamEvent
    
    
      
          module-attribute
       \(agents.items.TResponseStreamEvent\)")
    

The raw responses streaming event from the LLM.

####  type `class-attribute` `instance-attribute`
    
    
    type: Literal['raw_response_event'] = 'raw_response_event'
    

The type of the event.

###  RunItemStreamEvent `dataclass`

Streaming events that wrap a `RunItem`. As the agent processes the LLM response, it will generate these events for new messages, tool calls, tool outputs, handoffs, etc.

Source code in `src/agents/stream_events.py`
    
    
    25
    26
    27
    28
    29
    30
    31
    32
    33
    34
    35
    36
    37
    38
    39
    40
    41
    42
    43
    44

| 
    
    
    @dataclass
    class RunItemStreamEvent:
        """Streaming events that wrap a `RunItem`. As the agent processes the LLM response, it will
        generate these events for new messages, tool calls, tool outputs, handoffs, etc.
        """
    
        name: Literal[
            "message_output_created",
            "handoff_requested",
            "handoff_occured",
            "tool_called",
            "tool_output",
            "reasoning_item_created",
        ]
        """The name of the event."""
    
        item: RunItem
        """The item that was created."""
    
        type: Literal["run_item_stream_event"] = "run_item_stream_event"
      
  
---|---  
  
####  name `instance-attribute`
    
    
    name: Literal[
        "message_output_created",
        "handoff_requested",
        "handoff_occured",
        "tool_called",
        "tool_output",
        "reasoning_item_created",
    ]
    

The name of the event.

####  item `instance-attribute`
    
    
    item: [RunItem](../items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)")
    

The item that was created.

###  AgentUpdatedStreamEvent `dataclass`

Event that notifies that there is a new agent running.

Source code in `src/agents/stream_events.py`
    
    
    47
    48
    49
    50
    51
    52
    53
    54

| 
    
    
    @dataclass
    class AgentUpdatedStreamEvent:
        """Event that notifies that there is a new agent running."""
    
        new_agent: Agent[Any]
        """The new agent."""
    
        type: Literal["agent_updated_stream_event"] = "agent_updated_stream_event"
      
  
---|---  
  
####  new_agent `instance-attribute`
    
    
    new_agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any]
    

The new agent.
