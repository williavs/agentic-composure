[ ![logo](../../../../assets/logo.svg) ](../../../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../../../)
  * [ クイックスタート  ](../../../quickstart/)
  * [ コード例  ](../../../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../../../agents/)
    * [ エージェントの実行  ](../../../running_agents/)
    * [ 結果  ](../../../results/)
    * [ ストリーミング  ](../../../streaming/)
    * [ ツール  ](../../../tools/)
    * [ Model context protocol (MCP)  ](../../../mcp/)
    * [ ハンドオフ  ](../../../handoffs/)
    * [ トレーシング  ](../../../tracing/)
    * [ コンテキスト管理  ](../../../context/)
    * [ ガードレール  ](../../../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../../../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../../../models/)
      * [ LiteLLM 経由でのモデル利用  ](../../../models/litellm/)
    * [ SDK の設定  ](../../../config/)
    * [ エージェントの可視化  ](../../../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../../../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../../../voice/pipeline/)
      * [ トレーシング  ](../../../voice/tracing/)



目次 

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
    
    
    model_provider: [VoiceModelProvider](../../../../ref/voice/model/#agents.voice.model.VoiceModelProvider "VoiceModelProvider \(agents.voice.model.VoiceModelProvider\)") = field(
        default_factory=[OpenAIVoiceModelProvider](../../../../ref/voice/models/openai_provider/#agents.voice.models.openai_model_provider.OpenAIVoiceModelProvider "OpenAIVoiceModelProvider \(agents.voice.models.openai_model_provider.OpenAIVoiceModelProvider\)")
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
    
    
    group_id: str = field(default_factory=[gen_group_id](../../../../ref/tracing/util/#agents.tracing.util.gen_group_id "gen_group_id \(agents.tracing.util.gen_group_id\)"))
    

A grouping identifier to use for tracing, to link multiple traces from the same conversation or process. If not provided, we will create a random group ID.

####  trace_metadata `class-attribute` `instance-attribute`
    
    
    trace_metadata: dict[str, Any] | None = None
    

An optional dictionary of additional metadata to include with the trace.

####  stt_settings `class-attribute` `instance-attribute`
    
    
    stt_settings: [STTModelSettings](../../../../ref/voice/model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)") = field(
        default_factory=[STTModelSettings](../../../../ref/voice/model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)")
    )
    

The settings to use for the STT model.

####  tts_settings `class-attribute` `instance-attribute`
    
    
    tts_settings: [TTSModelSettings](../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)") = field(
        default_factory=[TTSModelSettings](../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)")
    )
    

The settings to use for the TTS model.
