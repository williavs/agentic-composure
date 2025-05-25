[ ![logo](../../../assets/logo.svg) ](../../.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](../../..)
  * [ Quickstart  ](../../../quickstart/)
  * [ Examples  ](../../../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../../../agents/)
    * [ Running agents  ](../../../running_agents/)
    * [ Results  ](../../../results/)
    * [ Streaming  ](../../../streaming/)
    * [ Tools  ](../../../tools/)
    * [ Model context protocol (MCP)  ](../../../mcp/)
    * [ Handoffs  ](../../../handoffs/)
    * [ Tracing  ](../../../tracing/)
    * [ Context management  ](../../../context/)
    * [ Guardrails  ](../../../guardrails/)
    * [ Orchestrating multiple agents  ](../../../multi_agent/)
    * Models  Models 
      * [ Models  ](../../../models/)
      * [ Using any model via LiteLLM  ](../../../models/litellm/)
    * [ Configuring the SDK  ](../../../config/)
    * [ Agent Visualization  ](../../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../../voice/pipeline/)
      * [ Tracing  ](../../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../../)
      * [ Agents  ](../../agent/)
      * [ Runner  ](../../run/)
      * [ Tools  ](../../tool/)
      * [ Results  ](../../result/)
      * [ Streaming events  ](../../stream_events/)
      * [ Handoffs  ](../../handoffs/)
      * [ Lifecycle  ](../../lifecycle/)
      * [ Items  ](../../items/)
      * [ Run context  ](../../run_context/)
      * [ Usage  ](../../usage/)
      * [ Exceptions  ](../../exceptions/)
      * [ Guardrails  ](../../guardrail/)
      * [ Model settings  ](../../model_settings/)
      * [ Agent output  ](../../agent_output/)
      * [ Function schema  ](../../function_schema/)
      * [ Model interface  ](../interface/)
      * OpenAI Chat Completions model  [ OpenAI Chat Completions model  ](./) Table of contents 
        * openai_chatcompletions 
        * OpenAIChatCompletionsModel 
          * stream_response 
      * [ OpenAI Responses model  ](../openai_responses/)
      * [ MCP Servers  ](../../mcp/server/)
      * [ MCP Util  ](../../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../../tracing/)
      * [ Creating traces/spans  ](../../tracing/create/)
      * [ Traces  ](../../tracing/traces/)
      * [ Spans  ](../../tracing/spans/)
      * [ Processor interface  ](../../tracing/processor_interface/)
      * [ Processors  ](../../tracing/processors/)
      * [ Scope  ](../../tracing/scope/)
      * [ Setup  ](../../tracing/setup/)
      * [ Span data  ](../../tracing/span_data/)
      * [ Util  ](../../tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../../voice/pipeline/)
      * [ Workflow  ](../../voice/workflow/)
      * [ Input  ](../../voice/input/)
      * [ Result  ](../../voice/result/)
      * [ Pipeline Config  ](../../voice/pipeline_config/)
      * [ Events  ](../../voice/events/)
      * [ Exceptions  ](../../voice/exceptions/)
      * [ Model  ](../../voice/model/)
      * [ Utils  ](../../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../../voice/models/openai_provider/)
      * [ OpenAI STT  ](../../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../extensions/litellm/)



Table of contents 

  * openai_chatcompletions 
  * OpenAIChatCompletionsModel 
    * stream_response 



# `OpenAI Chat Completions model`

###  OpenAIChatCompletionsModel

Bases: `[Model](../interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)")`

Source code in `src/agents/models/openai_chatcompletions.py`
    
    
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

