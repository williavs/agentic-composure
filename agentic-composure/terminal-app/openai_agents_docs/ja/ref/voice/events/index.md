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
        [VoiceStreamEventAudio](../../../../ref/voice/events/#agents.voice.events.VoiceStreamEventAudio "VoiceStreamEventAudio
    
    
      
          dataclass
       \(agents.voice.events.VoiceStreamEventAudio\)"),
        [VoiceStreamEventLifecycle](../../../../ref/voice/events/#agents.voice.events.VoiceStreamEventLifecycle "VoiceStreamEventLifecycle
    
    
      
          dataclass
       \(agents.voice.events.VoiceStreamEventLifecycle\)"),
        [VoiceStreamEventError](../../../../ref/voice/events/#agents.voice.events.VoiceStreamEventError "VoiceStreamEventError
    
    
      
          dataclass
       \(agents.voice.events.VoiceStreamEventError\)"),
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
