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
      * Pipeline  [ Pipeline  ](./) Table of contents 
        * pipeline 
        * VoicePipeline 
          * __init__ 
          * run 
      * [ Workflow  ](../workflow/)
      * [ Input  ](../input/)
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

  * pipeline 
  * VoicePipeline 
    * __init__ 
    * run 



# `Pipeline`

###  VoicePipeline

An opinionated voice agent pipeline. It works in three steps: 1\. Transcribe audio input into text. 2\. Run the provided `workflow`, which produces a sequence of text responses. 3\. Convert the text responses into streaming audio output.

Source code in `src/agents/voice/pipeline.py`
    
    
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

| 
    
    
    class VoicePipeline:
        """An opinionated voice agent pipeline. It works in three steps:
        1. Transcribe audio input into text.
        2. Run the provided `workflow`, which produces a sequence of text responses.
        3. Convert the text responses into streaming audio output.
        """
    
        def __init__(
            self,
            *,
            workflow: VoiceWorkflowBase,
            stt_model: STTModel | str | None = None,
            tts_model: TTSModel | str | None = None,
            config: VoicePipelineConfig | None = None,
        ):
            """Create a new voice pipeline.
    
            Args:
                workflow: The workflow to run. See `VoiceWorkflowBase`.
                stt_model: The speech-to-text model to use. If not provided, a default OpenAI
                    model will be used.
                tts_model: The text-to-speech model to use. If not provided, a default OpenAI
                    model will be used.
                config: The pipeline configuration. If not provided, a default configuration will be
                    used.
            """
            self.workflow = workflow
            self.stt_model = stt_model if isinstance(stt_model, STTModel) else None
            self.tts_model = tts_model if isinstance(tts_model, TTSModel) else None
            self._stt_model_name = stt_model if isinstance(stt_model, str) else None
            self._tts_model_name = tts_model if isinstance(tts_model, str) else None
            self.config = config or VoicePipelineConfig()
    
        async def run(self, audio_input: AudioInput | StreamedAudioInput) -> StreamedAudioResult:
            """Run the voice pipeline.
    
            Args:
                audio_input: The audio input to process. This can either be an `AudioInput` instance,
                    which is a single static buffer, or a `StreamedAudioInput` instance, which is a
                    stream of audio data that you can append to.
    
            Returns:
                A `StreamedAudioResult` instance. You can use this object to stream audio events and
                play them out.
            """
            if isinstance(audio_input, AudioInput):
                return await self._run_single_turn(audio_input)
            elif isinstance(audio_input, StreamedAudioInput):
                return await self._run_multi_turn(audio_input)
            else:
                raise UserError(f"Unsupported audio input type: {type(audio_input)}")
    
        def _get_tts_model(self) -> TTSModel:
            if not self.tts_model:
                self.tts_model = self.config.model_provider.get_tts_model(self._tts_model_name)
            return self.tts_model
    
        def _get_stt_model(self) -> STTModel:
            if not self.stt_model:
                self.stt_model = self.config.model_provider.get_stt_model(self._stt_model_name)
            return self.stt_model
    
        async def _process_audio_input(self, audio_input: AudioInput) -> str:
            model = self._get_stt_model()
            return await model.transcribe(
                audio_input,
                self.config.stt_settings,
                self.config.trace_include_sensitive_data,
                self.config.trace_include_sensitive_audio_data,
            )
    
        async def _run_single_turn(self, audio_input: AudioInput) -> StreamedAudioResult:
            # Since this is single turn, we can use the TraceCtxManager to manage starting/ending the
            # trace
            with TraceCtxManager(
                workflow_name=self.config.workflow_name or "Voice Agent",
                trace_id=None,  # Automatically generated
                group_id=self.config.group_id,
                metadata=self.config.trace_metadata,
                disabled=self.config.tracing_disabled,
            ):
                input_text = await self._process_audio_input(audio_input)
    
                output = StreamedAudioResult(
                    self._get_tts_model(), self.config.tts_settings, self.config
                )
    
                async def stream_events():
                    try:
                        async for text_event in self.workflow.run(input_text):
                            await output._add_text(text_event)
                        await output._turn_done()
                        await output._done()
                    except Exception as e:
                        logger.error(f"Error processing single turn: {e}")
                        await output._add_error(e)
                        raise e
    
                output._set_task(asyncio.create_task(stream_events()))
                return output
    
        async def _run_multi_turn(self, audio_input: StreamedAudioInput) -> StreamedAudioResult:
            with TraceCtxManager(
                workflow_name=self.config.workflow_name or "Voice Agent",
                trace_id=None,
                group_id=self.config.group_id,
                metadata=self.config.trace_metadata,
                disabled=self.config.tracing_disabled,
            ):
                output = StreamedAudioResult(
                    self._get_tts_model(), self.config.tts_settings, self.config
                )
    
                transcription_session = await self._get_stt_model().create_session(
                    audio_input,
                    self.config.stt_settings,
                    self.config.trace_include_sensitive_data,
                    self.config.trace_include_sensitive_audio_data,
                )
    
                async def process_turns():
                    try:
                        async for input_text in transcription_session.transcribe_turns():
                            result = self.workflow.run(input_text)
                            async for text_event in result:
                                await output._add_text(text_event)
                            await output._turn_done()
                    except Exception as e:
                        logger.error(f"Error processing turns: {e}")
                        await output._add_error(e)
                        raise e
                    finally:
                        await transcription_session.close()
                        await output._done()
    
                output._set_task(asyncio.create_task(process_turns()))
                return output
      
  
