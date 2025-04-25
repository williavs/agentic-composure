[ ![logo](../../assets/logo.svg) ](../.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](../..)
  * [ Quickstart  ](../../quickstart/)
  * [ Examples  ](../../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../../agents/)
    * [ Running agents  ](../../running_agents/)
    * [ Results  ](../../results/)
    * [ Streaming  ](../../streaming/)
    * [ Tools  ](../../tools/)
    * [ Model context protocol (MCP)  ](../../mcp/)
    * [ Handoffs  ](../../handoffs/)
    * [ Tracing  ](../../tracing/)
    * [ Context management  ](../../context/)
    * [ Guardrails  ](../../guardrails/)
    * [ Orchestrating multiple agents  ](../../multi_agent/)
    * Models  Models 
      * [ Models  ](../../models/)
      * [ Using any model via LiteLLM  ](../../models/litellm/)
    * [ Configuring the SDK  ](../../config/)
    * [ Agent Visualization  ](../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../voice/pipeline/)
      * [ Tracing  ](../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../)
      * [ Agents  ](../agent/)
      * [ Runner  ](../run/)
      * Tools  [ Tools  ](./) Table of contents 
        * tool 
        * Tool 
        * FunctionToolResult 
          * tool 
          * output 
          * run_item 
        * FunctionTool 
          * name 
          * description 
          * params_json_schema 
          * on_invoke_tool 
          * strict_json_schema 
        * FileSearchTool 
          * vector_store_ids 
          * max_num_results 
          * include_search_results 
          * ranking_options 
          * filters 
        * WebSearchTool 
          * user_location 
          * search_context_size 
        * ComputerTool 
          * computer 
        * default_tool_error_function 
        * function_tool 
      * [ Results  ](../result/)
      * [ Streaming events  ](../stream_events/)
      * [ Handoffs  ](../handoffs/)
      * [ Lifecycle  ](../lifecycle/)
      * [ Items  ](../items/)
      * [ Run context  ](../run_context/)
      * [ Usage  ](../usage/)
      * [ Exceptions  ](../exceptions/)
      * [ Guardrails  ](../guardrail/)
      * [ Model settings  ](../model_settings/)
      * [ Agent output  ](../agent_output/)
      * [ Function schema  ](../function_schema/)
      * [ Model interface  ](../models/interface/)
      * [ OpenAI Chat Completions model  ](../models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../models/openai_responses/)
      * [ MCP Servers  ](../mcp/server/)
      * [ MCP Util  ](../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../tracing/)
      * [ Creating traces/spans  ](../tracing/create/)
      * [ Traces  ](../tracing/traces/)
      * [ Spans  ](../tracing/spans/)
      * [ Processor interface  ](../tracing/processor_interface/)
      * [ Processors  ](../tracing/processors/)
      * [ Scope  ](../tracing/scope/)
      * [ Setup  ](../tracing/setup/)
      * [ Span data  ](../tracing/span_data/)
      * [ Util  ](../tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../voice/pipeline/)
      * [ Workflow  ](../voice/workflow/)
      * [ Input  ](../voice/input/)
      * [ Result  ](../voice/result/)
      * [ Pipeline Config  ](../voice/pipeline_config/)
      * [ Events  ](../voice/events/)
      * [ Exceptions  ](../voice/exceptions/)
      * [ Model  ](../voice/model/)
      * [ Utils  ](../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../voice/models/openai_provider/)
      * [ OpenAI STT  ](../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../extensions/handoff_filters/)
      * [ Handoff prompt  ](../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../extensions/litellm/)



Table of contents 

  * tool 
  * Tool 
  * FunctionToolResult 
    * tool 
    * output 
    * run_item 
  * FunctionTool 
    * name 
    * description 
    * params_json_schema 
    * on_invoke_tool 
    * strict_json_schema 
  * FileSearchTool 
    * vector_store_ids 
    * max_num_results 
    * include_search_results 
    * ranking_options 
    * filters 
  * WebSearchTool 
    * user_location 
    * search_context_size 
  * ComputerTool 
    * computer 
  * default_tool_error_function 
  * function_tool 



# `Tools`

###  Tool `module-attribute`
    
    
    Tool = Union[
        FunctionTool,
        FileSearchTool,
        WebSearchTool,
        ComputerTool,
    ]
    

A tool that can be used in an agent.

###  FunctionToolResult `dataclass`

Source code in `src/agents/tool.py`
    
    
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

| 
    
    
    @dataclass
    class FunctionToolResult:
        tool: FunctionTool
        """The tool that was run."""
    
        output: Any
        """The output of the tool."""
    
        run_item: RunItem
        """The run item that was produced as a result of the tool call."""
      
  
---|---  
  
####  tool `instance-attribute`
    
    
    tool: FunctionTool
    

The tool that was run.

