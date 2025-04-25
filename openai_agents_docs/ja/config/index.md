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
      * [ モデル  ](../models/)
      * [ LiteLLM 経由でのモデル利用  ](../models/litellm/)
    * SDK の設定  [ SDK の設定  ](./) 目次 
      * API キーとクライアント 
      * トレーシング 
      * デバッグログ 
        * ログに含まれる機微情報 
    * [ エージェントの可視化  ](../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../voice/pipeline/)
      * [ トレーシング  ](../voice/tracing/)



目次 

  * API キーとクライアント 
  * トレーシング 
  * デバッグログ 
    * ログに含まれる機微情報 



# SDK の設定

## API キーとクライアント

デフォルトでは、 SDK はインポートされた時点で LLM リクエストとトレーシングに使用する `OPENAI_API_KEY` 環境変数を探します。アプリ起動前にこの環境変数を設定できない場合は、 [set_default_openai_key()](../../ref/#agents.set_default_openai_key "set_default_openai_key") 関数を利用してキーを設定できます。
    
    
    from agents import set_default_openai_key
    
    set_default_openai_key("sk-...")
    

また、使用する OpenAI クライアントを構成することも可能です。デフォルトでは、 SDK は環境変数または上記で設定したデフォルトキーを用いて `AsyncOpenAI` インスタンスを作成します。これを変更するには、 [set_default_openai_client()](../../ref/#agents.set_default_openai_client "set_default_openai_client") 関数を使用します。
    
    
    from openai import AsyncOpenAI
    from agents import set_default_openai_client
    
    custom_client = AsyncOpenAI(base_url="...", api_key="...")
    set_default_openai_client(custom_client)
    

さらに、使用する OpenAI API をカスタマイズすることもできます。既定では OpenAI Responses API を利用します。これを Chat Completions API に変更するには、 [set_default_openai_api()](../../ref/#agents.set_default_openai_api "set_default_openai_api") 関数を使用してください。
    
    
    from agents import set_default_openai_api
    
    set_default_openai_api("chat_completions")
    

## トレーシング

トレーシングはデフォルトで有効になっています。前述の OpenAI API キー（環境変数または設定したデフォルトキー）が自動的に使用されます。トレーシングで使用する API キーを個別に設定したい場合は、 [`set_tracing_export_api_key`](../../ref/#agents.set_tracing_export_api_key "set_tracing_export_api_key") 関数を利用してください。
    
    
    from agents import set_tracing_export_api_key
    
    set_tracing_export_api_key("sk-...")
    

トレーシングを完全に無効化するには、 [`set_tracing_disabled()`](../../ref/#agents.set_tracing_disabled "set_tracing_disabled") 関数を呼び出します。
    
    
    from agents import set_tracing_disabled
    
    set_tracing_disabled(True)
    

## デバッグログ

SDK にはハンドラーが設定されていない Python ロガーが 2 つあります。デフォルトでは、警告とエラーは `stdout` に出力されますが、それ以外のログは抑制されます。

詳細なログを有効にするには、 [`enable_verbose_stdout_logging()`](../../ref/#agents.enable_verbose_stdout_logging "enable_verbose_stdout_logging") 関数を使用します。
    
    
    from agents import enable_verbose_stdout_logging
    
    enable_verbose_stdout_logging()
    

必要に応じて、ハンドラー、フィルター、フォーマッターなどを追加してログをカスタマイズすることも可能です。詳しくは [Python ロギングガイド](https://docs.python.org/3/howto/logging.html) を参照してください。
    
    
    import logging
    
    logger = logging.getLogger("openai.agents") # or openai.agents.tracing for the Tracing logger
    
    # To make all logs show up
    logger.setLevel(logging.DEBUG)
    # To make info and above show up
    logger.setLevel(logging.INFO)
    # To make warning and above show up
    logger.setLevel(logging.WARNING)
    # etc
    
    # You can customize this as needed, but this will output to `stderr` by default
    logger.addHandler(logging.StreamHandler())
    

### ログに含まれる機微情報

特定のログには機微情報（たとえば ユーザー データ）が含まれる場合があります。この情報が記録されるのを防ぎたい場合は、次の環境変数を設定してください。

LLM の入力および出力のログを無効にする:
    
    
    export OPENAI_AGENTS_DONT_LOG_MODEL_DATA=1
    

ツールの入力および出力のログを無効にする:
    
    
    export OPENAI_AGENTS_DONT_LOG_TOOL_DATA=1
    