---|---  
  
####  __init__
    
    
    __init__(
        *,
        workflow: [VoiceWorkflowBase](../workflow/#agents.voice.workflow.VoiceWorkflowBase "VoiceWorkflowBase \(agents.voice.workflow.VoiceWorkflowBase\)"),
        stt_model: [STTModel](../model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)") | str | None = None,
        tts_model: [TTSModel](../model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)") | str | None = None,
        config: [VoicePipelineConfig](../pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig
    
    
      
          dataclass
       \(agents.voice.pipeline_config.VoicePipelineConfig\)") | None = None,
    )
    

Create a new voice pipeline.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`workflow` |  `[VoiceWorkflowBase](../workflow/#agents.voice.workflow.VoiceWorkflowBase "VoiceWorkflowBase \(agents.voice.workflow.VoiceWorkflowBase\)")` |  The workflow to run. See `VoiceWorkflowBase`. |  _required_  
`stt_model` |  `[STTModel](../model/#agents.voice.model.STTModel "STTModel \(agents.voice.model.STTModel\)") | str | None` |  The speech-to-text model to use. If not provided, a default OpenAI model will be used. |  `None`  
`tts_model` |  `[TTSModel](../model/#agents.voice.model.TTSModel "TTSModel \(agents.voice.model.TTSModel\)") | str | None` |  The text-to-speech model to use. If not provided, a default OpenAI model will be used. |  `None`  
`config` |  `[VoicePipelineConfig](../pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig


  
      dataclass
   \(agents.voice.pipeline_config.VoicePipelineConfig\)") | None` |  The pipeline configuration. If not provided, a default configuration will be used. |  `None`  
Source code in `src/agents/voice/pipeline.py`
    
    
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
    
    
    def __init__(
        self,
        *,
        workflow: VoiceWorkflowBase,
        stt_model: STTModel | str | None = None,
        tts_model: TTSModel | str | None = None,
        config: VoicePipelineConfig | None = None,
    ):
        """Create a new voice pipeline.
    
        Args:
            workflow: The workflow to run. See `VoiceWorkflowBase`.
            stt_model: The speech-to-text model to use. If not provided, a default OpenAI
                model will be used.
            tts_model: The text-to-speech model to use. If not provided, a default OpenAI
                model will be used.
            config: The pipeline configuration. If not provided, a default configuration will be
                used.
        """
        self.workflow = workflow
        self.stt_model = stt_model if isinstance(stt_model, STTModel) else None
        self.tts_model = tts_model if isinstance(tts_model, TTSModel) else None
        self._stt_model_name = stt_model if isinstance(stt_model, str) else None
        self._tts_model_name = tts_model if isinstance(tts_model, str) else None
        self.config = config or VoicePipelineConfig()
      
  
---|---  
  
####  run `async`
    
    
    run(
        audio_input: [AudioInput](../input/#agents.voice.input.AudioInput "AudioInput
    
    
      
          dataclass
       \(agents.voice.input.AudioInput\)") | [StreamedAudioInput](../input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput \(agents.voice.input.StreamedAudioInput\)"),
    ) -> [StreamedAudioResult](../result/#agents.voice.result.StreamedAudioResult "StreamedAudioResult \(agents.voice.result.StreamedAudioResult\)")
    

Run the voice pipeline.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`audio_input` |  `[AudioInput](../input/#agents.voice.input.AudioInput "AudioInput


  
      dataclass
   \(agents.voice.input.AudioInput\)") | [StreamedAudioInput](../input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput \(agents.voice.input.StreamedAudioInput\)")` |  The audio input to process. This can either be an `AudioInput` instance, which is a single static buffer, or a `StreamedAudioInput` instance, which is a stream of audio data that you can append to. |  _required_  
  
Returns:

Type | Description  
---|---  
`[StreamedAudioResult](../result/#agents.voice.result.StreamedAudioResult "StreamedAudioResult \(agents.voice.result.StreamedAudioResult\)")` |  A `StreamedAudioResult` instance. You can use this object to stream audio events and  
`[StreamedAudioResult](../result/#agents.voice.result.StreamedAudioResult "StreamedAudioResult \(agents.voice.result.StreamedAudioResult\)")` |  play them out.  
Source code in `src/agents/voice/pipeline.py`
    
    
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

| 
    
    
    async def run(self, audio_input: AudioInput | StreamedAudioInput) -> StreamedAudioResult:
        """Run the voice pipeline.
    
        Args:
            audio_input: The audio input to process. This can either be an `AudioInput` instance,
                which is a single static buffer, or a `StreamedAudioInput` instance, which is a
                stream of audio data that you can append to.
    
        Returns:
            A `StreamedAudioResult` instance. You can use this object to stream audio events and
            play them out.
        """
        if isinstance(audio_input, AudioInput):
            return await self._run_single_turn(audio_input)
        elif isinstance(audio_input, StreamedAudioInput):
            return await self._run_multi_turn(audio_input)
        else:
            raise UserError(f"Unsupported audio input type: {type(audio_input)}")
      
  
---|---
