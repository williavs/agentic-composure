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

  * interface 
  * ModelTracing 
    * DISABLED 
    * ENABLED 
    * ENABLED_WITHOUT_DATA 
  * Model 
    * get_response 
    * stream_response 
  * ModelProvider 
    * get_model 



# `Model interface`

###  ModelTracing

Bases: `Enum`

Source code in `src/agents/models/interface.py`
    
    
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

| 
    
    
    class ModelTracing(enum.Enum):
        DISABLED = 0
        """Tracing is disabled entirely."""
    
        ENABLED = 1
        """Tracing is enabled, and all data is included."""
    
        ENABLED_WITHOUT_DATA = 2
        """Tracing is enabled, but inputs/outputs are not included."""
    
        def is_disabled(self) -> bool:
            return self == ModelTracing.DISABLED
    
        def include_data(self) -> bool:
            return self == ModelTracing.ENABLED
      
  
---|---  
  
####  DISABLED `class-attribute` `instance-attribute`
    
    
    DISABLED = 0
    

Tracing is disabled entirely.

####  ENABLED `class-attribute` `instance-attribute`
    
    
    ENABLED = 1
    

Tracing is enabled, and all data is included.

####  ENABLED_WITHOUT_DATA `class-attribute` `instance-attribute`
    
    
    ENABLED_WITHOUT_DATA = 2
    

Tracing is enabled, but inputs/outputs are not included.

###  Model

Bases: `ABC`

The base interface for calling an LLM.

Source code in `src/agents/models/interface.py`
    
    
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

