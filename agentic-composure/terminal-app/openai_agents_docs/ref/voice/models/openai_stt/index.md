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
      * OpenAI STT  [ OpenAI STT  ](./) Table of contents 
        * openai_stt 
        * OpenAISTTTranscriptionSession 
        * OpenAISTTModel 
          * __init__ 
          * transcribe 
          * create_session 
      * [ OpenAI TTS  ](../openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../../extensions/litellm/)



Table of contents 

  * openai_stt 
  * OpenAISTTTranscriptionSession 
  * OpenAISTTModel 
    * __init__ 
    * transcribe 
    * create_session 



# `OpenAI STT`

###  OpenAISTTTranscriptionSession

Bases: `[StreamedTranscriptionSession](../../model/#agents.voice.model.StreamedTranscriptionSession "StreamedTranscriptionSession \(agents.voice.model.StreamedTranscriptionSession\)")`

A transcription session for OpenAI's STT model.

Source code in `src/agents/voice/models/openai_stt.py`
    
    
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
    288
    289
    290
    291
    292
    293
    294
    295
    296
    297
    298
    299
    300
    301
    302
    303
    304
    305
    306
    307
    308
    309
    310
    311
    312
    313
    314
    315
    316
    317
    318
    319
    320
    321
    322
    323
    324
    325
    326
    327
    328
    329
    330
    331
    332
    333
    334
    335
    336
    337
    338
    339
    340
    341
    342
    343
    344
    345
    346
    347
    348
    349
    350
    351
    352
    353
    354
    355
    356
    357
    358
    359
    360
    361
    362

