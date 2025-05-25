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
      * [ Tracing module  ](../)
      * [ Creating traces/spans  ](../create/)
      * [ Traces  ](../traces/)
      * Spans  [ Spans  ](./) Table of contents 
        * spans 
        * Span 
          * start 
          * finish 
        * NoOpSpan 
        * SpanImpl 
      * [ Processor interface  ](../processor_interface/)
      * [ Processors  ](../processors/)
      * [ Scope  ](../scope/)
      * [ Setup  ](../setup/)
      * [ Span data  ](../span_data/)
      * [ Util  ](../util/)
    * Voice  Voice 
      * [ Pipeline  ](../../voice/pipeline/)
      * [ Workflow  ](../../voice/workflow/)
      * [ Input  ](../../voice/input/)
      * [ Result  ](../../voice/result/)
      * [ Pipeline Config  ](../../voice/pipeline_config/)
      * [ Events  ](../../voice/events/)
      * [ Exceptions  ](../../voice/exceptions/)
      * [ Model  ](../../voice/model/)
      * [ Utils  ](../../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../../voice/models/openai_provider/)
      * [ OpenAI STT  ](../../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../extensions/litellm/)



Table of contents 

  * spans 
  * Span 
    * start 
    * finish 
  * NoOpSpan 
  * SpanImpl 



# `Spans`

###  Span

Bases: `ABC`, `Generic[TSpanData]`

Source code in `src/agents/tracing/spans.py`
    
    
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

| 
    
    
    class Span(abc.ABC, Generic[TSpanData]):
        @property
        @abc.abstractmethod
        def trace_id(self) -> str:
            pass
    
        @property
        @abc.abstractmethod
        def span_id(self) -> str:
            pass
    
        @property
        @abc.abstractmethod
        def span_data(self) -> TSpanData:
            pass
    
        @abc.abstractmethod
        def start(self, mark_as_current: bool = False):
            """
            Start the span.
    
            Args:
                mark_as_current: If true, the span will be marked as the current span.
            """
            pass
    
        @abc.abstractmethod
        def finish(self, reset_current: bool = False) -> None:
            """
            Finish the span.
    
            Args:
                reset_current: If true, the span will be reset as the current span.
            """
            pass
    
        @abc.abstractmethod
        def __enter__(self) -> Span[TSpanData]:
            pass
    
        @abc.abstractmethod
        def __exit__(self, exc_type, exc_val, exc_tb):
            pass
    
        @property
        @abc.abstractmethod
        def parent_id(self) -> str | None:
            pass
    
        @abc.abstractmethod
        def set_error(self, error: SpanError) -> None:
            pass
    
        @property
        @abc.abstractmethod
        def error(self) -> SpanError | None:
            pass
    
        @abc.abstractmethod
        def export(self) -> dict[str, Any] | None:
            pass
    
        @property
        @abc.abstractmethod
        def started_at(self) -> str | None:
            pass
    
        @property
        @abc.abstractmethod
        def ended_at(self) -> str | None:
            pass
      
  
---|---  
  
####  start `abstractmethod`
    
    
    start(mark_as_current: bool = False)
    

Start the span.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`mark_as_current` |  `bool` |  If true, the span will be marked as the current span. |  `False`  
Source code in `src/agents/tracing/spans.py`
    
    
    39
    40
    41
    42
    43
    44
    45
    46
    47

| 
    
    
    @abc.abstractmethod
    def start(self, mark_as_current: bool = False):
        """
        Start the span.
    
        Args:
            mark_as_current: If true, the span will be marked as the current span.
        """
        pass
      
  
---|---  
  
####  finish `abstractmethod`
    
    
    finish(reset_current: bool = False) -> None
    

Finish the span.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`reset_current` |  `bool` |  If true, the span will be reset as the current span. |  `False`  
Source code in `src/agents/tracing/spans.py`
    
    
    49
    50
    51
    52
    53
    54
    55
    56
    57

| 
    
    
    @abc.abstractmethod
    def finish(self, reset_current: bool = False) -> None:
        """
        Finish the span.
    
        Args:
            reset_current: If true, the span will be reset as the current span.
        """
        pass
      
  
---|---  
  
###  NoOpSpan

Bases: `Span[TSpanData]`

Source code in `src/agents/tracing/spans.py`
    
    
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

