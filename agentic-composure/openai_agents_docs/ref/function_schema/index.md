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
      * [ Tools  ](../tool/)
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
      * Function schema  [ Function schema  ](./) Table of contents 
        * function_schema 
        * FuncSchema 
          * name 
          * description 
          * params_pydantic_model 
          * params_json_schema 
          * signature 
          * takes_context 
          * strict_json_schema 
          * to_call_args 
        * FuncDocumentation 
          * name 
          * description 
          * param_descriptions 
        * generate_func_documentation 
        * function_schema 
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

  * function_schema 
  * FuncSchema 
    * name 
    * description 
    * params_pydantic_model 
    * params_json_schema 
    * signature 
    * takes_context 
    * strict_json_schema 
    * to_call_args 
  * FuncDocumentation 
    * name 
    * description 
    * param_descriptions 
  * generate_func_documentation 
  * function_schema 



# `Function schema`

###  FuncSchema `dataclass`

Captures the schema for a python function, in preparation for sending it to an LLM as a tool.

Source code in `src/agents/function_schema.py`
    
    
    18
    19
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

| 
    
    
    @dataclass
    class FuncSchema:
        """
        Captures the schema for a python function, in preparation for sending it to an LLM as a tool.
        """
    
        name: str
        """The name of the function."""
        description: str | None
        """The description of the function."""
        params_pydantic_model: type[BaseModel]
        """A Pydantic model that represents the function's parameters."""
        params_json_schema: dict[str, Any]
        """The JSON schema for the function's parameters, derived from the Pydantic model."""
        signature: inspect.Signature
        """The signature of the function."""
        takes_context: bool = False
        """Whether the function takes a RunContextWrapper argument (must be the first argument)."""
        strict_json_schema: bool = True
        """Whether the JSON schema is in strict mode. We **strongly** recommend setting this to True,
        as it increases the likelihood of correct JSON input."""
    
        def to_call_args(self, data: BaseModel) -> tuple[list[Any], dict[str, Any]]:
            """
            Converts validated data from the Pydantic model into (args, kwargs), suitable for calling
            the original function.
            """
            positional_args: list[Any] = []
            keyword_args: dict[str, Any] = {}
            seen_var_positional = False
    
            # Use enumerate() so we can skip the first parameter if it's context.
            for idx, (name, param) in enumerate(self.signature.parameters.items()):
                # If the function takes a RunContextWrapper and this is the first parameter, skip it.
                if self.takes_context and idx == 0:
                    continue
    
                value = getattr(data, name, None)
                if param.kind == param.VAR_POSITIONAL:
                    # e.g. *args: extend positional args and mark that *args is now seen
                    positional_args.extend(value or [])
                    seen_var_positional = True
                elif param.kind == param.VAR_KEYWORD:
                    # e.g. **kwargs handling
                    keyword_args.update(value or {})
                elif param.kind in (param.POSITIONAL_ONLY, param.POSITIONAL_OR_KEYWORD):
                    # Before *args, add to positional args. After *args, add to keyword args.
                    if not seen_var_positional:
                        positional_args.append(value)
                    else:
                        keyword_args[name] = value
                else:
                    # For KEYWORD_ONLY parameters, always use keyword args.
                    keyword_args[name] = value
            return positional_args, keyword_args
      
  
---|---  
  
####  name `instance-attribute`
    
    
    name: str
    

The name of the function.

####  description `instance-attribute`
    
    
    description: str | None
    

The description of the function.

####  params_pydantic_model `instance-attribute`
    
    
    params_pydantic_model: type[BaseModel]
    

A Pydantic model that represents the function's parameters.

####  params_json_schema `instance-attribute`
    
    
    params_json_schema: dict[str, Any]
    

The JSON schema for the function's parameters, derived from the Pydantic model.

####  signature `instance-attribute`
    
    
    signature: Signature
    

The signature of the function.

####  takes_context `class-attribute` `instance-attribute`
    
    
    takes_context: bool = False
    

