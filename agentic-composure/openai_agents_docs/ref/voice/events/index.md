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
      * [ Pipeline  ](../pipeline/)
      * [ Workflow  ](../workflow/)
      * [ Input  ](../input/)
      * [ Result  ](../result/)
      * [ Pipeline Config  ](../pipeline_config/)
      * Events  [ Events  ](./) Table of contents 
        * events 
        * VoiceStreamEvent 
        * VoiceStreamEventAudio 
          * data 
          * type 
        * VoiceStreamEventLifecycle 
          * event 
          * type 
        * VoiceStreamEventError 
          * error 
          * type 
      * [ Exceptions  ](../exceptions/)
      * [ Model  ](../model/)
      * [ Utils  ](../utils/)
      * [ OpenAIVoiceModelProvider  ](../models/openai_provider/)
      * [ OpenAI STT  ](../models/openai_stt/)
      * [ OpenAI TTS  ](../models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../extensions/litellm/)



Table of contents 

  * events 
  * VoiceStreamEvent 
  * VoiceStreamEventAudio 
    * data 
    * type 
  * VoiceStreamEventLifecycle 
    * event 
    * type 
  * VoiceStreamEventError 
    * error 
    * type 



# `Events`

###  VoiceStreamEvent `module-attribute`
    
    
    VoiceStreamEvent: TypeAlias = Union[
        VoiceStreamEventAudio,
        VoiceStreamEventLifecycle,
        VoiceStreamEventError,
    ]
    

An event from the `VoicePipeline`, streamed via `StreamedAudioResult.stream()`.

###  VoiceStreamEventAudio `dataclass`

Streaming event from the VoicePipeline

Source code in `src/agents/voice/events.py`
    
    
    11
    12
    13
    14
    15
    16
    17
    18
    19

| 
    
    
    @dataclass
    class VoiceStreamEventAudio:
        """Streaming event from the VoicePipeline"""
    
        data: npt.NDArray[np.int16 | np.float32] | None
        """The audio data."""
    
        type: Literal["voice_stream_event_audio"] = "voice_stream_event_audio"
        """The type of event."""
      
  
---|---  
  
####  data `instance-attribute`
    
    
    data: NDArray[int16 | float32] | None
    

The audio data.

####  type `class-attribute` `instance-attribute`
    
    
    type: Literal["voice_stream_event_audio"] = (
        "voice_stream_event_audio"
    )
    

The type of event.

###  VoiceStreamEventLifecycle `dataclass`

Streaming event from the VoicePipeline

Source code in `src/agents/voice/events.py`
    
    
    22
    23
    24
    25
    26
    27
    28
    29
    30

| 
    
    
    @dataclass
    class VoiceStreamEventLifecycle:
        """Streaming event from the VoicePipeline"""
    
        event: Literal["turn_started", "turn_ended", "session_ended"]
        """The event that occurred."""
    
        type: Literal["voice_stream_event_lifecycle"] = "voice_stream_event_lifecycle"
        """The type of event."""
      
  
---|---  
  
####  event `instance-attribute`
    
    
    event: Literal[
        "turn_started", "turn_ended", "session_ended"
    ]
    

The event that occurred.

####  type `class-attribute` `instance-attribute`
    
    
    type: Literal["voice_stream_event_lifecycle"] = (
        "voice_stream_event_lifecycle"
    )
    

The type of event.

###  VoiceStreamEventError `dataclass`

Streaming event from the VoicePipeline

Source code in `src/agents/voice/events.py`
    
    
    33
    34
    35
    36
    37
    38
    39
    40
    41

| 
    
    
    @dataclass
    class VoiceStreamEventError:
        """Streaming event from the VoicePipeline"""
    
        error: Exception
        """The error that occurred."""
    
        type: Literal["voice_stream_event_error"] = "voice_stream_event_error"
        """The type of event."""
      
  
---|---  
  
####  error `instance-attribute`
    
    
    error: Exception
    

The error that occurred.

####  type `class-attribute` `instance-attribute`
    
    
    type: Literal["voice_stream_event_error"] = (
        "voice_stream_event_error"
    )
    

The type of event.
