[ ![logo](../../../../assets/logo.svg) ](../../../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../../../)
  * [ クイックスタート  ](../../../quickstart/)
  * [ コード例  ](../../../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../../../agents/)
    * [ エージェントの実行  ](../../../running_agents/)
    * [ 結果  ](../../../results/)
    * [ ストリーミング  ](../../../streaming/)
    * [ ツール  ](../../../tools/)
    * [ Model context protocol (MCP)  ](../../../mcp/)
    * [ ハンドオフ  ](../../../handoffs/)
    * [ トレーシング  ](../../../tracing/)
    * [ コンテキスト管理  ](../../../context/)
    * [ ガードレール  ](../../../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../../../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../../../models/)
      * [ LiteLLM 経由でのモデル利用  ](../../../models/litellm/)
    * [ SDK の設定  ](../../../config/)
    * [ エージェントの可視化  ](../../../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../../../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../../../voice/pipeline/)
      * [ トレーシング  ](../../../voice/tracing/)



目次 

  * server 
  * MCPServer 
    * name 
    * connect 
    * cleanup 
    * list_tools 
    * call_tool 
  * MCPServerStdioParams 
    * command 
    * args 
    * env 
    * cwd 
    * encoding 
    * encoding_error_handler 
  * MCPServerStdio 
    * name 
    * __init__ 
    * create_streams 
    * connect 
    * cleanup 
    * list_tools 
    * call_tool 
    * invalidate_tools_cache 
  * MCPServerSseParams 
    * url 
    * headers 
    * timeout 
    * sse_read_timeout 
  * MCPServerSse 
    * name 
    * __init__ 
    * create_streams 
    * connect 
    * cleanup 
    * list_tools 
    * call_tool 
    * invalidate_tools_cache 



# `MCP Servers`

###  MCPServer

Bases: `ABC`

Base class for Model Context Protocol servers.

Source code in `src/agents/mcp/server.py`
    
    
    20
    21
    22
    23
    24
    25
    26
    27
    28
    29
    30
    31
    32
    33
    34
    35
    36
    37
    38
    39
    40
    41
    42
    43
    44
    45
    46
    47
    48
    49
    50
    51
    52

| 
    
    
    class MCPServer(abc.ABC):
        """Base class for Model Context Protocol servers."""
    
        @abc.abstractmethod
        async def connect(self):
            """Connect to the server. For example, this might mean spawning a subprocess or
            opening a network connection. The server is expected to remain connected until
            `cleanup()` is called.
            """
            pass
    
        @property
        @abc.abstractmethod
        def name(self) -> str:
            """A readable name for the server."""
            pass
    
        @abc.abstractmethod
        async def cleanup(self):
            """Cleanup the server. For example, this might mean closing a subprocess or
            closing a network connection.
            """
            pass
    
        @abc.abstractmethod
        async def list_tools(self) -> list[MCPTool]:
            """List the tools available on the server."""
            pass
    
        @abc.abstractmethod
        async def call_tool(self, tool_name: str, arguments: dict[str, Any] | None) -> CallToolResult:
            """Invoke a tool on the server."""
            pass
      
  
---|---  
  
####  name `abstractmethod` `property`
    
    
    name: str
    

A readable name for the server.

####  connect `abstractmethod` `async`
    
    
    connect()
    

Connect to the server. For example, this might mean spawning a subprocess or opening a network connection. The server is expected to remain connected until `cleanup()` is called.

Source code in `src/agents/mcp/server.py`
    
    
    23
    24
    25
    26
    27
    28
    29

| 
    
    
    @abc.abstractmethod
    async def connect(self):
        """Connect to the server. For example, this might mean spawning a subprocess or
        opening a network connection. The server is expected to remain connected until
        `cleanup()` is called.
        """
        pass
      
  
---|---  
  
####  cleanup `abstractmethod` `async`
    
    
    cleanup()
    

Cleanup the server. For example, this might mean closing a subprocess or closing a network connection.

Source code in `src/agents/mcp/server.py`
    
    
    37
    38
    39
    40
    41
    42

