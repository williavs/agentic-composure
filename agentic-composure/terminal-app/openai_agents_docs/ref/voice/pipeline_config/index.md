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
      * Pipeline Config  [ Pipeline Config  ](./) Table of contents 
        * pipeline_config 
        * VoicePipelineConfig 
          * model_provider 
          * tracing_disabled 
          * trace_include_sensitive_data 
          * trace_include_sensitive_audio_data 
          * workflow_name 
          * group_id 
          * trace_metadata 
          * stt_settings 
          * tts_settings 
      * [ Events  ](../events/)
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

  * pipeline_config 
  * VoicePipelineConfig 
    * model_provider 
    * tracing_disabled 
    * trace_include_sensitive_data 
    * trace_include_sensitive_audio_data 
    * workflow_name 
    * group_id 
    * trace_metadata 
    * stt_settings 
    * tts_settings 



# `Pipeline Config`

###  VoicePipelineConfig `dataclass`

Configuration for a `VoicePipeline`.

Source code in `src/agents/voice/pipeline_config.py`
    
    
    11
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
    23
    24
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
    45
    46

| 
    
    
    @dataclass
    class VoicePipelineConfig:
        """Configuration for a `VoicePipeline`."""
    
        model_provider: VoiceModelProvider = field(default_factory=OpenAIVoiceModelProvider)
        """The voice model provider to use for the pipeline. Defaults to OpenAI."""
    
        tracing_disabled: bool = False
        """Whether to disable tracing of the pipeline. Defaults to `False`."""
    
        trace_include_sensitive_data: bool = True
        """Whether to include sensitive data in traces. Defaults to `True`. This is specifically for the
          voice pipeline, and not for anything that goes on inside your Workflow."""
    
        trace_include_sensitive_audio_data: bool = True
        """Whether to include audio data in traces. Defaults to `True`."""
    
        workflow_name: str = "Voice Agent"
        """The name of the workflow to use for tracing. Defaults to `Voice Agent`."""
    
        group_id: str = field(default_factory=gen_group_id)
        """
        A grouping identifier to use for tracing, to link multiple traces from the same conversation
        or process. If not provided, we will create a random group ID.
        """
    
        trace_metadata: dict[str, Any] | None = None
        """
        An optional dictionary of additional metadata to include with the trace.
        """
    
        stt_settings: STTModelSettings = field(default_factory=STTModelSettings)
        """The settings to use for the STT model."""
    
        tts_settings: TTSModelSettings = field(default_factory=TTSModelSettings)
        """The settings to use for the TTS model."""
      
  
---|---  
  
####  model_provider `class-attribute` `instance-attribute`
    
    
    model_provider: [VoiceModelProvider](../model/#agents.voice.model.VoiceModelProvider "VoiceModelProvider \(agents.voice.model.VoiceModelProvider\)") = field(
        default_factory=[OpenAIVoiceModelProvider](../models/openai_provider/#agents.voice.models.openai_model_provider.OpenAIVoiceModelProvider "OpenAIVoiceModelProvider \(agents.voice.models.openai_model_provider.OpenAIVoiceModelProvider\)")
    )
    

The voice model provider to use for the pipeline. Defaults to OpenAI.

####  tracing_disabled `class-attribute` `instance-attribute`
    
    
    tracing_disabled: bool = False
    

Whether to disable tracing of the pipeline. Defaults to `False`.

####  trace_include_sensitive_data `class-attribute` `instance-attribute`
    
    
    trace_include_sensitive_data: bool = True
    

Whether to include sensitive data in traces. Defaults to `True`. This is specifically for the voice pipeline, and not for anything that goes on inside your Workflow.

####  trace_include_sensitive_audio_data `class-attribute` `instance-attribute`
    
    
    trace_include_sensitive_audio_data: bool = True
    

Whether to include audio data in traces. Defaults to `True`.

####  workflow_name `class-attribute` `instance-attribute`
    
    
    workflow_name: str = 'Voice Agent'
    

The name of the workflow to use for tracing. Defaults to `Voice Agent`.

####  group_id `class-attribute` `instance-attribute`
    
    
    group_id: str = field(default_factory=[gen_group_id](../../tracing/util/#agents.tracing.util.gen_group_id "gen_group_id \(agents.tracing.util.gen_group_id\)"))
    

A grouping identifier to use for tracing, to link multiple traces from the same conversation or process. If not provided, we will create a random group ID.

####  trace_metadata `class-attribute` `instance-attribute`
    
    
    trace_metadata: dict[str, Any] | None = None
    

An optional dictionary of additional metadata to include with the trace.

####  stt_settings `class-attribute` `instance-attribute`
    
    
    stt_settings: [STTModelSettings](../model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)") = field(
        default_factory=[STTModelSettings](../model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)")
    )
    

The settings to use for the STT model.

####  tts_settings `class-attribute` `instance-attribute`
    
    
    tts_settings: [TTSModelSettings](../model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)") = field(
        default_factory=[TTSModelSettings](../model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)")
    )
    

The settings to use for the TTS model.
