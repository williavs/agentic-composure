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

  * run_context 
  * RunContextWrapper 
    * context 
    * usage 



# `Run context`

###  RunContextWrapper `dataclass`

Bases: `Generic[TContext]`

This wraps the context object that you passed to `Runner.run()`. It also contains information about the usage of the agent run so far.

NOTE: Contexts are not passed to the LLM. They're a way to pass dependencies and data to code you implement, like tool functions, callbacks, hooks, etc.

Source code in `src/agents/run_context.py`
    
    
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

| 
    
    
    @dataclass
    class RunContextWrapper(Generic[TContext]):
        """This wraps the context object that you passed to `Runner.run()`. It also contains
        information about the usage of the agent run so far.
    
        NOTE: Contexts are not passed to the LLM. They're a way to pass dependencies and data to code
        you implement, like tool functions, callbacks, hooks, etc.
        """
    
        context: TContext
        """The context object (or None), passed by you to `Runner.run()`"""
    
        usage: Usage = field(default_factory=Usage)
        """The usage of the agent run so far. For streamed responses, the usage will be stale until the
        last chunk of the stream is processed.
        """
      
  
---|---  
  
####  context `instance-attribute`
    
    
    context: TContext
    

The context object (or None), passed by you to `Runner.run()`

####  usage `class-attribute` `instance-attribute`
    
    
    usage: [Usage](../../../ref/usage/#agents.usage.Usage "Usage
    
    
      
          dataclass
       \(agents.usage.Usage\)") = field(default_factory=[Usage](../../../ref/usage/#agents.usage.Usage "Usage
    
    
      
          dataclass
       \(agents.usage.Usage\)"))
    

The usage of the agent run so far. For streamed responses, the usage will be stale until the last chunk of the stream is processed.
