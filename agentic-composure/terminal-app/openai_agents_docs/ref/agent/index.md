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
      * Agents  [ Agents  ](./) Table of contents 
        * agent 
        * ToolsToFinalOutputFunction 
        * ToolsToFinalOutputResult 
          * is_final_output 
          * final_output 
        * StopAtTools 
          * stop_at_tool_names 
        * MCPConfig 
          * convert_schemas_to_strict 
        * Agent 
          * name 
          * instructions 
          * handoff_description 
          * handoffs 
          * model 
          * model_settings 
          * tools 
          * mcp_servers 
          * mcp_config 
          * input_guardrails 
          * output_guardrails 
          * output_type 
          * hooks 
          * tool_use_behavior 
          * reset_tool_choice 
          * clone 
          * as_tool 
          * get_system_prompt 
          * get_mcp_tools 
          * get_all_tools 
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

  * agent 
  * ToolsToFinalOutputFunction 
  * ToolsToFinalOutputResult 
    * is_final_output 
    * final_output 
  * StopAtTools 
    * stop_at_tool_names 
  * MCPConfig 
    * convert_schemas_to_strict 
  * Agent 
    * name 
    * instructions 
    * handoff_description 
    * handoffs 
    * model 
    * model_settings 
    * tools 
    * mcp_servers 
    * mcp_config 
    * input_guardrails 
    * output_guardrails 
    * output_type 
    * hooks 
    * tool_use_behavior 
    * reset_tool_choice 
    * clone 
    * as_tool 
    * get_system_prompt 
    * get_mcp_tools 
    * get_all_tools 



# `Agents`

