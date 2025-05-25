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

  * stream_events 
  * StreamEvent 
  * RawResponsesStreamEvent 
    * data 
    * type 
  * RunItemStreamEvent 
    * name 
    * item 
  * AgentUpdatedStreamEvent 
    * new_agent 



# `Streaming events`

###  StreamEvent `module-attribute`
    
    
    StreamEvent: TypeAlias = Union[
        [RawResponsesStreamEvent](../../../ref/stream_events/#agents.stream_events.RawResponsesStreamEvent "RawResponsesStreamEvent
    
    
      
          dataclass
       \(agents.stream_events.RawResponsesStreamEvent\)"),
        [RunItemStreamEvent](../../../ref/stream_events/#agents.stream_events.RunItemStreamEvent "RunItemStreamEvent
    
    
      
          dataclass
       \(agents.stream_events.RunItemStreamEvent\)"),
        [AgentUpdatedStreamEvent](../../../ref/stream_events/#agents.stream_events.AgentUpdatedStreamEvent "AgentUpdatedStreamEvent
    
    
      
          dataclass
       \(agents.stream_events.AgentUpdatedStreamEvent\)"),
    ]
    

A streaming event from an agent.

###  RawResponsesStreamEvent `dataclass`

Streaming event from the LLM. These are 'raw' events, i.e. they are directly passed through from the LLM.

Source code in `src/agents/stream_events.py`
    
    
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
    class RawResponsesStreamEvent:
        """Streaming event from the LLM. These are 'raw' events, i.e. they are directly passed through
        from the LLM.
        """
    
        data: TResponseStreamEvent
        """The raw responses streaming event from the LLM."""
    
        type: Literal["raw_response_event"] = "raw_response_event"
        """The type of the event."""
      
  
---|---  
  
####  data `instance-attribute`
    
    
    data: [TResponseStreamEvent](../../../ref/items/#agents.items.TResponseStreamEvent "TResponseStreamEvent
    
    
      
          module-attribute
       \(agents.items.TResponseStreamEvent\)")
    

The raw responses streaming event from the LLM.

####  type `class-attribute` `instance-attribute`
    
    
    type: Literal['raw_response_event'] = 'raw_response_event'
    

The type of the event.

###  RunItemStreamEvent `dataclass`

Streaming events that wrap a `RunItem`. As the agent processes the LLM response, it will generate these events for new messages, tool calls, tool outputs, handoffs, etc.

Source code in `src/agents/stream_events.py`
    
    
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

| 
    
    
    @dataclass
    class RunItemStreamEvent:
        """Streaming events that wrap a `RunItem`. As the agent processes the LLM response, it will
        generate these events for new messages, tool calls, tool outputs, handoffs, etc.
        """
    
        name: Literal[
            "message_output_created",
            "handoff_requested",
            "handoff_occured",
            "tool_called",
            "tool_output",
            "reasoning_item_created",
        ]
        """The name of the event."""
    
        item: RunItem
        """The item that was created."""
    
        type: Literal["run_item_stream_event"] = "run_item_stream_event"
      
  
---|---  
  
####  name `instance-attribute`
    
    
    name: Literal[
        "message_output_created",
        "handoff_requested",
        "handoff_occured",
        "tool_called",
        "tool_output",
        "reasoning_item_created",
    ]
    

The name of the event.

####  item `instance-attribute`
    
    
    item: [RunItem](../../../ref/items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)")
    

The item that was created.

###  AgentUpdatedStreamEvent `dataclass`

Event that notifies that there is a new agent running.

Source code in `src/agents/stream_events.py`
    
    
    47
    48
    49
    50
    51
    52
    53
    54

| 
    
    
    @dataclass
    class AgentUpdatedStreamEvent:
        """Event that notifies that there is a new agent running."""
    
        new_agent: Agent[Any]
        """The new agent."""
    
        type: Literal["agent_updated_stream_event"] = "agent_updated_stream_event"
      
  
---|---  
  
####  new_agent `instance-attribute`
    
    
    new_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any]
    

The new agent.
