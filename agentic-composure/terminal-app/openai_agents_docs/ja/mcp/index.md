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
    * Model context protocol (MCP)  [ Model context protocol (MCP)  ](./) 目次 
      * MCP サーバー 
      * MCP サーバーの利用 
      * キャッシュ 
      * エンドツーエンドのコード例 
      * トレーシング 
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

  * MCP サーバー 
  * MCP サーバーの利用 
  * キャッシュ 
  * エンドツーエンドのコード例 
  * トレーシング 



# Model context protocol (MCP)

[Model context protocol](https://modelcontextprotocol.io/introduction)（通称 MCP）は、 LLM にツールとコンテキストを提供するための仕組みです。MCP のドキュメントでは次のように説明されています。

> MCP は、アプリケーションが LLM にコンテキストを提供する方法を標準化するオープンプロトコルです。MCP は AI アプリケーションにとっての USB‑C ポートのようなものと考えてください。USB‑C が各種デバイスを周辺機器と接続するための標準化された方法を提供するのと同様に、MCP は AI モデルをさまざまなデータソースやツールと接続するための標準化された方法を提供します。

Agents SDK は MCP をサポートしており、これにより幅広い MCP サーバーをエージェントにツールとして追加できます。

## MCP サーバー

現在、MCP 仕様では使用するトランスポート方式に基づき 2 種類のサーバーが定義されています。

  1. **stdio** サーバー: アプリケーションのサブプロセスとして実行されます。ローカルで動かすイメージです。 
  2. **HTTP over SSE** サーバー: リモートで動作し、 URL 経由で接続します。



これらのサーバーへは [`MCPServerStdio`](../../ref/mcp/server/#agents.mcp.server.MCPServerStdio "MCPServerStdio") と [`MCPServerSse`](../../ref/mcp/server/#agents.mcp.server.MCPServerSse "MCPServerSse") クラスを使用して接続できます。

たとえば、[公式 MCP filesystem サーバー](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem)を利用する場合は次のようになります。
    
    
    async with MCPServerStdio(
        params={
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
        }
    ) as server:
        tools = await server.list_tools()
    

## MCP サーバーの利用

MCP サーバーはエージェントに追加できます。Agents SDK はエージェント実行時に毎回 MCP サーバーへ `list_tools()` を呼び出し、 LLM に MCP サーバーのツールを認識させます。LLM が MCP サーバーのツールを呼び出すと、SDK はそのサーバーへ `call_tool()` を実行します。
    
    
    agent=Agent(
        name="Assistant",
        instructions="Use the tools to achieve the task",
        mcp_servers=[mcp_server_1, mcp_server_2]
    )
    

## キャッシュ

エージェントが実行されるたびに、MCP サーバーへ `list_tools()` が呼び出されます。サーバーがリモートの場合は特にレイテンシが発生します。ツール一覧を自動でキャッシュしたい場合は、[`MCPServerStdio`](../../ref/mcp/server/#agents.mcp.server.MCPServerStdio "MCPServerStdio") と [`MCPServerSse`](../../ref/mcp/server/#agents.mcp.server.MCPServerSse "MCPServerSse") の両方に `cache_tools_list=True` を渡してください。ツール一覧が変更されないと確信できる場合のみ使用してください。

キャッシュを無効化したい場合は、サーバーで `invalidate_tools_cache()` を呼び出します。

## エンドツーエンドのコード例

完全な動作例は [examples/mcp](https://github.com/openai/openai-agents-python/tree/main/examples/mcp) をご覧ください。

## トレーシング

[トレーシング](../tracing/) は MCP の操作を自動的にキャプチャします。具体的には次の内容が含まれます。

  1. ツール一覧取得のための MCP サーバー呼び出し 
  2. 関数呼び出しに関する MCP 情報 



![MCP Tracing Screenshot](../../assets/images/mcp-tracing.jpg)
