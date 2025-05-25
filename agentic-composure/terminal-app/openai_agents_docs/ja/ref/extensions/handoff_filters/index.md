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

  * handoff_filters 
  * remove_all_tools 



# `Handoff filters`

###  remove_all_tools
    
    
    remove_all_tools(
        handoff_input_data: [HandoffInputData](../../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)"),
    ) -> [HandoffInputData](../../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")
    

Filters out all tool items: file search, web search and function calls+output.

Source code in `src/agents/extensions/handoff_filters.py`
    
    
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

| 
    
    
    def remove_all_tools(handoff_input_data: HandoffInputData) -> HandoffInputData:
        """Filters out all tool items: file search, web search and function calls+output."""
    
        history = handoff_input_data.input_history
        new_items = handoff_input_data.new_items
    
        filtered_history = (
            _remove_tool_types_from_input(history) if isinstance(history, tuple) else history
        )
        filtered_pre_handoff_items = _remove_tools_from_items(handoff_input_data.pre_handoff_items)
        filtered_new_items = _remove_tools_from_items(new_items)
    
        return HandoffInputData(
            input_history=filtered_history,
            pre_handoff_items=filtered_pre_handoff_items,
            new_items=filtered_new_items,
        )
      
  
---|---
