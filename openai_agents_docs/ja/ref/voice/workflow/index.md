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

  * workflow 
  * VoiceWorkflowBase 
    * run 
  * VoiceWorkflowHelper 
    * stream_text_from 
  * SingleAgentWorkflowCallbacks 
    * on_run 
  * SingleAgentVoiceWorkflow 
    * __init__ 



# `Workflow`

###  VoiceWorkflowBase

Bases: `ABC`

A base class for a voice workflow. You must implement the `run` method. A "workflow" is any code you want, that receives a transcription and yields text that will be turned into speech by a text-to-speech model. In most cases, you'll create `Agent`s and use `Runner.run_streamed()` to run them, returning some or all of the text events from the stream. You can use the `VoiceWorkflowHelper` class to help with extracting text events from the stream. If you have a simple workflow that has a single starting agent and no custom logic, you can use `SingleAgentVoiceWorkflow` directly.

Source code in `src/agents/voice/workflow.py`
    
    
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

| 
    
    
    class VoiceWorkflowBase(abc.ABC):
        """
        A base class for a voice workflow. You must implement the `run` method. A "workflow" is any
        code you want, that receives a transcription and yields text that will be turned into speech
        by a text-to-speech model.
        In most cases, you'll create `Agent`s and use `Runner.run_streamed()` to run them, returning
        some or all of the text events from the stream. You can use the `VoiceWorkflowHelper` class to
        help with extracting text events from the stream.
        If you have a simple workflow that has a single starting agent and no custom logic, you can
        use `SingleAgentVoiceWorkflow` directly.
        """
    
        @abc.abstractmethod
        def run(self, transcription: str) -> AsyncIterator[str]:
            """
            Run the voice workflow. You will receive an input transcription, and must yield text that
            will be spoken to the user. You can run whatever logic you want here. In most cases, the
            final logic will involve calling `Runner.run_streamed()` and yielding any text events from
            the stream.
            """
            pass
      
  
---|---  
  
####  run `abstractmethod`
    
    
    run(transcription: str) -> AsyncIterator[str]
    

Run the voice workflow. You will receive an input transcription, and must yield text that will be spoken to the user. You can run whatever logic you want here. In most cases, the final logic will involve calling `Runner.run_streamed()` and yielding any text events from the stream.

Source code in `src/agents/voice/workflow.py`
    
    
    25
    26
    27
    28
    29
    30
    31
    32
    33

| 
    
    
    @abc.abstractmethod
    def run(self, transcription: str) -> AsyncIterator[str]:
        """
        Run the voice workflow. You will receive an input transcription, and must yield text that
        will be spoken to the user. You can run whatever logic you want here. In most cases, the
        final logic will involve calling `Runner.run_streamed()` and yielding any text events from
        the stream.
        """
        pass
      
  
---|---  
  
###  VoiceWorkflowHelper

Source code in `src/agents/voice/workflow.py`
    
    
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
    
    
    class VoiceWorkflowHelper:
        @classmethod
        async def stream_text_from(cls, result: RunResultStreaming) -> AsyncIterator[str]:
            """Wraps a `RunResultStreaming` object and yields text events from the stream."""
            async for event in result.stream_events():
                if (
                    event.type == "raw_response_event"
                    and event.data.type == "response.output_text.delta"
                ):
                    yield event.data.delta
      
  
---|---  
  
