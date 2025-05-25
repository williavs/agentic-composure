[ ![logo](assets/logo.svg) ](. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * Intro  [ Intro  ](.) Table of contents 
    * Why use the Agents SDK 
    * Installation 
    * Hello world example 
  * [ Quickstart  ](quickstart/)
  * [ Examples  ](examples/)
  * Documentation  Documentation 
    * [ Agents  ](agents/)
    * [ Running agents  ](running_agents/)
    * [ Results  ](results/)
    * [ Streaming  ](streaming/)
    * [ Tools  ](tools/)
    * [ Model context protocol (MCP)  ](mcp/)
    * [ Handoffs  ](handoffs/)
    * [ Tracing  ](tracing/)
    * [ Context management  ](context/)
    * [ Guardrails  ](guardrails/)
    * [ Orchestrating multiple agents  ](multi_agent/)
    * Models  Models 
      * [ Models  ](models/)
      * [ Using any model via LiteLLM  ](models/litellm/)
    * [ Configuring the SDK  ](config/)
    * [ Agent Visualization  ](visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](voice/quickstart/)
      * [ Pipelines and workflows  ](voice/pipeline/)
      * [ Tracing  ](voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](ref/)
      * [ Agents  ](ref/agent/)
      * [ Runner  ](ref/run/)
      * [ Tools  ](ref/tool/)
      * [ Results  ](ref/result/)
      * [ Streaming events  ](ref/stream_events/)
      * [ Handoffs  ](ref/handoffs/)
      * [ Lifecycle  ](ref/lifecycle/)
      * [ Items  ](ref/items/)
      * [ Run context  ](ref/run_context/)
      * [ Usage  ](ref/usage/)
      * [ Exceptions  ](ref/exceptions/)
      * [ Guardrails  ](ref/guardrail/)
      * [ Model settings  ](ref/model_settings/)
      * [ Agent output  ](ref/agent_output/)
      * [ Function schema  ](ref/function_schema/)
      * [ Model interface  ](ref/models/interface/)
      * [ OpenAI Chat Completions model  ](ref/models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](ref/models/openai_responses/)
      * [ MCP Servers  ](ref/mcp/server/)
      * [ MCP Util  ](ref/mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](ref/tracing/)
      * [ Creating traces/spans  ](ref/tracing/create/)
      * [ Traces  ](ref/tracing/traces/)
      * [ Spans  ](ref/tracing/spans/)
      * [ Processor interface  ](ref/tracing/processor_interface/)
      * [ Processors  ](ref/tracing/processors/)
      * [ Scope  ](ref/tracing/scope/)
      * [ Setup  ](ref/tracing/setup/)
      * [ Span data  ](ref/tracing/span_data/)
      * [ Util  ](ref/tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](ref/voice/pipeline/)
      * [ Workflow  ](ref/voice/workflow/)
      * [ Input  ](ref/voice/input/)
      * [ Result  ](ref/voice/result/)
      * [ Pipeline Config  ](ref/voice/pipeline_config/)
      * [ Events  ](ref/voice/events/)
      * [ Exceptions  ](ref/voice/exceptions/)
      * [ Model  ](ref/voice/model/)
      * [ Utils  ](ref/voice/utils/)
      * [ OpenAIVoiceModelProvider  ](ref/voice/models/openai_provider/)
      * [ OpenAI STT  ](ref/voice/models/openai_stt/)
      * [ OpenAI TTS  ](ref/voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](ref/extensions/handoff_filters/)
      * [ Handoff prompt  ](ref/extensions/handoff_prompt/)
      * [ LiteLLM Models  ](ref/extensions/litellm/)



Table of contents 

  * Why use the Agents SDK 
  * Installation 
  * Hello world example 



# OpenAI Agents SDK

The [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) enables you to build agentic AI apps in a lightweight, easy-to-use package with very few abstractions. It's a production-ready upgrade of our previous experimentation for agents, [Swarm](https://github.com/openai/swarm/tree/main). The Agents SDK has a very small set of primitives:

  * **Agents** , which are LLMs equipped with instructions and tools
  * **Handoffs** , which allow agents to delegate to other agents for specific tasks
  * **Guardrails** , which enable the inputs to agents to be validated



In combination with Python, these primitives are powerful enough to express complex relationships between tools and agents, and allow you to build real-world applications without a steep learning curve. In addition, the SDK comes with built-in **tracing** that lets you visualize and debug your agentic flows, as well as evaluate them and even fine-tune models for your application.

## Why use the Agents SDK

The SDK has two driving design principles:

  1. Enough features to be worth using, but few enough primitives to make it quick to learn.
  2. Works great out of the box, but you can customize exactly what happens.



Here are the main features of the SDK:

  * Agent loop: Built-in agent loop that handles calling tools, sending results to the LLM, and looping until the LLM is done.
  * Python-first: Use built-in language features to orchestrate and chain agents, rather than needing to learn new abstractions.
  * Handoffs: A powerful feature to coordinate and delegate between multiple agents.
  * Guardrails: Run input validations and checks in parallel to your agents, breaking early if the checks fail.
  * Function tools: Turn any Python function into a tool, with automatic schema generation and Pydantic-powered validation.
  * Tracing: Built-in tracing that lets you visualize, debug and monitor your workflows, as well as use the OpenAI suite of evaluation, fine-tuning and distillation tools.



## Installation
    
    
    pip install openai-agents
    

## Hello world example
    
    
    from agents import Agent, Runner
    
    agent = Agent(name="Assistant", instructions="You are a helpful assistant")
    
    result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
    print(result.final_output)
    
    # Code within the code,
    # Functions calling themselves,
    # Infinite loop's dance.
    

(_If running this, ensure you set the`OPENAI_API_KEY` environment variable_)
    
    
    export OPENAI_API_KEY=sk-...
    
