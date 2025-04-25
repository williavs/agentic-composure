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

  * litellm_model 
  * LitellmModel 



# `LiteLLM Models`

###  LitellmModel

Bases: `[Model](../../../../ref/models/interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)")`

This class enables using any model via LiteLLM. LiteLLM allows you to acess OpenAPI, Anthropic, Gemini, Mistral, and many other models. See supported models here: [litellm models](https://docs.litellm.ai/docs/providers).

Source code in `src/agents/extensions/models/litellm_model.py`
    
    
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

| 
    
    
    class LitellmModel(Model):
        """This class enables using any model via LiteLLM. LiteLLM allows you to acess OpenAPI,
        Anthropic, Gemini, Mistral, and many other models.
        See supported models here: [litellm models](https://docs.litellm.ai/docs/providers).
        """
    
        def __init__(
            self,
            model: str,
            base_url: str | None = None,
            api_key: str | None = None,
        ):
            self.model = model
            self.base_url = base_url
            self.api_key = api_key
    
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
            with generation_span(
                model=str(self.model),
                model_config=model_settings.to_json_dict()
                | {"base_url": str(self.base_url or ""), "model_impl": "litellm"},
                disabled=tracing.is_disabled(),
            ) as span_generation:
                response = await self._fetch_response(
                    system_instructions,
                    input,
                    model_settings,
                    tools,
                    output_schema,
                    handoffs,
                    span_generation,
                    tracing,
                    stream=False,
                )
    
                assert isinstance(response.choices[0], litellm.types.utils.Choices)
    
                if _debug.DONT_LOG_MODEL_DATA:
                    logger.debug("Received model response")
                else:
                    logger.debug(
                        f"LLM resp:\n{json.dumps(response.choices[0].message.model_dump(), indent=2)}\n"
                    )
    
                if hasattr(response, "usage"):
                    response_usage = response.usage
                    usage = (
                        Usage(
                            requests=1,
                            input_tokens=response_usage.prompt_tokens,
                            output_tokens=response_usage.completion_tokens,
                            total_tokens=response_usage.total_tokens,
                        )
                        if response.usage
                        else Usage()
                    )
                else:
                    usage = Usage()
                    logger.warning("No usage information returned from Litellm")
    
                if tracing.include_data():
                    span_generation.span_data.output = [response.choices[0].message.model_dump()]
                span_generation.span_data.usage = {
                    "input_tokens": usage.input_tokens,
                    "output_tokens": usage.output_tokens,
                }
    
                items = Converter.message_to_output_items(
                    LitellmConverter.convert_message_to_openai(response.choices[0].message)
                )
    
                return ModelResponse(
                    output=items,
                    usage=usage,
                    response_id=None,
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
            *,
            previous_response_id: str | None,
        ) -> AsyncIterator[TResponseStreamEvent]:
            with generation_span(
                model=str(self.model),
                model_config=model_settings.to_json_dict()
                | {"base_url": str(self.base_url or ""), "model_impl": "litellm"},
                disabled=tracing.is_disabled(),
            ) as span_generation:
                response, stream = await self._fetch_response(
                    system_instructions,
                    input,
                    model_settings,
                    tools,
                    output_schema,
                    handoffs,
                    span_generation,
                    tracing,
                    stream=True,
                )
    
                final_response: Response | None = None
                async for chunk in ChatCmplStreamHandler.handle_stream(response, stream):
                    yield chunk
    
                    if chunk.type == "response.completed":
                        final_response = chunk.response
    
                if tracing.include_data() and final_response:
                    span_generation.span_data.output = [final_response.model_dump()]
    
                if final_response and final_response.usage:
                    span_generation.span_data.usage = {
                        "input_tokens": final_response.usage.input_tokens,
                        "output_tokens": final_response.usage.output_tokens,
                    }
    
        @overload
        async def _fetch_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            span: Span[GenerationSpanData],
            tracing: ModelTracing,
            stream: Literal[True],
        ) -> tuple[Response, AsyncStream[ChatCompletionChunk]]: ...
    
        @overload
        async def _fetch_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            span: Span[GenerationSpanData],
            tracing: ModelTracing,
            stream: Literal[False],
        ) -> litellm.types.utils.ModelResponse: ...
    
        async def _fetch_response(
            self,
            system_instructions: str | None,
            input: str | list[TResponseInputItem],
            model_settings: ModelSettings,
            tools: list[Tool],
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            span: Span[GenerationSpanData],
            tracing: ModelTracing,
            stream: bool = False,
        ) -> litellm.types.utils.ModelResponse | tuple[Response, AsyncStream[ChatCompletionChunk]]:
            converted_messages = Converter.items_to_messages(input)
    
            if system_instructions:
                converted_messages.insert(
                    0,
                    {
                        "content": system_instructions,
                        "role": "system",
                    },
                )
            if tracing.include_data():
                span.span_data.input = converted_messages
    
            parallel_tool_calls = (
                True
                if model_settings.parallel_tool_calls and tools and len(tools) > 0
                else False
                if model_settings.parallel_tool_calls is False
                else None
            )
            tool_choice = Converter.convert_tool_choice(model_settings.tool_choice)
            response_format = Converter.convert_response_format(output_schema)
    
            converted_tools = [Converter.tool_to_openai(tool) for tool in tools] if tools else []
    
            for handoff in handoffs:
                converted_tools.append(Converter.convert_handoff_tool(handoff))
    
            if _debug.DONT_LOG_MODEL_DATA:
                logger.debug("Calling LLM")
            else:
                logger.debug(
                    f"Calling Litellm model: {self.model}\n"
                    f"{json.dumps(converted_messages, indent=2)}\n"
                    f"Tools:\n{json.dumps(converted_tools, indent=2)}\n"
                    f"Stream: {stream}\n"
                    f"Tool choice: {tool_choice}\n"
                    f"Response format: {response_format}\n"
                )
    
            reasoning_effort = model_settings.reasoning.effort if model_settings.reasoning else None
    
            stream_options = None
            if stream and model_settings.include_usage is not None:
                stream_options = {"include_usage": model_settings.include_usage}
    
            extra_kwargs = {}
            if model_settings.extra_query:
                extra_kwargs["extra_query"] = model_settings.extra_query
            if model_settings.metadata:
                extra_kwargs["metadata"] = model_settings.metadata
    
            ret = await litellm.acompletion(
                model=self.model,
                messages=converted_messages,
                tools=converted_tools or None,
                temperature=model_settings.temperature,
                top_p=model_settings.top_p,
                frequency_penalty=model_settings.frequency_penalty,
                presence_penalty=model_settings.presence_penalty,
                max_tokens=model_settings.max_tokens,
                tool_choice=self._remove_not_given(tool_choice),
                response_format=self._remove_not_given(response_format),
                parallel_tool_calls=parallel_tool_calls,
                stream=stream,
                stream_options=stream_options,
                reasoning_effort=reasoning_effort,
                extra_headers={**HEADERS, **(model_settings.extra_headers or {})},
                api_key=self.api_key,
                base_url=self.base_url,
                **extra_kwargs,
            )
    
            if isinstance(ret, litellm.types.utils.ModelResponse):
                return ret
    
            response = Response(
                id=FAKE_RESPONSES_ID,
                created_at=time.time(),
                model=self.model,
                object="response",
                output=[],
                tool_choice=cast(Literal["auto", "required", "none"], tool_choice)
                if tool_choice != NOT_GIVEN
                else "auto",
                top_p=model_settings.top_p,
                temperature=model_settings.temperature,
                tools=[],
                parallel_tool_calls=parallel_tool_calls or False,
                reasoning=model_settings.reasoning,
            )
            return response, ret
    
        def _remove_not_given(self, value: Any) -> Any:
            if isinstance(value, NotGiven):
                return None
            return value
      
  
---|---
