[ ![logo](../../assets/logo.svg) ](../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../)
  * [ クイックスタート  ](../quickstart/)
  * [ コード例  ](../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../agents/)
    * エージェントの実行  [ エージェントの実行  ](./) 目次 
      * エージェントループ 
      * ストリーミング 
      * Run 設定 
      * 会話 / チャットスレッド 
      * 例外 
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

  * エージェントループ 
  * ストリーミング 
  * Run 設定 
  * 会話 / チャットスレッド 
  * 例外 



# エージェントの実行

`Runner` クラス [`Runner`](../../ref/run/#agents.run.Runner "Runner") を使用して エージェント を実行できます。方法は 3 つあります。

  1. 非同期で実行し、[`RunResult`](../../ref/result/#agents.result.RunResult "RunResult


  
      dataclass
  ") を返す [`Runner.run()`](../../ref/run/#agents.run.Runner.run "run


  
      async
      classmethod
  ")
  2. 同期メソッドで、内部的には `.run()` を呼び出す [`Runner.run_sync()`](../../ref/run/#agents.run.Runner.run_sync "run_sync


  
      classmethod
  ")
  3. 非同期で実行し、[`RunResultStreaming`](../../ref/result/#agents.result.RunResultStreaming "RunResultStreaming


  
      dataclass
  ") を返す [`Runner.run_streamed()`](../../ref/run/#agents.run.Runner.run_streamed "run_streamed


  
      classmethod
  ")  
LLM をストリーミングモードで呼び出し、受信したイベントを逐次 ストリーミング します。


    
    
    from agents import Agent, Runner
    
    async def main():
        agent = Agent(name="Assistant", instructions="You are a helpful assistant")
    
        result = await Runner.run(agent, "Write a haiku about recursion in programming.")
        print(result.final_output)
        # Code within the code,
        # Functions calling themselves,
        # Infinite loop's dance.
    

詳細は [結果ガイド](../results/) を参照してください。

## エージェントループ

`Runner` の run メソッドを使用する際は、開始 エージェント と入力を渡します。入力は文字列（ユーザー メッセージと見なされます）または入力項目のリスト（OpenAI Responses API の項目）です。

Runner は以下のループを実行します。

  1. 現在の エージェント と現在の入力で LLM を呼び出します。 
  2. LLM が出力を生成します。 
    1. `final_output` が返された場合、ループを終了して結果を返します。 
    2. ハンドオフ が発生した場合、現在の エージェント と入力を更新し、ループを再実行します。 
    3. ツール呼び出し がある場合、それらを実行し、結果を追加してループを再実行します。 
  3. 指定した `max_turns` を超えた場合、[`MaxTurnsExceeded`](../../ref/exceptions/#agents.exceptions.MaxTurnsExceeded "MaxTurnsExceeded") 例外を送出します。



Note

LLM の出力が「最終出力」と見なされる条件は、望ましい型のテキスト出力であり、ツール呼び出しがないことです。

## ストリーミング

ストリーミング を使用すると、LLM の実行中に ストリーミング イベントを受け取れます。ストリーム完了後、[`RunResultStreaming`](../../ref/result/#agents.result.RunResultStreaming "RunResultStreaming


  
      dataclass
  ") には実行に関する完全な情報（新しく生成されたすべての出力を含む）が格納されます。`.stream_events()` を呼び出して ストリーミング イベントを取得できます。詳しくは [ストリーミングガイド](../streaming/) をご覧ください。

## Run 設定

`run_config` パラメーターにより、エージェント実行のグローバル設定を行えます。

  * [`model`](../../ref/run/#agents.run.RunConfig.model "model


  
      class-attribute
      instance-attribute
  "): 各 Agent の `model` 設定に関わらず使用するグローバル LLM モデルを指定します。 
  * [`model_provider`](../../ref/run/#agents.run.RunConfig.model_provider "model_provider


  
      class-attribute
      instance-attribute
  "): モデル名を解決する モデルプロバイダー。デフォルトは OpenAI です。 
  * [`model_settings`](../../ref/run/#agents.run.RunConfig.model_settings "model_settings


  
      class-attribute
      instance-attribute
  "): エージェント固有設定を上書きします。例としてグローバル `temperature` や `top_p` の設定など。 
  * [`input_guardrails`](../../ref/run/#agents.run.RunConfig.input_guardrails "input_guardrails


  
      class-attribute
      instance-attribute
  "), [`output_guardrails`](../../ref/run/#agents.run.RunConfig.output_guardrails "output_guardrails


  
      class-attribute
      instance-attribute
  "): すべての実行に適用する入力 / 出力 ガードレール のリスト。 
  * [`handoff_input_filter`](../../ref/run/#agents.run.RunConfig.handoff_input_filter "handoff_input_filter


  
      class-attribute
      instance-attribute
  "): ハンドオフ に入力フィルターが設定されていない場合に適用されるグローバル入力フィルター。新しい エージェント へ送信される入力を編集できます。詳細は [`Handoff.input_filter`](../../ref/handoffs/#agents.handoffs.Handoff.input_filter "input_filter


  
      class-attribute
      instance-attribute
  ") を参照してください。 
  * [`tracing_disabled`](../../ref/run/#agents.run.RunConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  "): 実行全体の [トレーシング](../tracing/) を無効化します。 
  * [`trace_include_sensitive_data`](../../ref/run/#agents.run.RunConfig.trace_include_sensitive_data "trace_include_sensitive_data


  
      class-attribute
      instance-attribute
  "): トレースに LLM やツール呼び出しの入出力など、機微なデータを含めるかどうかを設定します。 
  * [`workflow_name`](../../ref/run/#agents.run.RunConfig.workflow_name "workflow_name


  
      class-attribute
      instance-attribute
  "), [`trace_id`](../../ref/run/#agents.run.RunConfig.trace_id "trace_id


  
      class-attribute
      instance-attribute
  "), [`group_id`](../../ref/run/#agents.run.RunConfig.group_id "group_id


  
      class-attribute
      instance-attribute
  "): 実行のトレーシング ワークフロー名、トレース ID、トレース グループ ID を設定します。少なくとも `workflow_name` の設定を推奨します。`group_id` を設定すると、複数の実行にまたがるトレースをリンクできます。 
  * [`trace_metadata`](../../ref/run/#agents.run.RunConfig.trace_metadata "trace_metadata


  
      class-attribute
      instance-attribute
  "): すべてのトレースに付与するメタデータ。 



## 会話 / チャットスレッド

いずれかの run メソッドを呼び出すと、1 つ以上の エージェント が実行され（つまり 1 つ以上の LLM 呼び出しが行われ）、チャット会話の 1 つの論理ターンを表します。例:

  1. ユーザーターン: ユーザー がテキストを入力 
  2. Runner 実行: 最初の エージェント が LLM を呼び出し、ツールを実行し、2 番目の エージェント へハンドオフ。2 番目の エージェント がさらにツールを実行し、最終出力を生成。 



エージェント実行の終了時に、ユーザー に何を表示するかは自由です。たとえば、エージェント が生成したすべての新しい項目を表示する、または最終出力のみを表示する等です。いずれの場合でも、ユーザー がフォローアップ質問をしたら、再度 run メソッドを呼び出せます。

次ターンの入力は、基底クラス [`RunResultBase.to_input_list()`](../../ref/result/#agents.result.RunResultBase.to_input_list "to_input_list") を使用して取得できます。
    
    
    async def main():
        agent = Agent(name="Assistant", instructions="Reply very concisely.")
    
        with trace(workflow_name="Conversation", group_id=thread_id):
            # First turn
            result = await Runner.run(agent, "What city is the Golden Gate Bridge in?")
            print(result.final_output)
            # San Francisco
    
            # Second turn
            new_input = result.to_input_list() + [{"role": "user", "content": "What state is it in?"}]
            result = await Runner.run(agent, new_input)
            print(result.final_output)
            # California
    

## 例外

特定の状況で SDK は例外を送出します。完全な一覧は [`agents.exceptions`](../../ref/exceptions/#agents.exceptions) にあります。概要は以下のとおりです。

  * [`AgentsException`](../../ref/exceptions/#agents.exceptions.AgentsException "AgentsException"): SDK が送出するすべての例外の基底クラス 
  * [`MaxTurnsExceeded`](../../ref/exceptions/#agents.exceptions.MaxTurnsExceeded "MaxTurnsExceeded"): 実行が `max_turns` を超えた場合に送出 
  * [`ModelBehaviorError`](../../ref/exceptions/#agents.exceptions.ModelBehaviorError "ModelBehaviorError"): モデルが不正な出力（例: JSON 形式違反、存在しないツールの呼び出しなど）を生成した場合に送出 
  * [`UserError`](../../ref/exceptions/#agents.exceptions.UserError "UserError"): SDK の使用方法に誤りがある場合に送出 
  * [`InputGuardrailTripwireTriggered`](../../ref/exceptions/#agents.exceptions.InputGuardrailTripwireTriggered "InputGuardrailTripwireTriggered"), [`OutputGuardrailTripwireTriggered`](../../ref/exceptions/#agents.exceptions.OutputGuardrailTripwireTriggered "OutputGuardrailTripwireTriggered"): [ガードレール](../guardrails/) が発火した場合に送出