| 
    
    
    @abc.abstractmethod
    async def cleanup(self):
        """Cleanup the server. For example, this might mean closing a subprocess or
        closing a network connection.
        """
        pass
      
  
---|---  
  
####  list_tools `abstractmethod` `async`
    
    
    list_tools() -> list[Tool]
    

List the tools available on the server.

Source code in `src/agents/mcp/server.py`
    
    
    44
    45
    46
    47

| 
    
    
    @abc.abstractmethod
    async def list_tools(self) -> list[MCPTool]:
        """List the tools available on the server."""
        pass
      
  
---|---  
  
####  call_tool `abstractmethod` `async`
    
    
    call_tool(
        tool_name: str, arguments: dict[str, Any] | None
    ) -> CallToolResult
    

Invoke a tool on the server.

Source code in `src/agents/mcp/server.py`
    
    
    49
    50
    51
    52

| 
    
    
    @abc.abstractmethod
    async def call_tool(self, tool_name: str, arguments: dict[str, Any] | None) -> CallToolResult:
        """Invoke a tool on the server."""
        pass
      
  
---|---  
  
###  MCPServerStdioParams

Bases: `TypedDict`

Mirrors `mcp.client.stdio.StdioServerParameters`, but lets you pass params without another import.

Source code in `src/agents/mcp/server.py`
    
    
    159
    160
    161
    162
    163
    164
    165
    166
    167
    168
    169
    170
    171
    172
    173
    174
    175
    176
    177
    178
    179
    180
    181
    182
    183
    184
    185

| 
    
    
    class MCPServerStdioParams(TypedDict):
        """Mirrors `mcp.client.stdio.StdioServerParameters`, but lets you pass params without another
        import.
        """
    
        command: str
        """The executable to run to start the server. For example, `python` or `node`."""
    
        args: NotRequired[list[str]]
        """Command line args to pass to the `command` executable. For example, `['foo.py']` or
        `['server.js', '--port', '8080']`."""
    
        env: NotRequired[dict[str, str]]
        """The environment variables to set for the server. ."""
    
        cwd: NotRequired[str | Path]
        """The working directory to use when spawning the process."""
    
        encoding: NotRequired[str]
        """The text encoding used when sending/receiving messages to the server. Defaults to `utf-8`."""
    
        encoding_error_handler: NotRequired[Literal["strict", "ignore", "replace"]]
        """The text encoding error handler. Defaults to `strict`.
    
        See https://docs.python.org/3/library/codecs.html#codec-base-classes for
        explanations of possible values.
        """
      
  
---|---  
  
####  command `instance-attribute`
    
    
    command: str
    

The executable to run to start the server. For example, `python` or `node`.

####  args `instance-attribute`
    
    
    args: NotRequired[list[str]]
    

Command line args to pass to the `command` executable. For example, `['foo.py']` or `['server.js', '--port', '8080']`.

####  env `instance-attribute`
    
    
    env: NotRequired[dict[str, str]]
    

The environment variables to set for the server. .

####  cwd `instance-attribute`
    
    
    cwd: NotRequired[str | Path]
    

The working directory to use when spawning the process.

####  encoding `instance-attribute`
    
    
    encoding: NotRequired[str]
    

The text encoding used when sending/receiving messages to the server. Defaults to `utf-8`.

####  encoding_error_handler `instance-attribute`
    
    
    encoding_error_handler: NotRequired[
        Literal["strict", "ignore", "replace"]
    ]
    

The text encoding error handler. Defaults to `strict`.

See https://docs.python.org/3/library/codecs.html#codec-base-classes for explanations of possible values.

###  MCPServerStdio

Bases: `_MCPServerWithClientSession`