| 
    
    
    class Model(abc.ABC):
        """The base interface for calling an LLM."""
    
        @abc.abstractmethod
        async def get_response(
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
        ) -> ModelResponse:
            """Get a response from the model.
    
            Args:
                system_instructions: The system instructions to use.
                input: The input items to the model, in OpenAI Responses format.
                model_settings: The model settings to use.
                tools: The tools available to the model.
                output_schema: The output schema to use.
                handoffs: The handoffs available to the model.
                tracing: Tracing configuration.
                previous_response_id: the ID of the previous response. Generally not used by the model,
                    except for the OpenAI Responses API.
    
            Returns:
                The full model response.
            """
            pass
    
        @abc.abstractmethod
        def stream_response(
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
            """Stream a response from the model.
    
            Args:
                system_instructions: The system instructions to use.
                input: The input items to the model, in OpenAI Responses format.
                model_settings: The model settings to use.
                tools: The tools available to the model.
                output_schema: The output schema to use.
                handoffs: The handoffs available to the model.
                tracing: Tracing configuration.
                previous_response_id: the ID of the previous response. Generally not used by the model,
                    except for the OpenAI Responses API.
    
            Returns:
                An iterator of response stream events, in OpenAI Responses format.
            """
            pass
      
  
---|---  
  
####  get_response `abstractmethod` `async`
    
    
    get_response(
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
        *,
        previous_response_id: str | None,
    ) -> [ModelResponse](../../../../ref/items/#agents.items.ModelResponse "ModelResponse
    
    
      
          dataclass
       \(agents.items.ModelResponse\)")
    

Get a response from the model.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`system_instructions` |  `str | None` |  The system instructions to use. |  _required_  
`input` |  `str | list[[TResponseInputItem](../../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem


  
      module-attribute
   \(agents.items.TResponseInputItem\)")]` |  The input items to the model, in OpenAI Responses format. |  _required_  
`model_settings` |  `[ModelSettings](../../../../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings


  
      dataclass
   \(agents.model_settings.ModelSettings\)")` |  The model settings to use. |  _required_  
`tools` |  `list[[Tool](../../../../ref/tool/#agents.tool.Tool "Tool


  
      module-attribute
   \(agents.tool.Tool\)")]` |  The tools available to the model. |  _required_  
`output_schema` |  `[AgentOutputSchemaBase](../../../../ref/agent_output/#agents.agent_output.AgentOutputSchemaBase "AgentOutputSchemaBase \(agents.agent_output.AgentOutputSchemaBase\)") | None` |  The output schema to use. |  _required_  
`handoffs` |  `list[[Handoff](../../../../ref/handoffs/#agents.handoffs.Handoff "Handoff


  
      dataclass
   \(agents.handoffs.Handoff\)")]` |  The handoffs available to the model. |  _required_  
`tracing` |  `[ModelTracing](../../../../ref/models/interface/#agents.models.interface.ModelTracing "ModelTracing \(agents.models.interface.ModelTracing\)")` |  Tracing configuration. |  _required_  
`previous_response_id` |  `str | None` |  the ID of the previous response. Generally not used by the model, except for the OpenAI Responses API. |  _required_  
  
Returns:

Type | Description  
---|---  
`[ModelResponse](../../../../ref/items/#agents.items.ModelResponse "ModelResponse


  
      dataclass
   \(agents.items.ModelResponse\)")` |  The full model response.  
Source code in `src/agents/models/interface.py`
    
    
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

| 
    
    
    @abc.abstractmethod
    async def get_response(
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
    ) -> ModelResponse:
        """Get a response from the model.
    
        Args:
            system_instructions: The system instructions to use.
            input: The input items to the model, in OpenAI Responses format.
            model_settings: The model settings to use.
            tools: The tools available to the model.
            output_schema: The output schema to use.
            handoffs: The handoffs available to the model.
            tracing: Tracing configuration.
            previous_response_id: the ID of the previous response. Generally not used by the model,
                except for the OpenAI Responses API.
    
        Returns:
            The full model response.
        """
        pass
      
  
---|---  
  
####  stream_response `abstractmethod`
    
    
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
        *,
        previous_response_id: str | None,
    ) -> AsyncIterator[[TResponseStreamEvent](../../../../ref/items/#agents.items.TResponseStreamEvent "TResponseStreamEvent
    
    
      
          module-attribute
       \(agents.items.TResponseStreamEvent\)")]
    

Stream a response from the model.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`system_instructions` |  `str | None` |  The system instructions to use. |  _required_  
`input` |  `str | list[[TResponseInputItem](../../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem


  
      module-attribute
   \(agents.items.TResponseInputItem\)")]` |  The input items to the model, in OpenAI Responses format. |  _required_  
`model_settings` |  `[ModelSettings](../../../../ref/model_settings/#agents.model_settings.ModelSettings "ModelSettings


  
      dataclass
   \(agents.model_settings.ModelSettings\)")` |  The model settings to use. |  _required_  
`tools` |  `list[[Tool](../../../../ref/tool/#agents.tool.Tool "Tool


  
      module-attribute
   \(agents.tool.Tool\)")]` |  The tools available to the model. |  _required_  
`output_schema` |  `[AgentOutputSchemaBase](../../../../ref/agent_output/#agents.agent_output.AgentOutputSchemaBase "AgentOutputSchemaBase \(agents.agent_output.AgentOutputSchemaBase\)") | None` |  The output schema to use. |  _required_  
`handoffs` |  `list[[Handoff](../../../../ref/handoffs/#agents.handoffs.Handoff "Handoff


  
      dataclass
   \(agents.handoffs.Handoff\)")]` |  The handoffs available to the model. |  _required_  
`tracing` |  `[ModelTracing](../../../../ref/models/interface/#agents.models.interface.ModelTracing "ModelTracing \(agents.models.interface.ModelTracing\)")` |  Tracing configuration. |  _required_  
`previous_response_id` |  `str | None` |  the ID of the previous response. Generally not used by the model, except for the OpenAI Responses API. |  _required_  
  
Returns:

Type | Description  
---|---  
`AsyncIterator[[TResponseStreamEvent](../../../../ref/items/#agents.items.TResponseStreamEvent "TResponseStreamEvent


  
      module-attribute
   \(agents.items.TResponseStreamEvent\)")]` |  An iterator of response stream events, in OpenAI Responses format.  
Source code in `src/agents/models/interface.py`
    
    
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

| 
    
    
    @abc.abstractmethod
    def stream_response(
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
        """Stream a response from the model.
    
        Args:
            system_instructions: The system instructions to use.
            input: The input items to the model, in OpenAI Responses format.
            model_settings: The model settings to use.
            tools: The tools available to the model.
            output_schema: The output schema to use.
            handoffs: The handoffs available to the model.
            tracing: Tracing configuration.
            previous_response_id: the ID of the previous response. Generally not used by the model,
                except for the OpenAI Responses API.
    
        Returns:
            An iterator of response stream events, in OpenAI Responses format.
        """
        pass
      
  
---|---  
  
###  ModelProvider

Bases: `ABC`

The base interface for a model provider.

Model provider is responsible for looking up Models by name.

Source code in `src/agents/models/interface.py`
    
    
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

| 
    
    
    class ModelProvider(abc.ABC):
        """The base interface for a model provider.
    
        Model provider is responsible for looking up Models by name.
        """
    
        @abc.abstractmethod
        def get_model(self, model_name: str | None) -> Model:
            """Get a model by name.
    
            Args:
                model_name: The name of the model to get.
    
            Returns:
                The model.
            """
      
  
---|---  
  
####  get_model `abstractmethod`
    
    
    get_model(model_name: str | None) -> [Model](../../../../ref/models/interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)")
    

Get a model by name.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`model_name` |  `str | None` |  The name of the model to get. |  _required_  
  
Returns:

Type | Description  
---|---  
`[Model](../../../../ref/models/interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)")` |  The model.  
Source code in `src/agents/models/interface.py`
    
    
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

| 
    
    
    @abc.abstractmethod
    def get_model(self, model_name: str | None) -> Model:
        """Get a model by name.
    
        Args:
            model_name: The name of the model to get.
    
        Returns:
            The model.
        """
      
  
---|---