| 
    
    
    class NoOpSpan(Span[TSpanData]):
        __slots__ = ("_span_data", "_prev_span_token")
    
        def __init__(self, span_data: TSpanData):
            self._span_data = span_data
            self._prev_span_token: contextvars.Token[Span[TSpanData] | None] | None = None
    
        @property
        def trace_id(self) -> str:
            return "no-op"
    
        @property
        def span_id(self) -> str:
            return "no-op"
    
        @property
        def span_data(self) -> TSpanData:
            return self._span_data
    
        @property
        def parent_id(self) -> str | None:
            return None
    
        def start(self, mark_as_current: bool = False):
            if mark_as_current:
                self._prev_span_token = Scope.set_current_span(self)
    
        def finish(self, reset_current: bool = False) -> None:
            if reset_current and self._prev_span_token is not None:
                Scope.reset_current_span(self._prev_span_token)
                self._prev_span_token = None
    
        def __enter__(self) -> Span[TSpanData]:
            self.start(mark_as_current=True)
            return self
    
        def __exit__(self, exc_type, exc_val, exc_tb):
            reset_current = True
            if exc_type is GeneratorExit:
                logger.debug("GeneratorExit, skipping span reset")
                reset_current = False
    
            self.finish(reset_current=reset_current)
    
        def set_error(self, error: SpanError) -> None:
            pass
    
        @property
        def error(self) -> SpanError | None:
            return None
    
        def export(self) -> dict[str, Any] | None:
            return None
    
        @property
        def started_at(self) -> str | None:
            return None
    
        @property
        def ended_at(self) -> str | None:
            return None
      
  
---|---  
  
###  SpanImpl

Bases: `Span[TSpanData]`

Source code in `src/agents/tracing/spans.py`
    
    
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

| 
    
    
    class SpanImpl(Span[TSpanData]):
        __slots__ = (
            "_trace_id",
            "_span_id",
            "_parent_id",
            "_started_at",
            "_ended_at",
            "_error",
            "_prev_span_token",
            "_processor",
            "_span_data",
        )
    
        def __init__(
            self,
            trace_id: str,
            span_id: str | None,
            parent_id: str | None,
            processor: TracingProcessor,
            span_data: TSpanData,
        ):
            self._trace_id = trace_id
            self._span_id = span_id or util.gen_span_id()
            self._parent_id = parent_id
            self._started_at: str | None = None
            self._ended_at: str | None = None
            self._processor = processor
            self._error: SpanError | None = None
            self._prev_span_token: contextvars.Token[Span[TSpanData] | None] | None = None
            self._span_data = span_data
    
        @property
        def trace_id(self) -> str:
            return self._trace_id
    
        @property
        def span_id(self) -> str:
            return self._span_id
    
        @property
        def span_data(self) -> TSpanData:
            return self._span_data
    
        @property
        def parent_id(self) -> str | None:
            return self._parent_id
    
        def start(self, mark_as_current: bool = False):
            if self.started_at is not None:
                logger.warning("Span already started")
                return
    
            self._started_at = util.time_iso()
            self._processor.on_span_start(self)
            if mark_as_current:
                self._prev_span_token = Scope.set_current_span(self)
    
        def finish(self, reset_current: bool = False) -> None:
            if self.ended_at is not None:
                logger.warning("Span already finished")
                return
    
            self._ended_at = util.time_iso()
            self._processor.on_span_end(self)
            if reset_current and self._prev_span_token is not None:
                Scope.reset_current_span(self._prev_span_token)
                self._prev_span_token = None
    
        def __enter__(self) -> Span[TSpanData]:
            self.start(mark_as_current=True)
            return self
    
        def __exit__(self, exc_type, exc_val, exc_tb):
            reset_current = True
            if exc_type is GeneratorExit:
                logger.debug("GeneratorExit, skipping span reset")
                reset_current = False
    
            self.finish(reset_current=reset_current)
    
        def set_error(self, error: SpanError) -> None:
            self._error = error
    
        @property
        def error(self) -> SpanError | None:
            return self._error
    
        @property
        def started_at(self) -> str | None:
            return self._started_at
    
        @property
        def ended_at(self) -> str | None:
            return self._ended_at
    
        def export(self) -> dict[str, Any] | None:
            return {
                "object": "trace.span",
                "id": self.span_id,
                "trace_id": self.trace_id,
                "parent_id": self._parent_id,
                "started_at": self._started_at,
                "ended_at": self._ended_at,
                "span_data": self.span_data.export(),
                "error": self._error,
            }
      
  
---|---
