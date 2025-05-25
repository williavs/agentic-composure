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
    * [ ハンドオフ  ](../handoffs/)
    * [ トレーシング  ](../tracing/)
    * [ コンテキスト管理  ](../context/)
    * [ ガードレール  ](../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../multi_agent/)
    * モデル  モデル 
      * モデル  [ モデル  ](./) 目次 
        * モデルの組み合わせ 
        * 他の LLM プロバイダーの利用 
        * 他の LLM プロバイダーでよくある問題 
          * Tracing クライアントの 401 エラー 
          * Responses API サポート 
          * structured outputs のサポート 
      * [ LiteLLM 経由でのモデル利用  ](litellm/)
    * [ SDK の設定  ](../config/)
    * [ エージェントの可視化  ](../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../voice/pipeline/)
      * [ トレーシング  ](../voice/tracing/)



目次 

  * モデルの組み合わせ 
  * 他の LLM プロバイダーの利用 
  * 他の LLM プロバイダーでよくある問題 
    * Tracing クライアントの 401 エラー 
    * Responses API サポート 
    * structured outputs のサポート 



# モデル

Agents SDK には、標準で 2 種類の OpenAI モデルサポートが含まれています。

  * **推奨** : [`OpenAIResponsesModel`](../../ref/models/openai_responses/#agents.models.openai_responses.OpenAIResponsesModel "OpenAIResponsesModel") — 新しい [Responses API](https://platform.openai.com/docs/api-reference/responses) を利用して OpenAI API を呼び出します。 
  * [`OpenAIChatCompletionsModel`](../../ref/models/openai_chatcompletions/#agents.models.openai_chatcompletions.OpenAIChatCompletionsModel "OpenAIChatCompletionsModel") — [Chat Completions API](https://platform.openai.com/docs/api-reference/chat) を利用して OpenAI API を呼び出します。



## モデルの組み合わせ

1 つのワークフロー内で、エージェントごとに異なるモデルを使用したい場合があります。たとえば、振り分けには小さく高速なモデルを、複雑なタスクには大きく高性能なモデルを使う、といった使い分けです。[`Agent`](../ref/agent/#agents.agent.Agent "Agent


  
      dataclass
  ") を設定する際は、以下のいずれかで特定のモデルを指定できます。

  1. OpenAI モデル名を直接渡す 
  2. 任意のモデル名と、それを `Model` インスタンスへマッピングできる [`ModelProvider`](../../ref/models/interface/#agents.models.interface.ModelProvider "ModelProvider") を渡す 
  3. [`Model`](../../ref/models/interface/#agents.models.interface.Model "Model") 実装を直接渡す 



Note

SDK は [`OpenAIResponsesModel`](../../ref/models/openai_responses/#agents.models.openai_responses.OpenAIResponsesModel "OpenAIResponsesModel") と [`OpenAIChatCompletionsModel`](../../ref/models/openai_chatcompletions/#agents.models.openai_chatcompletions.OpenAIChatCompletionsModel "OpenAIChatCompletionsModel") の両方の形に対応していますが、ワークフローごとに 1 つのモデル形を使用することを推奨します。2 つの形ではサポートする機能・ツールが異なるためです。どうしても混在させる場合は、利用するすべての機能が両方で利用可能であることを確認してください。
    
    
    from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel
    import asyncio
    
    spanish_agent = Agent(
        name="Spanish agent",
        instructions="You only speak Spanish.",
        model="o3-mini", # (1)!
    )
    
    english_agent = Agent(
        name="English agent",
        instructions="You only speak English",
        model=OpenAIChatCompletionsModel( # (2)!
            model="gpt-4o",
            openai_client=AsyncOpenAI()
        ),
    )
    
    triage_agent = Agent(
        name="Triage agent",
        instructions="Handoff to the appropriate agent based on the language of the request.",
        handoffs=[spanish_agent, english_agent],
        model="gpt-3.5-turbo",
    )
    
    async def main():
        result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
        print(result.final_output)
    

  1. OpenAI モデル名を直接指定 
  2. [`Model`](../../ref/models/interface/#agents.models.interface.Model "Model") 実装を提供 



エージェントで使用するモデルをさらに細かく設定したい場合は、`temperature` などのオプションを指定できる [`ModelSettings`](../../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings


  
      dataclass
  ") を渡します。
    
    
    from agents import Agent, ModelSettings
    
    english_agent = Agent(
        name="English agent",
        instructions="You only speak English",
        model="gpt-4o",
        model_settings=ModelSettings(temperature=0.1),
    )
    

## 他の LLM プロバイダーの利用

他の LLM プロバイダーは 3 通りの方法で利用できます（コード例は [こちら](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/)）。

  1. [`set_default_openai_client`](../../ref/#agents.set_default_openai_client "set_default_openai_client")  
OpenAI 互換の API エンドポイントを持つ場合に、`AsyncOpenAI` インスタンスをグローバルに LLM クライアントとして設定できます。`base_url` と `api_key` を設定するケースです。設定例は [examples/model_providers/custom_example_global.py](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/custom_example_global.py)。 

  2. [`ModelProvider`](../../ref/models/interface/#agents.models.interface.ModelProvider "ModelProvider")  
`Runner.run` レベルで「この実行中のすべてのエージェントにカスタムモデルプロバイダーを使う」と宣言できます。設定例は [examples/model_providers/custom_example_provider.py](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/custom_example_provider.py)。 

  3. [`Agent.model`](../../ref/agent/#agents.agent.Agent.model "model


  
      class-attribute
      instance-attribute
  ")  
特定の Agent インスタンスにモデルを指定できます。エージェントごとに異なるプロバイダーを組み合わせられます。設定例は [examples/model_providers/custom_example_agent.py](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/custom_example_agent.py)。多くのモデルを簡単に使う方法として [LiteLLM 連携](litellm/) があります。 




`platform.openai.com` の API キーを持たない場合は、`set_tracing_disabled()` でトレーシングを無効化するか、[別のトレーシングプロセッサー](../tracing/) を設定することを推奨します。

Note

これらの例では Chat Completions API/モデルを使用しています。多くの LLM プロバイダーがまだ Responses API をサポートしていないためです。もしプロバイダーが Responses API をサポートしている場合は、Responses の使用を推奨します。

## 他の LLM プロバイダーでよくある問題

### Tracing クライアントの 401 エラー

トレースは OpenAI サーバーへアップロードされるため、OpenAI API キーがない場合にエラーになります。解決策は次の 3 つです。

  1. トレーシングを完全に無効化する: [`set_tracing_disabled(True)`](../../ref/#agents.set_tracing_disabled "set_tracing_disabled")
  2. トレーシング用の OpenAI キーを設定する: [`set_tracing_export_api_key(...)`](../../ref/#agents.set_tracing_export_api_key "set_tracing_export_api_key")  
このキーはトレースのアップロードにのみ使用され、[platform.openai.com](https://platform.openai.com/) のものが必要です。 
  3. OpenAI 以外のトレースプロセッサーを使う。詳しくは [tracing ドキュメント](../tracing/#custom-tracing-processors) を参照してください。 



### Responses API サポート

SDK は既定で Responses API を使用しますが、多くの LLM プロバイダーはまだ対応していません。そのため 404 などのエラーが発生する場合があります。対処方法は 2 つです。

  1. [`set_default_openai_api("chat_completions")`](../../ref/#agents.set_default_openai_api "set_default_openai_api") を呼び出す  
環境変数 `OPENAI_API_KEY` と `OPENAI_BASE_URL` を設定している場合に機能します。 
  2. [`OpenAIChatCompletionsModel`](../../ref/models/openai_chatcompletions/#agents.models.openai_chatcompletions.OpenAIChatCompletionsModel "OpenAIChatCompletionsModel") を使用する  
コード例は [こちら](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers/) にあります。 



### structured outputs のサポート

一部のモデルプロバイダーは [structured outputs](https://platform.openai.com/docs/guides/structured-outputs) をサポートしていません。その場合、次のようなエラーが発生することがあります。
    
    
    BadRequestError: Error code: 400 - {'error': {'message': "'response_format.type' : value is not one of the allowed values ['text','json_object']", 'type': 'invalid_request_error'}}
    

これは一部プロバイダーの制限で、JSON 出力はサポートしていても `json_schema` を指定できません。現在修正に取り組んでいますが、JSON スキーマ出力をサポートしているプロバイダーを利用することを推奨します。そうでない場合、不正な JSON によりアプリが頻繁に壊れる可能性があります。