| 
    
    
    class OpenAISTTTranscriptionSession(StreamedTranscriptionSession):
        """A transcription session for OpenAI's STT model."""
    
        def __init__(
            self,
            input: StreamedAudioInput,
            client: AsyncOpenAI,
            model: str,
            settings: STTModelSettings,
            trace_include_sensitive_data: bool,
            trace_include_sensitive_audio_data: bool,
        ):
            self.connected: bool = False
            self._client = client
            self._model = model
            self._settings = settings
            self._turn_detection = settings.turn_detection or DEFAULT_TURN_DETECTION
            self._trace_include_sensitive_data = trace_include_sensitive_data
            self._trace_include_sensitive_audio_data = trace_include_sensitive_audio_data
    
            self._input_queue: asyncio.Queue[npt.NDArray[np.int16 | np.float32]] = input.queue
            self._output_queue: asyncio.Queue[str | ErrorSentinel | SessionCompleteSentinel] = (
                asyncio.Queue()
            )
            self._websocket: websockets.ClientConnection | None = None
            self._event_queue: asyncio.Queue[dict[str, Any] | WebsocketDoneSentinel] = asyncio.Queue()
            self._state_queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
            self._turn_audio_buffer: list[npt.NDArray[np.int16 | np.float32]] = []
            self._tracing_span: Span[TranscriptionSpanData] | None = None
    
            # tasks
            self._listener_task: asyncio.Task[Any] | None = None
            self._process_events_task: asyncio.Task[Any] | None = None
            self._stream_audio_task: asyncio.Task[Any] | None = None
            self._connection_task: asyncio.Task[Any] | None = None
            self._stored_exception: Exception | None = None
    
        def _start_turn(self) -> None:
            self._tracing_span = transcription_span(
                model=self._model,
                model_config={
                    "temperature": self._settings.temperature,
                    "language": self._settings.language,
                    "prompt": self._settings.prompt,
                    "turn_detection": self._turn_detection,
                },
            )
            self._tracing_span.start()
    
        def _end_turn(self, _transcript: str) -> None:
            if len(_transcript) < 1:
                return
    
            if self._tracing_span:
                if self._trace_include_sensitive_audio_data:
                    self._tracing_span.span_data.input = _audio_to_base64(self._turn_audio_buffer)
    
                self._tracing_span.span_data.input_format = "pcm"
    
                if self._trace_include_sensitive_data:
                    self._tracing_span.span_data.output = _transcript
    
                self._tracing_span.finish()
                self._turn_audio_buffer = []
                self._tracing_span = None
    
        async def _event_listener(self) -> None:
            assert self._websocket is not None, "Websocket not initialized"
    
            async for message in self._websocket:
                try:
                    event = json.loads(message)
    
                    if event.get("type") == "error":
                        raise STTWebsocketConnectionError(f"Error event: {event.get('error')}")
    
                    if event.get("type") in [
                        "session.updated",
                        "transcription_session.updated",
                        "session.created",
                        "transcription_session.created",
                    ]:
                        await self._state_queue.put(event)
    
                    await self._event_queue.put(event)
                except Exception as e:
                    await self._output_queue.put(ErrorSentinel(e))
                    raise STTWebsocketConnectionError("Error parsing events") from e
            await self._event_queue.put(WebsocketDoneSentinel())
    
        async def _configure_session(self) -> None:
            assert self._websocket is not None, "Websocket not initialized"
            await self._websocket.send(
                json.dumps(
                    {
                        "type": "transcription_session.update",
                        "session": {
                            "input_audio_format": "pcm16",
                            "input_audio_transcription": {"model": self._model},
                            "turn_detection": self._turn_detection,
                        },
                    }
                )
            )
    
        async def _setup_connection(self, ws: websockets.ClientConnection) -> None:
            self._websocket = ws
            self._listener_task = asyncio.create_task(self._event_listener())
    
            try:
                event = await _wait_for_event(
                    self._state_queue,
                    ["session.created", "transcription_session.created"],
                    SESSION_CREATION_TIMEOUT,
                )
            except TimeoutError as e:
                wrapped_err = STTWebsocketConnectionError(
                    "Timeout waiting for transcription_session.created event"
                )
                await self._output_queue.put(ErrorSentinel(wrapped_err))
                raise wrapped_err from e
            except Exception as e:
                await self._output_queue.put(ErrorSentinel(e))
                raise e
    
            await self._configure_session()
    
            try:
                event = await _wait_for_event(
                    self._state_queue,
                    ["session.updated", "transcription_session.updated"],
                    SESSION_UPDATE_TIMEOUT,
                )
                if _debug.DONT_LOG_MODEL_DATA:
                    logger.debug("Session updated")
                else:
                    logger.debug(f"Session updated: {event}")
            except TimeoutError as e:
                wrapped_err = STTWebsocketConnectionError(
                    "Timeout waiting for transcription_session.updated event"
                )
                await self._output_queue.put(ErrorSentinel(wrapped_err))
                raise wrapped_err from e
            except Exception as e:
                await self._output_queue.put(ErrorSentinel(e))
                raise
    
        async def _handle_events(self) -> None:
            while True:
                try:
                    event = await asyncio.wait_for(
                        self._event_queue.get(), timeout=EVENT_INACTIVITY_TIMEOUT
                    )
                    if isinstance(event, WebsocketDoneSentinel):
                        # processed all events and websocket is done
                        break
    
                    event_type = event.get("type", "unknown")
                    if event_type == "conversation.item.input_audio_transcription.completed":
                        transcript = cast(str, event.get("transcript", ""))
                        if len(transcript) > 0:
                            self._end_turn(transcript)
                            self._start_turn()
                            await self._output_queue.put(transcript)
                    await asyncio.sleep(0)  # yield control
                except asyncio.TimeoutError:
                    # No new events for a while. Assume the session is done.
                    break
                except Exception as e:
                    await self._output_queue.put(ErrorSentinel(e))
                    raise e
            await self._output_queue.put(SessionCompleteSentinel())
    
        async def _stream_audio(
            self, audio_queue: asyncio.Queue[npt.NDArray[np.int16 | np.float32]]
        ) -> None:
            assert self._websocket is not None, "Websocket not initialized"
            self._start_turn()
            while True:
                buffer = await audio_queue.get()
                if buffer is None:
                    break
    
                self._turn_audio_buffer.append(buffer)
                try:
                    await self._websocket.send(
                        json.dumps(
                            {
                                "type": "input_audio_buffer.append",
                                "audio": base64.b64encode(buffer.tobytes()).decode("utf-8"),
                            }
                        )
                    )
                except websockets.ConnectionClosed:
                    break
                except Exception as e:
                    await self._output_queue.put(ErrorSentinel(e))
                    raise e
    
                await asyncio.sleep(0)  # yield control
    
        async def _process_websocket_connection(self) -> None:
            try:
                async with websockets.connect(
                    "wss://api.openai.com/v1/realtime?intent=transcription",
                    additional_headers={
                        "Authorization": f"Bearer {self._client.api_key}",
                        "OpenAI-Beta": "realtime=v1",
                        "OpenAI-Log-Session": "1",
                    },
                ) as ws:
                    await self._setup_connection(ws)
                    self._process_events_task = asyncio.create_task(self._handle_events())
                    self._stream_audio_task = asyncio.create_task(self._stream_audio(self._input_queue))
                    self.connected = True
                    if self._listener_task:
                        await self._listener_task
                    else:
                        logger.error("Listener task not initialized")
                        raise AgentsException("Listener task not initialized")
            except Exception as e:
                await self._output_queue.put(ErrorSentinel(e))
                raise e
    
        def _check_errors(self) -> None:
            if self._connection_task and self._connection_task.done():
                exc = self._connection_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
            if self._process_events_task and self._process_events_task.done():
                exc = self._process_events_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
            if self._stream_audio_task and self._stream_audio_task.done():
                exc = self._stream_audio_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
            if self._listener_task and self._listener_task.done():
                exc = self._listener_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
        def _cleanup_tasks(self) -> None:
            if self._listener_task and not self._listener_task.done():
                self._listener_task.cancel()
    
            if self._process_events_task and not self._process_events_task.done():
                self._process_events_task.cancel()
    
            if self._stream_audio_task and not self._stream_audio_task.done():
                self._stream_audio_task.cancel()
    
            if self._connection_task and not self._connection_task.done():
                self._connection_task.cancel()
    
        async def transcribe_turns(self) -> AsyncIterator[str]:
            self._connection_task = asyncio.create_task(self._process_websocket_connection())
    
            while True:
                try:
                    turn = await self._output_queue.get()
                except asyncio.CancelledError:
                    break
    
                if (
                    turn is None
                    or isinstance(turn, ErrorSentinel)
                    or isinstance(turn, SessionCompleteSentinel)
                ):
                    self._output_queue.task_done()
                    break
                yield turn
                self._output_queue.task_done()
    
            if self._tracing_span:
                self._end_turn("")
    
            if self._websocket:
                await self._websocket.close()
    
            self._check_errors()
            if self._stored_exception:
                raise self._stored_exception
    
        async def close(self) -> None:
            if self._websocket:
                await self._websocket.close()
    
            self._cleanup_tasks()
      
  
