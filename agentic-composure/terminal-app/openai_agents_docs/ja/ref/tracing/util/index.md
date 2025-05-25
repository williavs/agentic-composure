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

  * util 
  * time_iso 
  * gen_trace_id 
  * gen_span_id 
  * gen_group_id 



# `Util`

###  time_iso
    
    
    time_iso() -> str
    

Returns the current time in ISO 8601 format.

Source code in `src/agents/tracing/util.py`
    
    
    5
    6
    7

| 
    
    
    def time_iso() -> str:
        """Returns the current time in ISO 8601 format."""
        return datetime.now(timezone.utc).isoformat()
      
  
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
  
###  gen_group_id
    
    
    gen_group_id() -> str
    

Generates a new group ID.

Source code in `src/agents/tracing/util.py`
    
    
    20
    21
    22

| 
    
    
    def gen_group_id() -> str:
        """Generates a new group ID."""
        return f"group_{uuid.uuid4().hex[:24]}"
      
  
---|---
