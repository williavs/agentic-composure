[ ![logo](../../../assets/logo.svg) ](../../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../../)
  * [ クイックスタート  ](../../quickstart/)
  * [ コード例  ](../../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../../agents/)
    * [ エージェントの実行  ](../../running_agents/)
    * [ 結果  ](../../results/)
    * [ ストリーミング  ](../../streaming/)
    * [ ツール  ](../../tools/)
    * [ Model context protocol (MCP)  ](../../mcp/)
    * [ ハンドオフ  ](../../handoffs/)
    * [ トレーシング  ](../../tracing/)
    * [ コンテキスト管理  ](../../context/)
    * [ ガードレール  ](../../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../../models/)
      * [ LiteLLM 経由でのモデル利用  ](../../models/litellm/)
    * [ SDK の設定  ](../../config/)
    * [ エージェントの可視化  ](../../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../../voice/pipeline/)
      * [ トレーシング  ](../../voice/tracing/)



目次 

  * tracing 
  * TracingProcessor 
    * on_trace_start 
    * on_trace_end 
    * on_span_start 
    * on_span_end 
    * shutdown 
    * force_flush 
  * AgentSpanData 
  * CustomSpanData 
  * FunctionSpanData 
  * GenerationSpanData 
  * GuardrailSpanData 
  * HandoffSpanData 
  * MCPListToolsSpanData 
  * ResponseSpanData 
  * SpanData 
    * type 
    * export 
  * SpeechGroupSpanData 
  * SpeechSpanData 
  * TranscriptionSpanData 
  * Span 
    * start 
    * finish 
  * Trace 
    * trace_id 
    * name 
    * start 
    * finish 
    * export 
  * agent_span 
  * custom_span 
  * function_span 
  * generation_span 
  * get_current_span 
  * get_current_trace 
  * guardrail_span 
  * handoff_span 
  * mcp_tools_span 
  * response_span 
  * speech_group_span 
  * speech_span 
  * trace 
  * transcription_span 
  * gen_span_id 
  * gen_trace_id 
  * add_trace_processor 
  * set_trace_processors 
  * set_tracing_disabled 
  * set_tracing_export_api_key 



# Tracing module

###  TracingProcessor

Bases: `ABC`

Interface for processing spans.

Source code in `src/agents/tracing/processor_interface.py`
    
    
     9
    10
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
    55
    56

| 
    
    
    class TracingProcessor(abc.ABC):
        """Interface for processing spans."""
    
        @abc.abstractmethod
        def on_trace_start(self, trace: "Trace") -> None:
            """Called when a trace is started.
    
            Args:
                trace: The trace that started.
            """
            pass
    
        @abc.abstractmethod
        def on_trace_end(self, trace: "Trace") -> None:
            """Called when a trace is finished.
    
            Args:
                trace: The trace that started.
            """
            pass
    
        @abc.abstractmethod
        def on_span_start(self, span: "Span[Any]") -> None:
            """Called when a span is started.
    
            Args:
                span: The span that started.
            """
            pass
    
        @abc.abstractmethod
        def on_span_end(self, span: "Span[Any]") -> None:
            """Called when a span is finished. Should not block or raise exceptions.
    
            Args:
                span: The span that finished.
            """
            pass
    
        @abc.abstractmethod
        def shutdown(self) -> None:
            """Called when the application stops."""
            pass
    
        @abc.abstractmethod
        def force_flush(self) -> None:
            """Forces an immediate flush of all queued spans/traces."""
            pass
      
  
---|---  
  