| 
    
    
    class OpenAIChatCompletionsModel(Model):
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
            with generation_span(
                model=str(self.model),
                model_config=model_settings.to_json_dict() | {"base_url": str(self._client.base_url)},
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
    
                if _debug.DONT_LOG_MODEL_DATA:
                    logger.debug("Received model response")
                else:
                    logger.debug(
                        f"LLM resp:\n{json.dumps(response.choices[0].message.model_dump(), indent=2)}\n"
                    )
    
                usage = (
                    Usage(
                        requests=1,
                        input_tokens=response.usage.prompt_tokens,
                        output_tokens=response.usage.completion_tokens,
                        total_tokens=response.usage.total_tokens,
                    )
                    if response.usage
                    else Usage()
                )
                if tracing.include_data():
                    span_generation.span_data.output = [response.choices[0].message.model_dump()]
                span_generation.span_data.usage = {
                    "input_tokens": usage.input_tokens,
                    "output_tokens": usage.output_tokens,
                }
    
                items = Converter.message_to_output_items(response.choices[0].message)
    
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
            """
            Yields a partial message as it is generated, as well as the usage information.
            """
            with generation_span(
                model=str(self.model),
                model_config=model_settings.to_json_dict() | {"base_url": str(self._client.base_url)},
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
        ) -> ChatCompletion: ...
    
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
        ) -> ChatCompletion | tuple[Response, AsyncStream[ChatCompletionChunk]]:
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
                else NOT_GIVEN
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
                    f"{json.dumps(converted_messages, indent=2)}\n"
                    f"Tools:\n{json.dumps(converted_tools, indent=2)}\n"
                    f"Stream: {stream}\n"
                    f"Tool choice: {tool_choice}\n"
                    f"Response format: {response_format}\n"
                )
    
            reasoning_effort = model_settings.reasoning.effort if model_settings.reasoning else None
            store = ChatCmplHelpers.get_store_param(self._get_client(), model_settings)
    
            stream_options = ChatCmplHelpers.get_stream_options_param(
                self._get_client(), model_settings, stream=stream
            )
    
            ret = await self._get_client().chat.completions.create(
                model=self.model,
                messages=converted_messages,
                tools=converted_tools or NOT_GIVEN,
                temperature=self._non_null_or_not_given(model_settings.temperature),
                top_p=self._non_null_or_not_given(model_settings.top_p),
                frequency_penalty=self._non_null_or_not_given(model_settings.frequency_penalty),
                presence_penalty=self._non_null_or_not_given(model_settings.presence_penalty),
                max_tokens=self._non_null_or_not_given(model_settings.max_tokens),
                tool_choice=tool_choice,
                response_format=response_format,
                parallel_tool_calls=parallel_tool_calls,
                stream=stream,
                stream_options=self._non_null_or_not_given(stream_options),
                store=self._non_null_or_not_given(store),
                reasoning_effort=self._non_null_or_not_given(reasoning_effort),
                extra_headers={ **HEADERS, **(model_settings.extra_headers or {}) },
                extra_query=model_settings.extra_query,
                extra_body=model_settings.extra_body,
                metadata=self._non_null_or_not_given(model_settings.metadata),
            )
    
            if isinstance(ret, ChatCompletion):
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
    
        def _get_client(self) -> AsyncOpenAI:
            if self._client is None:
                self._client = AsyncOpenAI()
            return self._client
      
  
---|---  
  
####  stream_response `async`
    
    
    stream_response(
        system_instructions: str | None,
        input: str | list[[TResponseInputItem](../../items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")],
        model_settings: [ModelSettings](../../model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)"),
        tools: list[[Tool](../../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")],
        output_schema: [AgentOutputSchemaBase](../../agent_output/#agents.agent_output.AgentOutputSchemaBase "AgentOutputSchemaBase \(agents.agent_output.AgentOutputSchemaBase\)") | None,
        handoffs: list[[Handoff](../../handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")],
        tracing: [ModelTracing](../interface/#agents.models.interface.ModelTracing "ModelTracing \(agents.models.interface.ModelTracing\)"),
        *,
        previous_response_id: str | None,
    ) -> AsyncIterator[[TResponseStreamEvent](../../items/#agents.items.TResponseStreamEvent "TResponseStreamEvent
    
    
      
          module-attribute
       \(agents.items.TResponseStreamEvent\)")]
    

Yields a partial message as it is generated, as well as the usage information.

Source code in `src/agents/models/openai_chatcompletions.py`
    
    
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
        *,
        previous_response_id: str | None,
    ) -> AsyncIterator[TResponseStreamEvent]:
        """
        Yields a partial message as it is generated, as well as the usage information.
        """
        with generation_span(
            model=str(self.model),
            model_config=model_settings.to_json_dict() | {"base_url": str(self._client.base_url)},
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
      
  
---|---