####  stream_text_from `async` `classmethod`
    
    
    stream_text_from(
        result: [RunResultStreaming](../../../../ref/result/#agents.result.RunResultStreaming "RunResultStreaming
    
    
      
          dataclass
       \(agents.result.RunResultStreaming\)"),
    ) -> AsyncIterator[str]
    

Wraps a `RunResultStreaming` object and yields text events from the stream.

Source code in `src/agents/voice/workflow.py`
    
    
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
    
    
    @classmethod
    async def stream_text_from(cls, result: RunResultStreaming) -> AsyncIterator[str]:
        """Wraps a `RunResultStreaming` object and yields text events from the stream."""
        async for event in result.stream_events():
            if (
                event.type == "raw_response_event"
                and event.data.type == "response.output_text.delta"
            ):
                yield event.data.delta
      
  
---|---  
  
###  SingleAgentWorkflowCallbacks

Source code in `src/agents/voice/workflow.py`
    
    
    48
    49
    50
    51

| 
    
    
    class SingleAgentWorkflowCallbacks:
        def on_run(self, workflow: SingleAgentVoiceWorkflow, transcription: str) -> None:
            """Called when the workflow is run."""
            pass
      
  
---|---  
  
####  on_run
    
    
    on_run(
        workflow: [SingleAgentVoiceWorkflow](../../../../ref/voice/workflow/#agents.voice.workflow.SingleAgentVoiceWorkflow "SingleAgentVoiceWorkflow \(agents.voice.workflow.SingleAgentVoiceWorkflow\)"), transcription: str
    ) -> None
    

Called when the workflow is run.

Source code in `src/agents/voice/workflow.py`
    
    
    49
    50
    51

| 
    
    
    def on_run(self, workflow: SingleAgentVoiceWorkflow, transcription: str) -> None:
        """Called when the workflow is run."""
        pass
      
  
---|---  
  
###  SingleAgentVoiceWorkflow

Bases: `[VoiceWorkflowBase](../../../../ref/voice/workflow/#agents.voice.workflow.VoiceWorkflowBase "VoiceWorkflowBase \(agents.voice.workflow.VoiceWorkflowBase\)")`

A simple voice workflow that runs a single agent. Each transcription and result is added to the input history. For more complex workflows (e.g. multiple Runner calls, custom message history, custom logic, custom configs), subclass `VoiceWorkflowBase` and implement your own logic.

Source code in `src/agents/voice/workflow.py`
    
    
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
    
    
    class SingleAgentVoiceWorkflow(VoiceWorkflowBase):
        """A simple voice workflow that runs a single agent. Each transcription and result is added to
        the input history.
        For more complex workflows (e.g. multiple Runner calls, custom message history, custom logic,
        custom configs), subclass `VoiceWorkflowBase` and implement your own logic.
        """
    
        def __init__(self, agent: Agent[Any], callbacks: SingleAgentWorkflowCallbacks | None = None):
            """Create a new single agent voice workflow.
    
            Args:
                agent: The agent to run.
                callbacks: Optional callbacks to call during the workflow.
            """
            self._input_history: list[TResponseInputItem] = []
            self._current_agent = agent
            self._callbacks = callbacks
    
        async def run(self, transcription: str) -> AsyncIterator[str]:
            if self._callbacks:
                self._callbacks.on_run(self, transcription)
    
            # Add the transcription to the input history
            self._input_history.append(
                {
                    "role": "user",
                    "content": transcription,
                }
            )
    
            # Run the agent
            result = Runner.run_streamed(self._current_agent, self._input_history)
    
            # Stream the text from the result
            async for chunk in VoiceWorkflowHelper.stream_text_from(result):
                yield chunk
    
            # Update the input history and current agent
            self._input_history = result.to_input_list()
            self._current_agent = result.last_agent
      
  
---|---  
  
####  __init__
    
    
    __init__(
        agent: [Agent](../../../../ref/agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[Any],
        callbacks: [SingleAgentWorkflowCallbacks](../../../../ref/voice/workflow/#agents.voice.workflow.SingleAgentWorkflowCallbacks "SingleAgentWorkflowCallbacks \(agents.voice.workflow.SingleAgentWorkflowCallbacks\)") | None = None,
    )
    

Create a new single agent voice workflow.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`agent` |  `[Agent](../../../../ref/agent/#agents.agent.Agent "Agent


  
      dataclass
   \(agents.agent.Agent\)")[Any]` |  The agent to run. |  _required_  
`callbacks` |  `[SingleAgentWorkflowCallbacks](../../../../ref/voice/workflow/#agents.voice.workflow.SingleAgentWorkflowCallbacks "SingleAgentWorkflowCallbacks \(agents.voice.workflow.SingleAgentWorkflowCallbacks\)") | None` |  Optional callbacks to call during the workflow. |  `None`  
Source code in `src/agents/voice/workflow.py`
    
    
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

| 
    
    
    def __init__(self, agent: Agent[Any], callbacks: SingleAgentWorkflowCallbacks | None = None):
        """Create a new single agent voice workflow.
    
        Args:
            agent: The agent to run.
            callbacks: Optional callbacks to call during the workflow.
        """
        self._input_history: list[TResponseInputItem] = []
        self._current_agent = agent
        self._callbacks = callbacks
      
  
---|---