Whether the function takes a RunContextWrapper argument (must be the first argument).

####  strict_json_schema `class-attribute` `instance-attribute`
    
    
    strict_json_schema: bool = True
    

Whether the JSON schema is in strict mode. We **strongly** recommend setting this to True, as it increases the likelihood of correct JSON input.

####  to_call_args
    
    
    to_call_args(
        data: BaseModel,
    ) -> tuple[list[Any], dict[str, Any]]
    

Converts validated data from the Pydantic model into (args, kwargs), suitable for calling the original function.

Source code in `src/agents/function_schema.py`
    
    
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

| 
    
    
    def to_call_args(self, data: BaseModel) -> tuple[list[Any], dict[str, Any]]:
        """
        Converts validated data from the Pydantic model into (args, kwargs), suitable for calling
        the original function.
        """
        positional_args: list[Any] = []
        keyword_args: dict[str, Any] = {}
        seen_var_positional = False
    
        # Use enumerate() so we can skip the first parameter if it's context.
        for idx, (name, param) in enumerate(self.signature.parameters.items()):
            # If the function takes a RunContextWrapper and this is the first parameter, skip it.
            if self.takes_context and idx == 0:
                continue
    
            value = getattr(data, name, None)
            if param.kind == param.VAR_POSITIONAL:
                # e.g. *args: extend positional args and mark that *args is now seen
                positional_args.extend(value or [])
                seen_var_positional = True
            elif param.kind == param.VAR_KEYWORD:
                # e.g. **kwargs handling
                keyword_args.update(value or {})
            elif param.kind in (param.POSITIONAL_ONLY, param.POSITIONAL_OR_KEYWORD):
                # Before *args, add to positional args. After *args, add to keyword args.
                if not seen_var_positional:
                    positional_args.append(value)
                else:
                    keyword_args[name] = value
            else:
                # For KEYWORD_ONLY parameters, always use keyword args.
                keyword_args[name] = value
        return positional_args, keyword_args
      
  
---|---  
  
###  FuncDocumentation `dataclass`

Contains metadata about a python function, extracted from its docstring.

Source code in `src/agents/function_schema.py`
    
    
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

| 
    
    
    @dataclass
    class FuncDocumentation:
        """Contains metadata about a python function, extracted from its docstring."""
    
        name: str
        """The name of the function, via `__name__`."""
        description: str | None
        """The description of the function, derived from the docstring."""
        param_descriptions: dict[str, str] | None
        """The parameter descriptions of the function, derived from the docstring."""
      
  
---|---  
  
####  name `instance-attribute`
    
    
    name: str
    

The name of the function, via `__name__`.

####  description `instance-attribute`
    
    
    description: str | None
    

The description of the function, derived from the docstring.

####  param_descriptions `instance-attribute`
    
    
    param_descriptions: dict[str, str] | None
    

The parameter descriptions of the function, derived from the docstring.

###  generate_func_documentation
    
    
    generate_func_documentation(
        func: Callable[..., Any],
        style: DocstringStyle | None = None,
    ) -> FuncDocumentation
    

Extracts metadata from a function docstring, in preparation for sending it to an LLM as a tool.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`func` |  `Callable[..., Any]` |  The function to extract documentation from. |  _required_  
`style` |  `DocstringStyle | None` |  The style of the docstring to use for parsing. If not provided, we will attempt to auto-detect the style. |  `None`  
  
Returns:

Type | Description  
---|---  
`FuncDocumentation` |  A FuncDocumentation object containing the function's name, description, and parameter  
`FuncDocumentation` |  descriptions.  
Source code in `src/agents/function_schema.py`
    
    
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