####  output `instance-attribute`
    
    
    output: Any
    

The output of the tool.

####  run_item `instance-attribute`
    
    
    run_item: [RunItem](../items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)")
    

The run item that was produced as a result of the tool call.

###  FunctionTool `dataclass`

A tool that wraps a function. In most cases, you should use the `function_tool` helpers to create a FunctionTool, as they let you easily wrap a Python function.

Source code in `src/agents/tool.py`
    
    
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

| 
    
    
    @dataclass
    class FunctionTool:
        """A tool that wraps a function. In most cases, you should use  the `function_tool` helpers to
        create a FunctionTool, as they let you easily wrap a Python function.
        """
    
        name: str
        """The name of the tool, as shown to the LLM. Generally the name of the function."""
    
        description: str
        """A description of the tool, as shown to the LLM."""
    
        params_json_schema: dict[str, Any]
        """The JSON schema for the tool's parameters."""
    
        on_invoke_tool: Callable[[RunContextWrapper[Any], str], Awaitable[Any]]
        """A function that invokes the tool with the given context and parameters. The params passed
        are:
        1. The tool run context.
        2. The arguments from the LLM, as a JSON string.
    
        You must return a string representation of the tool output, or something we can call `str()` on.
        In case of errors, you can either raise an Exception (which will cause the run to fail) or
        return a string error message (which will be sent back to the LLM).
        """
    
        strict_json_schema: bool = True
        """Whether the JSON schema is in strict mode. We **strongly** recommend setting this to True,
        as it increases the likelihood of correct JSON input."""
      
  
---|---  
  
####  name `instance-attribute`
    
    
    name: str
    

The name of the tool, as shown to the LLM. Generally the name of the function.

####  description `instance-attribute`
    
    
    description: str
    

A description of the tool, as shown to the LLM.

####  params_json_schema `instance-attribute`
    
    
    params_json_schema: dict[str, Any]
    

The JSON schema for the tool's parameters.

####  on_invoke_tool `instance-attribute`
    
    
    on_invoke_tool: Callable[
        [[RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any], str], Awaitable[Any]
    ]
    

A function that invokes the tool with the given context and parameters. The params passed are: 1\. The tool run context. 2\. The arguments from the LLM, as a JSON string.

You must return a string representation of the tool output, or something we can call `str()` on. In case of errors, you can either raise an Exception (which will cause the run to fail) or return a string error message (which will be sent back to the LLM).

####  strict_json_schema `class-attribute` `instance-attribute`
    
    
    strict_json_schema: bool = True
    

Whether the JSON schema is in strict mode. We **strongly** recommend setting this to True, as it increases the likelihood of correct JSON input.

###  FileSearchTool `dataclass`

A hosted tool that lets the LLM search through a vector store. Currently only supported with OpenAI models, using the Responses API.

Source code in `src/agents/tool.py`
    
    
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

| 
    
    
    @dataclass
    class FileSearchTool:
        """A hosted tool that lets the LLM search through a vector store. Currently only supported with
        OpenAI models, using the Responses API.
        """
    
        vector_store_ids: list[str]
        """The IDs of the vector stores to search."""
    
        max_num_results: int | None = None
        """The maximum number of results to return."""
    
        include_search_results: bool = False
        """Whether to include the search results in the output produced by the LLM."""
    
        ranking_options: RankingOptions | None = None
        """Ranking options for search."""
    
        filters: Filters | None = None
        """A filter to apply based on file attributes."""
    
        @property
        def name(self):
            return "file_search"
      
  
---|---  
  
####  vector_store_ids `instance-attribute`
    
    
    vector_store_ids: list[str]
    

The IDs of the vector stores to search.

####  max_num_results `class-attribute` `instance-attribute`
    
    
    max_num_results: int | None = None
    

The maximum number of results to return.

####  include_search_results `class-attribute` `instance-attribute`
    
    
    include_search_results: bool = False
    

Whether to include the search results in the output produced by the LLM.

####  ranking_options `class-attribute` `instance-attribute`
    
    
    ranking_options: RankingOptions | None = None
    

Ranking options for search.

####  filters `class-attribute` `instance-attribute`
    
    
    filters: Filters | None = None
    

A filter to apply based on file attributes.

###  WebSearchTool `dataclass`

A hosted tool that lets the LLM search the web. Currently only supported with OpenAI models, using the Responses API.

Source code in `src/agents/tool.py`
    
    
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

| 
    
    
    @dataclass
    class WebSearchTool:
        """A hosted tool that lets the LLM search the web. Currently only supported with OpenAI models,
        using the Responses API.
        """
    
        user_location: UserLocation | None = None
        """Optional location for the search. Lets you customize results to be relevant to a location."""
    
        search_context_size: Literal["low", "medium", "high"] = "medium"
        """The amount of context to use for the search."""
    
        @property
        def name(self):
            return "web_search_preview"
      
  