####  on_trace_start `abstractmethod`
    
    
    on_trace_start(trace: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is started.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`trace` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The trace that started. |  _required_  
Source code in `src/agents/tracing/processor_interface.py`
    
    
    12
    13
    14
    15
    16
    17
    18
    19

| 
    
    
    @abc.abstractmethod
    def on_trace_start(self, trace: "Trace") -> None:
        """Called when a trace is started.
    
        Args:
            trace: The trace that started.
        """
        pass
      
  
---|---  
  
####  on_trace_end `abstractmethod`
    
    
    on_trace_end(trace: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is finished.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`trace` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The trace that started. |  _required_  
Source code in `src/agents/tracing/processor_interface.py`
    
    
    21
    22
    23
    24
    25
    26
    27
    28

| 
    
    
    @abc.abstractmethod
    def on_trace_end(self, trace: "Trace") -> None:
        """Called when a trace is finished.
    
        Args:
            trace: The trace that started.
        """
        pass
      
  
---|---  
  
####  on_span_start `abstractmethod`
    
    
    on_span_start(span: [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is started.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`span` |  `[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]` |  The span that started. |  _required_  
Source code in `src/agents/tracing/processor_interface.py`
    
    
    30
    31
    32
    33
    34
    35
    36
    37

| 
    
    
    @abc.abstractmethod
    def on_span_start(self, span: "Span[Any]") -> None:
        """Called when a span is started.
    
        Args:
            span: The span that started.
        """
        pass
      
  
---|---  
  
####  on_span_end `abstractmethod`
    
    
    on_span_end(span: [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is finished. Should not block or raise exceptions.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`span` |  `[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]` |  The span that finished. |  _required_  
Source code in `src/agents/tracing/processor_interface.py`
    
    
    39
    40
    41
    42
    43
    44
    45
    46

| 
    
    
    @abc.abstractmethod
    def on_span_end(self, span: "Span[Any]") -> None:
        """Called when a span is finished. Should not block or raise exceptions.
    
        Args:
            span: The span that finished.
        """
        pass
      
  
---|---  
  
####  shutdown `abstractmethod`
    
    
    shutdown() -> None
    

Called when the application stops.

Source code in `src/agents/tracing/processor_interface.py`
    
    
    48
    49
    50
    51

| 
    
    
    @abc.abstractmethod
    def shutdown(self) -> None:
        """Called when the application stops."""
        pass
      
  
---|---  
  
####  force_flush `abstractmethod`
    
    
    force_flush() -> None
    

Forces an immediate flush of all queued spans/traces.

Source code in `src/agents/tracing/processor_interface.py`
    
    
    53
    54
    55
    56

| 
    
    
    @abc.abstractmethod
    def force_flush(self) -> None:
        """Forces an immediate flush of all queued spans/traces."""
        pass
      
  
---|---  
  
###  AgentSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents an Agent Span in the trace. Includes name, handoffs, tools, and output type.

Source code in `src/agents/tracing/span_data.py`
    
    
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
    
    
    class AgentSpanData(SpanData):
        """
        Represents an Agent Span in the trace.
        Includes name, handoffs, tools, and output type.
        """
    
        __slots__ = ("name", "handoffs", "tools", "output_type")
    
        def __init__(
            self,
            name: str,
            handoffs: list[str] | None = None,
            tools: list[str] | None = None,
            output_type: str | None = None,
        ):
            self.name = name
            self.handoffs: list[str] | None = handoffs
            self.tools: list[str] | None = tools
            self.output_type: str | None = output_type
    
        @property
        def type(self) -> str:
            return "agent"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "name": self.name,
                "handoffs": self.handoffs,
                "tools": self.tools,
                "output_type": self.output_type,
            }
      
  
---|---  
  
###  CustomSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Custom Span in the trace. Includes name and data property bag.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class CustomSpanData(SpanData):
        """
        Represents a Custom Span in the trace.
        Includes name and data property bag.
        """
    
        __slots__ = ("name", "data")
    
        def __init__(self, name: str, data: dict[str, Any]):
            self.name = name
            self.data = data
    
        @property
        def type(self) -> str:
            return "custom"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "name": self.name,
                "data": self.data,
            }
      
  
---|---  
  
###  FunctionSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Function Span in the trace. Includes input, output and MCP data (if applicable).

Source code in `src/agents/tracing/span_data.py`
    
    
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
    
    
    class FunctionSpanData(SpanData):
        """
        Represents a Function Span in the trace.
        Includes input, output and MCP data (if applicable).
        """
    
        __slots__ = ("name", "input", "output", "mcp_data")
    
        def __init__(
            self,
            name: str,
            input: str | None,
            output: Any | None,
            mcp_data: dict[str, Any] | None = None,
        ):
            self.name = name
            self.input = input
            self.output = output
            self.mcp_data = mcp_data
    
        @property
        def type(self) -> str:
            return "function"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "name": self.name,
                "input": self.input,
                "output": str(self.output) if self.output else None,
                "mcp_data": self.mcp_data,
            }
      
  
---|---  
  
###  GenerationSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Generation Span in the trace. Includes input, output, model, model configuration, and usage.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class GenerationSpanData(SpanData):
        """
        Represents a Generation Span in the trace.
        Includes input, output, model, model configuration, and usage.
        """
    
        __slots__ = (
            "input",
            "output",
            "model",
            "model_config",
            "usage",
        )
    
        def __init__(
            self,
            input: Sequence[Mapping[str, Any]] | None = None,
            output: Sequence[Mapping[str, Any]] | None = None,
            model: str | None = None,
            model_config: Mapping[str, Any] | None = None,
            usage: dict[str, Any] | None = None,
        ):
            self.input = input
            self.output = output
            self.model = model
            self.model_config = model_config
            self.usage = usage
    
        @property
        def type(self) -> str:
            return "generation"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "input": self.input,
                "output": self.output,
                "model": self.model,
                "model_config": self.model_config,
                "usage": self.usage,
            }
      
  
---|---  
  
###  GuardrailSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Guardrail Span in the trace. Includes name and triggered status.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class GuardrailSpanData(SpanData):
        """
        Represents a Guardrail Span in the trace.
        Includes name and triggered status.
        """
    
        __slots__ = ("name", "triggered")
    
        def __init__(self, name: str, triggered: bool = False):
            self.name = name
            self.triggered = triggered
    
        @property
        def type(self) -> str:
            return "guardrail"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "name": self.name,
                "triggered": self.triggered,
            }
      
  
---|---  
  
###  HandoffSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Handoff Span in the trace. Includes source and destination agents.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class HandoffSpanData(SpanData):
        """
        Represents a Handoff Span in the trace.
        Includes source and destination agents.
        """
    
        __slots__ = ("from_agent", "to_agent")
    
        def __init__(self, from_agent: str | None, to_agent: str | None):
            self.from_agent = from_agent
            self.to_agent = to_agent
    
        @property
        def type(self) -> str:
            return "handoff"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "from_agent": self.from_agent,
                "to_agent": self.to_agent,
            }
      
  
