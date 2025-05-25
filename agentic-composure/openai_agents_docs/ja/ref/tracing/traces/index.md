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

  * traces 
  * Trace 
    * trace_id 
    * name 
    * start 
    * finish 
    * export 
  * NoOpTrace 
  * TraceImpl 



# `Traces`

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
  
###  NoOpTrace

Bases: `[Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")`

A no-op trace that will not be recorded.

Source code in `src/agents/tracing/traces.py`
    
    
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

| 
    
    
    class NoOpTrace(Trace):
        """
        A no-op trace that will not be recorded.
        """
    
        def __init__(self):
            self._started = False
            self._prev_context_token: contextvars.Token[Trace | None] | None = None
    
        def __enter__(self) -> Trace:
            if self._started:
                if not self._prev_context_token:
                    logger.error("Trace already started but no context token set")
                return self
    
            self._started = True
            self.start(mark_as_current=True)
    
            return self
    
        def __exit__(self, exc_type, exc_val, exc_tb):
            self.finish(reset_current=True)
    
        def start(self, mark_as_current: bool = False):
            if mark_as_current:
                self._prev_context_token = Scope.set_current_trace(self)
    
        def finish(self, reset_current: bool = False):
            if reset_current and self._prev_context_token is not None:
                Scope.reset_current_trace(self._prev_context_token)
                self._prev_context_token = None
    
        @property
        def trace_id(self) -> str:
            return "no-op"
    
        @property
        def name(self) -> str:
            return "no-op"
    
        def export(self) -> dict[str, Any] | None:
            return None
      
  
---|---  
  
###  TraceImpl

Bases: `[Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")`

A trace that will be recorded by the tracing library.

Source code in `src/agents/tracing/traces.py`
    
    
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

| 
    
    
    class TraceImpl(Trace):
        """
        A trace that will be recorded by the tracing library.
        """
    
        __slots__ = (
            "_name",
            "_trace_id",
            "group_id",
            "metadata",
            "_prev_context_token",
            "_processor",
            "_started",
        )
    
        def __init__(
            self,
            name: str,
            trace_id: str | None,
            group_id: str | None,
            metadata: dict[str, Any] | None,
            processor: TracingProcessor,
        ):
            self._name = name
            self._trace_id = trace_id or util.gen_trace_id()
            self.group_id = group_id
            self.metadata = metadata
            self._prev_context_token: contextvars.Token[Trace | None] | None = None
            self._processor = processor
            self._started = False
    
        @property
        def trace_id(self) -> str:
            return self._trace_id
    
        @property
        def name(self) -> str:
            return self._name
    
        def start(self, mark_as_current: bool = False):
            if self._started:
                return
    
            self._started = True
            self._processor.on_trace_start(self)
    
            if mark_as_current:
                self._prev_context_token = Scope.set_current_trace(self)
    
        def finish(self, reset_current: bool = False):
            if not self._started:
                return
    
            self._processor.on_trace_end(self)
    
            if reset_current and self._prev_context_token is not None:
                Scope.reset_current_trace(self._prev_context_token)
                self._prev_context_token = None
    
        def __enter__(self) -> Trace:
            if self._started:
                if not self._prev_context_token:
                    logger.error("Trace already started but no context token set")
                return self
    
            self.start(mark_as_current=True)
            return self
    
        def __exit__(self, exc_type, exc_val, exc_tb):
            self.finish(reset_current=exc_type is not GeneratorExit)
    
        def export(self) -> dict[str, Any] | None:
            return {
                "object": "trace",
                "id": self.trace_id,
                "workflow_name": self.name,
                "group_id": self.group_id,
                "metadata": self.metadata,
            }
      
  
---|---
