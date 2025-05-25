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

  * openai_model_provider 
  * OpenAIVoiceModelProvider 
    * __init__ 
    * get_stt_model 
    * get_tts_model 



# `OpenAIVoiceModelProvider`

###  OpenAIVoiceModelProvider

Bases: `[VoiceModelProvider](../../../../../ref/voice/model/#agents.voice.model.VoiceModelProvider "VoiceModelProvider \(agents.voice.model.VoiceModelProvider\)")`

A voice model provider that uses OpenAI models.

Source code in `src/agents/voice/models/openai_model_provider.py`
    
    
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
    72
    73
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
    89
    90
    91
    92
    93
    94
    95
    96
    97

| 
    
    
    class OpenAIVoiceModelProvider(VoiceModelProvider):
        """A voice model provider that uses OpenAI models."""
    
        def __init__(
            self,
            *,
            api_key: str | None = None,
            base_url: str | None = None,
            openai_client: AsyncOpenAI | None = None,
            organization: str | None = None,
            project: str | None = None,
        ) -> None:
            """Create a new OpenAI voice model provider.
    
            Args:
                api_key: The API key to use for the OpenAI client. If not provided, we will use the
                    default API key.
                base_url: The base URL to use for the OpenAI client. If not provided, we will use the
                    default base URL.
                openai_client: An optional OpenAI client to use. If not provided, we will create a new
                    OpenAI client using the api_key and base_url.
                organization: The organization to use for the OpenAI client.
                project: The project to use for the OpenAI client.
            """
            if openai_client is not None:
                assert api_key is None and base_url is None, (
                    "Don't provide api_key or base_url if you provide openai_client"
                )
                self._client: AsyncOpenAI | None = openai_client
            else:
                self._client = None
                self._stored_api_key = api_key
                self._stored_base_url = base_url
                self._stored_organization = organization
                self._stored_project = project
    
        # We lazy load the client in case you never actually use OpenAIProvider(). Otherwise
        # AsyncOpenAI() raises an error if you don't have an API key set.
        def _get_client(self) -> AsyncOpenAI:
            if self._client is None:
                self._client = _openai_shared.get_default_openai_client() or AsyncOpenAI(
                    api_key=self._stored_api_key or _openai_shared.get_default_openai_key(),
                    base_url=self._stored_base_url,
                    organization=self._stored_organization,
                    project=self._stored_project,
                    http_client=shared_http_client(),
                )
    
            return self._client
    
        def get_stt_model(self, model_name: str | None) -> STTModel:
            """Get a speech-to-text model by name.
    
            Args:
                model_name: The name of the model to get.
    
            Returns:
                The speech-to-text model.
            """
            return OpenAISTTModel(model_name or DEFAULT_STT_MODEL, self._get_client())
    
        def get_tts_model(self, model_name: str | None) -> TTSModel:
            """Get a text-to-speech model by name.
    
            Args:
                model_name: The name of the model to get.
    
            Returns:
                The text-to-speech model.
            """
            return OpenAITTSModel(model_name or DEFAULT_TTS_MODEL, self._get_client())
      
  
---|---  
  
####  __init__
    
    
    __init__(
        *,
        api_key: str | None = None,
        base_url: str | None = None,
        openai_client: AsyncOpenAI | None = None,
        organization: str | None = None,
        project: str | None = None,
    ) -> None
    

Create a new OpenAI voice model provider.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`api_key` |  `str | None` |  The API key to use for the OpenAI client. If not provided, we will use the default API key. |  `None`  
`base_url` |  `str | None` |  The base URL to use for the OpenAI client. If not provided, we will use the default base URL. |  `None`  
`openai_client` |  `AsyncOpenAI | None` |  An optional OpenAI client to use. If not provided, we will create a new OpenAI client using the api_key and base_url. |  `None`  
`organization` |  `str | None` |  The organization to use for the OpenAI client. |  `None`  
`project` |  `str | None` |  The project to use for the OpenAI client. |  `None`  
Source code in `src/agents/voice/models/openai_model_provider.py`
    
    
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
    55
    56
    57
    58
    59
    60
    61

| 
    
    
    def __init__(
        self,
        *,
        api_key: str | None = None,
        base_url: str | None = None,
        openai_client: AsyncOpenAI | None = None,
        organization: str | None = None,
        project: str | None = None,
    ) -> None:
        """Create a new OpenAI voice model provider.
    
        Args:
            api_key: The API key to use for the OpenAI client. If not provided, we will use the
                default API key.
            base_url: The base URL to use for the OpenAI client. If not provided, we will use the
                default base URL.
            openai_client: An optional OpenAI client to use. If not provided, we will create a new
                OpenAI client using the api_key and base_url.
            organization: The organization to use for the OpenAI client.
            project: The project to use for the OpenAI client.
        """
        if openai_client is not None:
            assert api_key is None and base_url is None, (
                "Don't provide api_key or base_url if you provide openai_client"
            )
            self._client: AsyncOpenAI | None = openai_client
        else:
            self._client = None
            self._stored_api_key = api_key
            self._stored_base_url = base_url
            self._stored_organization = organization
            self._stored_project = project
      
  
---|---  
  
####  get_stt_model
    
    
    get_stt_model(model_name: str | None) -> [STTModel](../../../../../ref/voice/model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)")
    

Get a speech-to-text model by name.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model_name` |  `str | None` |  The name of the model to get. |  _required_  
  
Returns:

Type | Description  
---|---  
`[STTModel](../../../../../ref/voice/model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)")` |  The speech-to-text model.  
Source code in `src/agents/voice/models/openai_model_provider.py`
    
    
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

| 
    
    
    def get_stt_model(self, model_name: str | None) -> STTModel:
        """Get a speech-to-text model by name.
    
        Args:
            model_name: The name of the model to get.
    
        Returns:
            The speech-to-text model.
        """
        return OpenAISTTModel(model_name or DEFAULT_STT_MODEL, self._get_client())
      
  
---|---  
  
####  get_tts_model
    
    
    get_tts_model(model_name: str | None) -> [TTSModel](../../../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)")
    

Get a text-to-speech model by name.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model_name` |  `str | None` |  The name of the model to get. |  _required_  
  
Returns:

Type | Description  
---|---  
`[TTSModel](../../../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)")` |  The text-to-speech model.  
Source code in `src/agents/voice/models/openai_model_provider.py`
    
    
    88
    89
    90
    91
    92
    93
    94
    95
    96
    97

| 
    
    
    def get_tts_model(self, model_name: str | None) -> TTSModel:
        """Get a text-to-speech model by name.
    
        Args:
            model_name: The name of the model to get.
    
        Returns:
            The text-to-speech model.
        """
        return OpenAITTSModel(model_name or DEFAULT_TTS_MODEL, self._get_client())
      
  
---|---
