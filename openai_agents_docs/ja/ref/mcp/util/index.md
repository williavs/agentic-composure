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

  * util 
  * MCPUtil 
    * get_all_function_tools 
    * get_function_tools 
    * to_function_tool 
    * invoke_mcp_tool 



# `MCP Util`

###  MCPUtil

Set of utilities for interop between MCP and Agents SDK tools.

Source code in `src/agents/mcp/util.py`
    
    
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
     53
     54
     55
     56
     57
     58
     59
     60
     61
     62
     63
     64
     65
     66
     67
     68
     69
     70
     71
     72
     73
     74
     75
     76
     77
     78
     79
     80
     81
     82
     83
     84
     85
     86
     87
     88
     89
     90
     91
     92
     93
     94
     95
     96
     97
     98
     99
    100
    101
    102
    103
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
    124
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

| 
    
    
    class MCPUtil:
        """Set of utilities for interop between MCP and Agents SDK tools."""
    
        @classmethod
        async def get_all_function_tools(
            cls, servers: list["MCPServer"], convert_schemas_to_strict: bool
        ) -> list[Tool]:
            """Get all function tools from a list of MCP servers."""
            tools = []
            tool_names: set[str] = set()
            for server in servers:
                server_tools = await cls.get_function_tools(server, convert_schemas_to_strict)
                server_tool_names = {tool.name for tool in server_tools}
                if len(server_tool_names & tool_names) > 0:
                    raise UserError(
                        f"Duplicate tool names found across MCP servers: "
                        f"{server_tool_names & tool_names}"
                    )
                tool_names.update(server_tool_names)
                tools.extend(server_tools)
    
            return tools
    
        @classmethod
        async def get_function_tools(
            cls, server: "MCPServer", convert_schemas_to_strict: bool
        ) -> list[Tool]:
            """Get all function tools from a single MCP server."""
    
            with mcp_tools_span(server=server.name) as span:
                tools = await server.list_tools()
                span.span_data.result = [tool.name for tool in tools]
    
            return [cls.to_function_tool(tool, server, convert_schemas_to_strict) for tool in tools]
    
        @classmethod
        def to_function_tool(
            cls, tool: "MCPTool", server: "MCPServer", convert_schemas_to_strict: bool
        ) -> FunctionTool:
            """Convert an MCP tool to an Agents SDK function tool."""
            invoke_func = functools.partial(cls.invoke_mcp_tool, server, tool)
            schema, is_strict = tool.inputSchema, False
    
            # MCP spec doesn't require the inputSchema to have `properties`, but OpenAI spec does.
            if "properties" not in schema:
                schema["properties"] = {}
    
            if convert_schemas_to_strict:
                try:
                    schema = ensure_strict_json_schema(schema)
                    is_strict = True
                except Exception as e:
                    logger.info(f"Error converting MCP schema to strict mode: {e}")
    
            return FunctionTool(
                name=tool.name,
                description=tool.description or "",
                params_json_schema=schema,
                on_invoke_tool=invoke_func,
                strict_json_schema=is_strict,
            )
    
        @classmethod
        async def invoke_mcp_tool(
            cls, server: "MCPServer", tool: "MCPTool", context: RunContextWrapper[Any], input_json: str
        ) -> str:
            """Invoke an MCP tool and return the result as a string."""
            try:
                json_data: dict[str, Any] = json.loads(input_json) if input_json else {}
            except Exception as e:
                if _debug.DONT_LOG_TOOL_DATA:
                    logger.debug(f"Invalid JSON input for tool {tool.name}")
                else:
                    logger.debug(f"Invalid JSON input for tool {tool.name}: {input_json}")
                raise ModelBehaviorError(
                    f"Invalid JSON input for tool {tool.name}: {input_json}"
                ) from e
    
            if _debug.DONT_LOG_TOOL_DATA:
                logger.debug(f"Invoking MCP tool {tool.name}")
            else:
                logger.debug(f"Invoking MCP tool {tool.name} with input {input_json}")
    
            try:
                result = await server.call_tool(tool.name, json_data)
            except Exception as e:
                logger.error(f"Error invoking MCP tool {tool.name}: {e}")
                raise AgentsException(f"Error invoking MCP tool {tool.name}: {e}") from e
    
            if _debug.DONT_LOG_TOOL_DATA:
                logger.debug(f"MCP tool {tool.name} completed.")
            else:
                logger.debug(f"MCP tool {tool.name} returned {result}")
    
            # The MCP tool result is a list of content items, whereas OpenAI tool outputs are a single
            # string. We'll try to convert.
            if len(result.content) == 1:
                tool_output = result.content[0].model_dump_json()
            elif len(result.content) > 1:
                tool_output = json.dumps([item.model_dump() for item in result.content])
            else:
                logger.error(f"Errored MCP tool result: {result}")
                tool_output = "Error running tool."
    
            current_span = get_current_span()
            if current_span:
                if isinstance(current_span.span_data, FunctionSpanData):
                    current_span.span_data.output = tool_output
                    current_span.span_data.mcp_data = {
                        "server": server.name,
                    }
                else:
                    logger.warning(
                        f"Current span is not a FunctionSpanData, skipping tool output: {current_span}"
                    )
    
            return tool_output
      
  