###  ToolsToFinalOutputFunction `module-attribute`
    
    
    ToolsToFinalOutputFunction: TypeAlias = Callable[
        [[RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext], list[[FunctionToolResult](../tool/#agents.tool.FunctionToolResult "FunctionToolResult
    
    
      
          dataclass
       \(agents.tool.FunctionToolResult\)")]],
        MaybeAwaitable[ToolsToFinalOutputResult],
    ]
    

A function that takes a run context and a list of tool results, and returns a `ToolsToFinalOutputResult`.

###  ToolsToFinalOutputResult `dataclass`

Source code in `src/agents/agent.py`
    
    
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

| 
    
    
    @dataclass
    class ToolsToFinalOutputResult:
        is_final_output: bool
        """Whether this is the final output. If False, the LLM will run again and receive the tool call
        output.
        """
    
        final_output: Any | None = None
        """The final output. Can be None if `is_final_output` is False, otherwise must match the
        `output_type` of the agent.
        """
      
  
---|---  
  
####  is_final_output `instance-attribute`
    
    
    is_final_output: bool
    

Whether this is the final output. If False, the LLM will run again and receive the tool call output.

####  final_output `class-attribute` `instance-attribute`
    
    
    final_output: Any | None = None
    

The final output. Can be None if `is_final_output` is False, otherwise must match the `output_type` of the agent.

###  StopAtTools

Bases: `TypedDict`

Source code in `src/agents/agent.py`
    
    
    52
    53
    54

| 
    
    
    class StopAtTools(TypedDict):
        stop_at_tool_names: list[str]
        """A list of tool names, any of which will stop the agent from running further."""
      
  
---|---  
  
####  stop_at_tool_names `instance-attribute`
    
    
    stop_at_tool_names: list[str]
    

A list of tool names, any of which will stop the agent from running further.

###  MCPConfig

Bases: `TypedDict`

Configuration for MCP servers.

Source code in `src/agents/agent.py`
    
    
    57
    58
    59
    60
    61
    62
    63

| 
    
    
    class MCPConfig(TypedDict):
        """Configuration for MCP servers."""
    
        convert_schemas_to_strict: NotRequired[bool]
        """If True, we will attempt to convert the MCP schemas to strict-mode schemas. This is a
        best-effort conversion, so some schemas may not be convertible. Defaults to False.
        """
      
  
---|---  
  
####  convert_schemas_to_strict `instance-attribute`
    
    
    convert_schemas_to_strict: NotRequired[bool]
    

If True, we will attempt to convert the MCP schemas to strict-mode schemas. This is a best-effort conversion, so some schemas may not be convertible. Defaults to False.

###  Agent `dataclass`

Bases: `Generic[TContext]`

An agent is an AI model configured with instructions, tools, guardrails, handoffs and more.

We strongly recommend passing `instructions`, which is the "system prompt" for the agent. In addition, you can pass `handoff_description`, which is a human-readable description of the agent, used when the agent is used inside tools/handoffs.

Agents are generic on the context type. The context is a (mutable) object you create. It is passed to tool functions, handoffs, guardrails, etc.

Source code in `src/agents/agent.py`
    
    
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

| 
    
    
    @dataclass
    class Agent(Generic[TContext]):
        """An agent is an AI model configured with instructions, tools, guardrails, handoffs and more.
    
        We strongly recommend passing `instructions`, which is the "system prompt" for the agent. In
        addition, you can pass `handoff_description`, which is a human-readable description of the
        agent, used when the agent is used inside tools/handoffs.
    
        Agents are generic on the context type. The context is a (mutable) object you create. It is
        passed to tool functions, handoffs, guardrails, etc.
        """
    
        name: str
        """The name of the agent."""
    
        instructions: (
            str
            | Callable[
                [RunContextWrapper[TContext], Agent[TContext]],
                MaybeAwaitable[str],
            ]
            | None
        ) = None
        """The instructions for the agent. Will be used as the "system prompt" when this agent is
        invoked. Describes what the agent should do, and how it responds.
    
        Can either be a string, or a function that dynamically generates instructions for the agent. If
        you provide a function, it will be called with the context and the agent instance. It must
        return a string.
        """
    
        handoff_description: str | None = None
        """A description of the agent. This is used when the agent is used as a handoff, so that an
        LLM knows what it does and when to invoke it.
        """
    
        handoffs: list[Agent[Any] | Handoff[TContext]] = field(default_factory=list)
        """Handoffs are sub-agents that the agent can delegate to. You can provide a list of handoffs,
        and the agent can choose to delegate to them if relevant. Allows for separation of concerns and
        modularity.
        """
    
        model: str | Model | None = None
        """The model implementation to use when invoking the LLM.
    
        By default, if not set, the agent will use the default model configured in
        `openai_provider.DEFAULT_MODEL` (currently "gpt-4o").
        """
    
        model_settings: ModelSettings = field(default_factory=ModelSettings)
        """Configures model-specific tuning parameters (e.g. temperature, top_p).
        """
    
        tools: list[Tool] = field(default_factory=list)
        """A list of tools that the agent can use."""
    
        mcp_servers: list[MCPServer] = field(default_factory=list)
        """A list of [Model Context Protocol](https://modelcontextprotocol.io/) servers that
        the agent can use. Every time the agent runs, it will include tools from these servers in the
        list of available tools.
    
        NOTE: You are expected to manage the lifecycle of these servers. Specifically, you must call
        `server.connect()` before passing it to the agent, and `server.cleanup()` when the server is no
        longer needed.
        """
    
        mcp_config: MCPConfig = field(default_factory=lambda: MCPConfig())
        """Configuration for MCP servers."""
    
        input_guardrails: list[InputGuardrail[TContext]] = field(default_factory=list)
        """A list of checks that run in parallel to the agent's execution, before generating a
        response. Runs only if the agent is the first agent in the chain.
        """
    
        output_guardrails: list[OutputGuardrail[TContext]] = field(default_factory=list)
        """A list of checks that run on the final output of the agent, after generating a response.
        Runs only if the agent produces a final output.
        """
    
        output_type: type[Any] | AgentOutputSchemaBase | None = None
        """The type of the output object. If not provided, the output will be `str`. In most cases,
        you should pass a regular Python type (e.g. a dataclass, Pydantic model, TypedDict, etc).
        You can customize this in two ways:
        1. If you want non-strict schemas, pass `AgentOutputSchema(MyClass, strict_json_schema=False)`.
        2. If you want to use a custom JSON schema (i.e. without using the SDK's automatic schema)
           creation, subclass and pass an `AgentOutputSchemaBase` subclass.
        """
    
        hooks: AgentHooks[TContext] | None = None
        """A class that receives callbacks on various lifecycle events for this agent.
        """
    
        tool_use_behavior: (
            Literal["run_llm_again", "stop_on_first_tool"] | StopAtTools | ToolsToFinalOutputFunction
        ) = "run_llm_again"
        """This lets you configure how tool use is handled.
        - "run_llm_again": The default behavior. Tools are run, and then the LLM receives the results
            and gets to respond.
        - "stop_on_first_tool": The output of the first tool call is used as the final output. This
            means that the LLM does not process the result of the tool call.
        - A list of tool names: The agent will stop running if any of the tools in the list are called.
            The final output will be the output of the first matching tool call. The LLM does not
            process the result of the tool call.
        - A function: If you pass a function, it will be called with the run context and the list of
          tool results. It must return a `ToolToFinalOutputResult`, which determines whether the tool
          calls result in a final output.
    
          NOTE: This configuration is specific to FunctionTools. Hosted tools, such as file search,
          web search, etc are always processed by the LLM.
        """
    
        reset_tool_choice: bool = True
        """Whether to reset the tool choice to the default value after a tool has been called. Defaults
        to True. This ensures that the agent doesn't enter an infinite loop of tool usage."""
    
        def clone(self, **kwargs: Any) -> Agent[TContext]:
            """Make a copy of the agent, with the given arguments changed. For example, you could do:
            ```
            new_agent = agent.clone(instructions="New instructions")
            ```
            """
            return dataclasses.replace(self, **kwargs)
    
        def as_tool(
            self,
            tool_name: str | None,
            tool_description: str | None,
            custom_output_extractor: Callable[[RunResult], Awaitable[str]] | None = None,
        ) -> Tool:
            """Transform this agent into a tool, callable by other agents.
    
            This is different from handoffs in two ways:
            1. In handoffs, the new agent receives the conversation history. In this tool, the new agent
               receives generated input.
            2. In handoffs, the new agent takes over the conversation. In this tool, the new agent is
               called as a tool, and the conversation is continued by the original agent.
    
            Args:
                tool_name: The name of the tool. If not provided, the agent's name will be used.
                tool_description: The description of the tool, which should indicate what it does and
                    when to use it.
                custom_output_extractor: A function that extracts the output from the agent. If not
                    provided, the last message from the agent will be used.
            """
    
            @function_tool(
                name_override=tool_name or _transforms.transform_string_function_style(self.name),
                description_override=tool_description or "",
            )
            async def run_agent(context: RunContextWrapper, input: str) -> str:
                from .run import Runner
    
                output = await Runner.run(
                    starting_agent=self,
                    input=input,
                    context=context.context,
                )
                if custom_output_extractor:
                    return await custom_output_extractor(output)
    
                return ItemHelpers.text_message_outputs(output.new_items)
    
            return run_agent
    
        async def get_system_prompt(self, run_context: RunContextWrapper[TContext]) -> str | None:
            """Get the system prompt for the agent."""
            if isinstance(self.instructions, str):
                return self.instructions
            elif callable(self.instructions):
                if inspect.iscoroutinefunction(self.instructions):
                    return await cast(Awaitable[str], self.instructions(run_context, self))
                else:
                    return cast(str, self.instructions(run_context, self))
            elif self.instructions is not None:
                logger.error(f"Instructions must be a string or a function, got {self.instructions}")
    
            return None
    
        async def get_mcp_tools(self) -> list[Tool]:
            """Fetches the available tools from the MCP servers."""
            convert_schemas_to_strict = self.mcp_config.get("convert_schemas_to_strict", False)
            return await MCPUtil.get_all_function_tools(self.mcp_servers, convert_schemas_to_strict)
    
        async def get_all_tools(self) -> list[Tool]:
            """All agent tools, including MCP tools and function tools."""
            mcp_tools = await self.get_mcp_tools()
            return mcp_tools + self.tools
      
  
---|---  
  
####  name `instance-attribute`
    
    
    name: str
    

The name of the agent.

####  instructions `class-attribute` `instance-attribute`
    
    
    instructions: (
        str
        | Callable[
            [[RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext], Agent[TContext]],
            MaybeAwaitable[str],
        ]
        | None
    ) = None
    

The instructions for the agent. Will be used as the "system prompt" when this agent is invoked. Describes what the agent should do, and how it responds.

Can either be a string, or a function that dynamically generates instructions for the agent. If you provide a function, it will be called with the context and the agent instance. It must return a string.

####  handoff_description `class-attribute` `instance-attribute`
    
    
    handoff_description: str | None = None
    

A description of the agent. This is used when the agent is used as a handoff, so that an LLM knows what it does and when to invoke it.

####  handoffs `class-attribute` `instance-attribute`
    
    
    handoffs: list[Agent[Any] | [Handoff](../handoffs/#agents.handoffs.Handoff "Handoff
    
    
      
          dataclass
       \(agents.handoffs.Handoff\)")[TContext]] = field(
        default_factory=list
    )
    

Handoffs are sub-agents that the agent can delegate to. You can provide a list of handoffs, and the agent can choose to delegate to them if relevant. Allows for separation of concerns and modularity.

####  model `class-attribute` `instance-attribute`
    
    
    model: str | [Model](../models/interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)") | None = None
    

The model implementation to use when invoking the LLM.

By default, if not set, the agent will use the default model configured in `openai_provider.DEFAULT_MODEL` (currently "gpt-4o").

####  model_settings `class-attribute` `instance-attribute`
    
    
    model_settings: [ModelSettings](../model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)") = field(
        default_factory=[ModelSettings](../model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)")
    )
    

Configures model-specific tuning parameters (e.g. temperature, top_p).

####  tools `class-attribute` `instance-attribute`
    
    
    tools: list[[Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")] = field(default_factory=list)
    

A list of tools that the agent can use.

####  mcp_servers `class-attribute` `instance-attribute`
    
    
    mcp_servers: list[[MCPServer](../mcp/server/#agents.mcp.server.MCPServer "MCPServer \(agents.mcp.MCPServer\)")] = field(default_factory=list)
    

A list of [Model Context Protocol](https://modelcontextprotocol.io/) servers that the agent can use. Every time the agent runs, it will include tools from these servers in the list of available tools.

NOTE: You are expected to manage the lifecycle of these servers. Specifically, you must call `server.connect()` before passing it to the agent, and `server.cleanup()` when the server is no longer needed.

####  mcp_config `class-attribute` `instance-attribute`
    
    
    mcp_config: MCPConfig = field(
        default_factory=lambda: MCPConfig()
    )
    

Configuration for MCP servers.

####  input_guardrails `class-attribute` `instance-attribute`
    
    
    input_guardrails: list[[InputGuardrail](../guardrail/#agents.guardrail.InputGuardrail "InputGuardrail
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrail\)")[TContext]] = field(
        default_factory=list
    )
    

A list of checks that run in parallel to the agent's execution, before generating a response. Runs only if the agent is the first agent in the chain.

####  output_guardrails `class-attribute` `instance-attribute`
    
    
    output_guardrails: list[[OutputGuardrail](../guardrail/#agents.guardrail.OutputGuardrail "OutputGuardrail
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrail\)")[TContext]] = field(
        default_factory=list
    )
    

A list of checks that run on the final output of the agent, after generating a response. Runs only if the agent produces a final output.

####  output_type `class-attribute` `instance-attribute`
    
    
    output_type: type[Any] | [AgentOutputSchemaBase](../agent_output/#agents.agent_output.AgentOutputSchemaBase "AgentOutputSchemaBase \(agents.agent_output.AgentOutputSchemaBase\)") | None = None
    

The type of the output object. If not provided, the output will be `str`. In most cases, you should pass a regular Python type (e.g. a dataclass, Pydantic model, TypedDict, etc). You can customize this in two ways: 1\. If you want non-strict schemas, pass `AgentOutputSchema(MyClass, strict_json_schema=False)`. 2\. If you want to use a custom JSON schema (i.e. without using the SDK's automatic schema) creation, subclass and pass an `AgentOutputSchemaBase` subclass.

####  hooks `class-attribute` `instance-attribute`
    
    
    hooks: [AgentHooks](../lifecycle/#agents.lifecycle.AgentHooks "AgentHooks \(agents.lifecycle.AgentHooks\)")[TContext] | None = None
    

A class that receives callbacks on various lifecycle events for this agent.

####  tool_use_behavior `class-attribute` `instance-attribute`
    
    
    tool_use_behavior: (
        Literal["run_llm_again", "stop_on_first_tool"]
        | StopAtTools
        | ToolsToFinalOutputFunction
    ) = "run_llm_again"
    

This lets you configure how tool use is handled. \- "run_llm_again": The default behavior. Tools are run, and then the LLM receives the results and gets to respond. \- "stop_on_first_tool": The output of the first tool call is used as the final output. This means that the LLM does not process the result of the tool call. \- A list of tool names: The agent will stop running if any of the tools in the list are called. The final output will be the output of the first matching tool call. The LLM does not process the result of the tool call. \- A function: If you pass a function, it will be called with the run context and the list of tool results. It must return a `ToolToFinalOutputResult`, which determines whether the tool calls result in a final output.

NOTE: This configuration is specific to FunctionTools. Hosted tools, such as file search, web search, etc are always processed by the LLM.

####  reset_tool_choice `class-attribute` `instance-attribute`
    
    
    reset_tool_choice: bool = True
    

Whether to reset the tool choice to the default value after a tool has been called. Defaults to True. This ensures that the agent doesn't enter an infinite loop of tool usage.

####  clone
    
    
    clone(**kwargs: Any) -> Agent[TContext]
    

Make a copy of the agent, with the given arguments changed. For example, you could do: 
    
    
    new_agent = agent.clone(instructions="New instructions")
    

Source code in `src/agents/agent.py`
    
    
    181
    182
    183
    184
    185
    186
    187

| 
    
    
    def clone(self, **kwargs: Any) -> Agent[TContext]:
        """Make a copy of the agent, with the given arguments changed. For example, you could do:
        ```
        new_agent = agent.clone(instructions="New instructions")
        ```
        """
        return dataclasses.replace(self, **kwargs)
      
  
---|---  
  
####  as_tool
    
    
    as_tool(
        tool_name: str | None,
        tool_description: str | None,
        custom_output_extractor: Callable[
            [[RunResult](../result/#agents.result.RunResult "RunResult
    
    
      
          dataclass
       \(agents.result.RunResult\)")], Awaitable[str]
        ]
        | None = None,
    ) -> [Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")
    

Transform this agent into a tool, callable by other agents.

This is different from handoffs in two ways: 1\. In handoffs, the new agent receives the conversation history. In this tool, the new agent receives generated input. 2\. In handoffs, the new agent takes over the conversation. In this tool, the new agent is called as a tool, and the conversation is continued by the original agent.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`tool_name` |  `str | None` |  The name of the tool. If not provided, the agent's name will be used. |  _required_  
`tool_description` |  `str | None` |  The description of the tool, which should indicate what it does and when to use it. |  _required_  
`custom_output_extractor` |  `Callable[[[RunResult](../result/#agents.result.RunResult "RunResult


  
      dataclass
   \(agents.result.RunResult\)")], Awaitable[str]] | None` |  A function that extracts the output from the agent. If not provided, the last message from the agent will be used. |  `None`  
Source code in `src/agents/agent.py`
    
    
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

| 
    
    
    def as_tool(
        self,
        tool_name: str | None,
        tool_description: str | None,
        custom_output_extractor: Callable[[RunResult], Awaitable[str]] | None = None,
    ) -> Tool:
        """Transform this agent into a tool, callable by other agents.
    
        This is different from handoffs in two ways:
        1. In handoffs, the new agent receives the conversation history. In this tool, the new agent
           receives generated input.
        2. In handoffs, the new agent takes over the conversation. In this tool, the new agent is
           called as a tool, and the conversation is continued by the original agent.
    
        Args:
            tool_name: The name of the tool. If not provided, the agent's name will be used.
            tool_description: The description of the tool, which should indicate what it does and
                when to use it.
            custom_output_extractor: A function that extracts the output from the agent. If not
                provided, the last message from the agent will be used.
        """
    
        @function_tool(
            name_override=tool_name or _transforms.transform_string_function_style(self.name),
            description_override=tool_description or "",
        )
        async def run_agent(context: RunContextWrapper, input: str) -> str:
            from .run import Runner
    
            output = await Runner.run(
                starting_agent=self,
                input=input,
                context=context.context,
            )
            if custom_output_extractor:
                return await custom_output_extractor(output)
    
            return ItemHelpers.text_message_outputs(output.new_items)
    
        return run_agent
      
  
---|---  
  
####  get_system_prompt `async`
    
    
    get_system_prompt(
        run_context: [RunContextWrapper](../run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[TContext],
    ) -> str | None
    

Get the system prompt for the agent.

Source code in `src/agents/agent.py`
    
    
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

| 
    
    
    async def get_system_prompt(self, run_context: RunContextWrapper[TContext]) -> str | None:
        """Get the system prompt for the agent."""
        if isinstance(self.instructions, str):
            return self.instructions
        elif callable(self.instructions):
            if inspect.iscoroutinefunction(self.instructions):
                return await cast(Awaitable[str], self.instructions(run_context, self))
            else:
                return cast(str, self.instructions(run_context, self))
        elif self.instructions is not None:
            logger.error(f"Instructions must be a string or a function, got {self.instructions}")
    
        return None
      
  
---|---  
  
####  get_mcp_tools `async`
    
    
    get_mcp_tools() -> list[[Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")]
    

Fetches the available tools from the MCP servers.

Source code in `src/agents/agent.py`
    
    
    244
    245
    246
    247

| 
    
    
    async def get_mcp_tools(self) -> list[Tool]:
        """Fetches the available tools from the MCP servers."""
        convert_schemas_to_strict = self.mcp_config.get("convert_schemas_to_strict", False)
        return await MCPUtil.get_all_function_tools(self.mcp_servers, convert_schemas_to_strict)
      
  
---|---  
  
####  get_all_tools `async`
    
    
    get_all_tools() -> list[[Tool](../tool/#agents.tool.Tool "Tool
    
    
      
          module-attribute
       \(agents.tool.Tool\)")]
    

All agent tools, including MCP tools and function tools.

Source code in `src/agents/agent.py`
    
    
    249
    250
    251
    252

| 
    
    
    async def get_all_tools(self) -> list[Tool]:
        """All agent tools, including MCP tools and function tools."""
        mcp_tools = await self.get_mcp_tools()
        return mcp_tools + self.tools
      
  
---|---
