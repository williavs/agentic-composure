[ ![logo](../assets/logo.svg) ](.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](..)
  * [ Quickstart  ](../quickstart/)
  * [ Examples  ](../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../agents/)
    * Running agents  [ Running agents  ](./) Table of contents 
      * The agent loop 
      * Streaming 
      * Run config 
      * Conversations/chat threads 
      * Exceptions 
    * [ Results  ](../results/)
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

  * The agent loop 
  * Streaming 
  * Run config 
  * Conversations/chat threads 
  * Exceptions 



# Running agents

You can run agents via the [`Runner`](../ref/run/#agents.run.Runner "Runner") class. You have 3 options:

  1. [`Runner.run()`](../ref/run/#agents.run.Runner.run "run


  
      async
      classmethod
  "), which runs async and returns a [`RunResult`](../ref/result/#agents.result.RunResult "RunResult


  
      dataclass
  ").
  2. [`Runner.run_sync()`](../ref/run/#agents.run.Runner.run_sync "run_sync


  
      classmethod
  "), which is a sync method and just runs `.run()` under the hood.
  3. [`Runner.run_streamed()`](../ref/run/#agents.run.Runner.run_streamed "run_streamed


  
      classmethod
  "), which runs async and returns a [`RunResultStreaming`](../ref/result/#agents.result.RunResultStreaming "RunResultStreaming


  
      dataclass
  "). It calls the LLM in streaming mode, and streams those events to you as they are received.


    
    
    from agents import Agent, Runner
    
    async def main():
        agent = Agent(name="Assistant", instructions="You are a helpful assistant")
    
        result = await Runner.run(agent, "Write a haiku about recursion in programming.")
        print(result.final_output)
        # Code within the code,
        # Functions calling themselves,
        # Infinite loop's dance.
    

Read more in the [results guide](../results/).

## The agent loop

When you use the run method in `Runner`, you pass in a starting agent and input. The input can either be a string (which is considered a user message), or a list of input items, which are the items in the OpenAI Responses API.

The runner then runs a loop:

  1. We call the LLM for the current agent, with the current input.
  2. The LLM produces its output.
    1. If the LLM returns a `final_output`, the loop ends and we return the result.
    2. If the LLM does a handoff, we update the current agent and input, and re-run the loop.
    3. If the LLM produces tool calls, we run those tool calls, append the results, and re-run the loop.
  3. If we exceed the `max_turns` passed, we raise a [`MaxTurnsExceeded`](../ref/exceptions/#agents.exceptions.MaxTurnsExceeded "MaxTurnsExceeded") exception.



Note

The rule for whether the LLM output is considered as a "final output" is that it produces text output with the desired type, and there are no tool calls.

## Streaming

Streaming allows you to additionally receive streaming events as the LLM runs. Once the stream is done, the [`RunResultStreaming`](../ref/result/#agents.result.RunResultStreaming "RunResultStreaming


  
      dataclass
  ") will contain the complete information about the run, including all the new outputs produces. You can call `.stream_events()` for the streaming events. Read more in the [streaming guide](../streaming/).

## Run config

The `run_config` parameter lets you configure some global settings for the agent run:

  * [`model`](../ref/run/#agents.run.RunConfig.model "model


  
      class-attribute
      instance-attribute
  "): Allows setting a global LLM model to use, irrespective of what `model` each Agent has.
  * [`model_provider`](../ref/run/#agents.run.RunConfig.model_provider "model_provider


  
      class-attribute
      instance-attribute
  "): A model provider for looking up model names, which defaults to OpenAI.
  * [`model_settings`](../ref/run/#agents.run.RunConfig.model_settings "model_settings


  
      class-attribute
      instance-attribute
  "): Overrides agent-specific settings. For example, you can set a global `temperature` or `top_p`.
  * [`input_guardrails`](../ref/run/#agents.run.RunConfig.input_guardrails "input_guardrails


  
      class-attribute
      instance-attribute
  "), [`output_guardrails`](../ref/run/#agents.run.RunConfig.output_guardrails "output_guardrails


  
      class-attribute
      instance-attribute
  "): A list of input or output guardrails to include on all runs.
  * [`handoff_input_filter`](../ref/run/#agents.run.RunConfig.handoff_input_filter "handoff_input_filter


  
      class-attribute
      instance-attribute
  "): A global input filter to apply to all handoffs, if the handoff doesn't already have one. The input filter allows you to edit the inputs that are sent to the new agent. See the documentation in [`Handoff.input_filter`](../ref/handoffs/#agents.handoffs.Handoff.input_filter "input_filter


  
      class-attribute
      instance-attribute
  ") for more details.
  * [`tracing_disabled`](../ref/run/#agents.run.RunConfig.tracing_disabled "tracing_disabled


  
      class-attribute
      instance-attribute
  "): Allows you to disable [tracing](../tracing/) for the entire run.
  * [`trace_include_sensitive_data`](../ref/run/#agents.run.RunConfig.trace_include_sensitive_data "trace_include_sensitive_data


  
      class-attribute
      instance-attribute
  "): Configures whether traces will include potentially sensitive data, such as LLM and tool call inputs/outputs.
  * [`workflow_name`](../ref/run/#agents.run.RunConfig.workflow_name "workflow_name


  
      class-attribute
      instance-attribute
  "), [`trace_id`](../ref/run/#agents.run.RunConfig.trace_id "trace_id


  
      class-attribute
      instance-attribute
  "), [`group_id`](../ref/run/#agents.run.RunConfig.group_id "group_id


  
      class-attribute
      instance-attribute
  "): Sets the tracing workflow name, trace ID and trace group ID for the run. We recommend at least setting `workflow_name`. The group ID is an optional field that lets you link traces across multiple runs.
  * [`trace_metadata`](../ref/run/#agents.run.RunConfig.trace_metadata "trace_metadata


  
      class-attribute
      instance-attribute
  "): Metadata to include on all traces.



## Conversations/chat threads

Calling any of the run methods can result in one or more agents running (and hence one or more LLM calls), but it represents a single logical turn in a chat conversation. For example:

  1. User turn: user enter text
  2. Runner run: first agent calls LLM, runs tools, does a handoff to a second agent, second agent runs more tools, and then produces an output.



At the end of the agent run, you can choose what to show to the user. For example, you might show the user every new item generated by the agents, or just the final output. Either way, the user might then ask a followup question, in which case you can call the run method again.

You can use the base [`RunResultBase.to_input_list()`](../ref/result/#agents.result.RunResultBase.to_input_list "to_input_list") method to get the inputs for the next turn.
    
    
    async def main():
        agent = Agent(name="Assistant", instructions="Reply very concisely.")
    
        with trace(workflow_name="Conversation", group_id=thread_id):
            # First turn
            result = await Runner.run(agent, "What city is the Golden Gate Bridge in?")
            print(result.final_output)
            # San Francisco
    
            # Second turn
            new_input = result.to_input_list() + [{"role": "user", "content": "What state is it in?"}]
            result = await Runner.run(agent, new_input)
            print(result.final_output)
            # California
    

## Exceptions

The SDK raises exceptions in certain cases. The full list is in [`agents.exceptions`](../ref/exceptions/#agents.exceptions). As an overview:

  * [`AgentsException`](../ref/exceptions/#agents.exceptions.AgentsException "AgentsException") is the base class for all exceptions raised in the SDK.
  * [`MaxTurnsExceeded`](../ref/exceptions/#agents.exceptions.MaxTurnsExceeded "MaxTurnsExceeded") is raised when the run exceeds the `max_turns` passed to the run methods.
  * [`ModelBehaviorError`](../ref/exceptions/#agents.exceptions.ModelBehaviorError "ModelBehaviorError") is raised when the model produces invalid outputs, e.g. malformed JSON or using non-existent tools.
  * [`UserError`](../ref/exceptions/#agents.exceptions.UserError "UserError") is raised when you (the person writing code using the SDK) make an error using the SDK.
  * [`InputGuardrailTripwireTriggered`](../ref/exceptions/#agents.exceptions.InputGuardrailTripwireTriggered "InputGuardrailTripwireTriggered"), [`OutputGuardrailTripwireTriggered`](../ref/exceptions/#agents.exceptions.OutputGuardrailTripwireTriggered "OutputGuardrailTripwireTriggered") is raised when a [guardrail](../guardrails/) is tripped.


