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

  * setup 
  * SynchronousMultiTracingProcessor 
    * add_tracing_processor 
    * set_processors 
    * on_trace_start 
    * on_trace_end 
    * on_span_start 
    * on_span_end 
    * shutdown 
    * force_flush 
  * TraceProvider 
    * register_processor 
    * set_processors 
    * get_current_trace 
    * get_current_span 
    * set_disabled 
    * create_trace 
    * create_span 



# `Setup`

###  SynchronousMultiTracingProcessor

Bases: `[TracingProcessor](../../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)")`

Forwards all calls to a list of TracingProcessors, in order of registration.

Source code in `src/agents/tracing/setup.py`
    
    
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

| 
    
    
    class SynchronousMultiTracingProcessor(TracingProcessor):
        """
        Forwards all calls to a list of TracingProcessors, in order of registration.
        """
    
        def __init__(self):
            # Using a tuple to avoid race conditions when iterating over processors
            self._processors: tuple[TracingProcessor, ...] = ()
            self._lock = threading.Lock()
    
        def add_tracing_processor(self, tracing_processor: TracingProcessor):
            """
            Add a processor to the list of processors. Each processor will receive all traces/spans.
            """
            with self._lock:
                self._processors += (tracing_processor,)
    
        def set_processors(self, processors: list[TracingProcessor]):
            """
            Set the list of processors. This will replace the current list of processors.
            """
            with self._lock:
                self._processors = tuple(processors)
    
        def on_trace_start(self, trace: Trace) -> None:
            """
            Called when a trace is started.
            """
            for processor in self._processors:
                processor.on_trace_start(trace)
    
        def on_trace_end(self, trace: Trace) -> None:
            """
            Called when a trace is finished.
            """
            for processor in self._processors:
                processor.on_trace_end(trace)
    
        def on_span_start(self, span: Span[Any]) -> None:
            """
            Called when a span is started.
            """
            for processor in self._processors:
                processor.on_span_start(span)
    
        def on_span_end(self, span: Span[Any]) -> None:
            """
            Called when a span is finished.
            """
            for processor in self._processors:
                processor.on_span_end(span)
    
        def shutdown(self) -> None:
            """
            Called when the application stops.
            """
            for processor in self._processors:
                logger.debug(f"Shutting down trace processor {processor}")
                processor.shutdown()
    
        def force_flush(self):
            """
            Force the processors to flush their buffers.
            """
            for processor in self._processors:
                processor.force_flush()
      
  
---|---  
  