---|---  
  
####  user_location `class-attribute` `instance-attribute`
    
    
    user_location: UserLocation | None = None
    

Optional location for the search. Lets you customize results to be relevant to a location.

####  search_context_size `class-attribute` `instance-attribute`
    
    
    search_context_size: Literal["low", "medium", "high"] = (
        "medium"
    )
    

The amount of context to use for the search.

###  ComputerTool `dataclass`

A hosted tool that lets the LLM control a computer.

Source code in `src/agents/tool.py`
    
    
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

| 
    
    
    @dataclass
    class ComputerTool:
        """A hosted tool that lets the LLM control a computer."""
    
        computer: Computer | AsyncComputer
        """The computer implementation, which describes the environment and dimensions of the computer,
        as well as implements the computer actions like click, screenshot, etc.
        """
    
        @property
        def name(self):
            return "computer_use_preview"
      
  
---|---  
  
####  computer `instance-attribute`
    
    
    computer: Computer | AsyncComputer
    

The computer implementation, which describes the environment and dimensions of the computer, as well as implements the computer actions like click, screenshot, etc.

###  default_tool_error_function
    
    
    default_tool_error_function(
        ctx: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any], error: Exception
    ) -> str
    

The default tool error function, which just returns a generic error message.

Source code in `src/agents/tool.py`
    
    
    137
    138
    139

| 
    
    
    def default_tool_error_function(ctx: RunContextWrapper[Any], error: Exception) -> str:
        """The default tool error function, which just returns a generic error message."""
        return f"An error occurred while running the tool. Please try again. Error: {str(error)}"
      
  
---|---  
  
###  function_tool
    
    
    function_tool(
        func: ToolFunction[...],
        *,
        name_override: str | None = None,
        description_override: str | None = None,
        docstring_style: DocstringStyle | None = None,
        use_docstring_info: bool = True,
        failure_error_function: ToolErrorFunction | None = None,
        strict_mode: bool = True,
    ) -> FunctionTool
    
    
    
    function_tool(
        *,
        name_override: str | None = None,
        description_override: str | None = None,
        docstring_style: DocstringStyle | None = None,
        use_docstring_info: bool = True,
        failure_error_function: ToolErrorFunction | None = None,
        strict_mode: bool = True,
    ) -> Callable[[ToolFunction[...]], FunctionTool]
    
    
    
    function_tool(
        func: ToolFunction[...] | None = None,
        *,
        name_override: str | None = None,
        description_override: str | None = None,
        docstring_style: DocstringStyle | None = None,
        use_docstring_info: bool = True,
        failure_error_function: ToolErrorFunction
        | None = default_tool_error_function,
        strict_mode: bool = True,
    ) -> (
        FunctionTool
        | Callable[[ToolFunction[...]], FunctionTool]
    )
    

Decorator to create a FunctionTool from a function. By default, we will: 1\. Parse the function signature to create a JSON schema for the tool's parameters. 2\. Use the function's docstring to populate the tool's description. 3\. Use the function's docstring to populate argument descriptions. The docstring style is detected automatically, but you can override it.

If the function takes a `RunContextWrapper` as the first argument, it _must_ match the context type of the agent that uses the tool.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`func` |  `ToolFunction[...] | None` |  The function to wrap. |  `None`  
`name_override` |  `str | None` |  If provided, use this name for the tool instead of the function's name. |  `None`  
`description_override` |  `str | None` |  If provided, use this description for the tool instead of the function's docstring. |  `None`  
`docstring_style` |  `DocstringStyle | None` |  If provided, use this style for the tool's docstring. If not provided, we will attempt to auto-detect the style. |  `None`  
`use_docstring_info` |  `bool` |  If True, use the function's docstring to populate the tool's description and argument descriptions. |  `True`  
`failure_error_function` |  `ToolErrorFunction | None` |  If provided, use this function to generate an error message when the tool call fails. The error message is sent to the LLM. If you pass None, then no error message will be sent and instead an Exception will be raised. |  `default_tool_error_function`  
`strict_mode` |  `bool` |  Whether to enable strict mode for the tool's JSON schema. We _strongly_ recommend setting this to True, as it increases the likelihood of correct JSON input. If False, it allows non-strict JSON schemas. For example, if a parameter has a default value, it will be optional, additional properties are allowed, etc. See here for more: https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#supported-schemas |  `True`  
Source code in `src/agents/tool.py`
    
    
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
    186
    187
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
    246
    247
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
    262
    263
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

