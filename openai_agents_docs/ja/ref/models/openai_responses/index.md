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

  * openai_responses 
  * OpenAIResponsesModel 
    * stream_response 
  * Converter 



# `OpenAI Responses model`

###  OpenAIResponsesModel

Bases: `[Model](../../../../ref/models/interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)")`

Implementation of `Model` that uses the OpenAI Responses API.

Source code in `src/agents/models/openai_responses.py`
    
    
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
    137
    138
    139
    140
    141
    142
    143
    144
    145
    146
    147
    148
    149
    150
    151
    152
    153
    154
    155
    156
    157
    158
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

| 
    
    
    class OpenAIResponsesModel(Model):
        """
        Implementation of `Model` that uses the OpenAI Responses API.
        """
    
        def __init__(
            self,
            model: str | ChatModel,
            openai_client: AsyncOpenAI,
        ) -> None:
            self.model = model
            self._client = openai_client
    
        def _non_null_or_not_given(self, value: Any) -> Any:
            return value if value is not None else NOT_GIVEN
    
        async def get_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            tracing: ModelTracing,
            previous_response_id: str | None,
        ) -> ModelResponse:
            with response_span(disabled=tracing.is_disabled()) as span_response:
                try:
                    response = await self._fetch_response(
                        system_instructions,
                        input,
                        model_settings,
                        tools,
                        output_schema,
                        handoffs,
                        previous_response_id,
                        stream=False,
                    )
    
                    if _debug.DONT_LOG_MODEL_DATA:
                        logger.debug("LLM responded")
                    else:
                        logger.debug(
                            "LLM resp:\n"
                            f"{json.dumps([x.model_dump() for x in response.output], indent=2)}\n"
                        )
    
                    usage = (
                        Usage(
                            requests=1,
                            input_tokens=response.usage.input_tokens,
                            output_tokens=response.usage.output_tokens,
                            total_tokens=response.usage.total_tokens,
                        )
                        if response.usage
                        else Usage()
                    )
    
                    if tracing.include_data():
                        span_response.span_data.response = response
                        span_response.span_data.input = input
                except Exception as e:
                    span_response.set_error(
                        SpanError(
                            message="Error getting response",
                            data={
                                "error": str(e) if tracing.include_data() else e.__class__.__name__,
                            },
                        )
                    )
                    request_id = e.request_id if isinstance(e, APIStatusError) else None
                    logger.error(f"Error getting response: {e}. (request_id: {request_id})")
                    raise
    
            return ModelResponse(
                output=response.output,
                usage=usage,
                response_id=response.id,
            )
    
        async def stream_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            tracing: ModelTracing,
            previous_response_id: str | None,
        ) -> AsyncIterator[ResponseStreamEvent]:
            """
            Yields a partial message as it is generated, as well as the usage information.
            """
            with response_span(disabled=tracing.is_disabled()) as span_response:
                try:
                    stream = await self._fetch_response(
                        system_instructions,
                        input,
                        model_settings,
                        tools,
                        output_schema,
                        handoffs,
                        previous_response_id,
                        stream=True,
                    )
    
                    final_response: Response | None = None
    
                    async for chunk in stream:
                        if isinstance(chunk, ResponseCompletedEvent):
                            final_response = chunk.response
                        yield chunk
    
                    if final_response and tracing.include_data():
                        span_response.span_data.response = final_response
                        span_response.span_data.input = input
    
                except Exception as e:
                    span_response.set_error(
                        SpanError(
                            message="Error streaming response",
                            data={
                                "error": str(e) if tracing.include_data() else e.__class__.__name__,
                            },
                        )
                    )
                    logger.error(f"Error streaming response: {e}")
                    raise
    
        @overload
        async def _fetch_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            previous_response_id: str | None,
            stream: Literal[True],
        ) -> AsyncStream[ResponseStreamEvent]: ...
    
        @overload
        async def _fetch_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            previous_response_id: str | None,
            stream: Literal[False],
        ) -> Response: ...
    
        async def _fetch_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            previous_response_id: str | None,
            stream: Literal[True] | Literal[False] = False,
        ) -> Response | AsyncStream[ResponseStreamEvent]:
            list_input = ItemHelpers.input_to_new_input_list(input)
    
            parallel_tool_calls = (
                True
                if model_settings.parallel_tool_calls and tools and len(tools) > 0
                else False
                if model_settings.parallel_tool_calls is False
                else NOT_GIVEN
            )
    
            tool_choice = Converter.convert_tool_choice(model_settings.tool_choice)
            converted_tools = Converter.convert_tools(tools, handoffs)
            response_format = Converter.get_response_format(output_schema)
    
            if _debug.DONT_LOG_MODEL_DATA:
                logger.debug("Calling LLM")
            else:
                logger.debug(
                    f"Calling LLM {self.model} with input:\n"
                    f"{json.dumps(list_input, indent=2)}\n"
                    f"Tools:\n{json.dumps(converted_tools.tools, indent=2)}\n"
                    f"Stream: {stream}\n"
                    f"Tool choice: {tool_choice}\n"
                    f"Response format: {response_format}\n"
                    f"Previous response id: {previous_response_id}\n"
                )
    
            return await self._client.responses.create(
                previous_response_id=self._non_null_or_not_given(previous_response_id),
                instructions=self._non_null_or_not_given(system_instructions),
                model=self.model,
                input=list_input,
                include=converted_tools.includes,
                tools=converted_tools.tools,
                temperature=self._non_null_or_not_given(model_settings.temperature),
                top_p=self._non_null_or_not_given(model_settings.top_p),
                truncation=self._non_null_or_not_given(model_settings.truncation),
                max_output_tokens=self._non_null_or_not_given(model_settings.max_tokens),
                tool_choice=tool_choice,
                parallel_tool_calls=parallel_tool_calls,
                stream=stream,
                extra_headers={**_HEADERS, **(model_settings.extra_headers or {})},
                extra_query=model_settings.extra_query,
                extra_body=model_settings.extra_body,
                text=response_format,
                store=self._non_null_or_not_given(model_settings.store),
                reasoning=self._non_null_or_not_given(model_settings.reasoning),
                metadata=self._non_null_or_not_given(model_settings.metadata),
            )
    
        def _get_client(self) -> AsyncOpenAI:
            if self._client is None:
                self._client = AsyncOpenAI()
            return self._client
      
  
