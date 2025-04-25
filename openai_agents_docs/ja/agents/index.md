[ ![logo](../../assets/logo.svg) ](../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../)
  * [ クイックスタート  ](../quickstart/)
  * [ コード例  ](../examples/)
  * ドキュメント  ドキュメント 
    * エージェント  [ エージェント  ](./) 目次 
      * 基本設定 
      * コンテキスト 
      * 出力タイプ 
      * ハンドオフ 
      * 動的 instructions 
      * ライフサイクルイベント (hooks) 
      * ガードレール 
      * エージェントの複製 
      * ツール使用の強制 
    * [ エージェントの実行  ](../running_agents/)
    * [ 結果  ](../results/)
    * [ ストリーミング  ](../streaming/)
    * [ ツール  ](../tools/)
    * [ Model context protocol (MCP)  ](../mcp/)
    * [ ハンドオフ  ](../handoffs/)
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

  * 基本設定 
  * コンテキスト 
  * 出力タイプ 
  * ハンドオフ 
  * 動的 instructions 
  * ライフサイクルイベント (hooks) 
  * ガードレール 
  * エージェントの複製 
  * ツール使用の強制 



# エージェント

エージェントはアプリの主要な構成ブロックです。エージェントは、大規模言語モデル ( LLM ) に instructions と tools を設定したものです。

## 基本設定

エージェントで最も一般的に設定するプロパティは次のとおりです。

  * `instructions`: 開発者メッセージまたは system prompt とも呼ばれます。
  * `model`: 使用する LLM と、temperature や top_p などのモデル調整パラメーターを指定する任意の `model_settings`。
  * `tools`: エージェントがタスクを達成するために利用できるツール。


    
    
    from agents import Agent, ModelSettings, function_tool
    
    @function_tool
    def get_weather(city: str) -> str:
        return f"The weather in {city} is sunny"
    
    agent = Agent(
        name="Haiku agent",
        instructions="Always respond in haiku form",
        model="o3-mini",
        tools=[get_weather],
    )
    

## コンテキスト

エージェントはその `context` 型について汎用的です。コンテキストは依存性注入の手段で、`Runner.run()` に渡すオブジェクトです。これはすべてのエージェント、ツール、ハンドオフなどに渡され、エージェント実行時の依存関係や状態をまとめて保持します。任意の Python オブジェクトをコンテキストとして渡せます。
    
    
    @dataclass
    class UserContext:
        uid: str
        is_pro_user: bool
    
        async def fetch_purchases() -> list[Purchase]:
            return ...
    
    agent = Agent[UserContext](
        ...,
    )
    

## 出力タイプ

デフォルトでは、エージェントはプレーンテキスト ( つまり `str` ) を出力します。特定の型で出力させたい場合は `output_type` パラメーターを使用します。一般的には [Pydantic](https://docs.pydantic.dev/) オブジェクトを利用しますが、Pydantic の [TypeAdapter](https://docs.pydantic.dev/latest/api/type_adapter/) でラップ可能な型であれば何でも対応します。たとえば dataclass、list、TypedDict などです。
    
    
    from pydantic import BaseModel
    from agents import Agent
    
    
    class CalendarEvent(BaseModel):
        name: str
        date: str
        participants: list[str]
    
    agent = Agent(
        name="Calendar extractor",
        instructions="Extract calendar events from text",
        output_type=CalendarEvent,
    )
    

Note

`output_type` を渡すと、モデルは通常のプレーンテキスト応答の代わりに [structured outputs](https://platform.openai.com/docs/guides/structured-outputs) を使用するよう指示されます。

## ハンドオフ

ハンドオフは、エージェントが委譲できるサブエージェントです。ハンドオフのリストを渡しておくと、エージェントは必要に応じてそれらに処理を委譲できます。これにより、単一のタスクに特化したモジュール式エージェントを編成できる強力なパターンが実現します。詳細は [handoffs](../handoffs/) ドキュメントをご覧ください。
    
    
    from agents import Agent
    
    booking_agent = Agent(...)
    refund_agent = Agent(...)
    
    triage_agent = Agent(
        name="Triage agent",
        instructions=(
            "Help the user with their questions."
            "If they ask about booking, handoff to the booking agent."
            "If they ask about refunds, handoff to the refund agent."
        ),
        handoffs=[booking_agent, refund_agent],
    )
    

## 動的 instructions

通常はエージェント作成時に instructions を指定しますが、関数を介して動的に instructions を提供することもできます。その関数はエージェントとコンテキストを受け取り、プロンプトを返す必要があります。同期関数と `async` 関数の両方に対応しています。
    
    
    def dynamic_instructions(
        context: RunContextWrapper[UserContext], agent: Agent[UserContext]
    ) -> str:
        return f"The user's name is {context.context.name}. Help them with their questions."
    
    
    agent = Agent[UserContext](
        name="Triage agent",
        instructions=dynamic_instructions,
    )
    

## ライフサイクルイベント (hooks)

場合によっては、エージェントのライフサイクルを観察したいことがあります。たとえば、イベントをログに記録したり、特定のイベント発生時にデータを事前取得したりする場合です。`hooks` プロパティを使ってエージェントのライフサイクルにフックできます。[`AgentHooks`](../../ref/lifecycle/#agents.lifecycle.AgentHooks "AgentHooks") クラスをサブクラス化し、関心のあるメソッドをオーバーライドしてください。

## ガードレール

ガードレールを使うと、エージェントの実行と並行してユーザー入力に対するチェックやバリデーションを実行できます。たとえば、ユーザーの入力内容が関連しているかをスクリーニングできます。詳細は [guardrails](../guardrails/) ドキュメントをご覧ください。

## エージェントの複製

`clone()` メソッドを使用すると、エージェントを複製し、必要に応じて任意のプロパティを変更できます。
    
    
    pirate_agent = Agent(
        name="Pirate",
        instructions="Write like a pirate",
        model="o3-mini",
    )
    
    robot_agent = pirate_agent.clone(
        name="Robot",
        instructions="Write like a robot",
    )
    

## ツール使用の強制

ツールの一覧を渡しても、LLM が必ずツールを使用するとは限りません。[`ModelSettings.tool_choice`](../../ref/model_settings/#agents.model_settings.ModelSettings.tool_choice "tool_choice


  
      class-attribute
      instance-attribute
  ") を設定することでツール使用を強制できます。有効な値は次のとおりです。

  1. `auto` — ツールを使用するかどうかを LLM が判断します。
  2. `required` — LLM にツール使用を必須化します ( ただし使用するツールは自動選択 )。
  3. `none` — LLM にツールを使用しないことを要求します。
  4. 特定の文字列 ( 例: `my_tool` ) — その特定のツールを LLM に使用させます。



Note

無限ループを防ぐため、フレームワークはツール呼び出し後に `tool_choice` を自動的に "auto" にリセットします。この動作は [`agent.reset_tool_choice`](../../ref/agent/#agents.agent.Agent.reset_tool_choice "reset_tool_choice


  
      class-attribute
      instance-attribute
  ") で設定できます。無限ループが起こる理由は、ツールの結果が LLM に送られ、`tool_choice` により再びツール呼び出しが生成される、という流れが繰り返されるからです。

ツール呼び出し後にエージェントを完全に停止させたい場合 ( auto モードで続行させたくない場合 ) は、[`Agent.tool_use_behavior="stop_on_first_tool"`] を設定してください。これにより、ツールの出力を LL M の追加処理なしにそのまま最終応答として返します。
