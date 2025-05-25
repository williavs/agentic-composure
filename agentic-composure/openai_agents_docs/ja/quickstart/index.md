[ ![logo](../../assets/logo.svg) ](../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../)
  * クイックスタート  [ クイックスタート  ](./) 目次 
    * プロジェクトと仮想環境の作成 
      * 仮想環境の有効化 
      * Agents SDK のインストール 
      * OpenAI API キーの設定 
    * 最初のエージェントの作成 
    * さらにエージェントを追加 
    * ハンドオフの定義 
    * エージェントオーケストレーションの実行 
    * ガードレールの追加 
    * すべてをまとめる 
    * トレースの表示 
    * 次のステップ 
  * [ コード例  ](../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../agents/)
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

  * プロジェクトと仮想環境の作成 
    * 仮想環境の有効化 
    * Agents SDK のインストール 
    * OpenAI API キーの設定 
  * 最初のエージェントの作成 
  * さらにエージェントを追加 
  * ハンドオフの定義 
  * エージェントオーケストレーションの実行 
  * ガードレールの追加 
  * すべてをまとめる 
  * トレースの表示 
  * 次のステップ 



# クイックスタート

## プロジェクトと仮想環境の作成

これは一度だけ行えば十分です。
    
    
    mkdir my_project
    cd my_project
    python -m venv .venv
    

### 仮想環境の有効化

新しいターミナルセッションを開始するたびに実行してください。
    
    
    source .venv/bin/activate
    

### Agents SDK のインストール
    
    
    pip install openai-agents # or `uv add openai-agents`, etc
    

### OpenAI API キーの設定

まだお持ちでない場合は、[こちらの手順](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)に従って OpenAI API キーを作成してください。
    
    
    export OPENAI_API_KEY=sk-...
    

## 最初のエージェントの作成

エージェントは instructions 、名前、`model_config` などのオプション設定で定義します。
    
    
    from agents import Agent
    
    agent = Agent(
        name="Math Tutor",
        instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    )
    

## さらにエージェントを追加

追加のエージェントも同様の方法で定義できます。`handoff_descriptions` はハンドオフのルーティングを判断するための追加コンテキストを提供します。
    
    
    from agents import Agent
    
    history_tutor_agent = Agent(
        name="History Tutor",
        handoff_description="Specialist agent for historical questions",
        instructions="You provide assistance with historical queries. Explain important events and context clearly.",
    )
    
    math_tutor_agent = Agent(
        name="Math Tutor",
        handoff_description="Specialist agent for math questions",
        instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    )
    

## ハンドオフの定義

各エージェントに対して、タスクを進める際に選択できるハンドオフ先の一覧を定義できます。
    
    
    triage_agent = Agent(
        name="Triage Agent",
        instructions="You determine which agent to use based on the user's homework question",
        handoffs=[history_tutor_agent, math_tutor_agent]
    )
    

## エージェントオーケストレーションの実行

ワークフローが実行され、トリアージエージェントが 2 つの専門エージェント間で正しくルーティングすることを確認しましょう。
    
    
    from agents import Runner
    
    async def main():
        result = await Runner.run(triage_agent, "What is the capital of France?")
        print(result.final_output)
    

## ガードレールの追加

入力または出力に対して実行されるカスタムガードレールを定義できます。
    
    
    from agents import GuardrailFunctionOutput, Agent, Runner
    from pydantic import BaseModel
    
    class HomeworkOutput(BaseModel):
        is_homework: bool
        reasoning: str
    
    guardrail_agent = Agent(
        name="Guardrail check",
        instructions="Check if the user is asking about homework.",
        output_type=HomeworkOutput,
    )
    
    async def homework_guardrail(ctx, agent, input_data):
        result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
        final_output = result.final_output_as(HomeworkOutput)
        return GuardrailFunctionOutput(
            output_info=final_output,
            tripwire_triggered=not final_output.is_homework,
        )
    

## すべてをまとめる

ハンドオフと入力ガードレールを組み合わせて、ワークフロー全体を実行してみましょう。
    
    
    from agents import Agent, InputGuardrail, GuardrailFunctionOutput, Runner
    from pydantic import BaseModel
    import asyncio
    
    class HomeworkOutput(BaseModel):
        is_homework: bool
        reasoning: str
    
    guardrail_agent = Agent(
        name="Guardrail check",
        instructions="Check if the user is asking about homework.",
        output_type=HomeworkOutput,
    )
    
    math_tutor_agent = Agent(
        name="Math Tutor",
        handoff_description="Specialist agent for math questions",
        instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    )
    
    history_tutor_agent = Agent(
        name="History Tutor",
        handoff_description="Specialist agent for historical questions",
        instructions="You provide assistance with historical queries. Explain important events and context clearly.",
    )
    
    
    async def homework_guardrail(ctx, agent, input_data):
        result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
        final_output = result.final_output_as(HomeworkOutput)
        return GuardrailFunctionOutput(
            output_info=final_output,
            tripwire_triggered=not final_output.is_homework,
        )
    
    triage_agent = Agent(
        name="Triage Agent",
        instructions="You determine which agent to use based on the user's homework question",
        handoffs=[history_tutor_agent, math_tutor_agent],
        input_guardrails=[
            InputGuardrail(guardrail_function=homework_guardrail),
        ],
    )
    
    async def main():
        result = await Runner.run(triage_agent, "who was the first president of the united states?")
        print(result.final_output)
    
        result = await Runner.run(triage_agent, "what is life")
        print(result.final_output)
    
    if __name__ == "__main__":
        asyncio.run(main())
    

## トレースの表示

エージェントの実行内容を確認するには、[OpenAI ダッシュボードの Trace viewer](https://platform.openai.com/traces) に移動してトレースを閲覧してください。

## 次のステップ

より複雑なエージェントフローの構築方法を学びましょう。

  * [エージェント](../agents/) の設定方法を学ぶ。
  * [エージェントの実行](../running_agents/) について学ぶ。
  * [ツール](../tools/)、[ガードレール](../guardrails/)、[モデル](../models/) について学ぶ。