| 
    
    
    def generate_func_documentation(
        func: Callable[..., Any], style: DocstringStyle | None = None
    ) -> FuncDocumentation:
        """
        Extracts metadata from a function docstring, in preparation for sending it to an LLM as a tool.
    
        Args:
            func: The function to extract documentation from.
            style: The style of the docstring to use for parsing. If not provided, we will attempt to
                auto-detect the style.
    
        Returns:
            A FuncDocumentation object containing the function's name, description, and parameter
            descriptions.
        """
        name = func.__name__
        doc = inspect.getdoc(func)
        if not doc:
            return FuncDocumentation(name=name, description=None, param_descriptions=None)
    
        with _suppress_griffe_logging():
            docstring = Docstring(doc, lineno=1, parser=style or _detect_docstring_style(doc))
            parsed = docstring.parse()
    
        description: str | None = next(
            (section.value for section in parsed if section.kind == DocstringSectionKind.text), None
        )
    
        param_descriptions: dict[str, str] = {
            param.name: param.description
            for section in parsed
            if section.kind == DocstringSectionKind.parameters
            for param in section.value
        }
    
        return FuncDocumentation(
            name=func.__name__,
            description=description,
            param_descriptions=param_descriptions or None,
        )
      
  
---|---  
  
###  function_schema
    
    
    function_schema(
        func: Callable[..., Any],
        docstring_style: DocstringStyle | None = None,
        name_override: str | None = None,
        description_override: str | None = None,
        use_docstring_info: bool = True,
        strict_json_schema: bool = True,
    ) -> FuncSchema
    

Given a python function, extracts a `FuncSchema` from it, capturing the name, description, parameter descriptions, and other metadata.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`func` |  `Callable[..., Any]` |  The function to extract the schema from. |  _required_  
`docstring_style` |  `DocstringStyle | None` |  The style of the docstring to use for parsing. If not provided, we will attempt to auto-detect the style. |  `None`  
`name_override` |  `str | None` |  If provided, use this name instead of the function's `__name__`. |  `None`  
`description_override` |  `str | None` |  If provided, use this description instead of the one derived from the docstring. |  `None`  
`use_docstring_info` |  `bool` |  If True, uses the docstring to generate the description and parameter descriptions. |  `True`  
`strict_json_schema` |  `bool` |  Whether the JSON schema is in strict mode. If True, we'll ensure that the schema adheres to the "strict" standard the OpenAI API expects. We **strongly** recommend setting this to True, as it increases the likelihood of the LLM providing correct JSON input. |  `True`  
  
Returns:

Type | Description  
---|---  
`FuncSchema` |  A `FuncSchema` object containing the function's name, description, parameter descriptions,  
`FuncSchema` |  and other metadata.  
Source code in `src/agents/function_schema.py`
    
    
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