---|---  
  
###  OpenAISTTModel

Bases: `[STTModel](../../model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)")`

A speech-to-text model for OpenAI.

Source code in `src/agents/voice/models/openai_stt.py`
    
    
    365
    366
    367
    368
    369
    370
    371
    372
    373
    374
    375
    376
    377
    378
    379
    380
    381
    382
    383
    384
    385
    386
    387
    388
    389
    390
    391
    392
    393
    394
    395
    396
    397
    398
    399
    400
    401
    402
    403
    404
    405
    406
    407
    408
    409
    410
    411
    412
    413
    414
    415
    416
    417
    418
    419
    420
    421
    422
    423
    424
    425
    426
    427
    428
    429
    430
    431
    432
    433
    434
    435
    436
    437
    438
    439
    440
    441
    442
    443
    444
    445
    446
    447
    448
    449
    450
    451
    452
    453
    454
    455
    456

| 
    
    
    class OpenAISTTModel(STTModel):
        """A speech-to-text model for OpenAI."""
    
        def __init__(
            self,
            model: str,
            openai_client: AsyncOpenAI,
        ):
            """Create a new OpenAI speech-to-text model.
    
            Args:
                model: The name of the model to use.
                openai_client: The OpenAI client to use.
            """
            self.model = model
            self._client = openai_client
    
        @property
        def model_name(self) -> str:
            return self.model
    
        def _non_null_or_not_given(self, value: Any) -> Any:
            return value if value is not None else None  # NOT_GIVEN
    
        async def transcribe(
            self,
            input: AudioInput,
            settings: STTModelSettings,
            trace_include_sensitive_data: bool,
            trace_include_sensitive_audio_data: bool,
        ) -> str:
            """Transcribe an audio input.
    
            Args:
                input: The audio input to transcribe.
                settings: The settings to use for the transcription.
    
            Returns:
                The transcribed text.
            """
            with transcription_span(
                model=self.model,
                input=input.to_base64() if trace_include_sensitive_audio_data else "",
                input_format="pcm",
                model_config={
                    "temperature": self._non_null_or_not_given(settings.temperature),
                    "language": self._non_null_or_not_given(settings.language),
                    "prompt": self._non_null_or_not_given(settings.prompt),
                },
            ) as span:
                try:
                    response = await self._client.audio.transcriptions.create(
                        model=self.model,
                        file=input.to_audio_file(),
                        prompt=self._non_null_or_not_given(settings.prompt),
                        language=self._non_null_or_not_given(settings.language),
                        temperature=self._non_null_or_not_given(settings.temperature),
                    )
                    if trace_include_sensitive_data:
                        span.span_data.output = response.text
                    return response.text
                except Exception as e:
                    span.span_data.output = ""
                    span.set_error(SpanError(message=str(e), data={}))
                    raise e
    
        async def create_session(
            self,
            input: StreamedAudioInput,
            settings: STTModelSettings,
            trace_include_sensitive_data: bool,
            trace_include_sensitive_audio_data: bool,
        ) -> StreamedTranscriptionSession:
            """Create a new transcription session.
    
            Args:
                input: The audio input to transcribe.
                settings: The settings to use for the transcription.
                trace_include_sensitive_data: Whether to include sensitive data in traces.
                trace_include_sensitive_audio_data: Whether to include sensitive audio data in traces.
    
            Returns:
                A new transcription session.
            """
            return OpenAISTTTranscriptionSession(
                input,
                self._client,
                self.model,
                settings,
                trace_include_sensitive_data,
                trace_include_sensitive_audio_data,
            )
      
  
