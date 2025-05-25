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

  * input 
  * AudioInput 
    * buffer 
    * frame_rate 
    * sample_width 
    * channels 
    * to_audio_file 
    * to_base64 
  * StreamedAudioInput 
    * add_audio 



# `Input`

###  AudioInput `dataclass`

Static audio to be used as input for the VoicePipeline.

Source code in `src/agents/voice/input.py`
    
    
    40
    41
    42
    43
    44
    45
    46
    47
    48
    49
    50
    51
    52
    53
    54
    55
    56
    57
    58
    59
    60
    61
    62
    63
    64
    65
    66
    67
    68
    69
    70
    71

| 
    
    
    @dataclass
    class AudioInput:
        """Static audio to be used as input for the VoicePipeline."""
    
        buffer: npt.NDArray[np.int16 | np.float32]
        """
        A buffer containing the audio data for the agent. Must be a numpy array of int16 or float32.
        """
    
        frame_rate: int = DEFAULT_SAMPLE_RATE
        """The sample rate of the audio data. Defaults to 24000."""
    
        sample_width: int = 2
        """The sample width of the audio data. Defaults to 2."""
    
        channels: int = 1
        """The number of channels in the audio data. Defaults to 1."""
    
        def to_audio_file(self) -> tuple[str, io.BytesIO, str]:
            """Returns a tuple of (filename, bytes, content_type)"""
            return _buffer_to_audio_file(self.buffer, self.frame_rate, self.sample_width, self.channels)
    
        def to_base64(self) -> str:
            """Returns the audio data as a base64 encoded string."""
            if self.buffer.dtype == np.float32:
                # convert to int16
                self.buffer = np.clip(self.buffer, -1.0, 1.0)
                self.buffer = (self.buffer * 32767).astype(np.int16)
            elif self.buffer.dtype != np.int16:
                raise UserError("Buffer must be a numpy array of int16 or float32")
    
            return base64.b64encode(self.buffer.tobytes()).decode("utf-8")
      
  
---|---  
  
####  buffer `instance-attribute`
    
    
    buffer: NDArray[int16 | float32]
    

A buffer containing the audio data for the agent. Must be a numpy array of int16 or float32.

####  frame_rate `class-attribute` `instance-attribute`
    
    
    frame_rate: int = DEFAULT_SAMPLE_RATE
    

The sample rate of the audio data. Defaults to 24000.

####  sample_width `class-attribute` `instance-attribute`
    
    
    sample_width: int = 2
    

The sample width of the audio data. Defaults to 2.

####  channels `class-attribute` `instance-attribute`
    
    
    channels: int = 1
    

The number of channels in the audio data. Defaults to 1.

####  to_audio_file
    
    
    to_audio_file() -> tuple[str, BytesIO, str]
    

Returns a tuple of (filename, bytes, content_type)

Source code in `src/agents/voice/input.py`
    
    
    58
    59
    60

| 
    
    
    def to_audio_file(self) -> tuple[str, io.BytesIO, str]:
        """Returns a tuple of (filename, bytes, content_type)"""
        return _buffer_to_audio_file(self.buffer, self.frame_rate, self.sample_width, self.channels)
      
  
---|---  
  
####  to_base64
    
    
    to_base64() -> str
    

Returns the audio data as a base64 encoded string.

Source code in `src/agents/voice/input.py`
    
    
    62
    63
    64
    65
    66
    67
    68
    69
    70
    71

| 
    
    
    def to_base64(self) -> str:
        """Returns the audio data as a base64 encoded string."""
        if self.buffer.dtype == np.float32:
            # convert to int16
            self.buffer = np.clip(self.buffer, -1.0, 1.0)
            self.buffer = (self.buffer * 32767).astype(np.int16)
        elif self.buffer.dtype != np.int16:
            raise UserError("Buffer must be a numpy array of int16 or float32")
    
        return base64.b64encode(self.buffer.tobytes()).decode("utf-8")
      
  
---|---  
  
###  StreamedAudioInput

Audio input represented as a stream of audio data. You can pass this to the `VoicePipeline` and then push audio data into the queue using the `add_audio` method.

Source code in `src/agents/voice/input.py`
    
    
    74
    75
    76
    77
    78
    79
    80
    81
    82
    83
    84
    85
    86
    87
    88

| 
    
    
    class StreamedAudioInput:
        """Audio input represented as a stream of audio data. You can pass this to the `VoicePipeline`
        and then push audio data into the queue using the `add_audio` method.
        """
    
        def __init__(self):
            self.queue: asyncio.Queue[npt.NDArray[np.int16 | np.float32]] = asyncio.Queue()
    
        async def add_audio(self, audio: npt.NDArray[np.int16 | np.float32]):
            """Adds more audio data to the stream.
    
            Args:
                audio: The audio data to add. Must be a numpy array of int16 or float32.
            """
            await self.queue.put(audio)
      
  
---|---  
  
####  add_audio `async`
    
    
    add_audio(audio: NDArray[int16 | float32])
    

Adds more audio data to the stream.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`audio` |  `NDArray[int16 | float32]` |  The audio data to add. Must be a numpy array of int16 or float32. |  _required_  
Source code in `src/agents/voice/input.py`
    
    
    82
    83
    84
    85
    86
    87
    88

| 
    
    
    async def add_audio(self, audio: npt.NDArray[np.int16 | np.float32]):
        """Adds more audio data to the stream.
    
        Args:
            audio: The audio data to add. Must be a numpy array of int16 or float32.
        """
        await self.queue.put(audio)
      
  
---|---