| 
    
    
    def function_schema(
        func: Callable[..., Any],
        docstring_style: DocstringStyle | None = None,
        name_override: str | None = None,
        description_override: str | None = None,
        use_docstring_info: bool = True,
        strict_json_schema: bool = True,
    ) -> FuncSchema:
        """
        Given a python function, extracts a `FuncSchema` from it, capturing the name, description,
        parameter descriptions, and other metadata.
    
        Args:
            func: The function to extract the schema from.
            docstring_style: The style of the docstring to use for parsing. If not provided, we will
                attempt to auto-detect the style.
            name_override: If provided, use this name instead of the function's `__name__`.
            description_override: If provided, use this description instead of the one derived from the
                docstring.
            use_docstring_info: If True, uses the docstring to generate the description and parameter
                descriptions.
            strict_json_schema: Whether the JSON schema is in strict mode. If True, we'll ensure that
                the schema adheres to the "strict" standard the OpenAI API expects. We **strongly**
                recommend setting this to True, as it increases the likelihood of the LLM providing
                correct JSON input.
    
        Returns:
            A `FuncSchema` object containing the function's name, description, parameter descriptions,
            and other metadata.
        """
    
        # 1. Grab docstring info
        if use_docstring_info:
            doc_info = generate_func_documentation(func, docstring_style)
            param_descs = doc_info.param_descriptions or {}
        else:
            doc_info = None
            param_descs = {}
    
        func_name = name_override or doc_info.name if doc_info else func.__name__
    
        # 2. Inspect function signature and get type hints
        sig = inspect.signature(func)
        type_hints = get_type_hints(func)
        params = list(sig.parameters.items())
        takes_context = False
        filtered_params = []
    
        if params:
            first_name, first_param = params[0]
            # Prefer the evaluated type hint if available
            ann = type_hints.get(first_name, first_param.annotation)
            if ann != inspect._empty:
                origin = get_origin(ann) or ann
                if origin is RunContextWrapper:
                    takes_context = True  # Mark that the function takes context
                else:
                    filtered_params.append((first_name, first_param))
            else:
                filtered_params.append((first_name, first_param))
    
        # For parameters other than the first, raise error if any use RunContextWrapper.
        for name, param in params[1:]:
            ann = type_hints.get(name, param.annotation)
            if ann != inspect._empty:
                origin = get_origin(ann) or ann
                if origin is RunContextWrapper:
                    raise UserError(
                        f"RunContextWrapper param found at non-first position in function"
                        f" {func.__name__}"
                    )
            filtered_params.append((name, param))
    
        # We will collect field definitions for create_model as a dict:
        #   field_name -> (type_annotation, default_value_or_Field(...))
        fields: dict[str, Any] = {}
    
        for name, param in filtered_params:
            ann = type_hints.get(name, param.annotation)
            default = param.default
    
            # If there's no type hint, assume `Any`
            if ann == inspect._empty:
                ann = Any
    
            # If a docstring param description exists, use it
            field_description = param_descs.get(name, None)
    
            # Handle different parameter kinds
            if param.kind == param.VAR_POSITIONAL:
                # e.g. *args: extend positional args
                if get_origin(ann) is tuple:
                    # e.g. def foo(*args: tuple[int, ...]) -> treat as List[int]
                    args_of_tuple = get_args(ann)
                    if len(args_of_tuple) == 2 and args_of_tuple[1] is Ellipsis:
                        ann = list[args_of_tuple[0]]  # type: ignore
                    else:
                        ann = list[Any]
                else:
                    # If user wrote *args: int, treat as List[int]
                    ann = list[ann]  # type: ignore
    
                # Default factory to empty list
                fields[name] = (
                    ann,
                    Field(default_factory=list, description=field_description),  # type: ignore
                )
    
            elif param.kind == param.VAR_KEYWORD:
                # **kwargs handling
                if get_origin(ann) is dict:
                    # e.g. def foo(**kwargs: dict[str, int])
                    dict_args = get_args(ann)
                    if len(dict_args) == 2:
                        ann = dict[dict_args[0], dict_args[1]]  # type: ignore
                    else:
                        ann = dict[str, Any]
                else:
                    # e.g. def foo(**kwargs: int) -> Dict[str, int]
                    ann = dict[str, ann]  # type: ignore
    
                fields[name] = (
                    ann,
                    Field(default_factory=dict, description=field_description),  # type: ignore
                )
    
            else:
                # Normal parameter
                if default == inspect._empty:
                    # Required field
                    fields[name] = (
                        ann,
                        Field(..., description=field_description),
                    )
                else:
                    # Parameter with a default value
                    fields[name] = (
                        ann,
                        Field(default=default, description=field_description),
                    )
    
        # 3. Dynamically build a Pydantic model
        dynamic_model = create_model(f"{func_name}_args", __base__=BaseModel, **fields)
    
        # 4. Build JSON schema from that model
        json_schema = dynamic_model.model_json_schema()
        if strict_json_schema:
            json_schema = ensure_strict_json_schema(json_schema)
    
        # 5. Return as a FuncSchema dataclass
        return FuncSchema(
            name=func_name,
            description=description_override or doc_info.description if doc_info else None,
            params_pydantic_model=dynamic_model,
            params_json_schema=json_schema,
            signature=sig,
            takes_context=takes_context,
            strict_json_schema=strict_json_schema,
        )
      
  
---|---
