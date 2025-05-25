[ ![logo](../../assets/logo.svg) ](../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../)
  * [ クイックスタート  ](../quickstart/)
  * [ コード例  ](../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../agents/)
    * [ エージェントの実行  ](../running_agents/)
    * 結果  [ 結果  ](./) 目次 
      * 最終出力 
      * 次のターンへの入力 
      * 最後のエージェント 
      * 新しいアイテム 
      * その他の情報 
        * ガードレール結果 
        * raw レスポンス 
        * 元の入力 
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

  * 最終出力 
  * 次のターンへの入力 
  * 最後のエージェント 
  * 新しいアイテム 
  * その他の情報 
    * ガードレール結果 
    * raw レスポンス 
    * 元の入力 



# 結果

`Runner.run` メソッドを呼び出すと、以下のいずれかが返されます。

  * `run` または `run_sync` を呼び出した場合は [`RunResult`](../../ref/result/#agents.result.RunResult "RunResult


  
      dataclass
  ")
  * `run_streamed` を呼び出した場合は [`RunResultStreaming`](../../ref/result/#agents.result.RunResultStreaming "RunResultStreaming


  
      dataclass
  ")



これらはどちらも [`RunResultBase`](../../ref/result/#agents.result.RunResultBase "RunResultBase


  
      dataclass
  ") を継承しており、ほとんどの有用な情報はここに格納されています。

## 最終出力

[`final_output`](../../ref/result/#agents.result.RunResultBase.final_output "final_output


  
      instance-attribute
  ") プロパティには、最後に実行されたエージェントの最終出力が格納されます。内容は以下のいずれかです。

  * `output_type` が定義されていない場合は `str`
  * `output_type` が定義されている場合は `last_agent.output_type` 型のオブジェクト



Note

`final_output` の型は `Any` です。ハンドオフが発生する可能性があるため、静的に型付けできません。ハンドオフが発生すると、どのエージェントでも最後になり得るため、可能性のある出力型を静的に特定できないのです。

## 次のターンへの入力

[`result.to_input_list()`](../../ref/result/#agents.result.RunResultBase.to_input_list "to_input_list") を使用すると、エージェント実行中に生成されたアイテムを元の入力に連結した入力リストへ変換できます。これにより、あるエージェント実行の出力を別の実行へ渡したり、ループで実行して毎回新しいユーザー入力を追加したりすることが容易になります。

## 最後のエージェント

[`last_agent`](../../ref/result/#agents.result.RunResultBase.last_agent "last_agent


  
      abstractmethod
      property
  ") プロパティには、最後に実行されたエージェントが格納されています。アプリケーションによっては、次回ユーザーが入力する際にこれが役立つことがよくあります。例えば、フロントラインのトリアージ エージェントが言語専用のエージェントにハンドオフする場合、最後のエージェントを保存しておき、ユーザーが次にメッセージを送ったときに再利用できます。

## 新しいアイテム

[`new_items`](../../ref/result/#agents.result.RunResultBase.new_items "new_items


  
      instance-attribute
  ") プロパティには、実行中に生成された新しいアイテムが含まれます。これらのアイテムは [`RunItem`](../../ref/items/#agents.items.RunItem "RunItem


  
      module-attribute
  ") です。RunItem は、 LLM が生成した raw アイテムをラップします。

  * [`MessageOutputItem`](../../ref/items/#agents.items.MessageOutputItem "MessageOutputItem


  
      dataclass
  ") — LLM からのメッセージを示します。 raw アイテムは生成されたメッセージです。
  * [`HandoffCallItem`](../../ref/items/#agents.items.HandoffCallItem "HandoffCallItem


  
      dataclass
  ") — LLM がハンドオフ ツールを呼び出したことを示します。 raw アイテムは LLM からのツール呼び出しアイテムです。
  * [`HandoffOutputItem`](../../ref/items/#agents.items.HandoffOutputItem "HandoffOutputItem


  
      dataclass
  ") — ハンドオフが発生したことを示します。 raw アイテムはハンドオフ ツール呼び出しに対するツール応答です。また、アイテムから送信元 / 送信先エージェントにもアクセスできます。
  * [`ToolCallItem`](../../ref/items/#agents.items.ToolCallItem "ToolCallItem


  
      dataclass
  ") — LLM がツールを呼び出したことを示します。
  * [`ToolCallOutputItem`](../../ref/items/#agents.items.ToolCallOutputItem "ToolCallOutputItem


  
      dataclass
  ") — ツールが呼び出されたことを示します。 raw アイテムはツール応答です。また、アイテムからツール出力にもアクセスできます。
  * [`ReasoningItem`](../../ref/items/#agents.items.ReasoningItem "ReasoningItem


  
      dataclass
  ") — LLM からの推論アイテムを示します。 raw アイテムは生成された推論内容です。



## その他の情報

### ガードレール結果

[`input_guardrail_results`](../../ref/result/#agents.result.RunResultBase.input_guardrail_results "input_guardrail_results


  
      instance-attribute
  ") と [`output_guardrail_results`](../../ref/result/#agents.result.RunResultBase.output_guardrail_results "output_guardrail_results


  
      instance-attribute
  ") プロパティには、ガードレールの結果が存在する場合に格納されます。ガードレール結果には、ログや保存を行いたい有用な情報が含まれることがあるため、これらを参照できるようにしています。

### raw レスポンス

[`raw_responses`](../../ref/result/#agents.result.RunResultBase.raw_responses "raw_responses


  
      instance-attribute
  ") プロパティには、 LLM が生成した [`ModelResponse`](../../ref/items/#agents.items.ModelResponse "ModelResponse


  
      dataclass
  ") が格納されます。

### 元の入力

[`input`](../../ref/result/#agents.result.RunResultBase.input "input


  
      instance-attribute
  ") プロパティには、`run` メソッドに渡した元の入力が格納されます。ほとんどの場合は必要ありませんが、必要に応じて参照できるように用意されています。
