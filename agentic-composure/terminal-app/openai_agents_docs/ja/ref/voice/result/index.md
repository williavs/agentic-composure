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

  * result 
  * StreamedAudioResult 
    * __init__ 
    * stream 



# `Result`

###  StreamedAudioResult

The output of a `VoicePipeline`. Streams events and audio data as they're generated.

Source code in `src/agents/voice/result.py`
    
    
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
     98
     99
    100
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
    116
    117
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
    169
    170
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
    193
    194
    195
    196
    197
    198
    199
    200
    201
    202
    203
    204
    205
    206
    207
    208
    209
    210
    211
    212
    213
    214
    215
    216
    217
    218
    219
    220
    221
    222
    223
    224
    225
    226
    227
    228
    229
    230
    231
    232
    233
    234
    235
    236
    237
    238
    239
    240
    241
    242
    243
    244
    245
    246
    247
    248
    249
    250
    251
    252
    253
    254
    255
    256
    257
    258
    259
    260
    261
    262
    263
    264
    265
    266
    267
    268
    269
    270
    271
    272
    273
    274
    275
    276
    277
    278
    279
    280
    281
    282
    283
    284
    285
    286
    287

| 
    
    
    class StreamedAudioResult:
        """The output of a `VoicePipeline`. Streams events and audio data as they're generated."""
    
        def __init__(
            self,
            tts_model: TTSModel,
            tts_settings: TTSModelSettings,
            voice_pipeline_config: VoicePipelineConfig,
        ):
            """Create a new `StreamedAudioResult` instance.
    
            Args:
                tts_model: The TTS model to use.
                tts_settings: The TTS settings to use.
                voice_pipeline_config: The voice pipeline config to use.
            """
            self.tts_model = tts_model
            self.tts_settings = tts_settings
            self.total_output_text = ""
            self.instructions = tts_settings.instructions
            self.text_generation_task: asyncio.Task[Any] | None = None
    
            self._voice_pipeline_config = voice_pipeline_config
            self._text_buffer = ""
            self._turn_text_buffer = ""
            self._queue: asyncio.Queue[VoiceStreamEvent] = asyncio.Queue()
            self._tasks: list[asyncio.Task[Any]] = []
            self._ordered_tasks: list[
                asyncio.Queue[VoiceStreamEvent | None]
            ] = []  # New: list to hold local queues for each text segment
            self._dispatcher_task: asyncio.Task[Any] | None = (
                None  # Task to dispatch audio chunks in order
            )
    
            self._done_processing = False
            self._buffer_size = tts_settings.buffer_size
            self._started_processing_turn = False
            self._first_byte_received = False
            self._generation_start_time: str | None = None
            self._completed_session = False
            self._stored_exception: BaseException | None = None
            self._tracing_span: Span[SpeechGroupSpanData] | None = None
    
        async def _start_turn(self):
            if self._started_processing_turn:
                return
    
            self._tracing_span = speech_group_span()
            self._tracing_span.start()
            self._started_processing_turn = True
            self._first_byte_received = False
            self._generation_start_time = time_iso()
            await self._queue.put(VoiceStreamEventLifecycle(event="turn_started"))
    
        def _set_task(self, task: asyncio.Task[Any]):
            self.text_generation_task = task
    
        async def _add_error(self, error: Exception):
            await self._queue.put(VoiceStreamEventError(error))
    
        def _transform_audio_buffer(
            self, buffer: list[bytes], output_dtype: npt.DTypeLike
        ) -> npt.NDArray[np.int16 | np.float32]:
            np_array = np.frombuffer(b"".join(buffer), dtype=np.int16)
    
            if output_dtype == np.int16:
                return np_array
            elif output_dtype == np.float32:
                return (np_array.astype(np.float32) / 32767.0).reshape(-1, 1)
            else:
                raise UserError("Invalid output dtype")
    
        async def _stream_audio(
            self,
            text: str,
            local_queue: asyncio.Queue[VoiceStreamEvent | None],
            finish_turn: bool = False,
        ):
            with speech_span(
                model=self.tts_model.model_name,
                input=text if self._voice_pipeline_config.trace_include_sensitive_data else "",
                model_config={
                    "voice": self.tts_settings.voice,
                    "instructions": self.instructions,
                    "speed": self.tts_settings.speed,
                },
                output_format="pcm",
                parent=self._tracing_span,
            ) as tts_span:
                try:
                    first_byte_received = False
                    buffer: list[bytes] = []
                    full_audio_data: list[bytes] = []
    
                    async for chunk in self.tts_model.run(text, self.tts_settings):
                        if not first_byte_received:
                            first_byte_received = True
                            tts_span.span_data.first_content_at = time_iso()
    
                        if chunk:
                            buffer.append(chunk)
                            full_audio_data.append(chunk)
                            if len(buffer) >= self._buffer_size:
                                audio_np = self._transform_audio_buffer(buffer, self.tts_settings.dtype)
                                if self.tts_settings.transform_data:
                                    audio_np = self.tts_settings.transform_data(audio_np)
                                await local_queue.put(
                                    VoiceStreamEventAudio(data=audio_np)
                                )  # Use local queue
                                buffer = []
                    if buffer:
                        audio_np = self._transform_audio_buffer(buffer, self.tts_settings.dtype)
                        if self.tts_settings.transform_data:
                            audio_np = self.tts_settings.transform_data(audio_np)
                        await local_queue.put(VoiceStreamEventAudio(data=audio_np))  # Use local queue
    
                    if self._voice_pipeline_config.trace_include_sensitive_audio_data:
                        tts_span.span_data.output = _audio_to_base64(full_audio_data)
                    else:
                        tts_span.span_data.output = ""
    
                    if finish_turn:
                        await local_queue.put(VoiceStreamEventLifecycle(event="turn_ended"))
                    else:
                        await local_queue.put(None)  # Signal completion for this segment
                except Exception as e:
                    tts_span.set_error(
                        {
                            "message": str(e),
                            "data": {
                                "text": text
                                if self._voice_pipeline_config.trace_include_sensitive_data
                                else "",
                            },
                        }
                    )
                    logger.error(f"Error streaming audio: {e}")
    
                    # Signal completion for whole session because of error
                    await local_queue.put(VoiceStreamEventLifecycle(event="session_ended"))
                    raise e
    
        async def _add_text(self, text: str):
            await self._start_turn()
    
            self._text_buffer += text
            self.total_output_text += text
            self._turn_text_buffer += text
    
            combined_sentences, self._text_buffer = self.tts_settings.text_splitter(self._text_buffer)
    
            if len(combined_sentences) >= 20:
                local_queue: asyncio.Queue[VoiceStreamEvent | None] = asyncio.Queue()
                self._ordered_tasks.append(local_queue)
                self._tasks.append(
                    asyncio.create_task(self._stream_audio(combined_sentences, local_queue))
                )
                if self._dispatcher_task is None:
                    self._dispatcher_task = asyncio.create_task(self._dispatch_audio())
    
        async def _turn_done(self):
            if self._text_buffer:
                local_queue: asyncio.Queue[VoiceStreamEvent | None] = asyncio.Queue()
                self._ordered_tasks.append(local_queue)  # Append the local queue for the final segment
                self._tasks.append(
                    asyncio.create_task(
                        self._stream_audio(self._text_buffer, local_queue, finish_turn=True)
                    )
                )
                self._text_buffer = ""
            self._done_processing = True
            if self._dispatcher_task is None:
                self._dispatcher_task = asyncio.create_task(self._dispatch_audio())
            await asyncio.gather(*self._tasks)
    
        def _finish_turn(self):
            if self._tracing_span:
                if self._voice_pipeline_config.trace_include_sensitive_data:
                    self._tracing_span.span_data.input = self._turn_text_buffer
                else:
                    self._tracing_span.span_data.input = ""
    
                self._tracing_span.finish()
                self._tracing_span = None
            self._turn_text_buffer = ""
            self._started_processing_turn = False
    
        async def _done(self):
            self._completed_session = True
            await self._wait_for_completion()
    
        async def _dispatch_audio(self):
            # Dispatch audio chunks from each segment in the order they were added
            while True:
                if len(self._ordered_tasks) == 0:
                    if self._completed_session:
                        break
                    await asyncio.sleep(0)
                    continue
                local_queue = self._ordered_tasks.pop(0)
                while True:
                    chunk = await local_queue.get()
                    if chunk is None:
                        break
                    await self._queue.put(chunk)
                    if isinstance(chunk, VoiceStreamEventLifecycle):
                        local_queue.task_done()
                        if chunk.event == "turn_ended":
                            self._finish_turn()
                            break
            await self._queue.put(VoiceStreamEventLifecycle(event="session_ended"))
    
        async def _wait_for_completion(self):
            tasks: list[asyncio.Task[Any]] = self._tasks
            if self._dispatcher_task is not None:
                tasks.append(self._dispatcher_task)
            await asyncio.gather(*tasks)
    
        def _cleanup_tasks(self):
            self._finish_turn()
    
            for task in self._tasks:
                if not task.done():
                    task.cancel()
    
            if self._dispatcher_task and not self._dispatcher_task.done():
                self._dispatcher_task.cancel()
    
            if self.text_generation_task and not self.text_generation_task.done():
                self.text_generation_task.cancel()
    
        def _check_errors(self):
            for task in self._tasks:
                if task.done():
                    if task.exception():
                        self._stored_exception = task.exception()
                        break
    
        async def stream(self) -> AsyncIterator[VoiceStreamEvent]:
            """Stream the events and audio data as they're generated."""
            while True:
                try:
                    event = await self._queue.get()
                except asyncio.CancelledError:
                    break
                if isinstance(event, VoiceStreamEventError):
                    self._stored_exception = event.error
                    logger.error(f"Error processing output: {event.error}")
                    break
                if event is None:
                    break
                yield event
                if event.type == "voice_stream_event_lifecycle" and event.event == "session_ended":
                    break
    
            self._check_errors()
            self._cleanup_tasks()
    
            if self._stored_exception:
                raise self._stored_exception
      
  
