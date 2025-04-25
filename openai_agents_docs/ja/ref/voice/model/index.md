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

  * model 
  * TTSVoice 
  * TTSModelSettings 
    * voice 
    * buffer_size 
    * dtype 
    * transform_data 
    * instructions 
    * text_splitter 
    * speed 
  * TTSModel 
    * model_name 
    * run 
  * StreamedTranscriptionSession 
    * transcribe_turns 
    * close 
  * STTModelSettings 
    * prompt 
    * language 
    * temperature 
    * turn_detection 
  * STTModel 
    * model_name 
    * transcribe 
    * create_session 
  * VoiceModelProvider 
    * get_stt_model 
    * get_tts_model 



# `Model`

###  TTSVoice `module-attribute`
    
    
    TTSVoice = Literal[
        "alloy",
        "ash",
        "coral",
        "echo",
        "fable",
        "onyx",
        "nova",
        "sage",
        "shimmer",
    ]
    

Exportable type for the TTSModelSettings voice enum

###  TTSModelSettings `dataclass`

Settings for a TTS model.

Source code in `src/agents/voice/model.py`
    
    
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
    55
    56
    57
    58
    59

| 
    
    
    @dataclass
    class TTSModelSettings:
        """Settings for a TTS model."""
        voice: TTSVoice | None = None
        """
        The voice to use for the TTS model. If not provided, the default voice for the respective model
        will be used.
        """
    
        buffer_size: int = 120
        """The minimal size of the chunks of audio data that are being streamed out."""
    
        dtype: npt.DTypeLike = np.int16
        """The data type for the audio data to be returned in."""
    
        transform_data: (
            Callable[[npt.NDArray[np.int16 | np.float32]], npt.NDArray[np.int16 | np.float32]] | None
        ) = None
        """
        A function to transform the data from the TTS model. This is useful if you want the resulting
        audio stream to have the data in a specific shape already.
        """
    
        instructions: str = (
            "You will receive partial sentences. Do not complete the sentence just read out the text."
        )
        """
        The instructions to use for the TTS model. This is useful if you want to control the tone of the
        audio output.
        """
    
        text_splitter: Callable[[str], tuple[str, str]] = get_sentence_based_splitter()
        """
        A function to split the text into chunks. This is useful if you want to split the text into
        chunks before sending it to the TTS model rather than waiting for the whole text to be
        processed.
        """
    
        speed: float | None = None
        """The speed with which the TTS model will read the text. Between 0.25 and 4.0."""
      
  
---|---  
  
