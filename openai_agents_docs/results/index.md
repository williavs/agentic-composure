[ ![logo](../assets/logo.svg) ](.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](..)
  * [ Quickstart  ](../quickstart/)
  * [ Examples  ](../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../agents/)
    * [ Running agents  ](../running_agents/)
    * Results  [ Results  ](./) Table of contents 
      * Final output 
      * Inputs for the next turn 
      * Last agent 
      * New items 
      * Other information 
        * Guardrail results 
        * Raw responses 
        * Original input 
    * [ Streaming  ](../streaming/)
    * [ Tools  ](../tools/)
    * [ Model context protocol (MCP)  ](../mcp/)
    * [ Handoffs  ](../handoffs/)
    * [ Tracing  ](../tracing/)
    * [ Context management  ](../context/)
    * [ Guardrails  ](../guardrails/)
    * [ Orchestrating multiple agents  ](../multi_agent/)
    * Models  Models 
      * [ Models  ](../models/)
      * [ Using any model via LiteLLM  ](../models/litellm/)
    * [ Configuring the SDK  ](../config/)
    * [ Agent Visualization  ](../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../voice/quickstart/)
      * [ Pipelines and workflows  ](../voice/pipeline/)
      * [ Tracing  ](../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../ref/)
      * [ Agents  ](../ref/agent/)
      * [ Runner  ](../ref/run/)
      * [ Tools  ](../ref/tool/)
      * [ Results  ](../ref/result/)
      * [ Streaming events  ](../ref/stream_events/)
      * [ Handoffs  ](../ref/handoffs/)
      * [ Lifecycle  ](../ref/lifecycle/)
      * [ Items  ](../ref/items/)
      * [ Run context  ](../ref/run_context/)
      * [ Usage  ](../ref/usage/)
      * [ Exceptions  ](../ref/exceptions/)
      * [ Guardrails  ](../ref/guardrail/)
      * [ Model settings  ](../ref/model_settings/)
      * [ Agent output  ](../ref/agent_output/)
      * [ Function schema  ](../ref/function_schema/)
      * [ Model interface  ](../ref/models/interface/)
      * [ OpenAI Chat Completions model  ](../ref/models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../ref/models/openai_responses/)
      * [ MCP Servers  ](../ref/mcp/server/)
      * [ MCP Util  ](../ref/mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../ref/tracing/)
      * [ Creating traces/spans  ](../ref/tracing/create/)
      * [ Traces  ](../ref/tracing/traces/)
      * [ Spans  ](../ref/tracing/spans/)
      * [ Processor interface  ](../ref/tracing/processor_interface/)
      * [ Processors  ](../ref/tracing/processors/)
      * [ Scope  ](../ref/tracing/scope/)
      * [ Setup  ](../ref/tracing/setup/)
      * [ Span data  ](../ref/tracing/span_data/)
      * [ Util  ](../ref/tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../ref/voice/pipeline/)
      * [ Workflow  ](../ref/voice/workflow/)
      * [ Input  ](../ref/voice/input/)
      * [ Result  ](../ref/voice/result/)
      * [ Pipeline Config  ](../ref/voice/pipeline_config/)
      * [ Events  ](../ref/voice/events/)
      * [ Exceptions  ](../ref/voice/exceptions/)
      * [ Model  ](../ref/voice/model/)
      * [ Utils  ](../ref/voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../ref/voice/models/openai_provider/)
      * [ OpenAI STT  ](../ref/voice/models/openai_stt/)
      * [ OpenAI TTS  ](../ref/voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../ref/extensions/handoff_filters/)
      * [ Handoff prompt  ](../ref/extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../ref/extensions/litellm/)



Table of contents 

  * Final output 
  * Inputs for the next turn 
  * Last agent 
  * New items 
  * Other information 
    * Guardrail results 
    * Raw responses 
    * Original input 



# Results

