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
      * Agent output  [ Agent output  ](./) Table of contents 
        * agent_output 
        * AgentOutputSchemaBase 
          * is_plain_text 
          * name 
          * json_schema 
          * is_strict_json_schema 
          * validate_json 
        * AgentOutputSchema 
          * output_type 
          * __init__ 
          * is_plain_text 
          * is_strict_json_schema 
          * json_schema 
          * validate_json 
          * name 
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

  * agent_output 
  * AgentOutputSchemaBase 
    * is_plain_text 
    * name 
    * json_schema 
    * is_strict_json_schema 
    * validate_json 
  * AgentOutputSchema 
    * output_type 
    * __init__ 
    * is_plain_text 
    * is_strict_json_schema 
    * json_schema 
    * validate_json 
    * name 



# `Agent output`

###  AgentOutputSchemaBase

Bases: `ABC`

An object that captures the JSON schema of the output, as well as validating/parsing JSON produced by the LLM into the output type.

Source code in `src/agents/agent_output.py`
    
    
    16
    17
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

| 
    
    
    class AgentOutputSchemaBase(abc.ABC):
        """An object that captures the JSON schema of the output, as well as validating/parsing JSON
        produced by the LLM into the output type.
        """
    
        @abc.abstractmethod
        def is_plain_text(self) -> bool:
            """Whether the output type is plain text (versus a JSON object)."""
            pass
    
        @abc.abstractmethod
        def name(self) -> str:
            """The name of the output type."""
            pass
    
        @abc.abstractmethod
        def json_schema(self) -> dict[str, Any]:
            """Returns the JSON schema of the output. Will only be called if the output type is not
            plain text.
            """
            pass
    
        @abc.abstractmethod
        def is_strict_json_schema(self) -> bool:
            """Whether the JSON schema is in strict mode. Strict mode constrains the JSON schema
            features, but guarantees valis JSON. See here for details:
            https://platform.openai.com/docs/guides/structured-outputs#supported-schemas
            """
            pass
    
        @abc.abstractmethod
        def validate_json(self, json_str: str) -> Any:
            """Validate a JSON string against the output type. You must return the validated object,
            or raise a `ModelBehaviorError` if the JSON is invalid.
            """
            pass
      
  
---|---  
  
####  is_plain_text `abstractmethod`
    
    
    is_plain_text() -> bool
    

Whether the output type is plain text (versus a JSON object).

Source code in `src/agents/agent_output.py`
    
    
    21
    22
    23
    24

| 
    
    
    @abc.abstractmethod
    def is_plain_text(self) -> bool:
        """Whether the output type is plain text (versus a JSON object)."""
        pass
      
  
---|---  
  
####  name `abstractmethod`
    
    
    name() -> str
    

The name of the output type.

Source code in `src/agents/agent_output.py`
    
    
    26
    27
    28
    29

| 
    
    
    @abc.abstractmethod
    def name(self) -> str:
        """The name of the output type."""
        pass
      
  
---|---  
  
####  json_schema `abstractmethod`
    
    
    json_schema() -> dict[str, Any]
    

Returns the JSON schema of the output. Will only be called if the output type is not plain text.

Source code in `src/agents/agent_output.py`
    
    
    31
    32
    33
    34
    35
    36

| 
    
    
    @abc.abstractmethod
    def json_schema(self) -> dict[str, Any]:
        """Returns the JSON schema of the output. Will only be called if the output type is not
        plain text.
        """
        pass
      
  
---|---  
  
####  is_strict_json_schema `abstractmethod`
    
    
    is_strict_json_schema() -> bool
    

Whether the JSON schema is in strict mode. Strict mode constrains the JSON schema features, but guarantees valis JSON. See here for details: https://platform.openai.com/docs/guides/structured-outputs#supported-schemas

Source code in `src/agents/agent_output.py`
    
    
    38
    39
    40
    41
    42
    43
    44

| 
    
    
    @abc.abstractmethod
    def is_strict_json_schema(self) -> bool:
        """Whether the JSON schema is in strict mode. Strict mode constrains the JSON schema
        features, but guarantees valis JSON. See here for details:
        https://platform.openai.com/docs/guides/structured-outputs#supported-schemas
        """
        pass
      
  
---|---  
  
####  validate_json `abstractmethod`
    
    
    validate_json(json_str: str) -> Any
    

Validate a JSON string against the output type. You must return the validated object, or raise a `ModelBehaviorError` if the JSON is invalid.

Source code in `src/agents/agent_output.py`
    
    
    46
    47
    48
    49
    50
    51

| 
    
    
    @abc.abstractmethod
    def validate_json(self, json_str: str) -> Any:
        """Validate a JSON string against the output type. You must return the validated object,
        or raise a `ModelBehaviorError` if the JSON is invalid.
        """
        pass
      
  