---|---  
  
###  MCPListToolsSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents an MCP List Tools Span in the trace. Includes server and result.

Source code in `src/agents/tracing/span_data.py`
    
    
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
    363
    364
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

| 
    
    
    class MCPListToolsSpanData(SpanData):
        """
        Represents an MCP List Tools Span in the trace.
        Includes server and result.
        """
    
        __slots__ = (
            "server",
            "result",
        )
    
        def __init__(self, server: str | None = None, result: list[str] | None = None):
            self.server = server
            self.result = result
    
        @property
        def type(self) -> str:
            return "mcp_tools"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "server": self.server,
                "result": self.result,
            }
      
  
---|---  
  
###  ResponseSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Response Span in the trace. Includes response and input.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class ResponseSpanData(SpanData):
        """
        Represents a Response Span in the trace.
        Includes response and input.
        """
    
        __slots__ = ("response", "input")
    
        def __init__(
            self,
            response: Response | None = None,
            input: str | list[ResponseInputItemParam] | None = None,
        ) -> None:
            self.response = response
            # This is not used by the OpenAI trace processors, but is useful for other tracing
            # processor implementations
            self.input = input
    
        @property
        def type(self) -> str:
            return "response"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "response_id": self.response.id if self.response else None,
            }
      
  
---|---  
  
###  SpanData

Bases: `ABC`

Represents span data in the trace.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class SpanData(abc.ABC):
        """
        Represents span data in the trace.
        """
    
        @abc.abstractmethod
        def export(self) -> dict[str, Any]:
            """Export the span data as a dictionary."""
            pass
    
        @property
        @abc.abstractmethod
        def type(self) -> str:
            """Return the type of the span."""
            pass
      
  
---|---  
  
####  type `abstractmethod` `property`
    
    
    type: str
    

Return the type of the span.

####  export `abstractmethod`
    
    
    export() -> dict[str, Any]
    

Export the span data as a dictionary.

Source code in `src/agents/tracing/span_data.py`
    
    
    16
    17
    18
    19

| 
    
    
    @abc.abstractmethod
    def export(self) -> dict[str, Any]:
        """Export the span data as a dictionary."""
        pass
      
  
---|---  
  
###  SpeechGroupSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Speech Group Span in the trace.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class SpeechGroupSpanData(SpanData):
        """
        Represents a Speech Group Span in the trace.
        """
    
        __slots__ = "input"
    
        def __init__(
            self,
            input: str | None = None,
        ):
            self.input = input
    
        @property
        def type(self) -> str:
            return "speech_group"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "input": self.input,
            }
      
  
---|---  
  
###  SpeechSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Speech Span in the trace. Includes input, output, model, model configuration, and first content timestamp.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class SpeechSpanData(SpanData):
        """
        Represents a Speech Span in the trace.
        Includes input, output, model, model configuration, and first content timestamp.
        """
    
        __slots__ = ("input", "output", "model", "model_config", "first_content_at")
    
        def __init__(
            self,
            input: str | None = None,
            output: str | None = None,
            output_format: str | None = "pcm",
            model: str | None = None,
            model_config: Mapping[str, Any] | None = None,
            first_content_at: str | None = None,
        ):
            self.input = input
            self.output = output
            self.output_format = output_format
            self.model = model
            self.model_config = model_config
            self.first_content_at = first_content_at
    
        @property
        def type(self) -> str:
            return "speech"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "input": self.input,
                "output": {
                    "data": self.output or "",
                    "format": self.output_format,
                },
                "model": self.model,
                "model_config": self.model_config,
                "first_content_at": self.first_content_at,
            }
      
  
---|---  
  
###  TranscriptionSpanData

Bases: `[SpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpanData "SpanData \(agents.tracing.span_data.SpanData\)")`

Represents a Transcription Span in the trace. Includes input, output, model, and model configuration.

Source code in `src/agents/tracing/span_data.py`
    
    
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

| 
    
    
    class TranscriptionSpanData(SpanData):
        """
        Represents a Transcription Span in the trace.
        Includes input, output, model, and model configuration.
        """
    
        __slots__ = (
            "input",
            "output",
            "model",
            "model_config",
        )
    
        def __init__(
            self,
            input: str | None = None,
            input_format: str | None = "pcm",
            output: str | None = None,
            model: str | None = None,
            model_config: Mapping[str, Any] | None = None,
        ):
            self.input = input
            self.input_format = input_format
            self.output = output
            self.model = model
            self.model_config = model_config
    
        @property
        def type(self) -> str:
            return "transcription"
    
        def export(self) -> dict[str, Any]:
            return {
                "type": self.type,
                "input": {
                    "data": self.input or "",
                    "format": self.input_format,
                },
                "output": self.output,
                "model": self.model,
                "model_config": self.model_config,
            }
      
  
