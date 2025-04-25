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
      * Input  [ Input  ](./) Table of contents 
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
      * [ Result  ](../result/)
      * [ Pipeline Config  ](../pipeline_config/)
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
