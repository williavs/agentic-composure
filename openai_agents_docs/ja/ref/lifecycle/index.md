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

  * lifecycle 
  * RunHooks 
    * on_agent_start 
    * on_agent_end 
    * on_handoff 
    * on_tool_start 
    * on_tool_end 
  * AgentHooks 
    * on_start 
    * on_end 
    * on_handoff 
    * on_tool_start 
    * on_tool_end 



# `Lifecycle`

###  RunHooks

Bases: `Generic[TContext]`

A class that receives callbacks on various lifecycle events in an agent run. Subclass and override the methods you need.

####  on_agent_start `async`
    
    
    on_agent_start(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called before the agent is invoked. Called each time the current agent changes.

####  on_agent_end `async`
    
    
    on_agent_end(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        output: Any,
    ) -> None
    

Called when the agent produces a final output.

####  on_handoff `async`
    
    
    on_handoff(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        from_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        to_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called when a handoff occurs.

####  on_tool_start `async`
    
    
    on_tool_start(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
    ) -> None
    

Called before a tool is invoked.

####  on_tool_end `async`
    
    
    on_tool_end(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
        result: str,
    ) -> None
    

Called after a tool is invoked.

###  AgentHooks

Bases: `Generic[TContext]`

A class that receives callbacks on various lifecycle events for a specific agent. You can set this on `agent.hooks` to receive events for that specific agent.

Subclass and override the methods you need.

####  on_start `async`
    
    
    on_start(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called before the agent is invoked. Called each time the running agent is changed to this agent.

####  on_end `async`
    
    
    on_end(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        output: Any,
    ) -> None
    

Called when the agent produces a final output.

####  on_handoff `async`
    
    
    on_handoff(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        source: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
    ) -> None
    

Called when the agent is being handed off to. The `source` is the agent that is handing off to this agent.

####  on_tool_start `async`
    
    
    on_tool_start(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
    ) -> None
    

Called before a tool is invoked.

####  on_tool_end `async`
    
    
    on_tool_end(
        context: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool: [Tool](../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)"),
        result: str,
    ) -> None
    

Called after a tool is invoked.