---|---  
  
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
  
###  Trace

A trace is the root level object that tracing creates. It represents a logical "workflow".

Source code in `src/agents/tracing/traces.py`
    
    
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

| 
    
    
    class Trace:
        """
        A trace is the root level object that tracing creates. It represents a logical "workflow".
        """
    
        @abc.abstractmethod
        def __enter__(self) -> Trace:
            pass
    
        @abc.abstractmethod
        def __exit__(self, exc_type, exc_val, exc_tb):
            pass
    
        @abc.abstractmethod
        def start(self, mark_as_current: bool = False):
            """
            Start the trace.
    
            Args:
                mark_as_current: If true, the trace will be marked as the current trace.
            """
            pass
    
        @abc.abstractmethod
        def finish(self, reset_current: bool = False):
            """
            Finish the trace.
    
            Args:
                reset_current: If true, the trace will be reset as the current trace.
            """
            pass
    
        @property
        @abc.abstractmethod
        def trace_id(self) -> str:
            """
            The trace ID.
            """
            pass
    
        @property
        @abc.abstractmethod
        def name(self) -> str:
            """
            The name of the workflow being traced.
            """
            pass
    
        @abc.abstractmethod
        def export(self) -> dict[str, Any] | None:
            """
            Export the trace as a dictionary.
            """
            pass
      
  
---|---  
  
####  trace_id `abstractmethod` `property`
    
    
    trace_id: str
    

The trace ID.

####  name `abstractmethod` `property`
    
    
    name: str
    

The name of the workflow being traced.

####  start `abstractmethod`
    
    
    start(mark_as_current: bool = False)
    

Start the trace.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`mark_as_current` |  `bool` |  If true, the trace will be marked as the current trace. |  `False`  
Source code in `src/agents/tracing/traces.py`
    
    
    26
    27
    28
    29
    30
    31
    32
    33
    34

| 
    
    
    @abc.abstractmethod
    def start(self, mark_as_current: bool = False):
        """
        Start the trace.
    
        Args:
            mark_as_current: If true, the trace will be marked as the current trace.
        """
        pass
      
  
---|---  
  
####  finish `abstractmethod`
    
    
    finish(reset_current: bool = False)
    

Finish the trace.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`reset_current` |  `bool` |  If true, the trace will be reset as the current trace. |  `False`  
Source code in `src/agents/tracing/traces.py`
    
    
    36
    37
    38
    39
    40
    41
    42
    43
    44

| 
    
    
    @abc.abstractmethod
    def finish(self, reset_current: bool = False):
        """
        Finish the trace.
    
        Args:
            reset_current: If true, the trace will be reset as the current trace.
        """
        pass
      
  
---|---  
  
####  export `abstractmethod`
    
    
    export() -> dict[str, Any] | None
    

Export the trace as a dictionary.

Source code in `src/agents/tracing/traces.py`
    
    
    62
    63
    64
    65
    66
    67

| 
    
    
    @abc.abstractmethod
    def export(self) -> dict[str, Any] | None:
        """
        Export the trace as a dictionary.
        """
        pass
      
  
---|---  
  
###  agent_span
    
    
    agent_span(
        name: str,
        handoffs: list[str] | None = None,
        tools: list[str] | None = None,
        output_type: str | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[AgentSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.AgentSpanData "AgentSpanData \(agents.tracing.span_data.AgentSpanData\)")]
    

