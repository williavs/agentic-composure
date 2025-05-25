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
      * [ Spans  ](../spans/)
      * [ Processor interface  ](../processor_interface/)
      * [ Processors  ](../processors/)
      * [ Scope  ](../scope/)
      * [ Setup  ](../setup/)
      * Span data  [ Span data  ](./) Table of contents 
        * span_data 
        * SpanData 
          * type 
          * export 
        * AgentSpanData 
        * FunctionSpanData 
        * GenerationSpanData 
        * ResponseSpanData 
        * HandoffSpanData 
        * CustomSpanData 
        * GuardrailSpanData 
        * TranscriptionSpanData 
        * SpeechSpanData 
        * SpeechGroupSpanData 
        * MCPListToolsSpanData 
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

  * span_data 
  * SpanData 
    * type 
    * export 
  * AgentSpanData 
  * FunctionSpanData 
  * GenerationSpanData 
  * ResponseSpanData 
  * HandoffSpanData 
  * CustomSpanData 
  * GuardrailSpanData 
  * TranscriptionSpanData 
  * SpeechSpanData 
  * SpeechGroupSpanData 
  * MCPListToolsSpanData 



# `Span data`

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
  
###  AgentSpanData

Bases: `SpanData`

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
  
###  FunctionSpanData

Bases: `SpanData`

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

Bases: `SpanData`

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
  
###  ResponseSpanData

Bases: `SpanData`

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
  
###  HandoffSpanData

Bases: `SpanData`

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
  
###  CustomSpanData

Bases: `SpanData`

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
  
###  GuardrailSpanData

Bases: `SpanData`

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
  
###  TranscriptionSpanData

Bases: `SpanData`

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
  
###  SpeechSpanData

Bases: `SpanData`

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
  
###  SpeechGroupSpanData

Bases: `SpanData`

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
  
###  MCPListToolsSpanData

Bases: `SpanData`

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
