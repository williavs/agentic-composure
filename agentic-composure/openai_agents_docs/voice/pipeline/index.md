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
      * [ Quickstart  ](../quickstart/)
      * Pipelines and workflows  [ Pipelines and workflows  ](./) Table of contents 
        * Configuring a pipeline 
        * Running a pipeline 
        * Results 
        * Best practices 
          * Interruptions 
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

  * Configuring a pipeline 
  * Running a pipeline 
  * Results 
  * Best practices 
    * Interruptions 



# Pipelines and workflows

[`VoicePipeline`](../../ref/voice/pipeline/#agents.voice.pipeline.VoicePipeline "VoicePipeline") is a class that makes it easy to turn your agentic workflows into a voice app. You pass in a workflow to run, and the pipeline takes care of transcribing input audio, detecting when the audio ends, calling your workflow at the right time, and turning the workflow output back into audio.
    
    
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
    

## Configuring a pipeline

When you create a pipeline, you can set a few things:

  1. The [`workflow`](../../ref/voice/workflow/#agents.voice.workflow.VoiceWorkflowBase "VoiceWorkflowBase"), which is the code that runs each time new audio is transcribed.
  2. The [`speech-to-text`](../../ref/voice/model/#agents.voice.model.STTModel "STTModel") and [`text-to-speech`](../../ref/voice/model/#agents.voice.model.TTSModel "TTSModel") models used
  3. The [`config`](../../ref/voice/pipeline_config/#agents.voice.pipeline_config.VoicePipelineConfig "VoicePipelineConfig


  
      dataclass
  "), which lets you configure things like:
     * A model provider, which can map model names to models
     * Tracing, including whether to disable tracing, whether audio files are uploaded, the workflow name, trace IDs etc.
     * Settings on the TTS and STT models, like the prompt, language and data types used.



## Running a pipeline

You can run a pipeline via the [`run()`](../../ref/voice/pipeline/#agents.voice.pipeline.VoicePipeline.run "run


  
      async
  ") method, which lets you pass in audio input in two forms:

  1. [`AudioInput`](../../ref/voice/input/#agents.voice.input.AudioInput "AudioInput


  
      dataclass
  ") is used when you have a full audio transcript, and just want to produce a result for it. This is useful in cases where you don't need to detect when a speaker is done speaking; for example, when you have pre-recorded audio or in push-to-talk apps where it's clear when the user is done speaking.
  2. [`StreamedAudioInput`](../../ref/voice/input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput") is used when you might need to detect when a user is done speaking. It allows you to push audio chunks as they are detected, and the voice pipeline will automatically run the agent workflow at the right time, via a process called "activity detection".



## Results

The result of a voice pipeline run is a [`StreamedAudioResult`](../../ref/voice/result/#agents.voice.result.StreamedAudioResult "StreamedAudioResult"). This is an object that lets you stream events as they occur. There are a few kinds of [`VoiceStreamEvent`](../../ref/voice/events/#agents.voice.events.VoiceStreamEvent "VoiceStreamEvent


  
      module-attribute
  "), including:

  1. [`VoiceStreamEventAudio`](../../ref/voice/events/#agents.voice.events.VoiceStreamEventAudio "VoiceStreamEventAudio


  
      dataclass
  "), which contains a chunk of audio.
  2. [`VoiceStreamEventLifecycle`](../../ref/voice/events/#agents.voice.events.VoiceStreamEventLifecycle "VoiceStreamEventLifecycle


  
      dataclass
  "), which informs you of lifecycle events like a turn starting or ending.
  3. [`VoiceStreamEventError`](../../ref/voice/events/#agents.voice.events.VoiceStreamEventError "VoiceStreamEventError


  
      dataclass
  "), is an error event.


    
    
    result = await pipeline.run(input)
    
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            # play audio
        elif event.type == "voice_stream_event_lifecycle":
            # lifecycle
        elif event.type == "voice_stream_event_error"
            # error
        ...
    

## Best practices

### Interruptions

The Agents SDK currently does not support any built-in interruptions support for [`StreamedAudioInput`](../../ref/voice/input/#agents.voice.input.StreamedAudioInput "StreamedAudioInput"). Instead for every detected turn it will trigger a separate run of your workflow. If you want to handle interruptions inside your application you can listen to the [`VoiceStreamEventLifecycle`](../../ref/voice/events/#agents.voice.events.VoiceStreamEventLifecycle "VoiceStreamEventLifecycle


  
      dataclass
  ") events. `turn_started` will indicate that a new turn was transcribed and processing is beginning. `turn_ended` will trigger after all the audio was dispatched for a respective turn. You could use these events to mute the microphone of the speaker when the model starts a turn and unmute it after you flushed all the related audio for a turn.
