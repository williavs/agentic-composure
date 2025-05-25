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
      * Quickstart  [ Quickstart  ](./) Table of contents 
        * Prerequisites 
        * Concepts 
        * Agents 
        * Voice pipeline 
        * Run the pipeline 
        * Put it all together 
      * [ Pipelines and workflows  ](../pipeline/)
      * [ Tracing  ](../tracing/)
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

  * Prerequisites 
  * Concepts 
  * Agents 
  * Voice pipeline 
  * Run the pipeline 
  * Put it all together 



# Quickstart

## Prerequisites

Make sure you've followed the base [quickstart instructions](../../quickstart/) for the Agents SDK, and set up a virtual environment. Then, install the optional voice dependencies from the SDK:
    
    
    pip install 'openai-agents[voice]'
    

## Concepts

The main concept to know about is a [`VoicePipeline`](../../ref/voice/pipeline/#agents.voice.pipeline.VoicePipeline "VoicePipeline"), which is a 3 step process:

  1. Run a speech-to-text model to turn audio into text.
  2. Run your code, which is usually an agentic workflow, to produce a result.
  3. Run a text-to-speech model to turn the result text back into audio.


    
    
    graph LR
        %% Input
        A["🎤 Audio Input"]
    
        %% Voice Pipeline
        subgraph Voice_Pipeline [Voice Pipeline]
            direction TB
            B["Transcribe (speech-to-text)"]
            C["Your Code"]:::highlight
            D["Text-to-speech"]
            B --> C --> D
        end
    
        %% Output
        E["🎧 Audio Output"]
    
        %% Flow
        A --> Voice_Pipeline
        Voice_Pipeline --> E
    
        %% Custom styling
        classDef highlight fill:#ffcc66,stroke:#333,stroke-width:1px,font-weight:700;
    

## Agents

First, let's set up some Agents. This should feel familiar to you if you've built any agents with this SDK. We'll have a couple of Agents, a handoff, and a tool.
    
    
    import asyncio
    import random
    
    from agents import (
        Agent,
        function_tool,
    )
    from agents.extensions.handoff_prompt import prompt_with_handoff_instructions
    
    
    
    @function_tool
    def get_weather(city: str) -> str:
        """Get the weather for a given city."""
        print(f"[debug] get_weather called with city: {city}")
        choices = ["sunny", "cloudy", "rainy", "snowy"]
        return f"The weather in {city} is {random.choice(choices)}."
    
    
    spanish_agent = Agent(
        name="Spanish",
        handoff_description="A spanish speaking agent.",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. Speak in Spanish.",
        ),
        model="gpt-4o-mini",
    )
    
    agent = Agent(
        name="Assistant",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. If the user speaks in Spanish, handoff to the spanish agent.",
        ),
        model="gpt-4o-mini",
        handoffs=[spanish_agent],
        tools=[get_weather],
    )
    

## Voice pipeline

We'll set up a simple voice pipeline, using [`SingleAgentVoiceWorkflow`](../../ref/voice/workflow/#agents.voice.workflow.SingleAgentVoiceWorkflow "SingleAgentVoiceWorkflow") as the workflow.
    
    
    from agents.voice import SingleAgentVoiceWorkflow, VoicePipeline
    pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
    

## Run the pipeline
    
    
    import numpy as np
    import sounddevice as sd
    from agents.voice import AudioInput
    
    # For simplicity, we'll just create 3 seconds of silence
    # In reality, you'd get microphone data
    buffer = np.zeros(24000 * 3, dtype=np.int16)
    audio_input = AudioInput(buffer=buffer)
    
    result = await pipeline.run(audio_input)
    
    # Create an audio player using `sounddevice`
    player = sd.OutputStream(samplerate=24000, channels=1, dtype=np.int16)
    player.start()
    
    # Play the audio stream as it comes in
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            player.write(event.data)
    

## Put it all together
    
    
    import asyncio
    import random
    
    import numpy as np
    import sounddevice as sd
    
    from agents import (
        Agent,
        function_tool,
        set_tracing_disabled,
    )
    from agents.voice import (
        AudioInput,
        SingleAgentVoiceWorkflow,
        VoicePipeline,
    )
    from agents.extensions.handoff_prompt import prompt_with_handoff_instructions
    
    
    @function_tool
    def get_weather(city: str) -> str:
        """Get the weather for a given city."""
        print(f"[debug] get_weather called with city: {city}")
        choices = ["sunny", "cloudy", "rainy", "snowy"]
        return f"The weather in {city} is {random.choice(choices)}."
    
    
    spanish_agent = Agent(
        name="Spanish",
        handoff_description="A spanish speaking agent.",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. Speak in Spanish.",
        ),
        model="gpt-4o-mini",
    )
    
    agent = Agent(
        name="Assistant",
        instructions=prompt_with_handoff_instructions(
            "You're speaking to a human, so be polite and concise. If the user speaks in Spanish, handoff to the spanish agent.",
        ),
        model="gpt-4o-mini",
        handoffs=[spanish_agent],
        tools=[get_weather],
    )
    
    
    async def main():
        pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
        buffer = np.zeros(24000 * 3, dtype=np.int16)
        audio_input = AudioInput(buffer=buffer)
    
        result = await pipeline.run(audio_input)
    
        # Create an audio player using `sounddevice`
        player = sd.OutputStream(samplerate=24000, channels=1, dtype=np.int16)
        player.start()
    
        # Play the audio stream as it comes in
        async for event in result.stream():
            if event.type == "voice_stream_event_audio":
                player.write(event.data)
    
    
    if __name__ == "__main__":
        asyncio.run(main())
    

If you run this example, the agent will speak to you! Check out the example in [examples/voice/static](https://github.com/openai/openai-agents-python/tree/main/examples/voice/static) to see a demo where you can speak to the agent yourself.
