[ ![logo](../../../assets/logo.svg) ](../../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../../)
  * [ クイックスタート  ](../../quickstart/)
  * [ コード例  ](../../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../../agents/)
    * [ エージェントの実行  ](../../running_agents/)
    * [ 結果  ](../../results/)
    * [ ストリーミング  ](../../streaming/)
    * [ ツール  ](../../tools/)
    * [ Model context protocol (MCP)  ](../../mcp/)
    * [ ハンドオフ  ](../../handoffs/)
    * [ トレーシング  ](../../tracing/)
    * [ コンテキスト管理  ](../../context/)
    * [ ガードレール  ](../../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../../models/)
      * [ LiteLLM 経由でのモデル利用  ](../../models/litellm/)
    * [ SDK の設定  ](../../config/)
    * [ エージェントの可視化  ](../../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../../voice/pipeline/)
      * [ トレーシング  ](../../voice/tracing/)



目次 

  * model_settings 
  * ModelSettings 
    * temperature 
    * top_p 
    * frequency_penalty 
    * presence_penalty 
    * tool_choice 
    * parallel_tool_calls 
    * truncation 
    * max_tokens 
    * reasoning 
    * metadata 
    * store 
    * include_usage 
    * extra_query 
    * extra_body 
    * extra_headers 
    * resolve 



# `Model settings`

###  ModelSettings `dataclass`

Settings to use when calling an LLM.

This class holds optional model configuration parameters (e.g. temperature, top_p, penalties, truncation, etc.).

Not all models/providers support all of these parameters, so please check the API documentation for the specific model and provider you are using.

Source code in `src/agents/model_settings.py`
    
    
     12
     13
     14
     15
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

| 
    
    
    @dataclass
    class ModelSettings:
        """Settings to use when calling an LLM.
    
        This class holds optional model configuration parameters (e.g. temperature,
        top_p, penalties, truncation, etc.).
    
        Not all models/providers support all of these parameters, so please check the API documentation
        for the specific model and provider you are using.
        """
    
        temperature: float | None = None
        """The temperature to use when calling the model."""
    
        top_p: float | None = None
        """The top_p to use when calling the model."""
    
        frequency_penalty: float | None = None
        """The frequency penalty to use when calling the model."""
    
        presence_penalty: float | None = None
        """The presence penalty to use when calling the model."""
    
        tool_choice: Literal["auto", "required", "none"] | str | None = None
        """The tool choice to use when calling the model."""
    
        parallel_tool_calls: bool | None = None
        """Whether to use parallel tool calls when calling the model.
        Defaults to False if not provided."""
    
        truncation: Literal["auto", "disabled"] | None = None
        """The truncation strategy to use when calling the model."""
    
        max_tokens: int | None = None
        """The maximum number of output tokens to generate."""
    
        reasoning: Reasoning | None = None
        """Configuration options for
        [reasoning models](https://platform.openai.com/docs/guides/reasoning).
        """
    
        metadata: dict[str, str] | None = None
        """Metadata to include with the model response call."""
    
        store: bool | None = None
        """Whether to store the generated model response for later retrieval.
        Defaults to True if not provided."""
    
        include_usage: bool | None = None
        """Whether to include usage chunk.
        Defaults to True if not provided."""
    
        extra_query: Query | None = None
        """Additional query fields to provide with the request.
        Defaults to None if not provided."""
    
        extra_body: Body | None = None
        """Additional body fields to provide with the request.
        Defaults to None if not provided."""
    
        extra_headers: Headers | None = None
        """Additional headers to provide with the request.
        Defaults to None if not provided."""
    
        def resolve(self, override: ModelSettings | None) -> ModelSettings:
            """Produce a new ModelSettings by overlaying any non-None values from the
            override on top of this instance."""
            if override is None:
                return self
    
            changes = {
                field.name: getattr(override, field.name)
                for field in fields(self)
                if getattr(override, field.name) is not None
            }
            return replace(self, **changes)
    
        def to_json_dict(self) -> dict[str, Any]:
            dataclass_dict = dataclasses.asdict(self)
    
            json_dict: dict[str, Any] = {}
    
            for field_name, value in dataclass_dict.items():
                if isinstance(value, BaseModel):
                    json_dict[field_name] = value.model_dump(mode="json")
                else:
                    json_dict[field_name] = value
    
            return json_dict
      
  
---|---  
  
####  temperature `class-attribute` `instance-attribute`
    
    
    temperature: float | None = None
    

The temperature to use when calling the model.

####  top_p `class-attribute` `instance-attribute`
    
    
    top_p: float | None = None
    

The top_p to use when calling the model.

####  frequency_penalty `class-attribute` `instance-attribute`
    
    
    frequency_penalty: float | None = None
    

The frequency penalty to use when calling the model.

####  presence_penalty `class-attribute` `instance-attribute`
    
    
    presence_penalty: float | None = None
    

The presence penalty to use when calling the model.

####  tool_choice `class-attribute` `instance-attribute`
    
    
    tool_choice: (
        Literal["auto", "required", "none"] | str | None
    ) = None
    

The tool choice to use when calling the model.

####  parallel_tool_calls `class-attribute` `instance-attribute`
    
    
    parallel_tool_calls: bool | None = None
    

Whether to use parallel tool calls when calling the model. Defaults to False if not provided.

####  truncation `class-attribute` `instance-attribute`
    
    
    truncation: Literal['auto', 'disabled'] | None = None
    

The truncation strategy to use when calling the model.

####  max_tokens `class-attribute` `instance-attribute`
    
    
    max_tokens: int | None = None
    

The maximum number of output tokens to generate.

####  reasoning `class-attribute` `instance-attribute`
    
    
    reasoning: Reasoning | None = None
    

Configuration options for [reasoning models](https://platform.openai.com/docs/guides/reasoning).

####  metadata `class-attribute` `instance-attribute`
    
    
    metadata: dict[str, str] | None = None
    

Metadata to include with the model response call.

####  store `class-attribute` `instance-attribute`
    
    
    store: bool | None = None
    

Whether to store the generated model response for later retrieval. Defaults to True if not provided.

####  include_usage `class-attribute` `instance-attribute`
    
    
    include_usage: bool | None = None
    

Whether to include usage chunk. Defaults to True if not provided.

####  extra_query `class-attribute` `instance-attribute`
    
    
    extra_query: Query | None = None
    

Additional query fields to provide with the request. Defaults to None if not provided.

####  extra_body `class-attribute` `instance-attribute`
    
    
    extra_body: Body | None = None
    

Additional body fields to provide with the request. Defaults to None if not provided.

####  extra_headers `class-attribute` `instance-attribute`
    
    
    extra_headers: Headers | None = None
    

Additional headers to provide with the request. Defaults to None if not provided.

####  resolve
    
    
    resolve(override: [ModelSettings](../../../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)") | None) -> [ModelSettings](../../../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)")
    

Produce a new ModelSettings by overlaying any non-None values from the override on top of this instance.

Source code in `src/agents/model_settings.py`
    
    
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

| 
    
    
    def resolve(self, override: ModelSettings | None) -> ModelSettings:
        """Produce a new ModelSettings by overlaying any non-None values from the
        override on top of this instance."""
        if override is None:
            return self
    
        changes = {
            field.name: getattr(override, field.name)
            for field in fields(self)
            if getattr(override, field.name) is not None
        }
        return replace(self, **changes)
      
  
---|---
