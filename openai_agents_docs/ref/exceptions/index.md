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
      * Exceptions  [ Exceptions  ](./) Table of contents 
        * exceptions 
        * AgentsException 
        * MaxTurnsExceeded 
        * ModelBehaviorError 
        * UserError 
        * InputGuardrailTripwireTriggered 
          * guardrail_result 
        * OutputGuardrailTripwireTriggered 
          * guardrail_result 
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

Bases: `AgentsException`

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

Bases: `AgentsException`

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

Bases: `AgentsException`

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

Bases: `AgentsException`

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
    
    
    guardrail_result: [InputGuardrailResult](../guardrail/#agents.guardrail.InputGuardrailResult "InputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrailResult\)") = guardrail_result
    

The result data of the guardrail that was triggered.

###  OutputGuardrailTripwireTriggered

Bases: `AgentsException`

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
    
    
    guardrail_result: [OutputGuardrailResult](../guardrail/#agents.guardrail.OutputGuardrailResult "OutputGuardrailResult
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrailResult\)") = guardrail_result
    

The result data of the guardrail that was triggered.