| 
    
    
    def function_tool(
        func: ToolFunction[...] | None = None,
        *,
        name_override: str | None = None,
        description_override: str | None = None,
        docstring_style: DocstringStyle | None = None,
        use_docstring_info: bool = True,
        failure_error_function: ToolErrorFunction | None = default_tool_error_function,
        strict_mode: bool = True,
    ) -> FunctionTool | Callable[[ToolFunction[...]], FunctionTool]:
        """
        Decorator to create a FunctionTool from a function. By default, we will:
        1. Parse the function signature to create a JSON schema for the tool's parameters.
        2. Use the function's docstring to populate the tool's description.
        3. Use the function's docstring to populate argument descriptions.
        The docstring style is detected automatically, but you can override it.
    
        If the function takes a `RunContextWrapper` as the first argument, it *must* match the
        context type of the agent that uses the tool.
    
        Args:
            func: The function to wrap.
            name_override: If provided, use this name for the tool instead of the function's name.
            description_override: If provided, use this description for the tool instead of the
                function's docstring.
            docstring_style: If provided, use this style for the tool's docstring. If not provided,
                we will attempt to auto-detect the style.
            use_docstring_info: If True, use the function's docstring to populate the tool's
                description and argument descriptions.
            failure_error_function: If provided, use this function to generate an error message when
                the tool call fails. The error message is sent to the LLM. If you pass None, then no
                error message will be sent and instead an Exception will be raised.
            strict_mode: Whether to enable strict mode for the tool's JSON schema. We *strongly*
                recommend setting this to True, as it increases the likelihood of correct JSON input.
                If False, it allows non-strict JSON schemas. For example, if a parameter has a default
                value, it will be optional, additional properties are allowed, etc. See here for more:
                https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#supported-schemas
        """
    
        def _create_function_tool(the_func: ToolFunction[...]) -> FunctionTool:
            schema = function_schema(
                func=the_func,
                name_override=name_override,
                description_override=description_override,
                docstring_style=docstring_style,
                use_docstring_info=use_docstring_info,
                strict_json_schema=strict_mode,
            )
    
            async def _on_invoke_tool_impl(ctx: RunContextWrapper[Any], input: str) -> Any:
                try:
                    json_data: dict[str, Any] = json.loads(input) if input else {}
                except Exception as e:
                    if _debug.DONT_LOG_TOOL_DATA:
                        logger.debug(f"Invalid JSON input for tool {schema.name}")
                    else:
                        logger.debug(f"Invalid JSON input for tool {schema.name}: {input}")
                    raise ModelBehaviorError(
                        f"Invalid JSON input for tool {schema.name}: {input}"
                    ) from e
    
                if _debug.DONT_LOG_TOOL_DATA:
                    logger.debug(f"Invoking tool {schema.name}")
                else:
                    logger.debug(f"Invoking tool {schema.name} with input {input}")
    
                try:
                    parsed = (
                        schema.params_pydantic_model(**json_data)
                        if json_data
                        else schema.params_pydantic_model()
                    )
                except ValidationError as e:
                    raise ModelBehaviorError(f"Invalid JSON input for tool {schema.name}: {e}") from e
    
                args, kwargs_dict = schema.to_call_args(parsed)
    
                if not _debug.DONT_LOG_TOOL_DATA:
                    logger.debug(f"Tool call args: {args}, kwargs: {kwargs_dict}")
    
                if inspect.iscoroutinefunction(the_func):
                    if schema.takes_context:
                        result = await the_func(ctx, *args, **kwargs_dict)
                    else:
                        result = await the_func(*args, **kwargs_dict)
                else:
                    if schema.takes_context:
                        result = the_func(ctx, *args, **kwargs_dict)
                    else:
                        result = the_func(*args, **kwargs_dict)
    
                if _debug.DONT_LOG_TOOL_DATA:
                    logger.debug(f"Tool {schema.name} completed.")
                else:
                    logger.debug(f"Tool {schema.name} returned {result}")
    
                return result
    
            async def _on_invoke_tool(ctx: RunContextWrapper[Any], input: str) -> Any:
                try:
                    return await _on_invoke_tool_impl(ctx, input)
                except Exception as e:
                    if failure_error_function is None:
                        raise
    
                    result = failure_error_function(ctx, e)
                    if inspect.isawaitable(result):
                        return await result
    
                    _error_tracing.attach_error_to_current_span(
                        SpanError(
                            message="Error running tool (non-fatal)",
                            data={
                                "tool_name": schema.name,
                                "error": str(e),
                            },
                        )
                    )
                    return result
    
            return FunctionTool(
                name=schema.name,
                description=schema.description or "",
                params_json_schema=schema.params_json_schema,
                on_invoke_tool=_on_invoke_tool,
                strict_json_schema=strict_mode,
            )
    
        # If func is actually a callable, we were used as @function_tool with no parentheses
        if callable(func):
            return _create_function_tool(func)
    
        # Otherwise, we were used as @function_tool(...), so return a decorator
        def decorator(real_func: ToolFunction[...]) -> FunctionTool:
            return _create_function_tool(real_func)
    
        return decorator
      
  
---|---