---|---  
  
###  AgentOutputSchema `dataclass`

Bases: `AgentOutputSchemaBase`

An object that captures the JSON schema of the output, as well as validating/parsing JSON produced by the LLM into the output type.

Source code in `src/agents/agent_output.py`
    
    
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

| 
    
    
    @dataclass(init=False)
    class AgentOutputSchema(AgentOutputSchemaBase):
        """An object that captures the JSON schema of the output, as well as validating/parsing JSON
        produced by the LLM into the output type.
        """
    
        output_type: type[Any]
        """The type of the output."""
    
        _type_adapter: TypeAdapter[Any]
        """A type adapter that wraps the output type, so that we can validate JSON."""
    
        _is_wrapped: bool
        """Whether the output type is wrapped in a dictionary. This is generally done if the base
        output type cannot be represented as a JSON Schema object.
        """
    
        _output_schema: dict[str, Any]
        """The JSON schema of the output."""
    
        _strict_json_schema: bool
        """Whether the JSON schema is in strict mode. We **strongly** recommend setting this to True,
        as it increases the likelihood of correct JSON input.
        """
    
        def __init__(self, output_type: type[Any], strict_json_schema: bool = True):
            """
            Args:
                output_type: The type of the output.
                strict_json_schema: Whether the JSON schema is in strict mode. We **strongly** recommend
                    setting this to True, as it increases the likelihood of correct JSON input.
            """
            self.output_type = output_type
            self._strict_json_schema = strict_json_schema
    
            if output_type is None or output_type is str:
                self._is_wrapped = False
                self._type_adapter = TypeAdapter(output_type)
                self._output_schema = self._type_adapter.json_schema()
                return
    
            # We should wrap for things that are not plain text, and for things that would definitely
            # not be a JSON Schema object.
            self._is_wrapped = not _is_subclass_of_base_model_or_dict(output_type)
    
            if self._is_wrapped:
                OutputType = TypedDict(
                    "OutputType",
                    {
                        _WRAPPER_DICT_KEY: output_type,  # type: ignore
                    },
                )
                self._type_adapter = TypeAdapter(OutputType)
                self._output_schema = self._type_adapter.json_schema()
            else:
                self._type_adapter = TypeAdapter(output_type)
                self._output_schema = self._type_adapter.json_schema()
    
            if self._strict_json_schema:
                try:
                    self._output_schema = ensure_strict_json_schema(self._output_schema)
                except UserError as e:
                    raise UserError(
                        "Strict JSON schema is enabled, but the output type is not valid. "
                        "Either make the output type strict, or pass output_schema_strict=False to "
                        "your Agent()"
                    ) from e
    
        def is_plain_text(self) -> bool:
            """Whether the output type is plain text (versus a JSON object)."""
            return self.output_type is None or self.output_type is str
    
        def is_strict_json_schema(self) -> bool:
            """Whether the JSON schema is in strict mode."""
            return self._strict_json_schema
    
        def json_schema(self) -> dict[str, Any]:
            """The JSON schema of the output type."""
            if self.is_plain_text():
                raise UserError("Output type is plain text, so no JSON schema is available")
            return self._output_schema
    
        def validate_json(self, json_str: str) -> Any:
            """Validate a JSON string against the output type. Returns the validated object, or raises
            a `ModelBehaviorError` if the JSON is invalid.
            """
            validated = _json.validate_json(json_str, self._type_adapter, partial=False)
            if self._is_wrapped:
                if not isinstance(validated, dict):
                    _error_tracing.attach_error_to_current_span(
                        SpanError(
                            message="Invalid JSON",
                            data={"details": f"Expected a dict, got {type(validated)}"},
                        )
                    )
                    raise ModelBehaviorError(
                        f"Expected a dict, got {type(validated)} for JSON: {json_str}"
                    )
    
                if _WRAPPER_DICT_KEY not in validated:
                    _error_tracing.attach_error_to_current_span(
                        SpanError(
                            message="Invalid JSON",
                            data={"details": f"Could not find key {_WRAPPER_DICT_KEY} in JSON"},
                        )
                    )
                    raise ModelBehaviorError(
                        f"Could not find key {_WRAPPER_DICT_KEY} in JSON: {json_str}"
                    )
                return validated[_WRAPPER_DICT_KEY]
            return validated
    
        def name(self) -> str:
            """The name of the output type."""
            return _type_to_str(self.output_type)
      
  
---|---  
  
####  output_type `instance-attribute`
    
    
    output_type: type[Any] = output_type
    

The type of the output.

