[ ![logo](../../../../assets/logo.svg) ](../../../ "OpenAI Agents SDK") OpenAI Agents SDK 

[ openai-agents-python  ](https://github.com/openai/openai-agents-python "リポジトリへ")

  * [ はじめに  ](../../../)
  * [ クイックスタート  ](../../../quickstart/)
  * [ コード例  ](../../../examples/)
  * ドキュメント  ドキュメント 
    * [ エージェント  ](../../../agents/)
    * [ エージェントの実行  ](../../../running_agents/)
    * [ 結果  ](../../../results/)
    * [ ストリーミング  ](../../../streaming/)
    * [ ツール  ](../../../tools/)
    * [ Model context protocol (MCP)  ](../../../mcp/)
    * [ ハンドオフ  ](../../../handoffs/)
    * [ トレーシング  ](../../../tracing/)
    * [ コンテキスト管理  ](../../../context/)
    * [ ガードレール  ](../../../guardrails/)
    * [ 複数エージェントのオーケストレーション  ](../../../multi_agent/)
    * モデル  モデル 
      * [ モデル  ](../../../models/)
      * [ LiteLLM 経由でのモデル利用  ](../../../models/litellm/)
    * [ SDK の設定  ](../../../config/)
    * [ エージェントの可視化  ](../../../visualization/)
    * 音声エージェント  音声エージェント 
      * [ クイックスタート  ](../../../voice/quickstart/)
      * [ パイプラインと ワークフロー  ](../../../voice/pipeline/)
      * [ トレーシング  ](../../../voice/tracing/)



目次 

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