####  add_tracing_processor
    
    
    add_tracing_processor(tracing_processor: [TracingProcessor](../../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)"))
    

Add a processor to the list of processors. Each processor will receive all traces/spans.

Source code in `src/agents/tracing/setup.py`
    
    
    25
    26
    27
    28
    29
    30

| 
    
    
    def add_tracing_processor(self, tracing_processor: TracingProcessor):
        """
        Add a processor to the list of processors. Each processor will receive all traces/spans.
        """
        with self._lock:
            self._processors += (tracing_processor,)
      
  
---|---  
  
####  set_processors
    
    
    set_processors(processors: list[[TracingProcessor](../../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)")])
    

Set the list of processors. This will replace the current list of processors.

Source code in `src/agents/tracing/setup.py`
    
    
    32
    33
    34
    35
    36
    37

| 
    
    
    def set_processors(self, processors: list[TracingProcessor]):
        """
        Set the list of processors. This will replace the current list of processors.
        """
        with self._lock:
            self._processors = tuple(processors)
      
  
---|---  
  
####  on_trace_start
    
    
    on_trace_start(trace: [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is started.

Source code in `src/agents/tracing/setup.py`
    
    
    39
    40
    41
    42
    43
    44

| 
    
    
    def on_trace_start(self, trace: Trace) -> None:
        """
        Called when a trace is started.
        """
        for processor in self._processors:
            processor.on_trace_start(trace)
      
  
---|---  
  
####  on_trace_end
    
    
    on_trace_end(trace: [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is finished.

Source code in `src/agents/tracing/setup.py`
    
    
    46
    47
    48
    49
    50
    51

| 
    
    
    def on_trace_end(self, trace: Trace) -> None:
        """
        Called when a trace is finished.
        """
        for processor in self._processors:
            processor.on_trace_end(trace)
      
  
---|---  
  
####  on_span_start
    
    
    on_span_start(span: [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is started.

Source code in `src/agents/tracing/setup.py`
    
    
    53
    54
    55
    56
    57
    58

| 
    
    
    def on_span_start(self, span: Span[Any]) -> None:
        """
        Called when a span is started.
        """
        for processor in self._processors:
            processor.on_span_start(span)
      
  
---|---  
  
####  on_span_end
    
    
    on_span_end(span: [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is finished.

Source code in `src/agents/tracing/setup.py`
    
    
    60
    61
    62
    63
    64
    65

| 
    
    
    def on_span_end(self, span: Span[Any]) -> None:
        """
        Called when a span is finished.
        """
        for processor in self._processors:
            processor.on_span_end(span)
      
  
---|---  
  
####  shutdown
    
    
    shutdown() -> None
    

Called when the application stops.

Source code in `src/agents/tracing/setup.py`
    
    
    67
    68
    69
    70
    71
    72
    73

| 
    
    
    def shutdown(self) -> None:
        """
        Called when the application stops.
        """
        for processor in self._processors:
            logger.debug(f"Shutting down trace processor {processor}")
            processor.shutdown()
      
  
---|---  
  
####  force_flush
    
    
    force_flush()
    

Force the processors to flush their buffers.

Source code in `src/agents/tracing/setup.py`
    
    
    75
    76
    77
    78
    79
    80

| 
    
    
    def force_flush(self):
        """
        Force the processors to flush their buffers.
        """
        for processor in self._processors:
            processor.force_flush()
      
  
---|---  
  
###  TraceProvider

Source code in `src/agents/tracing/setup.py`
    
    
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

| 
    
    
    class TraceProvider:
        def __init__(self):
            self._multi_processor = SynchronousMultiTracingProcessor()
            self._disabled = os.environ.get("OPENAI_AGENTS_DISABLE_TRACING", "false").lower() in (
                "true",
                "1",
            )
    
        def register_processor(self, processor: TracingProcessor):
            """
            Add a processor to the list of processors. Each processor will receive all traces/spans.
            """
            self._multi_processor.add_tracing_processor(processor)
    
        def set_processors(self, processors: list[TracingProcessor]):
            """
            Set the list of processors. This will replace the current list of processors.
            """
            self._multi_processor.set_processors(processors)
    
        def get_current_trace(self) -> Trace | None:
            """
            Returns the currently active trace, if any.
            """
            return Scope.get_current_trace()
    
        def get_current_span(self) -> Span[Any] | None:
            """
            Returns the currently active span, if any.
            """
            return Scope.get_current_span()
    
        def set_disabled(self, disabled: bool) -> None:
            """
            Set whether tracing is disabled.
            """
            self._disabled = disabled
    
        def create_trace(
            self,
            name: str,
            trace_id: str | None = None,
            group_id: str | None = None,
            metadata: dict[str, Any] | None = None,
            disabled: bool = False,
        ) -> Trace:
            """
            Create a new trace.
            """
            if self._disabled or disabled:
                logger.debug(f"Tracing is disabled. Not creating trace {name}")
                return NoOpTrace()
    
            trace_id = trace_id or util.gen_trace_id()
    
            logger.debug(f"Creating trace {name} with id {trace_id}")
    
            return TraceImpl(
                name=name,
                trace_id=trace_id,
                group_id=group_id,
                metadata=metadata,
                processor=self._multi_processor,
            )
    
        def create_span(
            self,
            span_data: TSpanData,
            span_id: str | None = None,
            parent: Trace | Span[Any] | None = None,
            disabled: bool = False,
        ) -> Span[TSpanData]:
            """
            Create a new span.
            """
            if self._disabled or disabled:
                logger.debug(f"Tracing is disabled. Not creating span {span_data}")
                return NoOpSpan(span_data)
    
            if not parent:
                current_span = Scope.get_current_span()
                current_trace = Scope.get_current_trace()
                if current_trace is None:
                    logger.error(
                        "No active trace. Make sure to start a trace with `trace()` first"
                        "Returning NoOpSpan."
                    )
                    return NoOpSpan(span_data)
                elif isinstance(current_trace, NoOpTrace) or isinstance(current_span, NoOpSpan):
                    logger.debug(
                        f"Parent {current_span} or {current_trace} is no-op, returning NoOpSpan"
                    )
                    return NoOpSpan(span_data)
    
                parent_id = current_span.span_id if current_span else None
                trace_id = current_trace.trace_id
    
            elif isinstance(parent, Trace):
                if isinstance(parent, NoOpTrace):
                    logger.debug(f"Parent {parent} is no-op, returning NoOpSpan")
                    return NoOpSpan(span_data)
                trace_id = parent.trace_id
                parent_id = None
            elif isinstance(parent, Span):
                if isinstance(parent, NoOpSpan):
                    logger.debug(f"Parent {parent} is no-op, returning NoOpSpan")
                    return NoOpSpan(span_data)
                parent_id = parent.span_id
                trace_id = parent.trace_id
    
            logger.debug(f"Creating span {span_data} with id {span_id}")
    
            return SpanImpl(
                trace_id=trace_id,
                span_id=span_id,
                parent_id=parent_id,
                processor=self._multi_processor,
                span_data=span_data,
            )
    
        def shutdown(self) -> None:
            if self._disabled:
                return
    
            try:
                logger.debug("Shutting down trace provider")
                self._multi_processor.shutdown()
            except Exception as e:
                logger.error(f"Error shutting down trace provider: {e}")
      
  
---|---  
  
####  register_processor
    
    
    register_processor(processor: [TracingProcessor](../../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)"))
    

Add a processor to the list of processors. Each processor will receive all traces/spans.

Source code in `src/agents/tracing/setup.py`
    
    
    91
    92
    93
    94
    95

| 
    
    
    def register_processor(self, processor: TracingProcessor):
        """
        Add a processor to the list of processors. Each processor will receive all traces/spans.
        """
        self._multi_processor.add_tracing_processor(processor)
      
  
---|---  
  
####  set_processors
    
    
    set_processors(processors: list[[TracingProcessor](../../../../ref/tracing/processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)")])
    

Set the list of processors. This will replace the current list of processors.

Source code in `src/agents/tracing/setup.py`
    
    
     97
     98
     99
    100
    101

| 
    
    
    def set_processors(self, processors: list[TracingProcessor]):
        """
        Set the list of processors. This will replace the current list of processors.
        """
        self._multi_processor.set_processors(processors)
      
  
---|---  
  
####  get_current_trace
    
    
    get_current_trace() -> [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | None
    

Returns the currently active trace, if any.

Source code in `src/agents/tracing/setup.py`
    
    
    103
    104
    105
    106
    107

| 
    
    
    def get_current_trace(self) -> Trace | None:
        """
        Returns the currently active trace, if any.
        """
        return Scope.get_current_trace()
      
  
---|---  
  
####  get_current_span
    
    
    get_current_span() -> [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None
    

Returns the currently active span, if any.

Source code in `src/agents/tracing/setup.py`
    
    
    109
    110
    111
    112
    113

| 
    
    
    def get_current_span(self) -> Span[Any] | None:
        """
        Returns the currently active span, if any.
        """
        return Scope.get_current_span()
      
  
---|---  
  
####  set_disabled
    
    
    set_disabled(disabled: bool) -> None
    

Set whether tracing is disabled.

Source code in `src/agents/tracing/setup.py`
    
    
    115
    116
    117
    118
    119

| 
    
    
    def set_disabled(self, disabled: bool) -> None:
        """
        Set whether tracing is disabled.
        """
        self._disabled = disabled
      
  
---|---  
  
####  create_trace
    
    
    create_trace(
        name: str,
        trace_id: str | None = None,
        group_id: str | None = None,
        metadata: dict[str, Any] | None = None,
        disabled: bool = False,
    ) -> [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")
    

Create a new trace.

Source code in `src/agents/tracing/setup.py`
    
    
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

| 
    
    
    def create_trace(
        self,
        name: str,
        trace_id: str | None = None,
        group_id: str | None = None,
        metadata: dict[str, Any] | None = None,
        disabled: bool = False,
    ) -> Trace:
        """
        Create a new trace.
        """
        if self._disabled or disabled:
            logger.debug(f"Tracing is disabled. Not creating trace {name}")
            return NoOpTrace()
    
        trace_id = trace_id or util.gen_trace_id()
    
        logger.debug(f"Creating trace {name} with id {trace_id}")
    
        return TraceImpl(
            name=name,
            trace_id=trace_id,
            group_id=group_id,
            metadata=metadata,
            processor=self._multi_processor,
        )
      
  
---|---  
  
####  create_span
    
    
    create_span(
        span_data: TSpanData,
        span_id: str | None = None,
        parent: [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any] | None = None,
        disabled: bool = False,
    ) -> [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[TSpanData]
    

Create a new span.

Source code in `src/agents/tracing/setup.py`
    
    
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

| 
    
    
    def create_span(
        self,
        span_data: TSpanData,
        span_id: str | None = None,
        parent: Trace | Span[Any] | None = None,
        disabled: bool = False,
    ) -> Span[TSpanData]:
        """
        Create a new span.
        """
        if self._disabled or disabled:
            logger.debug(f"Tracing is disabled. Not creating span {span_data}")
            return NoOpSpan(span_data)
    
        if not parent:
            current_span = Scope.get_current_span()
            current_trace = Scope.get_current_trace()
            if current_trace is None:
                logger.error(
                    "No active trace. Make sure to start a trace with `trace()` first"
                    "Returning NoOpSpan."
                )
                return NoOpSpan(span_data)
            elif isinstance(current_trace, NoOpTrace) or isinstance(current_span, NoOpSpan):
                logger.debug(
                    f"Parent {current_span} or {current_trace} is no-op, returning NoOpSpan"
                )
                return NoOpSpan(span_data)
    
            parent_id = current_span.span_id if current_span else None
            trace_id = current_trace.trace_id
    
        elif isinstance(parent, Trace):
            if isinstance(parent, NoOpTrace):
                logger.debug(f"Parent {parent} is no-op, returning NoOpSpan")
                return NoOpSpan(span_data)
            trace_id = parent.trace_id
            parent_id = None
        elif isinstance(parent, Span):
            if isinstance(parent, NoOpSpan):
                logger.debug(f"Parent {parent} is no-op, returning NoOpSpan")
                return NoOpSpan(span_data)
            parent_id = parent.span_id
            trace_id = parent.trace_id
    
        logger.debug(f"Creating span {span_data} with id {span_id}")
    
        return SpanImpl(
            trace_id=trace_id,
            span_id=span_id,
            parent_id=parent_id,
            processor=self._multi_processor,
            span_data=span_data,
        )
      
  
---|---