---|---  
  
####  __init__
    
    
    __init__(
        tts_model: [TTSModel](../../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)"),
        tts_settings: [TTSModelSettings](../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings
    
    
      
          dataclass
       \(agents.voice.model.TTSModelSettings\)"),
        voice_pipeline_config: [VoicePipelineConfig](../../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig
    
    
      
          dataclass
       \(agents.voice.pipeline_config.VoicePipelineConfig\)"),
    )
    

Create a new `StreamedAudioResult` instance.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`tts_model` |  `[TTSModel](../../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)")` |  The TTS model to use. |  _required_  
`tts_settings` |  `[TTSModelSettings](../../../../ref/voice/model/#agents.voice.model.TTSModelSettings "TTSModelSettings


  
      dataclass
   \(agents.voice.model.TTSModelSettings\)")` |  The TTS settings to use. |  _required_  
`voice_pipeline_config` |  `[VoicePipelineConfig](../../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig


  
      dataclass
   \(agents.voice.pipeline_config.VoicePipelineConfig\)")` |  The voice pipeline config to use. |  _required_  
Source code in `src/agents/voice/result.py`
    
    
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

| 
    
    
    def __init__(
        self,
        tts_model: TTSModel,
        tts_settings: TTSModelSettings,
        voice_pipeline_config: VoicePipelineConfig,
    ):
        """Create a new `StreamedAudioResult` instance.
    
        Args:
            tts_model: The TTS model to use.
            tts_settings: The TTS settings to use.
            voice_pipeline_config: The voice pipeline config to use.
        """
        self.tts_model = tts_model
        self.tts_settings = tts_settings
        self.total_output_text = ""
        self.instructions = tts_settings.instructions
        self.text_generation_task: asyncio.Task[Any] | None = None
    
        self._voice_pipeline_config = voice_pipeline_config
        self._text_buffer = ""
        self._turn_text_buffer = ""
        self._queue: asyncio.Queue[VoiceStreamEvent] = asyncio.Queue()
        self._tasks: list[asyncio.Task[Any]] = []
        self._ordered_tasks: list[
            asyncio.Queue[VoiceStreamEvent | None]
        ] = []  # New: list to hold local queues for each text segment
        self._dispatcher_task: asyncio.Task[Any] | None = (
            None  # Task to dispatch audio chunks in order
        )
    
        self._done_processing = False
        self._buffer_size = tts_settings.buffer_size
        self._started_processing_turn = False
        self._first_byte_received = False
        self._generation_start_time: str | None = None
        self._completed_session = False
        self._stored_exception: BaseException | None = None
        self._tracing_span: Span[SpeechGroupSpanData] | None = None
      
  
---|---  
  
####  stream `async`
    
    
    stream() -> AsyncIterator[[VoiceStreamEvent](../../../../ref/voice/events/#agents.voice.events.VoiceStreamEvent "VoiceStreamEvent
    
    
      
          module-attribute
       \(agents.voice.events.VoiceStreamEvent\)")]
    

Stream the events and audio data as they're generated.

Source code in `src/agents/voice/result.py`
    
    
    266
    267
    268
    269
    270
    271
    272
    273
    274
    275
    276
    277
    278
    279
    280
    281
    282
    283
    284
    285
    286
    287

| 
    
    
    async def stream(self) -> AsyncIterator[VoiceStreamEvent]:
        """Stream the events and audio data as they're generated."""
        while True:
            try:
                event = await self._queue.get()
            except asyncio.CancelledError:
                break
            if isinstance(event, VoiceStreamEventError):
                self._stored_exception = event.error
                logger.error(f"Error processing output: {event.error}")
                break
            if event is None:
                break
            yield event
            if event.type == "voice_stream_event_lifecycle" and event.event == "session_ended":
                break
    
        self._check_errors()
        self._cleanup_tasks()
    
        if self._stored_exception:
            raise self._stored_exception
      
  
---|---
