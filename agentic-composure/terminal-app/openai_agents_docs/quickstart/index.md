[ ![logo](../assets/logo.svg) ](.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](..)
  * Quickstart  [ Quickstart  ](./) Table of contents 
    * Create a project and virtual environment 
      * Activate the virtual environment 
      * Install the Agents SDK 
      * Set an OpenAI API key 
    * Create your first agent 
    * Add a few more agents 
    * Define your handoffs 
    * Run the agent orchestration 
    * Add a guardrail 
    * Put it all together 
    * View your traces 
    * Next steps 
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

  * Create a project and virtual environment 
    * Activate the virtual environment 
    * Install the Agents SDK 
    * Set an OpenAI API key 
  * Create your first agent 
  * Add a few more agents 
  * Define your handoffs 
  * Run the agent orchestration 
  * Add a guardrail 
  * Put it all together 
  * View your traces 
  * Next steps 



# Quickstart

## Create a project and virtual environment

You'll only need to do this once.
    
    
    mkdir my_project
    cd my_project
    python -m venv .venv
    

### Activate the virtual environment

Do this every time you start a new terminal session.
    
    
    source .venv/bin/activate
    

### Install the Agents SDK
    
    
    pip install openai-agents # or `uv add openai-agents`, etc
    

### Set an OpenAI API key

If you don't have one, follow [these instructions](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key) to create an OpenAI API key.
    
    
    export OPENAI_API_KEY=sk-...
    

## Create your first agent

Agents are defined with instructions, a name, and optional config (such as `model_config`)
    
    
    from agents import Agent
    
    agent = Agent(
        name="Math Tutor",
        instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    )
    

## Add a few more agents

Additional agents can be defined in the same way. `handoff_descriptions` provide additional context for determining handoff routing
    
    
    from agents import Agent
    
    history_tutor_agent = Agent(
        name="History Tutor",
        handoff_description="Specialist agent for historical questions",
        instructions="You provide assistance with historical queries. Explain important events and context clearly.",
    )
    
    math_tutor_agent = Agent(
        name="Math Tutor",
        handoff_description="Specialist agent for math questions",
        instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    )
    

## Define your handoffs

On each agent, you can define an inventory of outgoing handoff options that the agent can choose from to decide how to make progress on their task.
    
    
    triage_agent = Agent(
        name="Triage Agent",
        instructions="You determine which agent to use based on the user's homework question",
        handoffs=[history_tutor_agent, math_tutor_agent]
    )
    

## Run the agent orchestration

Let's check that the workflow runs and the triage agent correctly routes between the two specialist agents.
    
    
    from agents import Runner
    
    async def main():
        result = await Runner.run(triage_agent, "What is the capital of France?")
        print(result.final_output)
    

## Add a guardrail

You can define custom guardrails to run on the input or output.
    
    
    from agents import GuardrailFunctionOutput, Agent, Runner
    from pydantic import BaseModel
    
    class HomeworkOutput(BaseModel):
        is_homework: bool
        reasoning: str
    
    guardrail_agent = Agent(
        name="Guardrail check",
        instructions="Check if the user is asking about homework.",
        output_type=HomeworkOutput,
    )
    
    async def homework_guardrail(ctx, agent, input_data):
        result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
        final_output = result.final_output_as(HomeworkOutput)
        return GuardrailFunctionOutput(
            output_info=final_output,
            tripwire_triggered=not final_output.is_homework,
        )
    

## Put it all together

Let's put it all together and run the entire workflow, using handoffs and the input guardrail.
    
    
    from agents import Agent, InputGuardrail, GuardrailFunctionOutput, Runner
    from pydantic import BaseModel
    import asyncio
    
    class HomeworkOutput(BaseModel):
        is_homework: bool
        reasoning: str
    
    guardrail_agent = Agent(
        name="Guardrail check",
        instructions="Check if the user is asking about homework.",
        output_type=HomeworkOutput,
    )
    
    math_tutor_agent = Agent(
        name="Math Tutor",
        handoff_description="Specialist agent for math questions",
        instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    )
    
    history_tutor_agent = Agent(
        name="History Tutor",
        handoff_description="Specialist agent for historical questions",
        instructions="You provide assistance with historical queries. Explain important events and context clearly.",
    )
    
    
    async def homework_guardrail(ctx, agent, input_data):
        result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
        final_output = result.final_output_as(HomeworkOutput)
        return GuardrailFunctionOutput(
            output_info=final_output,
            tripwire_triggered=not final_output.is_homework,
        )
    
    triage_agent = Agent(
        name="Triage Agent",
        instructions="You determine which agent to use based on the user's homework question",
        handoffs=[history_tutor_agent, math_tutor_agent],
        input_guardrails=[
            InputGuardrail(guardrail_function=homework_guardrail),
        ],
    )
    
    async def main():
        result = await Runner.run(triage_agent, "who was the first president of the united states?")
        print(result.final_output)
    
        result = await Runner.run(triage_agent, "what is life")
        print(result.final_output)
    
    if __name__ == "__main__":
        asyncio.run(main())
    

## View your traces

To review what happened during your agent run, navigate to the [Trace viewer in the OpenAI Dashboard](https://platform.openai.com/traces) to view traces of your agent runs.

## Next steps

Learn how to build more complex agentic flows:

  * Learn about how to configure [Agents](../agents/).
  * Learn about [running agents](../running_agents/).
  * Learn about [tools](../tools/), [guardrails](../guardrails/) and [models](../models/).