####  __init__
    
    
    __init__(
        output_type: type[Any], strict_json_schema: bool = True
    )
    

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`output_type` |  `type[Any]` |  The type of the output. |  _required_  
`strict_json_schema` |  `bool` |  Whether the JSON schema is in strict mode. We **strongly** recommend setting this to True, as it increases the likelihood of correct JSON input. |  `True`  
Source code in `src/agents/agent_output.py`
    
    
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

| 
    
    
    def __init__(self, output_type: type[Any], strict_json_schema: bool = True):
        """
        Args:
            output_type: The type of the output.
            strict_json_schema: Whether the JSON schema is in strict mode. We **strongly** recommend
                setting this to True, as it increases the likelihood of correct JSON input.
        """
        self.output_type = output_type
        self._strict_json_schema = strict_json_schema
    
        if output_type is None or output_type is str:
            self._is_wrapped = False
            self._type_adapter = TypeAdapter(output_type)
            self._output_schema = self._type_adapter.json_schema()
            return
    
        # We should wrap for things that are not plain text, and for things that would definitely
        # not be a JSON Schema object.
        self._is_wrapped = not _is_subclass_of_base_model_or_dict(output_type)
    
        if self._is_wrapped:
            OutputType = TypedDict(
                "OutputType",
                {
                    _WRAPPER_DICT_KEY: output_type,  # type: ignore
                },
            )
            self._type_adapter = TypeAdapter(OutputType)
            self._output_schema = self._type_adapter.json_schema()
        else:
            self._type_adapter = TypeAdapter(output_type)
            self._output_schema = self._type_adapter.json_schema()
    
        if self._strict_json_schema:
            try:
                self._output_schema = ensure_strict_json_schema(self._output_schema)
            except UserError as e:
                raise UserError(
                    "Strict JSON schema is enabled, but the output type is not valid. "
                    "Either make the output type strict, or pass output_schema_strict=False to "
                    "your Agent()"
                ) from e
      
  
---|---  
  
####  is_plain_text
    
    
    is_plain_text() -> bool
    

Whether the output type is plain text (versus a JSON object).

Source code in `src/agents/agent_output.py`
    
    
    122
    123
    124

| 
    
    
    def is_plain_text(self) -> bool:
        """Whether the output type is plain text (versus a JSON object)."""
        return self.output_type is None or self.output_type is str
      
  
---|---  
  
####  is_strict_json_schema
    
    
    is_strict_json_schema() -> bool
    

Whether the JSON schema is in strict mode.

Source code in `src/agents/agent_output.py`
    
    
    126
    127
    128

| 
    
    
    def is_strict_json_schema(self) -> bool:
        """Whether the JSON schema is in strict mode."""
        return self._strict_json_schema
      
  
---|---  
  
####  json_schema
    
    
    json_schema() -> dict[str, Any]
    

The JSON schema of the output type.

Source code in `src/agents/agent_output.py`
    
    
    130
    131
    132
    133
    134

| 
    
    
    def json_schema(self) -> dict[str, Any]:
        """The JSON schema of the output type."""
        if self.is_plain_text():
            raise UserError("Output type is plain text, so no JSON schema is available")
        return self._output_schema
      
  
---|---  
  
####  validate_json
    
    
    validate_json(json_str: str) -> Any
    

Validate a JSON string against the output type. Returns the validated object, or raises a `ModelBehaviorError` if the JSON is invalid.

Source code in `src/agents/agent_output.py`
    
    
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

| 
    
    
    def validate_json(self, json_str: str) -> Any:
        """Validate a JSON string against the output type. Returns the validated object, or raises
        a `ModelBehaviorError` if the JSON is invalid.
        """
        validated = _json.validate_json(json_str, self._type_adapter, partial=False)
        if self._is_wrapped:
            if not isinstance(validated, dict):
                _error_tracing.attach_error_to_current_span(
                    SpanError(
                        message="Invalid JSON",
                        data={"details": f"Expected a dict, got {type(validated)}"},
                    )
                )
                raise ModelBehaviorError(
                    f"Expected a dict, got {type(validated)} for JSON: {json_str}"
                )
    
            if _WRAPPER_DICT_KEY not in validated:
                _error_tracing.attach_error_to_current_span(
                    SpanError(
                        message="Invalid JSON",
                        data={"details": f"Could not find key {_WRAPPER_DICT_KEY} in JSON"},
                    )
                )
                raise ModelBehaviorError(
                    f"Could not find key {_WRAPPER_DICT_KEY} in JSON: {json_str}"
                )
            return validated[_WRAPPER_DICT_KEY]
        return validated
      
  
---|---  
  
####  name
    
    
    name() -> str
    

The name of the output type.

Source code in `src/agents/agent_output.py`
    
    
    166
    167
    168

| 
    
    
    def name(self) -> str:
        """The name of the output type."""
        return _type_to_str(self.output_type)
      
  
---|---