---|---  
  
####  __init__
    
    
    __init__(model: str, openai_client: AsyncOpenAI)
    

Create a new OpenAI speech-to-text model.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model` |  `str` |  The name of the model to use. |  _required_  
`openai_client` |  `AsyncOpenAI` |  The OpenAI client to use. |  _required_  
Source code in `src/agents/voice/models/openai_stt.py`
    
    
    368
    369
    370
    371
    372
    373
    374
    375
    376
    377
    378
    379
    380

| 
    
    
    def __init__(
        self,
        model: str,
        openai_client: AsyncOpenAI,
    ):
        """Create a new OpenAI speech-to-text model.
    
        Args:
            model: The name of the model to use.
            openai_client: The OpenAI client to use.
        """
        self.model = model
        self._client = openai_client
      
  
---|---  
  
####  transcribe `async`
    
    
    transcribe(
        input: [AudioInput](../../input/#agents.voice.input.AudioInput "AudioInput
    
    
      
          dataclass
       \(agents.voice.input.AudioInput\)"),
        settings: [STTModelSettings](../../model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)"),
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> str
    

Transcribe an audio input.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`input` |  `[AudioInput](../../input/#agents.voice.input.AudioInput "AudioInput


  
      dataclass
   \(agents.voice.input.AudioInput\)")` |  The audio input to transcribe. |  _required_  
`settings` |  `[STTModelSettings](../../model/#agents.voice.model.STTModelSettings "STTModelSettings


  
      dataclass
   \(agents.voice.model.STTModelSettings\)")` |  The settings to use for the transcription. |  _required_  
  
Returns:

Type | Description  
---|---  
`str` |  The transcribed text.  
Source code in `src/agents/voice/models/openai_stt.py`
    
    
    389
    390
    391
    392
    393
    394
    395
    396
    397
    398
    399
    400
    401
    402
    403
    404
    405
    406
    407
    408
    409
    410
    411
    412
    413
    414
    415
    416
    417
    418
    419
    420
    421
    422
    423
    424
    425
    426
    427
    428
    429

| 
    
    
    async def transcribe(
        self,
        input: AudioInput,
        settings: STTModelSettings,
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> str:
        """Transcribe an audio input.
    
        Args:
            input: The audio input to transcribe.
            settings: The settings to use for the transcription.
    
        Returns:
            The transcribed text.
        """
        with transcription_span(
            model=self.model,
            input=input.to_base64() if trace_include_sensitive_audio_data else "",
            input_format="pcm",
            model_config={
                "temperature": self._non_null_or_not_given(settings.temperature),
                "language": self._non_null_or_not_given(settings.language),
                "prompt": self._non_null_or_not_given(settings.prompt),
            },
        ) as span:
            try:
                response = await self._client.audio.transcriptions.create(
                    model=self.model,
                    file=input.to_audio_file(),
                    prompt=self._non_null_or_not_given(settings.prompt),
                    language=self._non_null_or_not_given(settings.language),
                    temperature=self._non_null_or_not_given(settings.temperature),
                )
                if trace_include_sensitive_data:
                    span.span_data.output = response.text
                return response.text
            except Exception as e:
                span.span_data.output = ""
                span.set_error(SpanError(message=str(e), data={}))
                raise e
      
  
---|---  
  
####  create_session `async`
    
    
    create_session(
        input: [StreamedAudioInput](../../input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput \(agents.voice.input.StreamedAudioInput\)"),
        settings: [STTModelSettings](../../model/#agents.voice.model.STTModelSettings "STTModelSettings
    
    
      
          dataclass
       \(agents.voice.model.STTModelSettings\)"),
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> [StreamedTranscriptionSession](../../model/#agents.voice.model.StreamedTranscriptionSession "StreamedTranscriptionSession \(agents.voice.model.StreamedTranscriptionSession\)")
    

Create a new transcription session.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`input` |  `[StreamedAudioInput](../../input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput \(agents.voice.input.StreamedAudioInput\)")` |  The audio input to transcribe. |  _required_  
`settings` |  `[STTModelSettings](../../model/#agents.voice.model.STTModelSettings "STTModelSettings


  
      dataclass
   \(agents.voice.model.STTModelSettings\)")` |  The settings to use for the transcription. |  _required_  
`trace_include_sensitive_data` |  `bool` |  Whether to include sensitive data in traces. |  _required_  
`trace_include_sensitive_audio_data` |  `bool` |  Whether to include sensitive audio data in traces. |  _required_  
  
Returns:

Type | Description  
---|---  
`[StreamedTranscriptionSession](../../model/#agents.voice.model.StreamedTranscriptionSession "StreamedTranscriptionSession \(agents.voice.model.StreamedTranscriptionSession\)")` |  A new transcription session.  
Source code in `src/agents/voice/models/openai_stt.py`
    
    
    431
    432
    433
    434
    435
    436
    437
    438
    439
    440
    441
    442
    443
    444
    445
    446
    447
    448
    449
    450
    451
    452
    453
    454
    455
    456

| 
    
    
    async def create_session(
        self,
        input: StreamedAudioInput,
        settings: STTModelSettings,
        trace_include_sensitive_data: bool,
        trace_include_sensitive_audio_data: bool,
    ) -> StreamedTranscriptionSession:
        """Create a new transcription session.
    
        Args:
            input: The audio input to transcribe.
            settings: The settings to use for the transcription.
            trace_include_sensitive_data: Whether to include sensitive data in traces.
            trace_include_sensitive_audio_data: Whether to include sensitive audio data in traces.
    
        Returns:
            A new transcription session.
        """
        return OpenAISTTTranscriptionSession(
            input,
            self._client,
            self.model,
            settings,
            trace_include_sensitive_data,
            trace_include_sensitive_audio_data,
        )
      
  
---|---
