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

  * usage 
  * Usage 
    * requests 
    * input_tokens 
    * output_tokens 
    * total_tokens 



# `Usage`

###  Usage `dataclass`

Source code in `src/agents/usage.py`
    
    
     4
     5
     6
     7
     8
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

| 
    
    
    @dataclass
    class Usage:
        requests: int = 0
        """Total requests made to the LLM API."""
    
        input_tokens: int = 0
        """Total input tokens sent, across all requests."""
    
        output_tokens: int = 0
        """Total output tokens received, across all requests."""
    
        total_tokens: int = 0
        """Total tokens sent and received, across all requests."""
    
        def add(self, other: "Usage") -> None:
            self.requests += other.requests if other.requests else 0
            self.input_tokens += other.input_tokens if other.input_tokens else 0
            self.output_tokens += other.output_tokens if other.output_tokens else 0
            self.total_tokens += other.total_tokens if other.total_tokens else 0
      
  
---|---  
  
####  requests `class-attribute` `instance-attribute`
    
    
    requests: int = 0
    

Total requests made to the LLM API.

####  input_tokens `class-attribute` `instance-attribute`
    
    
    input_tokens: int = 0
    

Total input tokens sent, across all requests.

####  output_tokens `class-attribute` `instance-attribute`
    
    
    output_tokens: int = 0
    

Total output tokens received, across all requests.

####  total_tokens `class-attribute` `instance-attribute`
    
    
    total_tokens: int = 0
    

Total tokens sent and received, across all requests.
