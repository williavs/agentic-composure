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
      * [ クイックスタート  ](../quickstart/)
      * [ パイプラインと ワークフロー  ](../pipeline/)
      * [ トレーシング  ](./)



# トレーシング

[エージェントのトレーシング](../../tracing/) と同様に、音声パイプラインも自動的にトレーシングされます。

基本的なトレーシング情報については上記のドキュメントを参照してください。さらに、[`VoicePipelineConfig`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig


  
      dataclass
  ") でパイプラインのトレーシング設定を行えます。

主なトレーシング関連フィールドは次のとおりです。

  * [`tracing_disabled`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  ")：トレーシングを無効にするかどうかを制御します。デフォルトではトレーシングは有効です。 
  * [`trace_include_sensitive_data`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.trace_include_sensitive_data "trace_include_sensitive_data


  
      class-attribute
      instance-attribute
  ")：トレースに音声テキストなどの機微なデータを含めるかどうかを制御します。これは音声パイプライン専用であり、Workflow 内部で発生する処理には影響しません。 
  * [`trace_include_sensitive_audio_data`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.trace_include_sensitive_audio_data "trace_include_sensitive_audio_data


  
      class-attribute
      instance-attribute
  ")：トレースに音声データを含めるかどうかを制御します。 
  * [`workflow_name`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.workflow_name "workflow_name


  
      class-attribute
      instance-attribute
  ")：トレース Workflow の名前です。 
  * [`group_id`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.group_id "group_id


  
      class-attribute
      instance-attribute
  ")：複数のトレースを関連付けるための `group_id` です。 
  * [`trace_metadata`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  ")：トレースに追加するメタデータです。


