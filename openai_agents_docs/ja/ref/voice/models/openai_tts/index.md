[ ![logo](../../../../../assets/logo.svg) ](../../../../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../../../../)
  * [ クイックスタート  ](../../../../quickstart/)
  * [ コード例  ](../../../../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../../../../agents/)
    * [ エージェントの実行  ](../../../../running_agents/)
    * [ 結果  ](../../../../results/)
    * [ ストリーミング  ](../../../../streaming/)
    * [ ツール  ](../../../../tools/)
    * [ Model context protocol (MCP)  ](../../../../mcp/)
    * [ ハンドオフ  ](../../../../handoffs/)
    * [ トレーシング  ](../../../../tracing/)
    * [ コンテキスト管理  ](../../../../context/)
    * [ ガードレール  ](../../../../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../../../../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../../../../models/)
      * [ LiteLLM 経由でのモデル利用  ](../../../../models/litellm/)
    * [ SDK の設定  ](../../../../config/)
    * [ エージェントの可視化  ](../../../../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../../../../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../../../../voice/pipeline/)
      * [ トレーシング  ](../../../../voice/tracing/)



目次 

  * openai_tts 
  * OpenAITTSModel 
    * __init__ 
    * run 



# `OpenAI TTS`

###  OpenAITTSModel

Bases: `[TTSModel](../../../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)")`

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
        text: str, settings: [TTSModelSettings](../../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)")
    ) -> AsyncIterator[bytes]
    

Run the text-to-speech model.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`text` |  `str` |  The text to convert to speech. |  _required_  
`settings` |  `[TTSModelSettings](../../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings


  
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