When you call the `Runner.run` methods, you either get a:

  * [`RunResult`](../ref/result/#agents.result.RunResult "RunResult


  
      dataclass
  ") if you call `run` or `run_sync`
  * [`RunResultStreaming`](../ref/result/#agents.result.RunResultStreaming "RunResultStreaming


  
      dataclass
  ") if you call `run_streamed`



Both of these inherit from [`RunResultBase`](../ref/result/#agents.result.RunResultBase "RunResultBase


  
      dataclass
  "), which is where most useful information is present.

## Final output

The [`final_output`](../ref/result/#agents.result.RunResultBase.final_output "final_output


  
      instance-attribute
  ") property contains the final output of the last agent that ran. This is either:

  * a `str`, if the last agent didn't have an `output_type` defined
  * an object of type `last_agent.output_type`, if the agent had an output type defined.



Note

`final_output` is of type `Any`. We can't statically type this, because of handoffs. If handoffs occur, that means any Agent might be the last agent, so we don't statically know the set of possible output types.

## Inputs for the next turn

You can use [`result.to_input_list()`](../ref/result/#agents.result.RunResultBase.to_input_list "to_input_list") to turn the result into an input list that concatenates the original input you provided, to the items generated during the agent run. This makes it convenient to take the outputs of one agent run and pass them into another run, or to run it in a loop and append new user inputs each time.

## Last agent

The [`last_agent`](../ref/result/#agents.result.RunResultBase.last_agent "last_agent


  
      abstractmethod
      property
  ") property contains the last agent that ran. Depending on your application, this is often useful for the next time the user inputs something. For example, if you have a frontline triage agent that hands off to a language-specific agent, you can store the last agent, and re-use it the next time the user messages the agent.

## New items

The [`new_items`](../ref/result/#agents.result.RunResultBase.new_items "new_items


  
      instance-attribute
  ") property contains the new items generated during the run. The items are [`RunItem`](../ref/items/#agents.items.RunItem "RunItem


  
      module-attribute
  ")s. A run item wraps the raw item generated by the LLM.

  * [`MessageOutputItem`](../ref/items/#agents.items.MessageOutputItem "MessageOutputItem


  
      dataclass
  ") indicates a message from the LLM. The raw item is the message generated.
  * [`HandoffCallItem`](../ref/items/#agents.items.HandoffCallItem "HandoffCallItem


  
      dataclass
  ") indicates that the LLM called the handoff tool. The raw item is the tool call item from the LLM.
  * [`HandoffOutputItem`](../ref/items/#agents.items.HandoffOutputItem "HandoffOutputItem


  
      dataclass
  ") indicates that a handoff occurred. The raw item is the tool response to the handoff tool call. You can also access the source/target agents from the item.
  * [`ToolCallItem`](../ref/items/#agents.items.ToolCallItem "ToolCallItem


  
      dataclass
  ") indicates that the LLM invoked a tool.
  * [`ToolCallOutputItem`](../ref/items/#agents.items.ToolCallOutputItem "ToolCallOutputItem


  
      dataclass
  ") indicates that a tool was called. The raw item is the tool response. You can also access the tool output from the item.
  * [`ReasoningItem`](../ref/items/#agents.items.ReasoningItem "ReasoningItem


  
      dataclass
  ") indicates a reasoning item from the LLM. The raw item is the reasoning generated.



## Other information

### Guardrail results

The [`input_guardrail_results`](../ref/result/#agents.result.RunResultBase.input_guardrail_results "input_guardrail_results


  
      instance-attribute
  ") and [`output_guardrail_results`](../ref/result/#agents.result.RunResultBase.output_guardrail_results "output_guardrail_results


  
      instance-attribute
  ") properties contain the results of the guardrails, if any. Guardrail results can sometimes contain useful information you want to log or store, so we make these available to you.

### Raw responses

The [`raw_responses`](../ref/result/#agents.result.RunResultBase.raw_responses "raw_responses


  
      instance-attribute
  ") property contains the [`ModelResponse`](../ref/items/#agents.items.ModelResponse "ModelResponse


  
      dataclass
  ")s generated by the LLM.

### Original input

The [`input`](../ref/result/#agents.result.RunResultBase.input "input


  
      instance-attribute
  ") property contains the original input you provided to the `run` method. In most cases you won't need this, but it's available in case you do.