MCP server implementation that uses the stdio transport. See the [spec] (https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#stdio) for details.

Source code in `src/agents/mcp/server.py`
    
    
    188
    189
    190
    191
    192
    193
    194
    195
    196
    197
    198
    199
    200
    201
    202
    203
    204
    205
    206
    207
    208
    209
    210
    211
    212
    213
    214
    215
    216
    217
    218
    219
    220
    221
    222
    223
    224
    225
    226
    227
    228
    229
    230
    231
    232
    233
    234
    235
    236
    237
    238
    239
    240
    241
    242
    243
    244
    245

| 
    
    
    class MCPServerStdio(_MCPServerWithClientSession):
        """MCP server implementation that uses the stdio transport. See the [spec]
        (https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#stdio) for
        details.
        """
    
        def __init__(
            self,
            params: MCPServerStdioParams,
            cache_tools_list: bool = False,
            name: str | None = None,
            client_session_timeout_seconds: float | None = 5,
        ):
            """Create a new MCP server based on the stdio transport.
    
            Args:
                params: The params that configure the server. This includes the command to run to
                    start the server, the args to pass to the command, the environment variables to
                    set for the server, the working directory to use when spawning the process, and
                    the text encoding used when sending/receiving messages to the server.
                cache_tools_list: Whether to cache the tools list. If `True`, the tools list will be
                    cached and only fetched from the server once. If `False`, the tools list will be
                    fetched from the server on each call to `list_tools()`. The cache can be
                    invalidated by calling `invalidate_tools_cache()`. You should set this to `True`
                    if you know the server will not change its tools list, because it can drastically
                    improve latency (by avoiding a round-trip to the server every time).
                name: A readable name for the server. If not provided, we'll create one from the
                    command.
                client_session_timeout_seconds: the read timeout passed to the MCP ClientSession.
            """
            super().__init__(cache_tools_list, client_session_timeout_seconds)
    
            self.params = StdioServerParameters(
                command=params["command"],
                args=params.get("args", []),
                env=params.get("env"),
                cwd=params.get("cwd"),
                encoding=params.get("encoding", "utf-8"),
                encoding_error_handler=params.get("encoding_error_handler", "strict"),
            )
    
            self._name = name or f"stdio: {self.params.command}"
    
        def create_streams(
            self,
        ) -> AbstractAsyncContextManager[
            tuple[
                MemoryObjectReceiveStream[JSONRPCMessage | Exception],
                MemoryObjectSendStream[JSONRPCMessage],
            ]
        ]:
            """Create the streams for the server."""
            return stdio_client(self.params)
    
        @property
        def name(self) -> str:
            """A readable name for the server."""
            return self._name
      
  
---|---  
  
####  name `property`
    
    
    name: str
    

A readable name for the server.

####  __init__
    
    
    __init__(
        params: [MCPServerStdioParams](../../../../ref/mcp/server/#agents.mcp.server.MCPServerStdioParams "MCPServerStdioParams \(agents.mcp.server.MCPServerStdioParams\)"),
        cache_tools_list: bool = False,
        name: str | None = None,
        client_session_timeout_seconds: float | None = 5,
    )
    

Create a new MCP server based on the stdio transport.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`params` |  `[MCPServerStdioParams](../../../../ref/mcp/server/#agents.mcp.server.MCPServerStdioParams "MCPServerStdioParams \(agents.mcp.server.MCPServerStdioParams\)")` |  The params that configure the server. This includes the command to run to start the server, the args to pass to the command, the environment variables to set for the server, the working directory to use when spawning the process, and the text encoding used when sending/receiving messages to the server. |  _required_  
`cache_tools_list` |  `bool` |  Whether to cache the tools list. If `True`, the tools list will be cached and only fetched from the server once. If `False`, the tools list will be fetched from the server on each call to `list_tools()`. The cache can be invalidated by calling `invalidate_tools_cache()`. You should set this to `True` if you know the server will not change its tools list, because it can drastically improve latency (by avoiding a round-trip to the server every time). |  `False`  
`name` |  `str | None` |  A readable name for the server. If not provided, we'll create one from the command. |  `None`  
`client_session_timeout_seconds` |  `float | None` |  the read timeout passed to the MCP ClientSession. |  `5`  
Source code in `src/agents/mcp/server.py`
    
    
    194
    195
    196
    197
    198
    199
    200
    201
    202
    203
    204
    205
    206
    207
    208
    209
    210
    211
    212
    213
    214
    215
    216
    217
    218
    219
    220
    221
    222
    223
    224
    225
    226
    227
    228
    229

| 
    
    
    def __init__(
        self,
        params: MCPServerStdioParams,
        cache_tools_list: bool = False,
        name: str | None = None,
        client_session_timeout_seconds: float | None = 5,
    ):
        """Create a new MCP server based on the stdio transport.
    
        Args:
            params: The params that configure the server. This includes the command to run to
                start the server, the args to pass to the command, the environment variables to
                set for the server, the working directory to use when spawning the process, and
                the text encoding used when sending/receiving messages to the server.
            cache_tools_list: Whether to cache the tools list. If `True`, the tools list will be
                cached and only fetched from the server once. If `False`, the tools list will be
                fetched from the server on each call to `list_tools()`. The cache can be
                invalidated by calling `invalidate_tools_cache()`. You should set this to `True`
                if you know the server will not change its tools list, because it can drastically
                improve latency (by avoiding a round-trip to the server every time).
            name: A readable name for the server. If not provided, we'll create one from the
                command.
            client_session_timeout_seconds: the read timeout passed to the MCP ClientSession.
        """
        super().__init__(cache_tools_list, client_session_timeout_seconds)
    
        self.params = StdioServerParameters(
            command=params["command"],
            args=params.get("args", []),
            env=params.get("env"),
            cwd=params.get("cwd"),
            encoding=params.get("encoding", "utf-8"),
            encoding_error_handler=params.get("encoding_error_handler", "strict"),
        )
    
        self._name = name or f"stdio: {self.params.command}"
      
  
---|---  
  
####  create_streams
    
    
    create_streams() -> AbstractAsyncContextManager[
        tuple[
            MemoryObjectReceiveStream[
                JSONRPCMessage | Exception
            ],
            MemoryObjectSendStream[JSONRPCMessage],
        ]
    ]
    

Create the streams for the server.

Source code in `src/agents/mcp/server.py`
    
    
    231
    232
    233
    234
    235
    236
    237
    238
    239
    240

| 
    
    
    def create_streams(
        self,
    ) -> AbstractAsyncContextManager[
        tuple[
            MemoryObjectReceiveStream[JSONRPCMessage | Exception],
            MemoryObjectSendStream[JSONRPCMessage],
        ]
    ]:
        """Create the streams for the server."""
        return stdio_client(self.params)
      
  
---|---  
  
####  connect `async`
    
    
    connect()
    

Connect to the server.

Source code in `src/agents/mcp/server.py`
    
    
    104
    105
    106
    107
    108
    109
    110
    111
    112
    113
    114
    115
    116
    117
    118
    119
    120
    121
    122
    123

| 
    
    
    async def connect(self):
        """Connect to the server."""
        try:
            transport = await self.exit_stack.enter_async_context(self.create_streams())
            read, write = transport
            session = await self.exit_stack.enter_async_context(
                ClientSession(
                    read,
                    write,
                    timedelta(seconds=self.client_session_timeout_seconds)
                    if self.client_session_timeout_seconds
                    else None,
                )
            )
            await session.initialize()
            self.session = session
        except Exception as e:
            logger.error(f"Error initializing MCP server: {e}")
            await self.cleanup()
            raise
      
  
---|---  
  
####  cleanup `async`
    
    
    cleanup()
    

Cleanup the server.

Source code in `src/agents/mcp/server.py`
    
    
    148
    149
    150
    151
    152
    153
    154
    155
    156

| 
    
    
    async def cleanup(self):
        """Cleanup the server."""
        async with self._cleanup_lock:
            try:
                await self.exit_stack.aclose()
            except Exception as e:
                logger.error(f"Error cleaning up server: {e}")
            finally:
                self.session = None
      
  
---|---  
  
####  list_tools `async`
    
    
    list_tools() -> list[Tool]
    

List the tools available on the server.

Source code in `src/agents/mcp/server.py`
    
    
    125
    126
    127
    128
    129
    130
    131
    132
    133
    134
    135
    136
    137
    138
    139

| 
    
    
    async def list_tools(self) -> list[MCPTool]:
        """List the tools available on the server."""
        if not self.session:
            raise UserError("Server not initialized. Make sure you call `connect()` first.")
    
        # Return from cache if caching is enabled, we have tools, and the cache is not dirty
        if self.cache_tools_list and not self._cache_dirty and self._tools_list:
            return self._tools_list
    
        # Reset the cache dirty to False
        self._cache_dirty = False
    
        # Fetch the tools from the server
        self._tools_list = (await self.session.list_tools()).tools
        return self._tools_list
      
  
---|---  
  
####  call_tool `async`
    
    
    call_tool(
        tool_name: str, arguments: dict[str, Any] | None
    ) -> CallToolResult
    

Invoke a tool on the server.

Source code in `src/agents/mcp/server.py`
    
    
    141
    142
    143
    144
    145
    146

| 
    
    
    async def call_tool(self, tool_name: str, arguments: dict[str, Any] | None) -> CallToolResult:
        """Invoke a tool on the server."""
        if not self.session:
            raise UserError("Server not initialized. Make sure you call `connect()` first.")
    
        return await self.session.call_tool(tool_name, arguments)
      
  
---|---  
  
####  invalidate_tools_cache
    
    
    invalidate_tools_cache()
    

Invalidate the tools cache.

Source code in `src/agents/mcp/server.py`
    
    
    100
    101
    102

| 
    
    
    def invalidate_tools_cache(self):
        """Invalidate the tools cache."""
        self._cache_dirty = True
      
  
---|---  
  
###  MCPServerSseParams

Bases: `TypedDict`

Mirrors the params in`mcp.client.sse.sse_client`.

Source code in `src/agents/mcp/server.py`
    
    
    248
    249
    250
    251
    252
    253
    254
    255
    256
    257
    258
    259
    260
    261

| 
    
    
    class MCPServerSseParams(TypedDict):
        """Mirrors the params in`mcp.client.sse.sse_client`."""
    
        url: str
        """The URL of the server."""
    
        headers: NotRequired[dict[str, str]]
        """The headers to send to the server."""
    
        timeout: NotRequired[float]
        """The timeout for the HTTP request. Defaults to 5 seconds."""
    
        sse_read_timeout: NotRequired[float]
        """The timeout for the SSE connection, in seconds. Defaults to 5 minutes."""
      
  
---|---  
  
####  url `instance-attribute`
    
    
    url: str
    

The URL of the server.

####  headers `instance-attribute`
    
    
    headers: NotRequired[dict[str, str]]
    

The headers to send to the server.

####  timeout `instance-attribute`
    
    
    timeout: NotRequired[float]
    

The timeout for the HTTP request. Defaults to 5 seconds.

####  sse_read_timeout `instance-attribute`
    
    
    sse_read_timeout: NotRequired[float]
    

The timeout for the SSE connection, in seconds. Defaults to 5 minutes.

###  MCPServerSse

Bases: `_MCPServerWithClientSession`

MCP server implementation that uses the HTTP with SSE transport. See the [spec] (https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#http-with-sse) for details.

Source code in `src/agents/mcp/server.py`
    
    
    264
    265
    266
    267
    268
    269
    270
    271
    272
    273
    274
    275
    276
    277
    278
    279
    280
    281
    282
    283
    284
    285
    286
    287
    288
    289
    290
    291
    292
    293
    294
    295
    296
    297
    298
    299
    300
    301
    302
    303
    304
    305
    306
    307
    308
    309
    310
    311
    312
    313
    314
    315
    316
    317
    318
    319
    320

| 
    
    
    class MCPServerSse(_MCPServerWithClientSession):
        """MCP server implementation that uses the HTTP with SSE transport. See the [spec]
        (https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#http-with-sse)
        for details.
        """
    
        def __init__(
            self,
            params: MCPServerSseParams,
            cache_tools_list: bool = False,
            name: str | None = None,
            client_session_timeout_seconds: float | None = 5,
        ):
            """Create a new MCP server based on the HTTP with SSE transport.
    
            Args:
                params: The params that configure the server. This includes the URL of the server,
                    the headers to send to the server, the timeout for the HTTP request, and the
                    timeout for the SSE connection.
    
                cache_tools_list: Whether to cache the tools list. If `True`, the tools list will be
                    cached and only fetched from the server once. If `False`, the tools list will be
                    fetched from the server on each call to `list_tools()`. The cache can be
                    invalidated by calling `invalidate_tools_cache()`. You should set this to `True`
                    if you know the server will not change its tools list, because it can drastically
                    improve latency (by avoiding a round-trip to the server every time).
    
                name: A readable name for the server. If not provided, we'll create one from the
                    URL.
    
                client_session_timeout_seconds: the read timeout passed to the MCP ClientSession.
            """
            super().__init__(cache_tools_list, client_session_timeout_seconds)
    
            self.params = params
            self._name = name or f"sse: {self.params['url']}"
    
        def create_streams(
            self,
        ) -> AbstractAsyncContextManager[
            tuple[
                MemoryObjectReceiveStream[JSONRPCMessage | Exception],
                MemoryObjectSendStream[JSONRPCMessage],
            ]
        ]:
            """Create the streams for the server."""
            return sse_client(
                url=self.params["url"],
                headers=self.params.get("headers", None),
                timeout=self.params.get("timeout", 5),
                sse_read_timeout=self.params.get("sse_read_timeout", 60 * 5),
            )
    
        @property
        def name(self) -> str:
            """A readable name for the server."""
            return self._name
      
  
---|---  
  
####  name `property`
    
    
    name: str
    

A readable name for the server.

####  __init__
    
    
    __init__(
        params: [MCPServerSseParams](../../../../ref/mcp/server/#agents.mcp.server.MCPServerSseParams "MCPServerSseParams \(agents.mcp.server.MCPServerSseParams\)"),
        cache_tools_list: bool = False,
        name: str | None = None,
        client_session_timeout_seconds: float | None = 5,
    )
    

Create a new MCP server based on the HTTP with SSE transport.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`params` |  `[MCPServerSseParams](../../../../ref/mcp/server/#agents.mcp.server.MCPServerSseParams "MCPServerSseParams \(agents.mcp.server.MCPServerSseParams\)")` |  The params that configure the server. This includes the URL of the server, the headers to send to the server, the timeout for the HTTP request, and the timeout for the SSE connection. |  _required_  
`cache_tools_list` |  `bool` |  Whether to cache the tools list. If `True`, the tools list will be cached and only fetched from the server once. If `False`, the tools list will be fetched from the server on each call to `list_tools()`. The cache can be invalidated by calling `invalidate_tools_cache()`. You should set this to `True` if you know the server will not change its tools list, because it can drastically improve latency (by avoiding a round-trip to the server every time). |  `False`  
`name` |  `str | None` |  A readable name for the server. If not provided, we'll create one from the URL. |  `None`  
`client_session_timeout_seconds` |  `float | None` |  the read timeout passed to the MCP ClientSession. |  `5`  
Source code in `src/agents/mcp/server.py`
    
    
    270
    271
    272
    273
    274
    275
    276
    277
    278
    279
    280
    281
    282
    283
    284
    285
    286
    287
    288
    289
    290
    291
    292
    293
    294
    295
    296
    297
    298
    299

| 
    
    
    def __init__(
        self,
        params: MCPServerSseParams,
        cache_tools_list: bool = False,
        name: str | None = None,
        client_session_timeout_seconds: float | None = 5,
    ):
        """Create a new MCP server based on the HTTP with SSE transport.
    
        Args:
            params: The params that configure the server. This includes the URL of the server,
                the headers to send to the server, the timeout for the HTTP request, and the
                timeout for the SSE connection.
    
            cache_tools_list: Whether to cache the tools list. If `True`, the tools list will be
                cached and only fetched from the server once. If `False`, the tools list will be
                fetched from the server on each call to `list_tools()`. The cache can be
                invalidated by calling `invalidate_tools_cache()`. You should set this to `True`
                if you know the server will not change its tools list, because it can drastically
                improve latency (by avoiding a round-trip to the server every time).
    
            name: A readable name for the server. If not provided, we'll create one from the
                URL.
    
            client_session_timeout_seconds: the read timeout passed to the MCP ClientSession.
        """
        super().__init__(cache_tools_list, client_session_timeout_seconds)
    
        self.params = params
        self._name = name or f"sse: {self.params['url']}"
      
  
---|---  
  
####  create_streams
    
    
    create_streams() -> AbstractAsyncContextManager[
        tuple[
            MemoryObjectReceiveStream[
                JSONRPCMessage | Exception
            ],
            MemoryObjectSendStream[JSONRPCMessage],
        ]
    ]
    

Create the streams for the server.

Source code in `src/agents/mcp/server.py`
    
    
    301
    302
    303
    304
    305
    306
    307
    308
    309
    310
    311
    312
    313
    314
    315

| 
    
    
    def create_streams(
        self,
    ) -> AbstractAsyncContextManager[
        tuple[
            MemoryObjectReceiveStream[JSONRPCMessage | Exception],
            MemoryObjectSendStream[JSONRPCMessage],
        ]
    ]:
        """Create the streams for the server."""
        return sse_client(
            url=self.params["url"],
            headers=self.params.get("headers", None),
            timeout=self.params.get("timeout", 5),
            sse_read_timeout=self.params.get("sse_read_timeout", 60 * 5),
        )
      
  
---|---  
  
####  connect `async`
    
    
    connect()
    

Connect to the server.

Source code in `src/agents/mcp/server.py`
    
    
    104
    105
    106
    107
    108
    109
    110
    111
    112
    113
    114
    115
    116
    117
    118
    119
    120
    121
    122
    123

| 
    
    
    async def connect(self):
        """Connect to the server."""
        try:
            transport = await self.exit_stack.enter_async_context(self.create_streams())
            read, write = transport
            session = await self.exit_stack.enter_async_context(
                ClientSession(
                    read,
                    write,
                    timedelta(seconds=self.client_session_timeout_seconds)
                    if self.client_session_timeout_seconds
                    else None,
                )
            )
            await session.initialize()
            self.session = session
        except Exception as e:
            logger.error(f"Error initializing MCP server: {e}")
            await self.cleanup()
            raise
      
  
---|---  
  
####  cleanup `async`
    
    
    cleanup()
    

Cleanup the server.

Source code in `src/agents/mcp/server.py`
    
    
    148
    149
    150
    151
    152
    153
    154
    155
    156

| 
    
    
    async def cleanup(self):
        """Cleanup the server."""
        async with self._cleanup_lock:
            try:
                await self.exit_stack.aclose()
            except Exception as e:
                logger.error(f"Error cleaning up server: {e}")
            finally:
                self.session = None
      
  
---|---  
  
####  list_tools `async`
    
    
    list_tools() -> list[Tool]
    

List the tools available on the server.

Source code in `src/agents/mcp/server.py`
    
    
    125
    126
    127
    128
    129
    130
    131
    132
    133
    134
    135
    136
    137
    138
    139

| 
    
    
    async def list_tools(self) -> list[MCPTool]:
        """List the tools available on the server."""
        if not self.session:
            raise UserError("Server not initialized. Make sure you call `connect()` first.")
    
        # Return from cache if caching is enabled, we have tools, and the cache is not dirty
        if self.cache_tools_list and not self._cache_dirty and self._tools_list:
            return self._tools_list
    
        # Reset the cache dirty to False
        self._cache_dirty = False
    
        # Fetch the tools from the server
        self._tools_list = (await self.session.list_tools()).tools
        return self._tools_list
      
  
---|---  
  
####  call_tool `async`
    
    
    call_tool(
        tool_name: str, arguments: dict[str, Any] | None
    ) -> CallToolResult
    

Invoke a tool on the server.

Source code in `src/agents/mcp/server.py`
    
    
    141
    142
    143
    144
    145
    146

| 
    
    
    async def call_tool(self, tool_name: str, arguments: dict[str, Any] | None) -> CallToolResult:
        """Invoke a tool on the server."""
        if not self.session:
            raise UserError("Server not initialized. Make sure you call `connect()` first.")
    
        return await self.session.call_tool(tool_name, arguments)
      
  
---|---  
  
####  invalidate_tools_cache
    
    
    invalidate_tools_cache()
    

Invalidate the tools cache.

Source code in `src/agents/mcp/server.py`
    
    
    100
    101
    102

| 
    
    
    def invalidate_tools_cache(self):
        """Invalidate the tools cache."""
        self._cache_dirty = True
      
  
---|---