---|---  
  
####  get_all_function_tools `async` `classmethod`
    
    
    get_all_function_tools(
        servers: list[[MCPServer](../../../../ref/mcp/server/#agents.mcp.server.MCPServer "MCPServer \(agents.mcp.server.MCPServer\)")],
        convert_schemas_to_strict: bool,
    ) -> list[[Tool](../../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")]
    

Get all function tools from a list of MCP servers.

Source code in `src/agents/mcp/util.py`
    
    
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

| 
    
    
    @classmethod
    async def get_all_function_tools(
        cls, servers: list["MCPServer"], convert_schemas_to_strict: bool
    ) -> list[Tool]:
        """Get all function tools from a list of MCP servers."""
        tools = []
        tool_names: set[str] = set()
        for server in servers:
            server_tools = await cls.get_function_tools(server, convert_schemas_to_strict)
            server_tool_names = {tool.name for tool in server_tools}
            if len(server_tool_names & tool_names) > 0:
                raise UserError(
                    f"Duplicate tool names found across MCP servers: "
                    f"{server_tool_names & tool_names}"
                )
            tool_names.update(server_tool_names)
            tools.extend(server_tools)
    
        return tools
      
  
---|---  
  
####  get_function_tools `async` `classmethod`
    
    
    get_function_tools(
        server: [MCPServer](../../../../ref/mcp/server/#agents.mcp.server.MCPServer "MCPServer \(agents.mcp.server.MCPServer\)"), convert_schemas_to_strict: bool
    ) -> list[[Tool](../../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")]
    

Get all function tools from a single MCP server.

Source code in `src/agents/mcp/util.py`
    
    
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
    53

| 
    
    
    @classmethod
    async def get_function_tools(
        cls, server: "MCPServer", convert_schemas_to_strict: bool
    ) -> list[Tool]:
        """Get all function tools from a single MCP server."""
    
        with mcp_tools_span(server=server.name) as span:
            tools = await server.list_tools()
            span.span_data.result = [tool.name for tool in tools]
    
        return [cls.to_function_tool(tool, server, convert_schemas_to_strict) for tool in tools]
      
  
---|---  
  
####  to_function_tool `classmethod`
    
    
    to_function_tool(
        tool: Tool,
        server: [MCPServer](../../../../ref/mcp/server/#agents.mcp.server.MCPServer "MCPServer \(agents.mcp.server.MCPServer\)"),
        convert_schemas_to_strict: bool,
    ) -> [FunctionTool](../../../../ref/tool/#agents.tool.FunctionTool "FunctionTool
    
    
      
          dataclass
       \(agents.tool.FunctionTool\)")
    

Convert an MCP tool to an Agents SDK function tool.

Source code in `src/agents/mcp/util.py`
    
    
    55
    56
    57
    58
    59
    60
    61
    62
    63
    64
    65
    66
    67
    68
    69
    70
    71
    72
    73
    74
    75
    76
    77
    78
    79
    80

| 
    
    
    @classmethod
    def to_function_tool(
        cls, tool: "MCPTool", server: "MCPServer", convert_schemas_to_strict: bool
    ) -> FunctionTool:
        """Convert an MCP tool to an Agents SDK function tool."""
        invoke_func = functools.partial(cls.invoke_mcp_tool, server, tool)
        schema, is_strict = tool.inputSchema, False
    
        # MCP spec doesn't require the inputSchema to have `properties`, but OpenAI spec does.
        if "properties" not in schema:
            schema["properties"] = {}
    
        if convert_schemas_to_strict:
            try:
                schema = ensure_strict_json_schema(schema)
                is_strict = True
            except Exception as e:
                logger.info(f"Error converting MCP schema to strict mode: {e}")
    
        return FunctionTool(
            name=tool.name,
            description=tool.description or "",
            params_json_schema=schema,
            on_invoke_tool=invoke_func,
            strict_json_schema=is_strict,
        )
      
  
---|---  
  
####  invoke_mcp_tool `async` `classmethod`
    
    
    invoke_mcp_tool(
        server: [MCPServer](../../../../ref/mcp/server/#agents.mcp.server.MCPServer "MCPServer \(agents.mcp.server.MCPServer\)"),
        tool: Tool,
        context: [RunContextWrapper](../../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any],
        input_json: str,
    ) -> str
    

Invoke an MCP tool and return the result as a string.

Source code in `src/agents/mcp/util.py`
    
    
     82
     83
     84
     85
     86
     87
     88
     89
     90
     91
     92
     93
     94
     95
     96
     97
     98
     99
    100
    101
    102
    103
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
    124
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

| 
    
    
    @classmethod
    async def invoke_mcp_tool(
        cls, server: "MCPServer", tool: "MCPTool", context: RunContextWrapper[Any], input_json: str
    ) -> str:
        """Invoke an MCP tool and return the result as a string."""
        try:
            json_data: dict[str, Any] = json.loads(input_json) if input_json else {}
        except Exception as e:
            if _debug.DONT_LOG_TOOL_DATA:
                logger.debug(f"Invalid JSON input for tool {tool.name}")
            else:
                logger.debug(f"Invalid JSON input for tool {tool.name}: {input_json}")
            raise ModelBehaviorError(
                f"Invalid JSON input for tool {tool.name}: {input_json}"
            ) from e
    
        if _debug.DONT_LOG_TOOL_DATA:
            logger.debug(f"Invoking MCP tool {tool.name}")
        else:
            logger.debug(f"Invoking MCP tool {tool.name} with input {input_json}")
    
        try:
            result = await server.call_tool(tool.name, json_data)
        except Exception as e:
            logger.error(f"Error invoking MCP tool {tool.name}: {e}")
            raise AgentsException(f"Error invoking MCP tool {tool.name}: {e}") from e
    
        if _debug.DONT_LOG_TOOL_DATA:
            logger.debug(f"MCP tool {tool.name} completed.")
        else:
            logger.debug(f"MCP tool {tool.name} returned {result}")
    
        # The MCP tool result is a list of content items, whereas OpenAI tool outputs are a single
        # string. We'll try to convert.
        if len(result.content) == 1:
            tool_output = result.content[0].model_dump_json()
        elif len(result.content) > 1:
            tool_output = json.dumps([item.model_dump() for item in result.content])
        else:
            logger.error(f"Errored MCP tool result: {result}")
            tool_output = "Error running tool."
    
        current_span = get_current_span()
        if current_span:
            if isinstance(current_span.span_data, FunctionSpanData):
                current_span.span_data.output = tool_output
                current_span.span_data.mcp_data = {
                    "server": server.name,
                }
            else:
                logger.warning(
                    f"Current span is not a FunctionSpanData, skipping tool output: {current_span}"
                )
    
        return tool_output
      
  
---|---
