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
      * [ Models  ](../)
      * Using any model via LiteLLM  [ Using any model via LiteLLM  ](./) Table of contents 
        * Setup 
        * Example 
    * [ Configuring the SDK  ](../../config/)
    * [ Agent Visualization  ](../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../voice/pipeline/)
      * [ Tracing  ](../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../../ref/)
      * [ Agents  ](../../ref/agent/)
      * [ Runner  ](../../ref/run/)
      * [ Tools  ](../../ref/tool/)
      * [ Results  ](../../ref/result/)
      * [ Streaming events  ](../../ref/stream_events/)
      * [ Handoffs  ](../../ref/handoffs/)
      * [ Lifecycle  ](../../ref/lifecycle/)
      * [ Items  ](../../ref/items/)
      * [ Run context  ](../../ref/run_context/)
      * [ Usage  ](../../ref/usage/)
      * [ Exceptions  ](../../ref/exceptions/)
      * [ Guardrails  ](../../ref/guardrail/)
      * [ Model settings  ](../../ref/model_settings/)
      * [ Agent output  ](../../ref/agent_output/)
      * [ Function schema  ](../../ref/function_schema/)
      * [ Model interface  ](../../ref/models/interface/)
      * [ OpenAI Chat Completions model  ](../../ref/models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../../ref/models/openai_responses/)
      * [ MCP Servers  ](../../ref/mcp/server/)
      * [ MCP Util  ](../../ref/mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../../ref/tracing/)
      * [ Creating traces/spans  ](../../ref/tracing/create/)
      * [ Traces  ](../../ref/tracing/traces/)
      * [ Spans  ](../../ref/tracing/spans/)
      * [ Processor interface  ](../../ref/tracing/processor_interface/)
      * [ Processors  ](../../ref/tracing/processors/)
      * [ Scope  ](../../ref/tracing/scope/)
      * [ Setup  ](../../ref/tracing/setup/)
      * [ Span data  ](../../ref/tracing/span_data/)
      * [ Util  ](../../ref/tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../../ref/voice/pipeline/)
      * [ Workflow  ](../../ref/voice/workflow/)
      * [ Input  ](../../ref/voice/input/)
      * [ Result  ](../../ref/voice/result/)
      * [ Pipeline Config  ](../../ref/voice/pipeline_config/)
      * [ Events  ](../../ref/voice/events/)
      * [ Exceptions  ](../../ref/voice/exceptions/)
      * [ Model  ](../../ref/voice/model/)
      * [ Utils  ](../../ref/voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../../ref/voice/models/openai_provider/)
      * [ OpenAI STT  ](../../ref/voice/models/openai_stt/)
      * [ OpenAI TTS  ](../../ref/voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../ref/extensions/handoff_filters/)
      * [ Handoff prompt  ](../../ref/extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../ref/extensions/litellm/)



Table of contents 

  * Setup 
  * Example 



# Using any model via LiteLLM

Note

The LiteLLM integration is in beta. You may run into issues with some model providers, especially smaller ones. Please report any issues via [Github issues](https://github.com/openai/openai-agents-python/issues) and we'll fix quickly.

[LiteLLM](https://docs.litellm.ai/docs/) is a library that allows you to use 100+ models via a single interface. We've added a LiteLLM integration to allow you to use any AI model in the Agents SDK.

## Setup

You'll need to ensure `litellm` is available. You can do this by installing the optional `litellm` dependency group:
    
    
    pip install "openai-agents[litellm]"
    

Once done, you can use [`LitellmModel`](../../ref/extensions/litellm/#agents.extensions.models.litellm_model.LitellmModel "LitellmModel") in any agent.

## Example

This is a fully working example. When you run it, you'll be prompted for a model name and API key. For example, you could enter:

  * `openai/gpt-4.1` for the model, and your OpenAI API key
  * `anthropic/claude-3-5-sonnet-20240620` for the model, and your Anthropic API key
  * etc



For a full list of models supported in LiteLLM, see the [litellm providers docs](https://docs.litellm.ai/docs/providers).
    
    
    from __future__ import annotations
    
    import asyncio
    
    from agents import Agent, Runner, function_tool, set_tracing_disabled
    from agents.extensions.models.litellm_model import LitellmModel
    
    @function_tool
    def get_weather(city: str):
        print(f"[debug] getting weather for {city}")
        return f"The weather in {city} is sunny."
    
    
    async def main(model: str, api_key: str):
        agent = Agent(
            name="Assistant",
            instructions="You only respond in haikus.",
            model=LitellmModel(model=model, api_key=api_key),
            tools=[get_weather],
        )
    
        result = await Runner.run(agent, "What's the weather in Tokyo?")
        print(result.final_output)
    
    
    if __name__ == "__main__":
        # First try to get model/api key from args
        import argparse
    
        parser = argparse.ArgumentParser()
        parser.add_argument("--model", type=str, required=False)
        parser.add_argument("--api-key", type=str, required=False)
        args = parser.parse_args()
    
        model = args.model
        if not model:
            model = input("Enter a model name for Litellm: ")
    
        api_key = args.api_key
        if not api_key:
            api_key = input("Enter an API key for Litellm: ")
    
        asyncio.run(main(model, api_key))
    
