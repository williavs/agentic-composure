[ ![logo](../../assets/logo.svg) ](../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../)
  * [ クイックスタート  ](../quickstart/)
  * コード例  [ コード例  ](./) 目次 
    * カテゴリー 
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

  * カテゴリー 



# コード例

リポジトリの [examples セクション](https://github.com/openai/openai-agents-python/tree/main/examples) には、 SDK のさまざまなサンプル実装が用意されています。これらの例は、異なるパターンや機能を示す複数のカテゴリーに整理されています。

## カテゴリー

  * **[agent_patterns](https://github.com/openai/openai-agents-python/tree/main/examples/agent_patterns):**  
このカテゴリーの例では、一般的なエージェント設計パターンを紹介しています。

    * 決定論的ワークフロー 
    * ツールとしてのエージェント 
    * エージェントの並列実行 
  * **[basic](https://github.com/openai/openai-agents-python/tree/main/examples/basic):**  
SDK の基礎的な機能を示す例です。

    * 動的なシステムプロンプト 
    * ストリーミング出力 
    * ライフサイクルイベント 
  * **[tool examples](https://github.com/openai/openai-agents-python/tree/main/examples/tools):**  
Web 検索やファイル検索など、 OpenAI がホストするツールの実装方法と、それらをエージェントに統合する方法を学べます。

  * **[model providers](https://github.com/openai/openai-agents-python/tree/main/examples/model_providers):**  
OpenAI 以外のモデルを SDK で利用する方法を探ります。

  * **[handoffs](https://github.com/openai/openai-agents-python/tree/main/examples/handoffs):**  
エージェントのハンドオフを実践的に示す例です。

  * **[mcp](https://github.com/openai/openai-agents-python/tree/main/examples/mcp):**  
MCP を使ったエージェントの構築方法を学べます。

  * **[customer_service](https://github.com/openai/openai-agents-python/tree/main/examples/customer_service)** と **[research_bot](https://github.com/openai/openai-agents-python/tree/main/examples/research_bot):**  
より実践的なユースケースを示す、拡張された 2 つの例です。

    * **customer_service** : 航空会社向けカスタマーサービスシステムの例 
    * **research_bot** : シンプルなディープリサーチクローン 
  * **[voice](https://github.com/openai/openai-agents-python/tree/main/examples/voice):**  
TTS と STT モデルを用いた音声エージェントの例をご覧ください。



