[ ![logo](../../assets/logo.svg) ](../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../)
  * [ クイックスタート  ](../quickstart/)
  * [ コード例  ](../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../agents/)
    * [ エージェントの実行  ](../running_agents/)
    * [ 結果  ](../results/)
    * [ ストリーミング  ](../streaming/)
    * [ ツール  ](../tools/)
    * [ Model context protocol (MCP)  ](../mcp/)
    * ハンドオフ  [ ハンドオフ  ](./) 目次 
      * ハンドオフの作成 
        * 基本的な使い方 
        * handoff() 関数によるハンドオフのカスタマイズ 
      * ハンドオフ入力 
      * 入力フィルター 
      * 推奨プロンプト 
    * [ トレーシング  ](../tracing/)
    * [ コンテキスト管理  ](../context/)
    * [ ガードレール  ](../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../models/)
      * [ LiteLLM 経由でのモデル利用  ](../models/litellm/)
    * [ SDK の設定  ](../config/)
    * [ エージェントの可視化  ](../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../voice/pipeline/)
      * [ トレーシング  ](../voice/tracing/)



目次 

  * ハンドオフの作成 
    * 基本的な使い方 
    * handoff() 関数によるハンドオフのカスタマイズ 
  * ハンドオフ入力 
  * 入力フィルター 
  * 推奨プロンプト 



# ハンドオフ

ハンドオフを使用すると、エージェント がタスクを別の エージェント に委譲できます。これは、複数の エージェント がそれぞれ異なる分野を専門とするシナリオで特に便利です。たとえばカスタマーサポートアプリでは、注文状況、返金、 FAQ などのタスクを個別に担当する エージェント を用意できます。

ハンドオフは LLM からはツールとして認識されます。そのため、`Refund Agent` という エージェント へのハンドオフであれば、ツール名は `transfer_to_refund_agent` になります。

## ハンドオフの作成

すべての エージェント には [`handoffs`](../../ref/agent/#agents.agent.Agent.handoffs "handoffs


  
      class-attribute
      instance-attribute
  ") パラメーターがあり、直接 `Agent` を渡すことも、ハンドオフをカスタマイズする `Handoff` オブジェクトを渡すこともできます。

Agents SDK が提供する [`handoff()`](../../ref/handoffs/#agents.handoffs.handoff "handoff") 関数を使ってハンドオフを作成できます。この関数では、引き継ぎ先の エージェント を指定し、オーバーライドや入力フィルターをオプションで設定できます。

### 基本的な使い方

シンプルなハンドオフを作成する例を示します。
    
    
    from agents import Agent, handoff
    
    billing_agent = Agent(name="Billing agent")
    refund_agent = Agent(name="Refund agent")
    
    # (1)!
    triage_agent = Agent(name="Triage agent", handoffs=[billing_agent, handoff(refund_agent)])
    

  1. `billing_agent` のように エージェント を直接指定することも、`handoff()` 関数を使用することもできます。



### `handoff()` 関数によるハンドオフのカスタマイズ

[`handoff()`](../../ref/handoffs/#agents.handoffs.handoff "handoff") 関数を使うと、ハンドオフを細かくカスタマイズできます。

  * `agent`: ここで指定した エージェント に処理が引き渡されます。
  * `tool_name_override`: デフォルトでは `Handoff.default_tool_name()` が使用され、`transfer_to_<agent_name>` という名前になります。これを上書きできます。
  * `tool_description_override`: `Handoff.default_tool_description()` が返すデフォルトのツール説明を上書きします。
  * `on_handoff`: ハンドオフ実行時に呼び出されるコールバック関数です。ハンドオフが呼ばれたタイミングでデータ取得を開始するなどに便利です。この関数は エージェント のコンテキストを受け取り、オプションで LLM が生成した入力も受け取れます。渡されるデータは `input_type` パラメーターで制御します。
  * `input_type`: ハンドオフが受け取る入力の型（任意）。
  * `input_filter`: 次の エージェント が受け取る入力をフィルタリングできます。詳細は後述します。


    
    
    from agents import Agent, handoff, RunContextWrapper
    
    def on_handoff(ctx: RunContextWrapper[None]):
        print("Handoff called")
    
    agent = Agent(name="My agent")
    
    handoff_obj = handoff(
        agent=agent,
        on_handoff=on_handoff,
        tool_name_override="custom_handoff_tool",
        tool_description_override="Custom description",
    )
    

## ハンドオフ入力

場合によっては、 LLM がハンドオフを呼び出す際に追加のデータを渡してほしいことがあります。たとえば「Escalation エージェント」へのハンドオフでは、ログ用に理由を渡してもらいたいかもしれません。
    
    
    from pydantic import BaseModel
    
    from agents import Agent, handoff, RunContextWrapper
    
    class EscalationData(BaseModel):
        reason: str
    
    async def on_handoff(ctx: RunContextWrapper[None], input_data: EscalationData):
        print(f"Escalation agent called with reason: {input_data.reason}")
    
    agent = Agent(name="Escalation agent")
    
    handoff_obj = handoff(
        agent=agent,
        on_handoff=on_handoff,
        input_type=EscalationData,
    )
    

## 入力フィルター

ハンドオフが発生すると、新しい エージェント が会話を引き継ぎ、これまでの会話履歴全体を閲覧できる状態になります。これを変更したい場合は [`input_filter`](../../ref/handoffs/#agents.handoffs.Handoff.input_filter "input_filter


  
      class-attribute
      instance-attribute
  ") を設定してください。入力フィルターは、[`HandoffInputData`](../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData


  
      dataclass
  ") として渡される既存の入力を受け取り、新しい `HandoffInputData` を返す関数です。

よくあるパターン（たとえば履歴からすべてのツール呼び出しを削除するなど）は [`agents.extensions.handoff_filters`](../../ref/extensions/handoff_filters/#agents.extensions.handoff_filters) に実装済みです。
    
    
    from agents import Agent, handoff
    from agents.extensions import handoff_filters
    
    agent = Agent(name="FAQ agent")
    
    handoff_obj = handoff(
        agent=agent,
        input_filter=handoff_filters.remove_all_tools, # (1)!
    )
    

  1. これにより `FAQ agent` が呼ばれた際に、履歴からすべてのツール呼び出しが自動で削除されます。



## 推奨プロンプト

LLM がハンドオフを正しく理解できるよう、エージェント にハンドオフに関する情報を含めることを推奨します。事前に用意したプレフィックス [`agents.extensions.handoff_prompt.RECOMMENDED_PROMPT_PREFIX`](../../ref/extensions/handoff_prompt/#agents.extensions.handoff_prompt.RECOMMENDED_PROMPT_PREFIX "RECOMMENDED_PROMPT_PREFIX


  
      module-attribute
  ") を利用するか、[`agents.extensions.handoff_prompt.prompt_with_handoff_instructions`](../../ref/extensions/handoff_prompt/#agents.extensions.handoff_prompt.prompt_with_handoff_instructions "prompt_with_handoff_instructions") を呼び出してプロンプトに推奨情報を自動で追加できます。
    
    
    from agents import Agent
    from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
    
    billing_agent = Agent(
        name="Billing agent",
        instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
        <Fill in the rest of your prompt here>.""",
    )
    
