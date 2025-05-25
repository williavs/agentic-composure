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

  * processor_interface 
  * TracingProcessor 
    * on_trace_start 
    * on_trace_end 
    * on_span_start 
    * on_span_end 
    * shutdown 
    * force_flush 
  * TracingExporter 
    * export 



# `Processor interface`

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
    
    
    on_trace_start(trace: [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is started.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`trace` |  `[Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The trace that started. |  _required_  
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
    
    
    on_trace_end(trace: [Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is finished.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`trace` |  `[Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The trace that started. |  _required_  
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
    
    
    on_span_start(span: [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is started.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`span` |  `[Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]` |  The span that started. |  _required_  
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
    
    
    on_span_end(span: [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is finished. Should not block or raise exceptions.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`span` |  `[Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]` |  The span that finished. |  _required_  
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
  
###  TracingExporter

Bases: `ABC`

Exports traces and spans. For example, could log them or send them to a backend.

Source code in `src/agents/tracing/processor_interface.py`
    
    
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
    
    
    class TracingExporter(abc.ABC):
        """Exports traces and spans. For example, could log them or send them to a backend."""
    
        @abc.abstractmethod
        def export(self, items: list["Trace | Span[Any]"]) -> None:
            """Exports a list of traces and spans.
    
            Args:
                items: The items to export.
            """
            pass
      
  
---|---  
  
####  export `abstractmethod`
    
    
    export(items: list[[Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]]) -> None
    

Exports a list of traces and spans.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`items` |  `list[[Trace](../../../../ref/tracing/traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../../../../ref/tracing/spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]]` |  The items to export. |  _required_  
Source code in `src/agents/tracing/processor_interface.py`
    
    
    62
    63
    64
    65
    66
    67
    68
    69

| 
    
    
    @abc.abstractmethod
    def export(self, items: list["Trace | Span[Any]"]) -> None:
        """Exports a list of traces and spans.
    
        Args:
            items: The items to export.
        """
        pass
      
  
---|---
