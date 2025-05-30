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

  * result 
  * RunResultBase 
    * input 
    * new_items 
    * raw_responses 
    * final_output 
    * input_guardrail_results 
    * output_guardrail_results 
    * context_wrapper 
    * last_agent 
    * last_response_id 
    * final_output_as 
    * to_input_list 
  * RunResult 
    * last_agent 
    * input 
    * new_items 
    * raw_responses 
    * final_output 
    * input_guardrail_results 
    * output_guardrail_results 
    * context_wrapper 
    * last_response_id 
    * final_output_as 
    * to_input_list 
  * RunResultStreaming 
    * current_agent 
    * current_turn 
    * max_turns 
    * final_output 
    * is_complete 
    * last_agent 
    * input 
    * new_items 
    * raw_responses 
    * input_guardrail_results 
    * output_guardrail_results 
    * context_wrapper 
    * last_response_id 
    * cancel 
    * stream_events 
    * final_output_as 
    * to_input_list 



# `Results`

###  RunResultBase `dataclass`

Bases: `ABC`

Source code in `src/agents/result.py`
    
    
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

| 
    
    
    @dataclass
    class RunResultBase(abc.ABC):
        input: str | list[TResponseInputItem]
        """The original input items i.e. the items before run() was called. This may be a mutated
        version of the input, if there are handoff input filters that mutate the input.
        """
    
        new_items: list[RunItem]
        """The new items generated during the agent run. These include things like new messages, tool
        calls and their outputs, etc.
        """
    
        raw_responses: list[ModelResponse]
        """The raw LLM responses generated by the model during the agent run."""
    
        final_output: Any
        """The output of the last agent."""
    
        input_guardrail_results: list[InputGuardrailResult]
        """Guardrail results for the input messages."""
    
        output_guardrail_results: list[OutputGuardrailResult]
        """Guardrail results for the final output of the agent."""
    
        context_wrapper: RunContextWrapper[Any]
        """The context wrapper for the agent run."""
    
        @property
        @abc.abstractmethod
        def last_agent(self) -> Agent[Any]:
            """The last agent that was run."""
    
        def final_output_as(self, cls: type[T], raise_if_incorrect_type: bool = False) -> T:
            """A convenience method to cast the final output to a specific type. By default, the cast
            is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a
            TypeError if the final output is not of the given type.
    
            Args:
                cls: The type to cast the final output to.
                raise_if_incorrect_type: If True, we'll raise a TypeError if the final output is not of
                    the given type.
    
            Returns:
                The final output casted to the given type.
            """
            if raise_if_incorrect_type and not isinstance(self.final_output, cls):
                raise TypeError(f"Final output is not of type {cls.__name__}")
    
            return cast(T, self.final_output)
    
        def to_input_list(self) -> list[TResponseInputItem]:
            """Creates a new input list, merging the original input with all the new items generated."""
            original_items: list[TResponseInputItem] = ItemHelpers.input_to_new_input_list(self.input)
            new_items = [item.to_input_item() for item in self.new_items]
    
            return original_items + new_items
    
        @property
        def last_response_id(self) -> str | None:
            """Convenience method to get the response ID of the last model response."""
            if not self.raw_responses:
                return None
    
            return self.raw_responses[-1].response_id
      
  
---|---  
  
