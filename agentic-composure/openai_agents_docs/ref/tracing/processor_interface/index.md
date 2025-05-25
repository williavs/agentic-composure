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
      * Processor interface  [ Processor interface  ](./) Table of contents 
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
    
    
    on_trace_start(trace: [Trace](../traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is started.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`trace` |  `[Trace](../traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The trace that started. |  _required_  
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
    
    
    on_trace_end(trace: [Trace](../traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")) -> None
    

Called when a trace is finished.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`trace` |  `[Trace](../traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)")` |  The trace that started. |  _required_  
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
    
    
    on_span_start(span: [Span](../spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is started.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`span` |  `[Span](../spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]` |  The span that started. |  _required_  
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
    
    
    on_span_end(span: [Span](../spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]) -> None
    

Called when a span is finished. Should not block or raise exceptions.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`span` |  `[Span](../spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]` |  The span that finished. |  _required_  
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
    
    
    export(items: list[[Trace](../traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]]) -> None
    

Exports a list of traces and spans.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`items` |  `list[[Trace](../traces/#agents.tracing.traces.Trace "Trace \(agents.tracing.traces.Trace\)") | [Span](../spans/#agents.tracing.spans.Span "Span \(agents.tracing.spans.Span\)")[Any]]` |  The items to export. |  _required_  
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
