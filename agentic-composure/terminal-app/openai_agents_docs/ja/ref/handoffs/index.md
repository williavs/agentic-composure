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

  * handoffs 
  * HandoffInputFilter 
  * HandoffInputData 
    * input_history 
    * pre_handoff_items 
    * new_items 
  * Handoff 
    * tool_name 
    * tool_description 
    * input_json_schema 
    * on_invoke_handoff 
    * agent_name 
    * input_filter 
    * strict_json_schema 
  * handoff 



# `Handoffs`

###  HandoffInputFilter `module-attribute`
    
    
    HandoffInputFilter: TypeAlias = Callable[
        [[HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")], [HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")
    ]
    

A function that filters the input data passed to the next agent.

###  HandoffInputData `dataclass`

Source code in `src/agents/handoffs.py`
    
    
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

| 
    
    
    @dataclass(frozen=True)
    class HandoffInputData:
        input_history: str | tuple[TResponseInputItem, ...]
        """
        The input history before `Runner.run()` was called.
        """
    
        pre_handoff_items: tuple[RunItem, ...]
        """
        The items generated before the agent turn where the handoff was invoked.
        """
    
        new_items: tuple[RunItem, ...]
        """
        The new items generated during the current agent turn, including the item that triggered the
        handoff and the tool output message representing the response from the handoff output.
        """
      
  
---|---  
  
####  input_history `instance-attribute`
    
    
    input_history: str | tuple[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)"), ...]
    

The input history before `Runner.run()` was called.

####  pre_handoff_items `instance-attribute`
    
    
    pre_handoff_items: tuple[[RunItem](../../../ref/items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)"), ...]
    

The items generated before the agent turn where the handoff was invoked.

####  new_items `instance-attribute`
    
    
    new_items: tuple[[RunItem](../../../ref/items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)"), ...]
    

The new items generated during the current agent turn, including the item that triggered the handoff and the tool output message representing the response from the handoff output.

###  Handoff `dataclass`

Bases: `Generic[TContext]`

A handoff is when an agent delegates a task to another agent. For example, in a customer support scenario you might have a "triage agent" that determines which agent should handle the user's request, and sub-agents that specialize in different areas like billing, account management, etc.

Source code in `src/agents/handoffs.py`
    
    
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

| 
    
    
    @dataclass
    class Handoff(Generic[TContext]):
        """A handoff is when an agent delegates a task to another agent.
        For example, in a customer support scenario you might have a "triage agent" that determines
        which agent should handle the user's request, and sub-agents that specialize in different
        areas like billing, account management, etc.
        """
    
        tool_name: str
        """The name of the tool that represents the handoff."""
    
        tool_description: str
        """The description of the tool that represents the handoff."""
    
        input_json_schema: dict[str, Any]
        """The JSON schema for the handoff input. Can be empty if the handoff does not take an input.
        """
    
        on_invoke_handoff: Callable[[RunContextWrapper[Any], str], Awaitable[Agent[TContext]]]
        """The function that invokes the handoff. The parameters passed are:
        1. The handoff run context
        2. The arguments from the LLM, as a JSON string. Empty string if input_json_schema is empty.
    
        Must return an agent.
        """
    
        agent_name: str
        """The name of the agent that is being handed off to."""
    
        input_filter: HandoffInputFilter | None = None
        """A function that filters the inputs that are passed to the next agent. By default, the new
        agent sees the entire conversation history. In some cases, you may want to filter inputs e.g.
        to remove older inputs, or remove tools from existing inputs.
    
        The function will receive the entire conversation history so far, including the input item
        that triggered the handoff and a tool call output item representing the handoff tool's output.
    
        You are free to modify the input history or new items as you see fit. The next agent that
        runs will receive `handoff_input_data.all_items`.
    
        IMPORTANT: in streaming mode, we will not stream anything as a result of this function. The
        items generated before will already have been streamed.
        """
    
        strict_json_schema: bool = True
        """Whether the input JSON schema is in strict mode. We **strongly** recommend setting this to
        True, as it increases the likelihood of correct JSON input.
        """
    
        def get_transfer_message(self, agent: Agent[Any]) -> str:
            base = f"{{'assistant': '{agent.name}'}}"
            return base
    
        @classmethod
        def default_tool_name(cls, agent: Agent[Any]) -> str:
            return _transforms.transform_string_function_style(f"transfer_to_{agent.name}")
    
        @classmethod
        def default_tool_description(cls, agent: Agent[Any]) -> str:
            return (
                f"Handoff to the {agent.name} agent to handle the request. "
                f"{agent.handoff_description or ''}"
            )
      
  
---|---  
  
####  tool_name `instance-attribute`
    
    
    tool_name: str
    

The name of the tool that represents the handoff.

####  tool_description `instance-attribute`
    
    
    tool_description: str
    

The description of the tool that represents the handoff.

####  input_json_schema `instance-attribute`
    
    
    input_json_schema: dict[str, Any]
    

The JSON schema for the handoff input. Can be empty if the handoff does not take an input.

####  on_invoke_handoff `instance-attribute`
    
    
    on_invoke_handoff: Callable[
        [[RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any], str],
        Awaitable[[Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext]],
    ]
    

The function that invokes the handoff. The parameters passed are: 1\. The handoff run context 2\. The arguments from the LLM, as a JSON string. Empty string if input_json_schema is empty.

Must return an agent.

####  agent_name `instance-attribute`
    
    
    agent_name: str
    

The name of the agent that is being handed off to.

####  input_filter `class-attribute` `instance-attribute`
    
    
    input_filter: [HandoffInputFilter](../../../ref/handoffs/#agents.handoffs.HandoffInputFilter "HandoffInputFilter
    
    
      
          module-attribute
       \(agents.handoffs.HandoffInputFilter\)") | None = None
    

A function that filters the inputs that are passed to the next agent. By default, the new agent sees the entire conversation history. In some cases, you may want to filter inputs e.g. to remove older inputs, or remove tools from existing inputs.

The function will receive the entire conversation history so far, including the input item that triggered the handoff and a tool call output item representing the handoff tool's output.

You are free to modify the input history or new items as you see fit. The next agent that runs will receive `handoff_input_data.all_items`.

IMPORTANT: in streaming mode, we will not stream anything as a result of this function. The items generated before will already have been streamed.

####  strict_json_schema `class-attribute` `instance-attribute`
    
    
    strict_json_schema: bool = True
    

Whether the input JSON schema is in strict mode. We **strongly** recommend setting this to True, as it increases the likelihood of correct JSON input.

###  handoff
    
    
    handoff(
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        *,
        tool_name_override: str | None = None,
        tool_description_override: str | None = None,
        input_filter: Callable[
            [[HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")], [HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")
        ]
        | None = None,
    ) -> [Handoff](../../../ref/handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")[TContext]
    
    
    
    handoff(
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        *,
        on_handoff: OnHandoffWithInput[THandoffInput],
        input_type: type[THandoffInput],
        tool_description_override: str | None = None,
        tool_name_override: str | None = None,
        input_filter: Callable[
            [[HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")], [HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")
        ]
        | None = None,
    ) -> [Handoff](../../../ref/handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")[TContext]
    
    
    
    handoff(
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        *,
        on_handoff: OnHandoffWithoutInput,
        tool_description_override: str | None = None,
        tool_name_override: str | None = None,
        input_filter: Callable[
            [[HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")], [HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")
        ]
        | None = None,
    ) -> [Handoff](../../../ref/handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")[TContext]
    
    
    
    handoff(
        agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        tool_name_override: str | None = None,
        tool_description_override: str | None = None,
        on_handoff: OnHandoffWithInput[THandoffInput]
        | OnHandoffWithoutInput
        | None = None,
        input_type: type[THandoffInput] | None = None,
        input_filter: Callable[
            [[HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")], [HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData
    
    
      
          dataclass
       \(agents.handoffs.HandoffInputData\)")
        ]
        | None = None,
    ) -> [Handoff](../../../ref/handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")[TContext]
    

Create a handoff from an agent.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`agent` |  `[Agent](../../../ref/agent/#agents.agent.Agent "Agent


  
      dataclass
   \(agents.agent.Agent\)")[TContext]` |  The agent to handoff to, or a function that returns an agent. |  _required_  
`tool_name_override` |  `str | None` |  Optional override for the name of the tool that represents the handoff. |  `None`  
`tool_description_override` |  `str | None` |  Optional override for the description of the tool that represents the handoff. |  `None`  
`on_handoff` |  `OnHandoffWithInput[THandoffInput] | OnHandoffWithoutInput | None` |  A function that runs when the handoff is invoked. |  `None`  
`input_type` |  `type[THandoffInput] | None` |  the type of the input to the handoff. If provided, the input will be validated against this type. Only relevant if you pass a function that takes an input. |  `None`  
`input_filter` |  `Callable[[[HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData


  
      dataclass
   \(agents.handoffs.HandoffInputData\)")], [HandoffInputData](../../../ref/handoffs/#agents.handoffs.HandoffInputData "HandoffInputData


  
      dataclass
   \(agents.handoffs.HandoffInputData\)")] | None` |  a function that filters the inputs that are passed to the next agent. |  `None`  
Source code in `src/agents/handoffs.py`
    
    
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

| 
    
    
    def handoff(
        agent: Agent[TContext],
        tool_name_override: str | None = None,
        tool_description_override: str | None = None,
        on_handoff: OnHandoffWithInput[THandoffInput] | OnHandoffWithoutInput | None = None,
        input_type: type[THandoffInput] | None = None,
        input_filter: Callable[[HandoffInputData], HandoffInputData] | None = None,
    ) -> Handoff[TContext]:
        """Create a handoff from an agent.
    
        Args:
            agent: The agent to handoff to, or a function that returns an agent.
            tool_name_override: Optional override for the name of the tool that represents the handoff.
            tool_description_override: Optional override for the description of the tool that
                represents the handoff.
            on_handoff: A function that runs when the handoff is invoked.
            input_type: the type of the input to the handoff. If provided, the input will be validated
                against this type. Only relevant if you pass a function that takes an input.
            input_filter: a function that filters the inputs that are passed to the next agent.
        """
        assert (on_handoff and input_type) or not (on_handoff and input_type), (
            "You must provide either both on_input and input_type, or neither"
        )
        type_adapter: TypeAdapter[Any] | None
        if input_type is not None:
            assert callable(on_handoff), "on_handoff must be callable"
            sig = inspect.signature(on_handoff)
            if len(sig.parameters) != 2:
                raise UserError("on_handoff must take two arguments: context and input")
    
            type_adapter = TypeAdapter(input_type)
            input_json_schema = type_adapter.json_schema()
        else:
            type_adapter = None
            input_json_schema = {}
            if on_handoff is not None:
                sig = inspect.signature(on_handoff)
                if len(sig.parameters) != 1:
                    raise UserError("on_handoff must take one argument: context")
    
        async def _invoke_handoff(
            ctx: RunContextWrapper[Any], input_json: str | None = None
        ) -> Agent[Any]:
            if input_type is not None and type_adapter is not None:
                if input_json is None:
                    _error_tracing.attach_error_to_current_span(
                        SpanError(
                            message="Handoff function expected non-null input, but got None",
                            data={"details": "input_json is None"},
                        )
                    )
                    raise ModelBehaviorError("Handoff function expected non-null input, but got None")
    
                validated_input = _json.validate_json(
                    json_str=input_json,
                    type_adapter=type_adapter,
                    partial=False,
                )
                input_func = cast(OnHandoffWithInput[THandoffInput], on_handoff)
                if inspect.iscoroutinefunction(input_func):
                    await input_func(ctx, validated_input)
                else:
                    input_func(ctx, validated_input)
            elif on_handoff is not None:
                no_input_func = cast(OnHandoffWithoutInput, on_handoff)
                if inspect.iscoroutinefunction(no_input_func):
                    await no_input_func(ctx)
                else:
                    no_input_func(ctx)
    
            return agent
    
        tool_name = tool_name_override or Handoff.default_tool_name(agent)
        tool_description = tool_description_override or Handoff.default_tool_description(agent)
    
        # Always ensure the input JSON schema is in strict mode
        # If there is a need, we can make this configurable in the future
        input_json_schema = ensure_strict_json_schema(input_json_schema)
    
        return Handoff(
            tool_name=tool_name,
            tool_description=tool_description,
            input_json_schema=input_json_schema,
            on_invoke_handoff=_invoke_handoff,
            input_filter=input_filter,
            agent_name=agent.name,
        )
      
  
---|---
