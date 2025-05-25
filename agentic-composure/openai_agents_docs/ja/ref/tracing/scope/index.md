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

  * scope 
  * Scope 



# `Scope`

###  Scope

Manages the current span and trace in the context.

Source code in `src/agents/tracing/scope.py`
    
    
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

| 
    
    
    class Scope:
        """
        Manages the current span and trace in the context.
        """
    
        @classmethod
        def get_current_span(cls) -> "Span[Any] | None":
            return _current_span.get()
    
        @classmethod
        def set_current_span(cls, span: "Span[Any] | None") -> "contextvars.Token[Span[Any] | None]":
            return _current_span.set(span)
    
        @classmethod
        def reset_current_span(cls, token: "contextvars.Token[Span[Any] | None]") -> None:
            _current_span.reset(token)
    
        @classmethod
        def get_current_trace(cls) -> "Trace | None":
            return _current_trace.get()
    
        @classmethod
        def set_current_trace(cls, trace: "Trace | None") -> "contextvars.Token[Trace | None]":
            logger.debug(f"Setting current trace: {trace.trace_id if trace else None}")
            return _current_trace.set(trace)
    
        @classmethod
        def reset_current_trace(cls, token: "contextvars.Token[Trace | None]") -> None:
            logger.debug("Resetting current trace")
            _current_trace.reset(token)
      
  
---|---