####  voice `class-attribute` `instance-attribute`
    
    
    voice: [TTSVoice](../../../../ref/voice/model/#agents.voice.model.TTSVoice "TTSVoice
    
    
      
          module-attribute
       \(agents.voice.model.TTSVoice\)") | None = None
    

The voice to use for the TTS model. If not provided, the default voice for the respective model will be used.

####  buffer_size `class-attribute` `instance-attribute`
    
    
    buffer_size: int = 120
    

The minimal size of the chunks of audio data that are being streamed out.

####  dtype `class-attribute` `instance-attribute`
    
    
    dtype: DTypeLike = int16
    

The data type for the audio data to be returned in.

####  transform_data `class-attribute` `instance-attribute`
    
    
    transform_data: (
        Callable[
            [NDArray[int16 | float32]], NDArray[int16 | float32]
        ]
        | None
    ) = None
    

A function to transform the data from the TTS model. This is useful if you want the resulting audio stream to have the data in a specific shape already.

####  instructions `class-attribute` `instance-attribute`
    
    
    instructions: str = "You will receive partial sentences. Do not complete the sentence just read out the text."
    

The instructions to use for the TTS model. This is useful if you want to control the tone of the audio output.

####  text_splitter `class-attribute` `instance-attribute`
    
    
    text_splitter: Callable[[str], tuple[str, str]] = (
        [get_sentence_based_splitter](../../../../ref/voice/utils/#agents.voice.utils.get_sentence_based_splitter "get_sentence_based_splitter \(agents.voice.utils.get_sentence_based_splitter\)")()
    )
    

A function to split the text into chunks. This is useful if you want to split the text into chunks before sending it to the TTS model rather than waiting for the whole text to be processed.

####  speed `class-attribute` `instance-attribute`
    
    
    speed: float | None = None
    

The speed with which the TTS model will read the text. Between 0.25 and 4.0.

###  TTSModel

Bases: `ABC`

A text-to-speech model that can convert text into audio output.

Source code in `src/agents/voice/model.py`
    
    
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

| 
    
    
    class TTSModel(abc.ABC):
        """A text-to-speech model that can convert text into audio output."""
    
        @property
        @abc.abstractmethod
        def model_name(self) -> str:
            """The name of the TTS model."""
            pass
    
        @abc.abstractmethod
        def run(self, text: str, settings: TTSModelSettings) -> AsyncIterator[bytes]:
            """Given a text string, produces a stream of audio bytes, in PCM format.
    
            Args:
                text: The text to convert to audio.
    
            Returns:
                An async iterator of audio bytes, in PCM format.
            """
            pass
      
  
---|---  
  
####  model_name `abstractmethod` `property`
    
    
    model_name: str
    

The name of the TTS model.

####  run `abstractmethod`
    
    
    run(
        text: str, settings: [TTSModelSettings](../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)")
    ) -> AsyncIterator[bytes]
    

Given a text string, produces a stream of audio bytes, in PCM format.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`text` |  `str` |  The text to convert to audio. |  _required_  
  
Returns:

Type | Description  
---|---  
`AsyncIterator[bytes]` |  An async iterator of audio bytes, in PCM format.  
Source code in `src/agents/voice/model.py`
    
    
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

| 
    
    
    @abc.abstractmethod
    def run(self, text: str, settings: TTSModelSettings) -> AsyncIterator[bytes]:
        """Given a text string, produces a stream of audio bytes, in PCM format.
    
        Args:
            text: The text to convert to audio.
    
        Returns:
            An async iterator of audio bytes, in PCM format.
        """
        pass
      
  
---|---  
  
###  StreamedTranscriptionSession

Bases: `ABC`

A streamed transcription of audio input.

Source code in `src/agents/voice/model.py`
    
    
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
    98

| 
    
    
    class StreamedTranscriptionSession(abc.ABC):
        """A streamed transcription of audio input."""
    
        @abc.abstractmethod
        def transcribe_turns(self) -> AsyncIterator[str]:
            """Yields a stream of text transcriptions. Each transcription is a turn in the conversation.
    
            This method is expected to return only after `close()` is called.
            """
            pass
    
        @abc.abstractmethod
        async def close(self) -> None:
            """Closes the session."""
            pass
      
  
---|---  
  
####  transcribe_turns `abstractmethod`
    
    
    transcribe_turns() -> AsyncIterator[str]
    

Yields a stream of text transcriptions. Each transcription is a turn in the conversation.

This method is expected to return only after `close()` is called.

Source code in `src/agents/voice/model.py`
    
    
    87
    88
    89
    90
    91
    92
    93

| 
    
    
    @abc.abstractmethod
    def transcribe_turns(self) -> AsyncIterator[str]:
        """Yields a stream of text transcriptions. Each transcription is a turn in the conversation.
    
        This method is expected to return only after `close()` is called.
        """
        pass
      
  
---|---  
  
####  close `abstractmethod` `async`
    
    
    close() -> None
    

Closes the session.

Source code in `src/agents/voice/model.py`
    
    
    95
    96
    97
    98

| 
    
    
    @abc.abstractmethod
    async def close(self) -> None:
        """Closes the session."""
        pass
      
  
---|---  
  
###  STTModelSettings `dataclass`

Settings for a speech-to-text model.

Source code in `src/agents/voice/model.py`
    
    
    101
    102
    103
    104
    105
    106
    107
    108
    109
    110
    111
    112
    113
    114
    115

| 
    
    
    @dataclass
    class STTModelSettings:
        """Settings for a speech-to-text model."""
    
        prompt: str | None = None
        """Instructions for the model to follow."""
    
        language: str | None = None
        """The language of the audio input."""
    
        temperature: float | None = None
        """The temperature of the model."""
    
        turn_detection: dict[str, Any] | None = None
        """The turn detection settings for the model when using streamed audio input."""
      
  
---|---  
  
####  prompt `class-attribute` `instance-attribute`
    
    
    prompt: str | None = None
    

Instructions for the model to follow.

####  language `class-attribute` `instance-attribute`
    
    
    language: str | None = None
    

The language of the audio input.

####  temperature `class-attribute` `instance-attribute`
    
    
    temperature: float | None = None
    

The temperature of the model.

####  turn_detection `class-attribute` `instance-attribute`
    
    
    turn_detection: dict[str, Any] | None = None
    

The turn detection settings for the model when using streamed audio input.

###  STTModel

Bases: `ABC`

A speech-to-text model that can convert audio input into text.

Source code in `src/agents/voice/model.py`
    
    
    118
    119
    120
    121
    122
    123
    124
    125
    126
    127
    128
    129
    130
    131
    132
    133
    134
    135
    136
    137
    138
    139
    140
    141
    142
    143
    144
    145
    146
    147
    148
    149
    150
    151
    152
    153
    154
    155
    156
    157
    158
    159
    160
    161
    162
    163
    164
    165
    166
    167
    168

| 
    
    
    class STTModel(abc.ABC):
        """A speech-to-text model that can convert audio input into text."""
    
        @property
        @abc.abstractmethod
        def model_name(self) -> str:
            """The name of the STT model."""
            pass
    
        @abc.abstractmethod
        async def transcribe(
            self,
            input: AudioInput,
            settings: STTModelSettings,
            trace_include_sensitive_data: bool,
            trace_include_sensitive_audio_data: bool,
        ) -> str:
            """Given an audio input, produces a text transcription.
    
            Args:
                input: The audio input to transcribe.
                settings: The settings to use for the transcription.
                trace_include_sensitive_data: Whether to include sensitive data in traces.
                trace_include_sensitive_audio_data: Whether to include sensitive audio data in traces.
    
            Returns:
                The text transcription of the audio input.
            """
            pass
    
        @abc.abstractmethod
        async def create_session(
            self,
            input: StreamedAudioInput,
            settings: STTModelSettings,
            trace_include_sensitive_data: bool,
            trace_include_sensitive_audio_data: bool,
        ) -> StreamedTranscriptionSession:
            """Creates a new transcription session, which you can push audio to, and receive a stream
            of text transcriptions.
    
            Args:
                input: The audio input to transcribe.
                settings: The settings to use for the transcription.
                trace_include_sensitive_data: Whether to include sensitive data in traces.
                trace_include_sensitive_audio_data: Whether to include sensitive audio data in traces.
    
            Returns:
                A new transcription session.
            """
            pass
      
  
---|---  
  
####  model_name `abstractmethod` `property`
    
    
    model_name: str
    

The name of the STT model.

####  transcribe `abstractmethod` `async`
    
    
    transcribe(
        input: [AudioInput](../../../../ref/voice/input/#agents.voice.input.AudioInput "AudioInput
    
    
      
          dataclass
       \(agents.voice.input.AudioInput\)"),
        settings: [STTModelSettings](../../../../ref/voice/model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)"),
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> str
    

Given an audio input, produces a text transcription.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`input` |  `[AudioInput](../../../../ref/voice/input/#agents.voice.input.AudioInput "AudioInput


  
      dataclass
   \(agents.voice.input.AudioInput\)")` |  The audio input to transcribe. |  _required_  
`settings` |  `[STTModelSettings](../../../../ref/voice/model/#agents.voice.model.STTModelSettings "STTModelSettings


  
      dataclass
   \(agents.voice.model.STTModelSettings\)")` |  The settings to use for the transcription. |  _required_  
`trace_include_sensitive_data` |  `bool` |  Whether to include sensitive data in traces. |  _required_  
`trace_include_sensitive_audio_data` |  `bool` |  Whether to include sensitive audio data in traces. |  _required_  
  
Returns:

Type | Description  
---|---  
`str` |  The text transcription of the audio input.  
Source code in `src/agents/voice/model.py`
    
    
    127
    128
    129
    130
    131
    132
    133
    134
    135
    136
    137
    138
    139
    140
    141
    142
    143
    144
    145
    146

| 
    
    
    @abc.abstractmethod
    async def transcribe(
        self,
        input: AudioInput,
        settings: STTModelSettings,
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> str:
        """Given an audio input, produces a text transcription.
    
        Args:
            input: The audio input to transcribe.
            settings: The settings to use for the transcription.
            trace_include_sensitive_data: Whether to include sensitive data in traces.
            trace_include_sensitive_audio_data: Whether to include sensitive audio data in traces.
    
        Returns:
            The text transcription of the audio input.
        """
        pass
      
  
---|---  
  
####  create_session `abstractmethod` `async`
    
    
    create_session(
        input: [StreamedAudioInput](../../../../ref/voice/input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput \(agents.voice.input.StreamedAudioInput\)"),
        settings: [STTModelSettings](../../../../ref/voice/model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)"),
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> [StreamedTranscriptionSession](../../../../ref/voice/model/#agents.voice.model.StreamedTranscriptionSession "StreamedTranscriptionSession \(agents.voice.model.StreamedTranscriptionSession\)")
    

Creates a new transcription session, which you can push audio to, and receive a stream of text transcriptions.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`input` |  `[StreamedAudioInput](../../../../ref/voice/input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput \(agents.voice.input.StreamedAudioInput\)")` |  The audio input to transcribe. |  _required_  
`settings` |  `[STTModelSettings](../../../../ref/voice/model/#agents.voice.model.STTModelSettings "STTModelSettings


  
      dataclass
   \(agents.voice.model.STTModelSettings\)")` |  The settings to use for the transcription. |  _required_  
`trace_include_sensitive_data` |  `bool` |  Whether to include sensitive data in traces. |  _required_  
`trace_include_sensitive_audio_data` |  `bool` |  Whether to include sensitive audio data in traces. |  _required_  
  
Returns:

Type | Description  
---|---  
`[StreamedTranscriptionSession](../../../../ref/voice/model/#agents.voice.model.StreamedTranscriptionSession "StreamedTranscriptionSession \(agents.voice.model.StreamedTranscriptionSession\)")` |  A new transcription session.  
Source code in `src/agents/voice/model.py`
    
    
    148
    149
    150
    151
    152
    153
    154
    155
    156
    157
    158
    159
    160
    161
    162
    163
    164
    165
    166
    167
    168

| 
    
    
    @abc.abstractmethod
    async def create_session(
        self,
        input: StreamedAudioInput,
        settings: STTModelSettings,
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> StreamedTranscriptionSession:
        """Creates a new transcription session, which you can push audio to, and receive a stream
        of text transcriptions.
    
        Args:
            input: The audio input to transcribe.
            settings: The settings to use for the transcription.
            trace_include_sensitive_data: Whether to include sensitive data in traces.
            trace_include_sensitive_audio_data: Whether to include sensitive audio data in traces.
    
        Returns:
            A new transcription session.
        """
        pass
      
  
---|---  
  
###  VoiceModelProvider

Bases: `ABC`

The base interface for a voice model provider.

A model provider is responsible for creating speech-to-text and text-to-speech models, given a name.

Source code in `src/agents/voice/model.py`
    
    
    171
    172
    173
    174
    175
    176
    177
    178
    179
    180
    181
    182
    183
    184
    185
    186
    187
    188
    189
    190
    191
    192

| 
    
    
    class VoiceModelProvider(abc.ABC):
        """The base interface for a voice model provider.
    
        A model provider is responsible for creating speech-to-text and text-to-speech models, given a
        name.
        """
    
        @abc.abstractmethod
        def get_stt_model(self, model_name: str | None) -> STTModel:
            """Get a speech-to-text model by name.
    
            Args:
                model_name: The name of the model to get.
    
            Returns:
                The speech-to-text model.
            """
            pass
    
        @abc.abstractmethod
        def get_tts_model(self, model_name: str | None) -> TTSModel:
            """Get a text-to-speech model by name."""
      
  
---|---  
  
####  get_stt_model `abstractmethod`
    
    
    get_stt_model(model_name: str | None) -> [STTModel](../../../../ref/voice/model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)")
    

Get a speech-to-text model by name.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model_name` |  `str | None` |  The name of the model to get. |  _required_  
  
Returns:

Type | Description  
---|---  
`[STTModel](../../../../ref/voice/model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)")` |  The speech-to-text model.  
Source code in `src/agents/voice/model.py`
    
    
    178
    179
    180
    181
    182
    183
    184
    185
    186
    187
    188

| 
    
    
    @abc.abstractmethod
    def get_stt_model(self, model_name: str | None) -> STTModel:
        """Get a speech-to-text model by name.
    
        Args:
            model_name: The name of the model to get.
    
        Returns:
            The speech-to-text model.
        """
        pass
      
  
---|---  
  
####  get_tts_model `abstractmethod`
    
    
    get_tts_model(model_name: str | None) -> [TTSModel](../../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)")
    

Get a text-to-speech model by name.

Source code in `src/agents/voice/model.py`
    
    
    190
    191
    192

| 
    
    
    @abc.abstractmethod
    def get_tts_model(self, model_name: str | None) -> TTSModel:
        """Get a text-to-speech model by name."""
      
  
---|---
