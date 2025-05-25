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

  * exceptions 
  * AgentsException 
  * MaxTurnsExceeded 
  * ModelBehaviorError 
  * UserError 
  * InputGuardrailTripwireTriggered 
    * guardrail_result 
  * OutputGuardrailTripwireTriggered 
    * guardrail_result 



# `Exceptions`

###  AgentsException

Bases: `Exception`

Base class for all exceptions in the Agents SDK.

Source code in `src/agents/exceptions.py`
    
    
    7
    8

| 
    
    
    class AgentsException(Exception):
        """Base class for all exceptions in the Agents SDK."""
      
  
---|---  
  
###  MaxTurnsExceeded

Bases: `[AgentsException](../../../ref/exceptions/#agents.exceptions.AgentsException "AgentsException \(agents.exceptions.AgentsException\)")`

Exception raised when the maximum number of turns is exceeded.

Source code in `src/agents/exceptions.py`
    
    
    11
    12
    13
    14
    15
    16
    17

| 
    
    
    class MaxTurnsExceeded(AgentsException):
        """Exception raised when the maximum number of turns is exceeded."""
    
        message: str
    
        def __init__(self, message: str):
            self.message = message
      
  
---|---  
  
###  ModelBehaviorError

Bases: `[AgentsException](../../../ref/exceptions/#agents.exceptions.AgentsException "AgentsException \(agents.exceptions.AgentsException\)")`

Exception raised when the model does something unexpected, e.g. calling a tool that doesn't exist, or providing malformed JSON.

Source code in `src/agents/exceptions.py`
    
    
    20
    21
    22
    23
    24
    25
    26
    27
    28

| 
    
    
    class ModelBehaviorError(AgentsException):
        """Exception raised when the model does something unexpected, e.g. calling a tool that doesn't
        exist, or providing malformed JSON.
        """
    
        message: str
    
        def __init__(self, message: str):
            self.message = message
      
  
---|---  
  
###  UserError

Bases: `[AgentsException](../../../ref/exceptions/#agents.exceptions.AgentsException "AgentsException \(agents.exceptions.AgentsException\)")`

Exception raised when the user makes an error using the SDK.

Source code in `src/agents/exceptions.py`
    
    
    31
    32
    33
    34
    35
    36
    37

| 
    
    
    class UserError(AgentsException):
        """Exception raised when the user makes an error using the SDK."""
    
        message: str
    
        def __init__(self, message: str):
            self.message = message
      
  
---|---  
  
###  InputGuardrailTripwireTriggered

Bases: `[AgentsException](../../../ref/exceptions/#agents.exceptions.AgentsException "AgentsException \(agents.exceptions.AgentsException\)")`

Exception raised when a guardrail tripwire is triggered.

Source code in `src/agents/exceptions.py`
    
    
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

| 
    
    
    class InputGuardrailTripwireTriggered(AgentsException):
        """Exception raised when a guardrail tripwire is triggered."""
    
        guardrail_result: "InputGuardrailResult"
        """The result data of the guardrail that was triggered."""
    
        def __init__(self, guardrail_result: "InputGuardrailResult"):
            self.guardrail_result = guardrail_result
            super().__init__(
                f"Guardrail {guardrail_result.guardrail.__class__.__name__} triggered tripwire"
            )
      
  
---|---  
  
####  guardrail_result `instance-attribute`
    
    
    guardrail_result: [InputGuardrailResult](../../../ref/guardrail/#agents.guardrail.InputGuardrailResult "InputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrailResult\)") = guardrail_result
    

The result data of the guardrail that was triggered.

###  OutputGuardrailTripwireTriggered

Bases: `[AgentsException](../../../ref/exceptions/#agents.exceptions.AgentsException "AgentsException \(agents.exceptions.AgentsException\)")`

Exception raised when a guardrail tripwire is triggered.

Source code in `src/agents/exceptions.py`
    
    
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

| 
    
    
    class OutputGuardrailTripwireTriggered(AgentsException):
        """Exception raised when a guardrail tripwire is triggered."""
    
        guardrail_result: "OutputGuardrailResult"
        """The result data of the guardrail that was triggered."""
    
        def __init__(self, guardrail_result: "OutputGuardrailResult"):
            self.guardrail_result = guardrail_result
            super().__init__(
                f"Guardrail {guardrail_result.guardrail.__class__.__name__} triggered tripwire"
            )
      
  
---|---  
  
####  guardrail_result `instance-attribute`
    
    
    guardrail_result: [OutputGuardrailResult](../../../ref/guardrail/#agents.guardrail.OutputGuardrailResult "OutputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrailResult\)") = guardrail_result
    

The result data of the guardrail that was triggered.
