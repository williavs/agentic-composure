[ ![logo](../assets/logo.svg) ](.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](..)
  * [ Quickstart  ](../quickstart/)
  * [ Examples  ](../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../agents/)
    * [ Running agents  ](../running_agents/)
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
    * Agent Visualization  [ Agent Visualization  ](./) Table of contents 
      * Installation 
      * Generating a Graph 
        * Example Usage 
      * Understanding the Visualization 
      * Customizing the Graph 
        * Showing the Graph 
        * Saving the Graph 
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

  * Installation 
  * Generating a Graph 
    * Example Usage 
  * Understanding the Visualization 
  * Customizing the Graph 
    * Showing the Graph 
    * Saving the Graph 



# Agent Visualization

Agent visualization allows you to generate a structured graphical representation of agents and their relationships using **Graphviz**. This is useful for understanding how agents, tools, and handoffs interact within an application.

## Installation

Install the optional `viz` dependency group:
    
    
    pip install "openai-agents[viz]"
    

## Generating a Graph

You can generate an agent visualization using the `draw_graph` function. This function creates a directed graph where:

  * **Agents** are represented as yellow boxes.
  * **Tools** are represented as green ellipses.
  * **Handoffs** are directed edges from one agent to another.



### Example Usage
    
    
    from agents import Agent, function_tool
    from agents.extensions.visualization import draw_graph
    
    @function_tool
    def get_weather(city: str) -> str:
        return f"The weather in {city} is sunny."
    
    spanish_agent = Agent(
        name="Spanish agent",
        instructions="You only speak Spanish.",
    )
    
    english_agent = Agent(
        name="English agent",
        instructions="You only speak English",
    )
    
    triage_agent = Agent(
        name="Triage agent",
        instructions="Handoff to the appropriate agent based on the language of the request.",
        handoffs=[spanish_agent, english_agent],
        tools=[get_weather],
    )
    
    draw_graph(triage_agent)
    

![Agent Graph](../assets/images/graph.png)

This generates a graph that visually represents the structure of the **triage agent** and its connections to sub-agents and tools.

## Understanding the Visualization

The generated graph includes:

  * A **start node** (`__start__`) indicating the entry point.
  * Agents represented as **rectangles** with yellow fill.
  * Tools represented as **ellipses** with green fill.
  * Directed edges indicating interactions:
  * **Solid arrows** for agent-to-agent handoffs.
  * **Dotted arrows** for tool invocations.
  * An **end node** (`__end__`) indicating where execution terminates.



## Customizing the Graph

### Showing the Graph

By default, `draw_graph` displays the graph inline. To show the graph in a separate window, write the following:
    
    
    draw_graph(triage_agent).view()
    

### Saving the Graph

By default, `draw_graph` displays the graph inline. To save it as a file, specify a filename:
    
    
    draw_graph(triage_agent, filename="agent_graph")
    

This will generate `agent_graph.png` in the working directory.
