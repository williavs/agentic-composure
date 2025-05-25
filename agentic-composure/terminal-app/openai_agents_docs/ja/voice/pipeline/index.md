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
      * パイプラインと ワークフロー  [ パイプラインと ワークフロー  ](./) 目次 
        * パイプラインの設定 
        * パイプラインの実行 
        * 結果 
        * ベストプラクティス 
          * 割り込み 
      * [ トレーシング  ](../tracing/)



目次 

  * パイプラインの設定 
  * パイプラインの実行 
  * 結果 
  * ベストプラクティス 
    * 割り込み 



# パイプラインと ワークフロー

[`VoicePipeline`](../../../ref/voice/pipeline/#agents.voice.pipeline.VoicePipeline "VoicePipeline") は、エージェント的なワークフローを音声アプリに簡単に変換できるクラスです。ワークフローを渡すと、パイプラインが入力音声の文字起こし、音声終了の検知、適切なタイミングでのワークフロー呼び出し、そしてワークフロー出力を音声へ変換する処理を担当します。
    
    
    graph LR
        %% Input
        A["🎤 Audio Input"]
    
        %% Voice Pipeline
        subgraph Voice_Pipeline [Voice Pipeline]
            direction TB
            B["Transcribe (speech-to-text)"]
            C["Your Code"]:::highlight
            D["Text-to-speech"]
            B --> C --> D
        end
    
        %% Output
        E["🎧 Audio Output"]
    
        %% Flow
        A --> Voice_Pipeline
        Voice_Pipeline --> E
    
        %% Custom styling
        classDef highlight fill:#ffcc66,stroke:#333,stroke-width:1px,font-weight:700;
    

## パイプラインの設定

パイプラインを作成する際に、以下を設定できます。

  1. [`workflow`](../../../ref/voice/workflow/#agents.voice.workflow.VoiceWorkflowBase "VoiceWorkflowBase") ‐ 新しい音声が文字起こしされるたびに実行されるコード
  2. 使用する [`speech-to-text`](../../../ref/voice/model/#agents.voice.model.STTModel "STTModel") および [`text-to-speech`](../../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel") モデル
  3. [`config`](../../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig


  
      dataclass
  ") ‐ 以下のような内容を設定可能
     * モデルプロバイダー。モデル名をモデルにマッピングします
     * トレーシング。トレーシングの無効化、音声ファイルのアップロード可否、ワークフロー名、トレース ID など
     * TTS と STT モデルの設定。プロンプト、言語、使用するデータ型など



## パイプラインの実行

パイプラインは [`run()`](../../../ref/voice/pipeline/#agents.voice.pipeline.VoicePipeline.run "run


  
      async
  ") メソッドで実行できます。音声入力は次の 2 形式で渡せます。

  1. [`AudioInput`](../../../ref/voice/input/#agents.voice.input.AudioInput "AudioInput


  
      dataclass
  ")  
完全な音声トランスクリプトがある場合に使用し、その結果だけを生成したいときに便利です。話者の発話終了を検知する必要がないケース、たとえば録音済み音声やプッシュトゥートーク型アプリのようにユーザーが話し終えたタイミングが明確な場合に向いています。
  2. [`StreamedAudioInput`](../../../ref/voice/input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput")  
ユーザーの発話終了検知が必要な場合に使用します。検出された音声チャンクを順次プッシュでき、音声パイプラインが「アクティビティ検知」と呼ばれるプロセスを通じて適切なタイミングでエージェント ワークフローを自動的に実行します。



## 結果

音声パイプライン実行の結果は [`StreamedAudioResult`](../../../ref/voice/result/#agents.voice.result.StreamedAudioResult "StreamedAudioResult") です。これは発生したイベントをストリーミングで受け取れるオブジェクトです。いくつかの [`VoiceStreamEvent`](../../../ref/voice/events/#agents.voice.events.VoiceStreamEvent "VoiceStreamEvent


  
      module-attribute
  ") があり、主なものは次のとおりです。

  1. [`VoiceStreamEventAudio`](../../../ref/voice/events/#agents.voice.events.VoiceStreamEventAudio "VoiceStreamEventAudio


  
      dataclass
  ") ‐ 音声チャンクを含みます
  2. [`VoiceStreamEventLifecycle`](../../../ref/voice/events/#agents.voice.events.VoiceStreamEventLifecycle "VoiceStreamEventLifecycle


  
      dataclass
  ") ‐ ターンの開始や終了などのライフサイクルイベントを通知します
  3. [`VoiceStreamEventError`](../../../ref/voice/events/#agents.voice.events.VoiceStreamEventError "VoiceStreamEventError


  
      dataclass
  ") ‐ エラーイベントです


    
    
    result = await pipeline.run(input)
    
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            # play audio
        elif event.type == "voice_stream_event_lifecycle":
            # lifecycle
        elif event.type == "voice_stream_event_error"
            # error
        ...
    

## ベストプラクティス

### 割り込み

Agents SDK は現在 [`StreamedAudioInput`](../../../ref/voice/input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput") に対して、組み込みの割り込み処理をサポートしていません。そのため、検出された各ターンごとにワークフローが個別に実行されます。アプリケーション内で割り込みを処理したい場合は、[`VoiceStreamEventLifecycle`](../../../ref/voice/events/#agents.voice.events.VoiceStreamEventLifecycle "VoiceStreamEventLifecycle


  
      dataclass
  ") イベントを監視できます。`turn_started` は新しいターンが文字起こしされ、処理が開始されたことを示します。`turn_ended` は該当ターンのすべての音声が送信された後にトリガーされます。たとえば、モデルがターンを開始した際にスピーカーのマイクをミュートし、そのターンに関連する音声をすべて送信し終えた後にアンミュートするといった制御に、これらのイベントを利用できます。