Create a new agent span. The span will not be started automatically, you should either do `with agent_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`name` |  `str` |  The name of the agent. |  _required_  
`handoffs` |  `list[str] | None` |  Optional list of agent names to which this agent could hand off control. |  `None`  
`tools` |  `list[str] | None` |  Optional list of tool names available to this agent. |  `None`  
`output_type` |  `str | None` |  Optional name of the output type produced by the agent. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[AgentSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.AgentSpanData "AgentSpanData \(agents.tracing.span_data.AgentSpanData\)")]` |  The newly created agent span.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def agent_span(
        name: str,
        handoffs: list[str] | None = None,
        tools: list[str] | None = None,
        output_type: str | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[AgentSpanData]:
        """Create a new agent span. The span will not be started automatically, you should either do
        `with agent_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            name: The name of the agent.
            handoffs: Optional list of agent names to which this agent could hand off control.
            tools: Optional list of tool names available to this agent.
            output_type: Optional name of the output type produced by the agent.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
    
        Returns:
            The newly created agent span.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=AgentSpanData(name=name, handoffs=handoffs, tools=tools, output_type=output_type),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  custom_span
    
    
    custom_span(
        name: str,
        data: dict[str, Any] | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[CustomSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.CustomSpanData "CustomSpanData \(agents.tracing.span_data.CustomSpanData\)")]
    

Create a new custom span, to which you can add your own metadata. The span will not be started automatically, you should either do `with custom_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`name` |  `str` |  The name of the custom span. |  _required_  
`data` |  `dict[str, Any] | None` |  Arbitrary structured data to associate with the span. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[CustomSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.CustomSpanData "CustomSpanData \(agents.tracing.span_data.CustomSpanData\)")]` |  The newly created custom span.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def custom_span(
        name: str,
        data: dict[str, Any] | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[CustomSpanData]:
        """Create a new custom span, to which you can add your own metadata. The span will not be
        started automatically, you should either do `with custom_span() ...` or call
        `span.start()` + `span.finish()` manually.
    
        Args:
            name: The name of the custom span.
            data: Arbitrary structured data to associate with the span.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
    
        Returns:
            The newly created custom span.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=CustomSpanData(name=name, data=data or {}),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  function_span
    
    
    function_span(
        name: str,
        input: str | None = None,
        output: str | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[FunctionSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.FunctionSpanData "FunctionSpanData \(agents.tracing.span_data.FunctionSpanData\)")]
    

Create a new function span. The span will not be started automatically, you should either do `with function_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`name` |  `str` |  The name of the function. |  _required_  
`input` |  `str | None` |  The input to the function. |  `None`  
`output` |  `str | None` |  The output of the function. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[FunctionSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.FunctionSpanData "FunctionSpanData \(agents.tracing.span_data.FunctionSpanData\)")]` |  The newly created function span.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def function_span(
        name: str,
        input: str | None = None,
        output: str | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[FunctionSpanData]:
        """Create a new function span. The span will not be started automatically, you should either do
        `with function_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            name: The name of the function.
            input: The input to the function.
            output: The output of the function.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
    
        Returns:
            The newly created function span.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=FunctionSpanData(name=name, input=input, output=output),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  generation_span
    
    
    generation_span(
        input: Sequence[Mapping[str, Any]] | None = None,
        output: Sequence[Mapping[str, Any]] | None = None,
        model: str | None = None,
        model_config: Mapping[str, Any] | None = None,
        usage: dict[str, Any] | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[GenerationSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.GenerationSpanData "GenerationSpanData \(agents.tracing.span_data.GenerationSpanData\)")]
    

Create a new generation span. The span will not be started automatically, you should either do `with generation_span() ...` or call `span.start()` \+ `span.finish()` manually.

This span captures the details of a model generation, including the input message sequence, any generated outputs, the model name and configuration, and usage data. If you only need to capture a model response identifier, use `response_span()` instead.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`input` |  `Sequence[Mapping[str, Any]] | None` |  The sequence of input messages sent to the model. |  `None`  
`output` |  `Sequence[Mapping[str, Any]] | None` |  The sequence of output messages received from the model. |  `None`  
`model` |  `str | None` |  The model identifier used for the generation. |  `None`  
`model_config` |  `Mapping[str, Any] | None` |  The model configuration (hyperparameters) used. |  `None`  
`usage` |  `dict[str, Any] | None` |  A dictionary of usage information (input tokens, output tokens, etc.). |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[GenerationSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.GenerationSpanData "GenerationSpanData \(agents.tracing.span_data.GenerationSpanData\)")]` |  The newly created generation span.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def generation_span(
        input: Sequence[Mapping[str, Any]] | None = None,
        output: Sequence[Mapping[str, Any]] | None = None,
        model: str | None = None,
        model_config: Mapping[str, Any] | None = None,
        usage: dict[str, Any] | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[GenerationSpanData]:
        """Create a new generation span. The span will not be started automatically, you should either
        do `with generation_span() ...` or call `span.start()` + `span.finish()` manually.
    
        This span captures the details of a model generation, including the
        input message sequence, any generated outputs, the model name and
        configuration, and usage data. If you only need to capture a model
        response identifier, use `response_span()` instead.
    
        Args:
            input: The sequence of input messages sent to the model.
            output: The sequence of output messages received from the model.
            model: The model identifier used for the generation.
            model_config: The model configuration (hyperparameters) used.
            usage: A dictionary of usage information (input tokens, output tokens, etc.).
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
    
        Returns:
            The newly created generation span.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=GenerationSpanData(
                input=input,
                output=output,
                model=model,
                model_config=model_config,
                usage=usage,
            ),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  get_current_span
    
    
    get_current_span() -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None
    

Returns the currently active span, if present.

Source code in `src/agents/tracing/create.py`
    
    
    79
    80
    81

| 
    
    
    def get_current_span() -> Span[Any] | None:
        """Returns the currently active span, if present."""
        return GLOBAL_TRACE_PROVIDER.get_current_span()
      
  
---|---  
  
###  get_current_trace
    
    
    get_current_trace() -> [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | None
    

Returns the currently active trace, if present.

Source code in `src/agents/tracing/create.py`
    
    
    74
    75
    76

| 
    
    
    def get_current_trace() -> Trace | None:
        """Returns the currently active trace, if present."""
        return GLOBAL_TRACE_PROVIDER.get_current_trace()
      
  
---|---  
  
###  guardrail_span
    
    
    guardrail_span(
        name: str,
        triggered: bool = False,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[GuardrailSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.GuardrailSpanData "GuardrailSpanData \(agents.tracing.span_data.GuardrailSpanData\)")]
    

Create a new guardrail span. The span will not be started automatically, you should either do `with guardrail_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`name` |  `str` |  The name of the guardrail. |  _required_  
`triggered` |  `bool` |  Whether the guardrail was triggered. |  `False`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def guardrail_span(
        name: str,
        triggered: bool = False,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[GuardrailSpanData]:
        """Create a new guardrail span. The span will not be started automatically, you should either
        do `with guardrail_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            name: The name of the guardrail.
            triggered: Whether the guardrail was triggered.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=GuardrailSpanData(name=name, triggered=triggered),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  handoff_span
    
    
    handoff_span(
        from_agent: str | None = None,
        to_agent: str | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[HandoffSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.HandoffSpanData "HandoffSpanData \(agents.tracing.span_data.HandoffSpanData\)")]
    

Create a new handoff span. The span will not be started automatically, you should either do `with handoff_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`from_agent` |  `str | None` |  The name of the agent that is handing off. |  `None`  
`to_agent` |  `str | None` |  The name of the agent that is receiving the handoff. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[HandoffSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.HandoffSpanData "HandoffSpanData \(agents.tracing.span_data.HandoffSpanData\)")]` |  The newly created handoff span.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def handoff_span(
        from_agent: str | None = None,
        to_agent: str | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[HandoffSpanData]:
        """Create a new handoff span. The span will not be started automatically, you should either do
        `with handoff_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            from_agent: The name of the agent that is handing off.
            to_agent: The name of the agent that is receiving the handoff.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
    
        Returns:
            The newly created handoff span.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=HandoffSpanData(from_agent=from_agent, to_agent=to_agent),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  mcp_tools_span
    
    
    mcp_tools_span(
        server: str | None = None,
        result: list[str] | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[MCPListToolsSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.MCPListToolsSpanData "MCPListToolsSpanData \(agents.tracing.span_data.MCPListToolsSpanData\)")]
    

Create a new MCP list tools span. The span will not be started automatically, you should either do `with mcp_tools_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`server` |  `str | None` |  The name of the MCP server. |  `None`  
`result` |  `list[str] | None` |  The result of the MCP list tools call. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def mcp_tools_span(
        server: str | None = None,
        result: list[str] | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[MCPListToolsSpanData]:
        """Create a new MCP list tools span. The span will not be started automatically, you should
        either do `with mcp_tools_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            server: The name of the MCP server.
            result: The result of the MCP list tools call.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=MCPListToolsSpanData(server=server, result=result),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  response_span
    
    
    response_span(
        response: Response | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[ResponseSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.ResponseSpanData "ResponseSpanData \(agents.tracing.span_data.ResponseSpanData\)")]
    

Create a new response span. The span will not be started automatically, you should either do `with response_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`response` |  `Response | None` |  The OpenAI Response object. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def response_span(
        response: Response | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[ResponseSpanData]:
        """Create a new response span. The span will not be started automatically, you should either do
        `with response_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            response: The OpenAI Response object.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=ResponseSpanData(response=response),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  speech_group_span
    
    
    speech_group_span(
        input: str | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[SpeechGroupSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpeechGroupSpanData "SpeechGroupSpanData \(agents.tracing.span_data.SpeechGroupSpanData\)")]
    

Create a new speech group span. The span will not be started automatically, you should either do `with speech_group_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`input` |  `str | None` |  The input text used for the speech request. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def speech_group_span(
        input: str | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[SpeechGroupSpanData]:
        """Create a new speech group span. The span will not be started automatically, you should
        either do `with speech_group_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            input: The input text used for the speech request.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=SpeechGroupSpanData(input=input),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  speech_span
    
    
    speech_span(
        model: str | None = None,
        input: str | None = None,
        output: str | None = None,
        output_format: str | None = "pcm",
        model_config: Mapping[str, Any] | None = None,
        first_content_at: str | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[SpeechSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.SpeechSpanData "SpeechSpanData \(agents.tracing.span_data.SpeechSpanData\)")]
    

Create a new speech span. The span will not be started automatically, you should either do `with speech_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model` |  `str | None` |  The name of the model used for the text-to-speech. |  `None`  
`input` |  `str | None` |  The text input of the text-to-speech. |  `None`  
`output` |  `str | None` |  The audio output of the text-to-speech as base64 encoded string of PCM audio bytes. |  `None`  
`output_format` |  `str | None` |  The format of the audio output (defaults to "pcm"). |  `'pcm'`  
`model_config` |  `Mapping[str, Any] | None` |  The model configuration (hyperparameters) used. |  `None`  
`first_content_at` |  `str | None` |  The time of the first byte of the audio output. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
Source code in `src/agents/tracing/create.py`
    
    
    361
    362
    363
    364
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

| 
    
    
    def speech_span(
        model: str | None = None,
        input: str | None = None,
        output: str | None = None,
        output_format: str | None = "pcm",
        model_config: Mapping[str, Any] | None = None,
        first_content_at: str | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[SpeechSpanData]:
        """Create a new speech span. The span will not be started automatically, you should either do
        `with speech_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            model: The name of the model used for the text-to-speech.
            input: The text input of the text-to-speech.
            output: The audio output of the text-to-speech as base64 encoded string of PCM audio bytes.
            output_format: The format of the audio output (defaults to "pcm").
            model_config: The model configuration (hyperparameters) used.
            first_content_at: The time of the first byte of the audio output.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=SpeechSpanData(
                model=model,
                input=input,
                output=output,
                output_format=output_format,
                model_config=model_config,
                first_content_at=first_content_at,
            ),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  trace
    
    
    trace(
        workflow_name: str,
        trace_id: str | None = None,
        group_id: str | None = None,
        metadata: dict[str, Any] | None = None,
        disabled: bool = False,
    ) -> [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")
    

Create a new trace. The trace will not be started automatically; you should either use it as a context manager (`with trace(...):`) or call `trace.start()` \+ `trace.finish()` manually.

In addition to the workflow name and optional grouping identifier, you can provide an arbitrary metadata dictionary to attach additional user-defined information to the trace.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`workflow_name` |  `str` |  The name of the logical app or workflow. For example, you might provide "code_bot" for a coding agent, or "customer_support_agent" for a customer support agent. |  _required_  
`trace_id` |  `str | None` |  The ID of the trace. Optional. If not provided, we will generate an ID. We recommend using `util.gen_trace_id()` to generate a trace ID, to guarantee that IDs are correctly formatted. |  `None`  
`group_id` |  `str | None` |  Optional grouping identifier to link multiple traces from the same conversation or process. For instance, you might use a chat thread ID. |  `None`  
`metadata` |  `dict[str, Any] | None` |  Optional dictionary of additional metadata to attach to the trace. |  `None`  
`disabled` |  `bool` |  If True, we will return a Trace but the Trace will not be recorded. This will not be checked if there's an existing trace and `even_if_trace_running` is True. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The newly created trace object.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def trace(
        workflow_name: str,
        trace_id: str | None = None,
        group_id: str | None = None,
        metadata: dict[str, Any] | None = None,
        disabled: bool = False,
    ) -> Trace:
        """
        Create a new trace. The trace will not be started automatically; you should either use
        it as a context manager (`with trace(...):`) or call `trace.start()` + `trace.finish()`
        manually.
    
        In addition to the workflow name and optional grouping identifier, you can provide
        an arbitrary metadata dictionary to attach additional user-defined information to
        the trace.
    
        Args:
            workflow_name: The name of the logical app or workflow. For example, you might provide
                "code_bot" for a coding agent, or "customer_support_agent" for a customer support agent.
            trace_id: The ID of the trace. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_trace_id()` to generate a trace ID, to guarantee that IDs are
                correctly formatted.
            group_id: Optional grouping identifier to link multiple traces from the same conversation
                or process. For instance, you might use a chat thread ID.
            metadata: Optional dictionary of additional metadata to attach to the trace.
            disabled: If True, we will return a Trace but the Trace will not be recorded. This will
                not be checked if there's an existing trace and `even_if_trace_running` is True.
    
        Returns:
            The newly created trace object.
        """
        current_trace = GLOBAL_TRACE_PROVIDER.get_current_trace()
        if current_trace:
            logger.warning(
                "Trace already exists. Creating a new trace, but this is probably a mistake."
            )
    
        return GLOBAL_TRACE_PROVIDER.create_trace(
            name=workflow_name,
            trace_id=trace_id,
            group_id=group_id,
            metadata=metadata,
            disabled=disabled,
        )
      
  
---|---  
  
###  transcription_span
    
    
    transcription_span(
        model: str | None = None,
        input: str | None = None,
        input_format: str | None = "pcm",
        output: str | None = None,
        model_config: Mapping[str, Any] | None = None,
        span_id: str | None = None,
        parent: [Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[TranscriptionSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.TranscriptionSpanData "TranscriptionSpanData \(agents.tracing.span_data.TranscriptionSpanData\)")]
    

Create a new transcription span. The span will not be started automatically, you should either do `with transcription_span() ...` or call `span.start()` \+ `span.finish()` manually.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model` |  `str | None` |  The name of the model used for the speech-to-text. |  `None`  
`input` |  `str | None` |  The audio input of the speech-to-text transcription, as a base64 encoded string of audio bytes. |  `None`  
`input_format` |  `str | None` |  The format of the audio input (defaults to "pcm"). |  `'pcm'`  
`output` |  `str | None` |  The output of the speech-to-text transcription. |  `None`  
`model_config` |  `Mapping[str, Any] | None` |  The model configuration (hyperparameters) used. |  `None`  
`span_id` |  `str | None` |  The ID of the span. Optional. If not provided, we will generate an ID. We recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are correctly formatted. |  `None`  
`parent` |  `[Trace](../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None` |  The parent span or trace. If not provided, we will automatically use the current trace/span as the parent. |  `None`  
`disabled` |  `bool` |  If True, we will return a Span but the Span will not be recorded. |  `False`  
  
Returns:

Type | Description  
---|---  
`[Span](../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[[TranscriptionSpanData](../../../ref/tracing/span_data/#agents.tracing.span_data.TranscriptionSpanData "TranscriptionSpanData \(agents.tracing.span_data.TranscriptionSpanData\)")]` |  The newly created speech-to-text span.  
Source code in `src/agents/tracing/create.py`
    
    
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

| 
    
    
    def transcription_span(
        model: str | None = None,
        input: str | None = None,
        input_format: str | None = "pcm",
        output: str | None = None,
        model_config: Mapping[str, Any] | None = None,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[TranscriptionSpanData]:
        """Create a new transcription span. The span will not be started automatically, you should
        either do `with transcription_span() ...` or call `span.start()` + `span.finish()` manually.
    
        Args:
            model: The name of the model used for the speech-to-text.
            input: The audio input of the speech-to-text transcription, as a base64 encoded string of
                audio bytes.
            input_format: The format of the audio input (defaults to "pcm").
            output: The output of the speech-to-text transcription.
            model_config: The model configuration (hyperparameters) used.
            span_id: The ID of the span. Optional. If not provided, we will generate an ID. We
                recommend using `util.gen_span_id()` to generate a span ID, to guarantee that IDs are
                correctly formatted.
            parent: The parent span or trace. If not provided, we will automatically use the current
                trace/span as the parent.
            disabled: If True, we will return a Span but the Span will not be recorded.
    
        Returns:
            The newly created speech-to-text span.
        """
        return GLOBAL_TRACE_PROVIDER.create_span(
            span_data=TranscriptionSpanData(
                input=input,
                input_format=input_format,
                output=output,
                model=model,
                model_config=model_config,
            ),
            span_id=span_id,
            parent=parent,
            disabled=disabled,
        )
      
  
---|---  
  
###  gen_span_id
    
    
    gen_span_id() -> str
    

Generates a new span ID.

Source code in `src/agents/tracing/util.py`
    
    
    15
    16
    17

| 
    
    
    def gen_span_id() -> str:
        """Generates a new span ID."""
        return f"span_{uuid.uuid4().hex[:24]}"
      
  
---|---  
  
###  gen_trace_id
    
    
    gen_trace_id() -> str
    

Generates a new trace ID.

Source code in `src/agents/tracing/util.py`
    
    
    10
    11
    12

| 
    
    
    def gen_trace_id() -> str:
        """Generates a new trace ID."""
        return f"trace_{uuid.uuid4().hex}"
      
  
---|---  
  
###  add_trace_processor
    
    
    add_trace_processor(
        span_processor: [TracingProcessor](../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)"),
    ) -> None
    

Adds a new trace processor. This processor will receive all traces/spans.

Source code in `src/agents/tracing/__init__.py`
    
    
    79
    80
    81
    82
    83

| 
    
    
    def add_trace_processor(span_processor: TracingProcessor) -> None:
        """
        Adds a new trace processor. This processor will receive all traces/spans.
        """
        GLOBAL_TRACE_PROVIDER.register_processor(span_processor)
      
  
---|---  
  
###  set_trace_processors
    
    
    set_trace_processors(
        processors: list[[TracingProcessor](../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)")],
    ) -> None
    

Set the list of trace processors. This will replace the current list of processors.

Source code in `src/agents/tracing/__init__.py`
    
    
    86
    87
    88
    89
    90

| 
    
    
    def set_trace_processors(processors: list[TracingProcessor]) -> None:
        """
        Set the list of trace processors. This will replace the current list of processors.
        """
        GLOBAL_TRACE_PROVIDER.set_processors(processors)
      
  
---|---  
  
###  set_tracing_disabled
    
    
    set_tracing_disabled(disabled: bool) -> None
    

Set whether tracing is globally disabled.

Source code in `src/agents/tracing/__init__.py`
    
    
    93
    94
    95
    96
    97

| 
    
    
    def set_tracing_disabled(disabled: bool) -> None:
        """
        Set whether tracing is globally disabled.
        """
        GLOBAL_TRACE_PROVIDER.set_disabled(disabled)
      
  
---|---  
  
###  set_tracing_export_api_key
    
    
    set_tracing_export_api_key(api_key: str) -> None
    

Set the OpenAI API key for the backend exporter.

Source code in `src/agents/tracing/__init__.py`
    
    
    100
    101
    102
    103
    104

| 
    
    
    def set_tracing_export_api_key(api_key: str) -> None:
        """
        Set the OpenAI API key for the backend exporter.
        """
        default_exporter().set_api_key(api_key)
      
  
---|---
