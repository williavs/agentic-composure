[ ![logo](../../../../assets/logo.svg) ](../../../.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](../../../..)
  * [ Quickstart  ](../../../../quickstart/)
  * [ Examples  ](../../../../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../../../../agents/)
    * [ Running agents  ](../../../../running_agents/)
    * [ Results  ](../../../../results/)
    * [ Streaming  ](../../../../streaming/)
    * [ Tools  ](../../../../tools/)
    * [ Model context protocol (MCP)  ](../../../../mcp/)
    * [ Handoffs  ](../../../../handoffs/)
    * [ Tracing  ](../../../../tracing/)
    * [ Context management  ](../../../../context/)
    * [ Guardrails  ](../../../../guardrails/)
    * [ Orchestrating multiple agents  ](../../../../multi_agent/)
    * Models  Models 
      * [ Models  ](../../../../models/)
      * [ Using any model via LiteLLM  ](../../../../models/litellm/)
    * [ Configuring the SDK  ](../../../../config/)
    * [ Agent Visualization  ](../../../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../../../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../../../voice/pipeline/)
      * [ Tracing  ](../../../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../../../)
      * [ Agents  ](../../../agent/)
      * [ Runner  ](../../../run/)
      * [ Tools  ](../../../tool/)
      * [ Results  ](../../../result/)
      * [ Streaming events  ](../../../stream_events/)
      * [ Handoffs  ](../../../handoffs/)
      * [ Lifecycle  ](../../../lifecycle/)
      * [ Items  ](../../../items/)
      * [ Run context  ](../../../run_context/)
      * [ Usage  ](../../../usage/)
      * [ Exceptions  ](../../../exceptions/)
      * [ Guardrails  ](../../../guardrail/)
      * [ Model settings  ](../../../model_settings/)
      * [ Agent output  ](../../../agent_output/)
      * [ Function schema  ](../../../function_schema/)
      * [ Model interface  ](../../../models/interface/)
      * [ OpenAI Chat Completions model  ](../../../models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../../../models/openai_responses/)
      * [ MCP Servers  ](../../../mcp/server/)
      * [ MCP Util  ](../../../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../../../tracing/)
      * [ Creating traces/spans  ](../../../tracing/create/)
      * [ Traces  ](../../../tracing/traces/)
      * [ Spans  ](../../../tracing/spans/)
      * [ Processor interface  ](../../../tracing/processor_interface/)
      * [ Processors  ](../../../tracing/processors/)
      * [ Scope  ](../../../tracing/scope/)
      * [ Setup  ](../../../tracing/setup/)
      * [ Span data  ](../../../tracing/span_data/)
      * [ Util  ](../../../tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../../pipeline/)
      * [ Workflow  ](../../workflow/)
      * [ Input  ](../../input/)
      * [ Result  ](../../result/)
      * [ Pipeline Config  ](../../pipeline_config/)
      * [ Events  ](../../events/)
      * [ Exceptions  ](../../exceptions/)
      * [ Model  ](../../model/)
      * [ Utils  ](../../utils/)
      * [ OpenAIVoiceModelProvider  ](../openai_provider/)
      * [ OpenAI STT  ](../openai_stt/)
      * OpenAI TTS  [ OpenAI TTS  ](./) Table of contents 
        * openai_tts 
        * OpenAITTSModel 
          * __init__ 
          * run 
    * Extensions  Extensions 
      * [ Handoff filters  ](../../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../../extensions/litellm/)



Table of contents 

  * openai_tts 
  * OpenAITTSModel 
    * __init__ 
    * run 



# `OpenAI TTS`

###  OpenAITTSModel

Bases: `[TTSModel](../../model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)")`

A text-to-speech model for OpenAI.

Source code in `src/agents/voice/models/openai_tts.py`
    
    
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
    47
    48
    49
    50
    51
    52
    53
    54

| 
    
    
    class OpenAITTSModel(TTSModel):
        """A text-to-speech model for OpenAI."""
    
        def __init__(
            self,
            model: str,
            openai_client: AsyncOpenAI,
        ):
            """Create a new OpenAI text-to-speech model.
    
            Args:
                model: The name of the model to use.
                openai_client: The OpenAI client to use.
            """
            self.model = model
            self._client = openai_client
    
        @property
        def model_name(self) -> str:
            return self.model
    
        async def run(self, text: str, settings: TTSModelSettings) -> AsyncIterator[bytes]:
            """Run the text-to-speech model.
    
            Args:
                text: The text to convert to speech.
                settings: The settings to use for the text-to-speech model.
    
            Returns:
                An iterator of audio chunks.
            """
            response = self._client.audio.speech.with_streaming_response.create(
                model=self.model,
                voice=settings.voice or DEFAULT_VOICE,
                input=text,
                response_format="pcm",
                extra_body={
                    "instructions": settings.instructions,
                },
            )
    
            async with response as stream:
                async for chunk in stream.iter_bytes(chunk_size=1024):
                    yield chunk
      
  
---|---  
  
####  __init__
    
    
    __init__(model: str, openai_client: AsyncOpenAI)
    

Create a new OpenAI text-to-speech model.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model` |  `str` |  The name of the model to use. |  _required_  
`openai_client` |  `AsyncOpenAI` |  The OpenAI client to use. |  _required_  
Source code in `src/agents/voice/models/openai_tts.py`
    
    
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

| 
    
    
    def __init__(
        self,
        model: str,
        openai_client: AsyncOpenAI,
    ):
        """Create a new OpenAI text-to-speech model.
    
        Args:
            model: The name of the model to use.
            openai_client: The OpenAI client to use.
        """
        self.model = model
        self._client = openai_client
      
  
---|---  
  
####  run `async`
    
    
    run(
        text: str, settings: [TTSModelSettings](../../model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)")
    ) -> AsyncIterator[bytes]
    

Run the text-to-speech model.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`text` |  `str` |  The text to convert to speech. |  _required_  
`settings` |  `[TTSModelSettings](../../model/#agents.voice.model.TTSModelSettings "TTSModelSettings


  
      dataclass
   \(agents.voice.model.TTSModelSettings\)")` |  The settings to use for the text-to-speech model. |  _required_  
  
Returns:

Type | Description  
---|---  
`AsyncIterator[bytes]` |  An iterator of audio chunks.  
Source code in `src/agents/voice/models/openai_tts.py`
    
    
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
    47
    48
    49
    50
    51
    52
    53
    54

| 
    
    
    async def run(self, text: str, settings: TTSModelSettings) -> AsyncIterator[bytes]:
        """Run the text-to-speech model.
    
        Args:
            text: The text to convert to speech.
            settings: The settings to use for the text-to-speech model.
    
        Returns:
            An iterator of audio chunks.
        """
        response = self._client.audio.speech.with_streaming_response.create(
            model=self.model,
            voice=settings.voice or DEFAULT_VOICE,
            input=text,
            response_format="pcm",
            extra_body={
                "instructions": settings.instructions,
            },
        )
    
        async with response as stream:
            async for chunk in stream.iter_bytes(chunk_size=1024):
                yield chunk
      
  
---|---