####  input `instance-attribute`
    
    
    input: str | list[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")]
    

The original input items i.e. the items before run() was called. This may be a mutated version of the input, if there are handoff input filters that mutate the input.

####  new_items `instance-attribute`
    
    
    new_items: list[[RunItem](../../../ref/items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)")]
    

The new items generated during the agent run. These include things like new messages, tool calls and their outputs, etc.

####  raw_responses `instance-attribute`
    
    
    raw_responses: list[[ModelResponse](../../../ref/items/#agents.items.ModelResponse "ModelResponse
    
    
      
          dataclass
       \(agents.items.ModelResponse\)")]
    

The raw LLM responses generated by the model during the agent run.

####  final_output `instance-attribute`
    
    
    final_output: Any
    

The output of the last agent.

####  input_guardrail_results `instance-attribute`
    
    
    input_guardrail_results: list[[InputGuardrailResult](../../../ref/guardrail/#agents.guardrail.InputGuardrailResult "InputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrailResult\)")]
    

Guardrail results for the input messages.

####  output_guardrail_results `instance-attribute`
    
    
    output_guardrail_results: list[[OutputGuardrailResult](../../../ref/guardrail/#agents.guardrail.OutputGuardrailResult "OutputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrailResult\)")]
    

Guardrail results for the final output of the agent.

####  context_wrapper `instance-attribute`
    
    
    context_wrapper: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any]
    

The context wrapper for the agent run.

####  last_agent `abstractmethod` `property`
    
    
    last_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any]
    

The last agent that was run.

####  last_response_id `property`
    
    
    last_response_id: str | None
    

Convenience method to get the response ID of the last model response.

####  final_output_as
    
    
    final_output_as(
        cls: type[T], raise_if_incorrect_type: bool = False
    ) -> T
    

A convenience method to cast the final output to a specific type. By default, the cast is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a TypeError if the final output is not of the given type.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`cls` |  `type[T]` |  The type to cast the final output to. |  _required_  
`raise_if_incorrect_type` |  `bool` |  If True, we'll raise a TypeError if the final output is not of the given type. |  `False`  
  
Returns:

Type | Description  
---|---  
`T` |  The final output casted to the given type.  
Source code in `src/agents/result.py`
    
    
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

| 
    
    
    def final_output_as(self, cls: type[T], raise_if_incorrect_type: bool = False) -> T:
        """A convenience method to cast the final output to a specific type. By default, the cast
        is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a
        TypeError if the final output is not of the given type.
    
        Args:
            cls: The type to cast the final output to.
            raise_if_incorrect_type: If True, we'll raise a TypeError if the final output is not of
                the given type.
    
        Returns:
            The final output casted to the given type.
        """
        if raise_if_incorrect_type and not isinstance(self.final_output, cls):
            raise TypeError(f"Final output is not of type {cls.__name__}")
    
        return cast(T, self.final_output)
      
  
---|---  
  
####  to_input_list
    
    
    to_input_list() -> list[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")]
    

Creates a new input list, merging the original input with all the new items generated.

Source code in `src/agents/result.py`
    
    
    80
    81
    82
    83
    84
    85

| 
    
    
    def to_input_list(self) -> list[TResponseInputItem]:
        """Creates a new input list, merging the original input with all the new items generated."""
        original_items: list[TResponseInputItem] = ItemHelpers.input_to_new_input_list(self.input)
        new_items = [item.to_input_item() for item in self.new_items]
    
        return original_items + new_items
      
  
---|---  
  
###  RunResult `dataclass`

Bases: `[RunResultBase](../../../ref/result/#agents.result.RunResultBase "RunResultBase


  
      dataclass
   \(agents.result.RunResultBase\)")`

Source code in `src/agents/result.py`
    
    
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

| 
    
    
    @dataclass
    class RunResult(RunResultBase):
        _last_agent: Agent[Any]
    
        @property
        def last_agent(self) -> Agent[Any]:
            """The last agent that was run."""
            return self._last_agent
    
        def __str__(self) -> str:
            return pretty_print_result(self)
      
  
---|---  
  
####  last_agent `property`
    
    
    last_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any]
    

The last agent that was run.

####  input `instance-attribute`
    
    
    input: str | list[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")]
    

The original input items i.e. the items before run() was called. This may be a mutated version of the input, if there are handoff input filters that mutate the input.

####  new_items `instance-attribute`
    
    
    new_items: list[[RunItem](../../../ref/items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)")]
    

The new items generated during the agent run. These include things like new messages, tool calls and their outputs, etc.

####  raw_responses `instance-attribute`
    
    
    raw_responses: list[[ModelResponse](../../../ref/items/#agents.items.ModelResponse "ModelResponse
    
    
      
          dataclass
       \(agents.items.ModelResponse\)")]
    

The raw LLM responses generated by the model during the agent run.

####  final_output `instance-attribute`
    
    
    final_output: Any
    

The output of the last agent.

####  input_guardrail_results `instance-attribute`
    
    
    input_guardrail_results: list[[InputGuardrailResult](../../../ref/guardrail/#agents.guardrail.InputGuardrailResult "InputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrailResult\)")]
    

Guardrail results for the input messages.

####  output_guardrail_results `instance-attribute`
    
    
    output_guardrail_results: list[[OutputGuardrailResult](../../../ref/guardrail/#agents.guardrail.OutputGuardrailResult "OutputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrailResult\)")]
    

Guardrail results for the final output of the agent.

####  context_wrapper `instance-attribute`
    
    
    context_wrapper: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any]
    

The context wrapper for the agent run.

####  last_response_id `property`
    
    
    last_response_id: str | None
    

Convenience method to get the response ID of the last model response.

####  final_output_as
    
    
    final_output_as(
        cls: type[T], raise_if_incorrect_type: bool = False
    ) -> T
    

A convenience method to cast the final output to a specific type. By default, the cast is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a TypeError if the final output is not of the given type.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`cls` |  `type[T]` |  The type to cast the final output to. |  _required_  
`raise_if_incorrect_type` |  `bool` |  If True, we'll raise a TypeError if the final output is not of the given type. |  `False`  
  
Returns:

Type | Description  
---|---  
`T` |  The final output casted to the given type.  
Source code in `src/agents/result.py`
    
    
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

| 
    
    
    def final_output_as(self, cls: type[T], raise_if_incorrect_type: bool = False) -> T:
        """A convenience method to cast the final output to a specific type. By default, the cast
        is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a
        TypeError if the final output is not of the given type.
    
        Args:
            cls: The type to cast the final output to.
            raise_if_incorrect_type: If True, we'll raise a TypeError if the final output is not of
                the given type.
    
        Returns:
            The final output casted to the given type.
        """
        if raise_if_incorrect_type and not isinstance(self.final_output, cls):
            raise TypeError(f"Final output is not of type {cls.__name__}")
    
        return cast(T, self.final_output)
      
  
---|---  
  
####  to_input_list
    
    
    to_input_list() -> list[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")]
    

Creates a new input list, merging the original input with all the new items generated.

Source code in `src/agents/result.py`
    
    
    80
    81
    82
    83
    84
    85

| 
    
    
    def to_input_list(self) -> list[TResponseInputItem]:
        """Creates a new input list, merging the original input with all the new items generated."""
        original_items: list[TResponseInputItem] = ItemHelpers.input_to_new_input_list(self.input)
        new_items = [item.to_input_item() for item in self.new_items]
    
        return original_items + new_items
      
  
---|---  
  
###  RunResultStreaming `dataclass`

Bases: `[RunResultBase](../../../ref/result/#agents.result.RunResultBase "RunResultBase


  
      dataclass
   \(agents.result.RunResultBase\)")`

The result of an agent run in streaming mode. You can use the `stream_events` method to receive semantic events as they are generated.

The streaming method will raise: \- A MaxTurnsExceeded exception if the agent exceeds the max_turns limit. \- A GuardrailTripwireTriggered exception if a guardrail is tripped.

Source code in `src/agents/result.py`
    
    
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

| 
    
    
    @dataclass
    class RunResultStreaming(RunResultBase):
        """The result of an agent run in streaming mode. You can use the `stream_events` method to
        receive semantic events as they are generated.
    
        The streaming method will raise:
        - A MaxTurnsExceeded exception if the agent exceeds the max_turns limit.
        - A GuardrailTripwireTriggered exception if a guardrail is tripped.
        """
    
        current_agent: Agent[Any]
        """The current agent that is running."""
    
        current_turn: int
        """The current turn number."""
    
        max_turns: int
        """The maximum number of turns the agent can run for."""
    
        final_output: Any
        """The final output of the agent. This is None until the agent has finished running."""
    
        _current_agent_output_schema: AgentOutputSchemaBase | None = field(repr=False)
    
        trace: Trace | None = field(repr=False)
    
        is_complete: bool = False
        """Whether the agent has finished running."""
    
        # Queues that the background run_loop writes to
        _event_queue: asyncio.Queue[StreamEvent | QueueCompleteSentinel] = field(
            default_factory=asyncio.Queue, repr=False
        )
        _input_guardrail_queue: asyncio.Queue[InputGuardrailResult] = field(
            default_factory=asyncio.Queue, repr=False
        )
    
        # Store the asyncio tasks that we're waiting on
        _run_impl_task: asyncio.Task[Any] | None = field(default=None, repr=False)
        _input_guardrails_task: asyncio.Task[Any] | None = field(default=None, repr=False)
        _output_guardrails_task: asyncio.Task[Any] | None = field(default=None, repr=False)
        _stored_exception: Exception | None = field(default=None, repr=False)
    
        @property
        def last_agent(self) -> Agent[Any]:
            """The last agent that was run. Updates as the agent run progresses, so the true last agent
            is only available after the agent run is complete.
            """
            return self.current_agent
    
        def cancel(self) -> None:
            """Cancels the streaming run, stopping all background tasks and marking the run as
            complete."""
            self._cleanup_tasks()  # Cancel all running tasks
            self.is_complete = True  # Mark the run as complete to stop event streaming
    
            # Optionally, clear the event queue to prevent processing stale events
            while not self._event_queue.empty():
                self._event_queue.get_nowait()
            while not self._input_guardrail_queue.empty():
                self._input_guardrail_queue.get_nowait()
    
        async def stream_events(self) -> AsyncIterator[StreamEvent]:
            """Stream deltas for new items as they are generated. We're using the types from the
            OpenAI Responses API, so these are semantic events: each event has a `type` field that
            describes the type of the event, along with the data for that event.
    
            This will raise:
            - A MaxTurnsExceeded exception if the agent exceeds the max_turns limit.
            - A GuardrailTripwireTriggered exception if a guardrail is tripped.
            """
            while True:
                self._check_errors()
                if self._stored_exception:
                    logger.debug("Breaking due to stored exception")
                    self.is_complete = True
                    break
    
                if self.is_complete and self._event_queue.empty():
                    break
    
                try:
                    item = await self._event_queue.get()
                except asyncio.CancelledError:
                    break
    
                if isinstance(item, QueueCompleteSentinel):
                    self._event_queue.task_done()
                    # Check for errors, in case the queue was completed due to an exception
                    self._check_errors()
                    break
    
                yield item
                self._event_queue.task_done()
    
            self._cleanup_tasks()
    
            if self._stored_exception:
                raise self._stored_exception
    
        def _check_errors(self):
            if self.current_turn > self.max_turns:
                self._stored_exception = MaxTurnsExceeded(f"Max turns ({self.max_turns}) exceeded")
    
            # Fetch all the completed guardrail results from the queue and raise if needed
            while not self._input_guardrail_queue.empty():
                guardrail_result = self._input_guardrail_queue.get_nowait()
                if guardrail_result.output.tripwire_triggered:
                    self._stored_exception = InputGuardrailTripwireTriggered(guardrail_result)
    
            # Check the tasks for any exceptions
            if self._run_impl_task and self._run_impl_task.done():
                exc = self._run_impl_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
            if self._input_guardrails_task and self._input_guardrails_task.done():
                exc = self._input_guardrails_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
            if self._output_guardrails_task and self._output_guardrails_task.done():
                exc = self._output_guardrails_task.exception()
                if exc and isinstance(exc, Exception):
                    self._stored_exception = exc
    
        def _cleanup_tasks(self):
            if self._run_impl_task and not self._run_impl_task.done():
                self._run_impl_task.cancel()
    
            if self._input_guardrails_task and not self._input_guardrails_task.done():
                self._input_guardrails_task.cancel()
    
            if self._output_guardrails_task and not self._output_guardrails_task.done():
                self._output_guardrails_task.cancel()
    
        def __str__(self) -> str:
            return pretty_print_run_result_streaming(self)
      
  
---|---  
  
####  current_agent `instance-attribute`
    
    
    current_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any]
    

The current agent that is running.

####  current_turn `instance-attribute`
    
    
    current_turn: int
    

The current turn number.

####  max_turns `instance-attribute`
    
    
    max_turns: int
    

The maximum number of turns the agent can run for.

####  final_output `instance-attribute`
    
    
    final_output: Any
    

The final output of the agent. This is None until the agent has finished running.

####  is_complete `class-attribute` `instance-attribute`
    
    
    is_complete: bool = False
    

Whether the agent has finished running.

####  last_agent `property`
    
    
    last_agent: [Agent](../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any]
    

The last agent that was run. Updates as the agent run progresses, so the true last agent is only available after the agent run is complete.

####  input `instance-attribute`
    
    
    input: str | list[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")]
    

The original input items i.e. the items before run() was called. This may be a mutated version of the input, if there are handoff input filters that mutate the input.

####  new_items `instance-attribute`
    
    
    new_items: list[[RunItem](../../../ref/items/#agents.items.RunItem "RunItem
    
    
      
          module-attribute
       \(agents.items.RunItem\)")]
    

The new items generated during the agent run. These include things like new messages, tool calls and their outputs, etc.

####  raw_responses `instance-attribute`
    
    
    raw_responses: list[[ModelResponse](../../../ref/items/#agents.items.ModelResponse "ModelResponse
    
    
      
          dataclass
       \(agents.items.ModelResponse\)")]
    

The raw LLM responses generated by the model during the agent run.

####  input_guardrail_results `instance-attribute`
    
    
    input_guardrail_results: list[[InputGuardrailResult](../../../ref/guardrail/#agents.guardrail.InputGuardrailResult "InputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrailResult\)")]
    

Guardrail results for the input messages.

####  output_guardrail_results `instance-attribute`
    
    
    output_guardrail_results: list[[OutputGuardrailResult](../../../ref/guardrail/#agents.guardrail.OutputGuardrailResult "OutputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrailResult\)")]
    

Guardrail results for the final output of the agent.

####  context_wrapper `instance-attribute`
    
    
    context_wrapper: [RunContextWrapper](../../../ref/run_context/#agents.run_context.RunContextWrapper "RunContextWrapper
    
    
      
          dataclass
       \(agents.run_context.RunContextWrapper\)")[Any]
    

The context wrapper for the agent run.

####  last_response_id `property`
    
    
    last_response_id: str | None
    

Convenience method to get the response ID of the last model response.

####  cancel
    
    
    cancel() -> None
    

Cancels the streaming run, stopping all background tasks and marking the run as complete.

Source code in `src/agents/result.py`
    
    
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

| 
    
    
    def cancel(self) -> None:
        """Cancels the streaming run, stopping all background tasks and marking the run as
        complete."""
        self._cleanup_tasks()  # Cancel all running tasks
        self.is_complete = True  # Mark the run as complete to stop event streaming
    
        # Optionally, clear the event queue to prevent processing stale events
        while not self._event_queue.empty():
            self._event_queue.get_nowait()
        while not self._input_guardrail_queue.empty():
            self._input_guardrail_queue.get_nowait()
      
  
---|---  
  
####  stream_events `async`
    
    
    stream_events() -> AsyncIterator[[StreamEvent](../../../ref/stream_events/#agents.stream_events.StreamEvent "StreamEvent
    
    
      
          module-attribute
       \(agents.stream_events.StreamEvent\)")]
    

Stream deltas for new items as they are generated. We're using the types from the OpenAI Responses API, so these are semantic events: each event has a `type` field that describes the type of the event, along with the data for that event.

This will raise: \- A MaxTurnsExceeded exception if the agent exceeds the max_turns limit. \- A GuardrailTripwireTriggered exception if a guardrail is tripped.

Source code in `src/agents/result.py`
    
    
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

| 
    
    
    async def stream_events(self) -> AsyncIterator[StreamEvent]:
        """Stream deltas for new items as they are generated. We're using the types from the
        OpenAI Responses API, so these are semantic events: each event has a `type` field that
        describes the type of the event, along with the data for that event.
    
        This will raise:
        - A MaxTurnsExceeded exception if the agent exceeds the max_turns limit.
        - A GuardrailTripwireTriggered exception if a guardrail is tripped.
        """
        while True:
            self._check_errors()
            if self._stored_exception:
                logger.debug("Breaking due to stored exception")
                self.is_complete = True
                break
    
            if self.is_complete and self._event_queue.empty():
                break
    
            try:
                item = await self._event_queue.get()
            except asyncio.CancelledError:
                break
    
            if isinstance(item, QueueCompleteSentinel):
                self._event_queue.task_done()
                # Check for errors, in case the queue was completed due to an exception
                self._check_errors()
                break
    
            yield item
            self._event_queue.task_done()
    
        self._cleanup_tasks()
    
        if self._stored_exception:
            raise self._stored_exception
      
  
---|---  
  
####  final_output_as
    
    
    final_output_as(
        cls: type[T], raise_if_incorrect_type: bool = False
    ) -> T
    

A convenience method to cast the final output to a specific type. By default, the cast is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a TypeError if the final output is not of the given type.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`cls` |  `type[T]` |  The type to cast the final output to. |  _required_  
`raise_if_incorrect_type` |  `bool` |  If True, we'll raise a TypeError if the final output is not of the given type. |  `False`  
  
Returns:

Type | Description  
---|---  
`T` |  The final output casted to the given type.  
Source code in `src/agents/result.py`
    
    
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

| 
    
    
    def final_output_as(self, cls: type[T], raise_if_incorrect_type: bool = False) -> T:
        """A convenience method to cast the final output to a specific type. By default, the cast
        is only for the typechecker. If you set `raise_if_incorrect_type` to True, we'll raise a
        TypeError if the final output is not of the given type.
    
        Args:
            cls: The type to cast the final output to.
            raise_if_incorrect_type: If True, we'll raise a TypeError if the final output is not of
                the given type.
    
        Returns:
            The final output casted to the given type.
        """
        if raise_if_incorrect_type and not isinstance(self.final_output, cls):
            raise TypeError(f"Final output is not of type {cls.__name__}")
    
        return cast(T, self.final_output)
      
  
---|---  
  
####  to_input_list
    
    
    to_input_list() -> list[[TResponseInputItem](../../../ref/items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")]
    

Creates a new input list, merging the original input with all the new items generated.

Source code in `src/agents/result.py`
    
    
    80
    81
    82
    83
    84
    85

| 
    
    
    def to_input_list(self) -> list[TResponseInputItem]:
        """Creates a new input list, merging the original input with all the new items generated."""
        original_items: list[TResponseInputItem] = ItemHelpers.input_to_new_input_list(self.input)
        new_items = [item.to_input_item() for item in self.new_items]
    
        return original_items + new_items
      
  
---|---
