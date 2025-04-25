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
      * クイックスタート  [ クイックスタート  ](./) 目次 
        * 前提条件 
        * コンセプト 
        * エージェント 
        * 音声パイプライン 
        * パイプラインの実行 
        * まとめて実行 
      * [ パイプラインと ワークフロー  ](../pipeline/)
      * [ トレーシング  ](../tracing/)



目次 

  * 前提条件 
  * コンセプト 
  * エージェント 
  * 音声パイプライン 
  * パイプラインの実行 
  * まとめて実行 



# クイックスタート

## 前提条件

まずは [クイックスタート手順](../../quickstart/) に従って Agents SDK をセットアップし、仮想環境を作成してください。その後、SDK の音声関連のオプション依存関係をインストールします:
    
    
    pip install 'openai-agents[voice]'
    

## コンセプト

押さえておくべき主な概念は [`VoicePipeline`](../../../ref/voice/pipeline/#agents.voice.pipeline.VoicePipeline "VoicePipeline") です。これは次の 3 ステップから成るプロセスです。

  1. speech-to-text モデルを実行して音声をテキストに変換します。 
  2. 通常はエージェント的ワークフローであるあなたのコードを実行し、結果を生成します。 
  3. text-to-speech モデルを実行して結果のテキストを再び音声に変換します。


    
    
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
    

## エージェント

まず、いくつかの エージェント をセットアップしましょう。この SDK でエージェントを構築したことがあれば、見覚えがあるはずです。ここでは複数の エージェント、ハンドオフ、そしてツールを用意します。
    
    
    import asyncio
    import random
    
    from agents import (
        Agent,
        function_tool,
    )
    from agents.extensions.handoff_prompt import prompt_with_handoff_instructions
    
    
    
    @function_tool
    def get_weather(city: str) -> str:
        """Get the weather for a given city."""
        print(f"[debug] get_weather called with city: {city}")
        choices = ["sunny", "cloudy", "rainy", "snowy"]
        return f"The weather in {city} is {random.choice(choices)}."
    
    
    spanish_agent = Agent(
        name="Spanish",
        handoff_description="A spanish speaking agent.",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. Speak in Spanish.",
        ),
        model="gpt-4o-mini",
    )
    
    agent = Agent(
        name="Assistant",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. If the user speaks in Spanish, handoff to the spanish agent.",
        ),
        model="gpt-4o-mini",
        handoffs=[spanish_agent],
        tools=[get_weather],
    )
    

## 音声パイプライン

[`SingleAgentVoiceWorkflow`](../../../ref/voice/workflow/#agents.voice.workflow.SingleAgentVoiceWorkflow "SingleAgentVoiceWorkflow") をワークフローとして、シンプルな音声パイプラインを構築します。
    
    
    from agents.voice import SingleAgentVoiceWorkflow, VoicePipeline
    pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
    

## パイプラインの実行
    
    
    import numpy as np
    import sounddevice as sd
    from agents.voice import AudioInput
    
    # For simplicity, we'll just create 3 seconds of silence
    # In reality, you'd get microphone data
    buffer = np.zeros(24000 * 3, dtype=np.int16)
    audio_input = AudioInput(buffer=buffer)
    
    result = await pipeline.run(audio_input)
    
    # Create an audio player using `sounddevice`
    player = sd.OutputStream(samplerate=24000, channels=1, dtype=np.int16)
    player.start()
    
    # Play the audio stream as it comes in
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            player.write(event.data)
    

## まとめて実行
    
    
    import asyncio
    import random
    
    import numpy as np
    import sounddevice as sd
    
    from agents import (
        Agent,
        function_tool,
        set_tracing_disabled,
    )
    from agents.voice import (
        AudioInput,
        SingleAgentVoiceWorkflow,
        VoicePipeline,
    )
    from agents.extensions.handoff_prompt import prompt_with_handoff_instructions
    
    
    @function_tool
    def get_weather(city: str) -> str:
        """Get the weather for a given city."""
        print(f"[debug] get_weather called with city: {city}")
        choices = ["sunny", "cloudy", "rainy", "snowy"]
        return f"The weather in {city} is {random.choice(choices)}."
    
    
    spanish_agent = Agent(
        name="Spanish",
        handoff_description="A spanish speaking agent.",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. Speak in Spanish.",
        ),
        model="gpt-4o-mini",
    )
    
    agent = Agent(
        name="Assistant",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. If the user speaks in Spanish, handoff to the spanish agent.",
        ),
        model="gpt-4o-mini",
        handoffs=[spanish_agent],
        tools=[get_weather],
    )
    
    
    async def main():
        pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
        buffer = np.zeros(24000 * 3, dtype=np.int16)
        audio_input = AudioInput(buffer=buffer)
    
        result = await pipeline.run(audio_input)
    
        # Create an audio player using `sounddevice`
        player = sd.OutputStream(samplerate=24000, channels=1, dtype=np.int16)
        player.start()
    
        # Play the audio stream as it comes in
        async for event in result.stream():
            if event.type == "voice_stream_event_audio":
                player.write(event.data)
    
    
    if __name__ == "__main__":
        asyncio.run(main())
    

この例を実行すると、エージェントがあなたに話しかけます。実際にエージェントと会話できるデモは、[examples/voice/static](https://github.com/openai/openai-agents-python/tree/main/examples/voice/static) をご覧ください。
