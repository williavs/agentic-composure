[ ![logo](../../../assets/logo.svg) ](../../.. "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "Go to repository")

  * [ Intro  ](../../..)
  * [ Quickstart  ](../../../quickstart/)
  * [ Examples  ](../../../examples/)
  * Documentation  Documentation 
    * [ Agents  ](../../../agents/)
    * [ Running agents  ](../../../running_agents/)
    * [ Results  ](../../../results/)
    * [ Streaming  ](../../../streaming/)
    * [ Tools  ](../../../tools/)
    * [ Model context protocol (MCP)  ](../../../mcp/)
    * [ Handoffs  ](../../../handoffs/)
    * [ Tracing  ](../../../tracing/)
    * [ Context management  ](../../../context/)
    * [ Guardrails  ](../../../guardrails/)
    * [ Orchestrating multiple agents  ](../../../multi_agent/)
    * Models  Models 
      * [ Models  ](../../../models/)
      * [ Using any model via LiteLLM  ](../../../models/litellm/)
    * [ Configuring the SDK  ](../../../config/)
    * [ Agent Visualization  ](../../../visualization/)
    * Voice agents  Voice agents 
      * [ Quickstart  ](../../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../../voice/pipeline/)
      * [ Tracing  ](../../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../../)
      * [ Agents  ](../../agent/)
      * [ Runner  ](../../run/)
      * [ Tools  ](../../tool/)
      * [ Results  ](../../result/)
      * [ Streaming events  ](../../stream_events/)
      * [ Handoffs  ](../../handoffs/)
      * [ Lifecycle  ](../../lifecycle/)
      * [ Items  ](../../items/)
      * [ Run context  ](../../run_context/)
      * [ Usage  ](../../usage/)
      * [ Exceptions  ](../../exceptions/)
      * [ Guardrails  ](../../guardrail/)
      * [ Model settings  ](../../model_settings/)
      * [ Agent output  ](../../agent_output/)
      * [ Function schema  ](../../function_schema/)
      * [ Model interface  ](../../models/interface/)
      * [ OpenAI Chat Completions model  ](../../models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../../models/openai_responses/)
      * [ MCP Servers  ](../../mcp/server/)
      * [ MCP Util  ](../../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../../tracing/)
      * [ Creating traces/spans  ](../../tracing/create/)
      * [ Traces  ](../../tracing/traces/)
      * [ Spans  ](../../tracing/spans/)
      * [ Processor interface  ](../../tracing/processor_interface/)
      * [ Processors  ](../../tracing/processors/)
      * [ Scope  ](../../tracing/scope/)
      * [ Setup  ](../../tracing/setup/)
      * [ Span data  ](../../tracing/span_data/)
      * [ Util  ](../../tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../pipeline/)
      * [ Workflow  ](../workflow/)
      * [ Input  ](../input/)
      * [ Result  ](../result/)
      * [ Pipeline Config  ](../pipeline_config/)
      * [ Events  ](../events/)
      * [ Exceptions  ](../exceptions/)
      * [ Model  ](../model/)
      * Utils  [ Utils  ](./) Table of contents 
        * utils 
        * get_sentence_based_splitter 
      * [ OpenAIVoiceModelProvider  ](../models/openai_provider/)
      * [ OpenAI STT  ](../models/openai_stt/)
      * [ OpenAI TTS  ](../models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../extensions/litellm/)



Table of contents 

  * utils 
  * get_sentence_based_splitter 



# `Utils`

###  get_sentence_based_splitter
    
    
    get_sentence_based_splitter(
        min_sentence_length: int = 20,
    ) -> Callable[[str], tuple[str, str]]
    

Returns a function that splits text into chunks based on sentence boundaries.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`min_sentence_length` |  `int` |  The minimum length of a sentence to be included in a chunk. |  `20`  
  
Returns:

Type | Description  
---|---  
`Callable[[str], tuple[str, str]]` |  A function that splits text into chunks based on sentence boundaries.  
Source code in `src/agents/voice/utils.py`
    
    
     5
     6
     7
     8
     9
    10
    11
    12
    13
    14
    15
    16
    17
    18
    19
    20
    21
    22
    23
    24
    25
    26
    27
    28
    29
    30
    31
    32
    33
    34
    35
    36
    37

| 
    
    
    def get_sentence_based_splitter(
        min_sentence_length: int = 20,
    ) -> Callable[[str], tuple[str, str]]:
        """Returns a function that splits text into chunks based on sentence boundaries.
    
        Args:
            min_sentence_length: The minimum length of a sentence to be included in a chunk.
    
        Returns:
            A function that splits text into chunks based on sentence boundaries.
        """
    
        def sentence_based_text_splitter(text_buffer: str) -> tuple[str, str]:
            """
            A function to split the text into chunks. This is useful if you want to split the text into
            chunks before sending it to the TTS model rather than waiting for the whole text to be
            processed.
    
            Args:
                text_buffer: The text to split.
    
            Returns:
                A tuple of the text to process and the remaining text buffer.
            """
            sentences = re.split(r"(?<=[.!?])\s+", text_buffer.strip())
            if len(sentences) >= 1:
                combined_sentences = " ".join(sentences[:-1])
                if len(combined_sentences) >= min_sentence_length:
                    remaining_text_buffer = sentences[-1]
                    return combined_sentences, remaining_text_buffer
            return "", text_buffer
    
        return sentence_based_text_splitter
      
  
---|---