---|---  
  
####  stream_response `async`
    
    
    stream_response(
        system_instructions: str | None,
        input: str | list[[TResponseInputItem](../../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")],
        model_settings: [ModelSettings](../../../../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)"),
        tools: list[[Tool](../../../../ref/tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")],
        output_schema: [AgentOutputSchemaBase](../../../../ref/agent_output/#agents.agent_output.AgentOutputSchemaBase "AgentOutputSchemaBase \(agents.agent_output.AgentOutputSchemaBase\)") | None,
        handoffs: list[[Handoff](../../../../ref/handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")],
        tracing: [ModelTracing](../../../../ref/models/interface/#agents.models.interface.ModelTracing "ModelTracing \(agents.models.interface.ModelTracing\)"),
        previous_response_id: str | None,
    ) -> AsyncIterator[ResponseStreamEvent]
    

Yields a partial message as it is generated, as well as the usage information.

Source code in `src/agents/models/openai_responses.py`
    
    
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
    140
    141
    142
    143
    144
    145
    146
    147
    148
    149
    150
    151
    152
    153
    154
    155
    156
    157
    158
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

| 
    
    
    async def stream_response(
        self,
        system_instructions: str | None,
        input: str | list[TResponseInputItem],
        model_settings: ModelSettings,
        tools: list[Tool],
        output_schema: AgentOutputSchemaBase | None,
        handoffs: list[Handoff],
        tracing: ModelTracing,
        previous_response_id: str | None,
    ) -> AsyncIterator[ResponseStreamEvent]:
        """
        Yields a partial message as it is generated, as well as the usage information.
        """
        with response_span(disabled=tracing.is_disabled()) as span_response:
            try:
                stream = await self._fetch_response(
                    system_instructions,
                    input,
                    model_settings,
                    tools,
                    output_schema,
                    handoffs,
                    previous_response_id,
                    stream=True,
                )
    
                final_response: Response | None = None
    
                async for chunk in stream:
                    if isinstance(chunk, ResponseCompletedEvent):
                        final_response = chunk.response
                    yield chunk
    
                if final_response and tracing.include_data():
                    span_response.span_data.response = final_response
                    span_response.span_data.input = input
    
            except Exception as e:
                span_response.set_error(
                    SpanError(
                        message="Error streaming response",
                        data={
                            "error": str(e) if tracing.include_data() else e.__class__.__name__,
                        },
                    )
                )
                logger.error(f"Error streaming response: {e}")
                raise
      
  
---|---  
  
###  Converter

Source code in `src/agents/models/openai_responses.py`
    
    
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
    321
    322
    323
    324
    325
    326
    327
    328
    329
    330
    331
    332
    333
    334
    335
    336
    337
    338
    339
    340
    341
    342
    343
    344
    345
    346
    347
    348
    349
    350
    351
    352
    353
    354
    355
    356
    357
    358
    359
    360
    361
    362
    363
    364
    365
    366
    367
    368
    369
    370
    371
    372
    373
    374
    375
    376
    377
    378
    379
    380
    381
    382
    383
    384
    385
    386
    387
    388
    389
    390
    391
    392
    393
    394
    395
    396
    397
    398
    399
    400
    401
    402
    403
    404

| 
    
    
    class Converter:
        @classmethod
        def convert_tool_choice(
            cls, tool_choice: Literal["auto", "required", "none"] | str | None
        ) -> response_create_params.ToolChoice | NotGiven:
            if tool_choice is None:
                return NOT_GIVEN
            elif tool_choice == "required":
                return "required"
            elif tool_choice == "auto":
                return "auto"
            elif tool_choice == "none":
                return "none"
            elif tool_choice == "file_search":
                return {
                    "type": "file_search",
                }
            elif tool_choice == "web_search_preview":
                return {
                    "type": "web_search_preview",
                }
            elif tool_choice == "computer_use_preview":
                return {
                    "type": "computer_use_preview",
                }
            else:
                return {
                    "type": "function",
                    "name": tool_choice,
                }
    
        @classmethod
        def get_response_format(
            cls, output_schema: AgentOutputSchemaBase | None
        ) -> ResponseTextConfigParam | NotGiven:
            if output_schema is None or output_schema.is_plain_text():
                return NOT_GIVEN
            else:
                return {
                    "format": {
                        "type": "json_schema",
                        "name": "final_output",
                        "schema": output_schema.json_schema(),
                        "strict": output_schema.is_strict_json_schema(),
                    }
                }
    
        @classmethod
        def convert_tools(
            cls,
            tools: list[Tool],
            handoffs: list[Handoff[Any]],
        ) -> ConvertedTools:
            converted_tools: list[ToolParam] = []
            includes: list[IncludeLiteral] = []
    
            computer_tools = [tool for tool in tools if isinstance(tool, ComputerTool)]
            if len(computer_tools) > 1:
                raise UserError(f"You can only provide one computer tool. Got {len(computer_tools)}")
    
            for tool in tools:
                converted_tool, include = cls._convert_tool(tool)
                converted_tools.append(converted_tool)
                if include:
                    includes.append(include)
    
            for handoff in handoffs:
                converted_tools.append(cls._convert_handoff_tool(handoff))
    
            return ConvertedTools(tools=converted_tools, includes=includes)
    
        @classmethod
        def _convert_tool(cls, tool: Tool) -> tuple[ToolParam, IncludeLiteral | None]:
            """Returns converted tool and includes"""
    
            if isinstance(tool, FunctionTool):
                converted_tool: ToolParam = {
                    "name": tool.name,
                    "parameters": tool.params_json_schema,
                    "strict": tool.strict_json_schema,
                    "type": "function",
                    "description": tool.description,
                }
                includes: IncludeLiteral | None = None
            elif isinstance(tool, WebSearchTool):
                ws: WebSearchToolParam = {
                    "type": "web_search_preview",
                    "user_location": tool.user_location,
                    "search_context_size": tool.search_context_size,
                }
                converted_tool = ws
                includes = None
            elif isinstance(tool, FileSearchTool):
                converted_tool = {
                    "type": "file_search",
                    "vector_store_ids": tool.vector_store_ids,
                }
                if tool.max_num_results:
                    converted_tool["max_num_results"] = tool.max_num_results
                if tool.ranking_options:
                    converted_tool["ranking_options"] = tool.ranking_options
                if tool.filters:
                    converted_tool["filters"] = tool.filters
    
                includes = "file_search_call.results" if tool.include_search_results else None
            elif isinstance(tool, ComputerTool):
                converted_tool = {
                    "type": "computer_use_preview",
                    "environment": tool.computer.environment,
                    "display_width": tool.computer.dimensions[0],
                    "display_height": tool.computer.dimensions[1],
                }
                includes = None
    
            else:
                raise UserError(f"Unknown tool type: {type(tool)}, tool")
    
            return converted_tool, includes
    
        @classmethod
        def _convert_handoff_tool(cls, handoff: Handoff) -> ToolParam:
            return {
                "name": handoff.tool_name,
                "parameters": handoff.input_json_schema,
                "strict": handoff.strict_json_schema,
                "type": "function",
                "description": handoff.tool_description,
            }
      
  
---|---
