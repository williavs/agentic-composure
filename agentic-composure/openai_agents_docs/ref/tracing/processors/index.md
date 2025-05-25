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
      * [ Tracing module  ](../)
      * [ Creating traces/spans  ](../create/)
      * [ Traces  ](../traces/)
      * [ Spans  ](../spans/)
      * [ Processor interface  ](../processor_interface/)
      * Processors  [ Processors  ](./) Table of contents 
        * processors 
        * ConsoleSpanExporter 
        * BackendSpanExporter 
          * __init__ 
          * set_api_key 
          * close 
        * BatchTraceProcessor 
          * __init__ 
          * shutdown 
          * force_flush 
        * default_exporter 
        * default_processor 
      * [ Scope  ](../scope/)
      * [ Setup  ](../setup/)
      * [ Span data  ](../span_data/)
      * [ Util  ](../util/)
    * Voice  Voice 
      * [ Pipeline  ](../../voice/pipeline/)
      * [ Workflow  ](../../voice/workflow/)
      * [ Input  ](../../voice/input/)
      * [ Result  ](../../voice/result/)
      * [ Pipeline Config  ](../../voice/pipeline_config/)
      * [ Events  ](../../voice/events/)
      * [ Exceptions  ](../../voice/exceptions/)
      * [ Model  ](../../voice/model/)
      * [ Utils  ](../../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../../voice/models/openai_provider/)
      * [ OpenAI STT  ](../../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../../extensions/handoff_filters/)
      * [ Handoff prompt  ](../../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../../extensions/litellm/)



Table of contents 

  * processors 
  * ConsoleSpanExporter 
  * BackendSpanExporter 
    * __init__ 
    * set_api_key 
    * close 
  * BatchTraceProcessor 
    * __init__ 
    * shutdown 
    * force_flush 
  * default_exporter 
  * default_processor 



# `Processors`

###  ConsoleSpanExporter

Bases: `[TracingExporter](../processor_interface/#agents.tracing.processor_interface.TracingExporter "TracingExporter \(agents.tracing.processor_interface.TracingExporter\)")`

Prints the traces and spans to the console.

Source code in `src/agents/tracing/processors.py`
    
    
    19
    20
    21
    22
    23
    24
    25
    26
    27

| 
    
    
    class ConsoleSpanExporter(TracingExporter):
        """Prints the traces and spans to the console."""
    
        def export(self, items: list[Trace | Span[Any]]) -> None:
            for item in items:
                if isinstance(item, Trace):
                    print(f"[Exporter] Export trace_id={item.trace_id}, name={item.name}, ")
                else:
                    print(f"[Exporter] Export span: {item.export()}")
      
  
---|---  
  
###  BackendSpanExporter

Bases: `[TracingExporter](../processor_interface/#agents.tracing.processor_interface.TracingExporter "TracingExporter \(agents.tracing.processor_interface.TracingExporter\)")`

Source code in `src/agents/tracing/processors.py`
    
    
     30
     31
     32
     33
     34
     35
     36
     37
     38
     39
     40
     41
     42
     43
     44
     45
     46
     47
     48
     49
     50
     51
     52
     53
     54
     55
     56
     57
     58
     59
     60
     61
     62
     63
     64
     65
     66
     67
     68
     69
     70
     71
     72
     73
     74
     75
     76
     77
     78
     79
     80
     81
     82
     83
     84
     85
     86
     87
     88
     89
     90
     91
     92
     93
     94
     95
     96
     97
     98
     99
    100
    101
    102
    103
    104
    105
    106
    107
    108
    109
    110
    111
    112
    113
    114
    115
    116
    117
    118
    119
    120
    121
    122
    123
    124
    125
    126
    127
    128
    129
    130
    131
    132
    133
    134
    135
    136
    137
    138
    139
    140
    141
    142
    143
    144
    145
    146
    147
    148
    149
    150
    151

| 
    
    
    class BackendSpanExporter(TracingExporter):
        def __init__(
            self,
            api_key: str | None = None,
            organization: str | None = None,
            project: str | None = None,
            endpoint: str = "https://api.openai.com/v1/traces/ingest",
            max_retries: int = 3,
            base_delay: float = 1.0,
            max_delay: float = 30.0,
        ):
            """
            Args:
                api_key: The API key for the "Authorization" header. Defaults to
                    `os.environ["OPENAI_API_KEY"]` if not provided.
                organization: The OpenAI organization to use. Defaults to
                    `os.environ["OPENAI_ORG_ID"]` if not provided.
                project: The OpenAI project to use. Defaults to
                    `os.environ["OPENAI_PROJECT_ID"]` if not provided.
                endpoint: The HTTP endpoint to which traces/spans are posted.
                max_retries: Maximum number of retries upon failures.
                base_delay: Base delay (in seconds) for the first backoff.
                max_delay: Maximum delay (in seconds) for backoff growth.
            """
            self._api_key = api_key
            self._organization = organization
            self._project = project
            self.endpoint = endpoint
            self.max_retries = max_retries
            self.base_delay = base_delay
            self.max_delay = max_delay
    
            # Keep a client open for connection pooling across multiple export calls
            self._client = httpx.Client(timeout=httpx.Timeout(timeout=60, connect=5.0))
    
        def set_api_key(self, api_key: str):
            """Set the OpenAI API key for the exporter.
    
            Args:
                api_key: The OpenAI API key to use. This is the same key used by the OpenAI Python
                    client.
            """
            # We're specifically setting the underlying cached property as well
            self._api_key = api_key
            self.api_key = api_key
    
        @cached_property
        def api_key(self):
            return self._api_key or os.environ.get("OPENAI_API_KEY")
    
        @cached_property
        def organization(self):
            return self._organization or os.environ.get("OPENAI_ORG_ID")
    
        @cached_property
        def project(self):
            return self._project or os.environ.get("OPENAI_PROJECT_ID")
    
        def export(self, items: list[Trace | Span[Any]]) -> None:
            if not items:
                return
    
            if not self.api_key:
                logger.warning("OPENAI_API_KEY is not set, skipping trace export")
                return
    
            data = [item.export() for item in items if item.export()]
            payload = {"data": data}
    
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "OpenAI-Beta": "traces=v1",
            }
    
            if self.organization:
                headers["OpenAI-Organization"] = self.organization
    
            if self.project:
                headers["OpenAI-Project"] = self.project
    
            # Exponential backoff loop
            attempt = 0
            delay = self.base_delay
            while True:
                attempt += 1
                try:
                    response = self._client.post(url=self.endpoint, headers=headers, json=payload)
    
                    # If the response is successful, break out of the loop
                    if response.status_code < 300:
                        logger.debug(f"Exported {len(items)} items")
                        return
    
                    # If the response is a client error (4xx), we wont retry
                    if 400 <= response.status_code < 500:
                        logger.error(
                            f"[non-fatal] Tracing client error {response.status_code}: {response.text}"
                        )
                        return
    
                    # For 5xx or other unexpected codes, treat it as transient and retry
                    logger.warning(
                        f"[non-fatal] Tracing: server error {response.status_code}, retrying."
                    )
                except httpx.RequestError as exc:
                    # Network or other I/O error, we'll retry
                    logger.warning(f"[non-fatal] Tracing: request failed: {exc}")
    
                # If we reach here, we need to retry or give up
                if attempt >= self.max_retries:
                    logger.error("[non-fatal] Tracing: max retries reached, giving up on this batch.")
                    return
    
                # Exponential backoff + jitter
                sleep_time = delay + random.uniform(0, 0.1 * delay)  # 10% jitter
                time.sleep(sleep_time)
                delay = min(delay * 2, self.max_delay)
    
        def close(self):
            """Close the underlying HTTP client."""
            self._client.close()
      
  
---|---  
  
####  __init__
    
    
    __init__(
        api_key: str | None = None,
        organization: str | None = None,
        project: str | None = None,
        endpoint: str = "https://api.openai.com/v1/traces/ingest",
        max_retries: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 30.0,
    )
    

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`api_key` |  `str | None` |  The API key for the "Authorization" header. Defaults to `os.environ["OPENAI_API_KEY"]` if not provided. |  `None`  
`organization` |  `str | None` |  The OpenAI organization to use. Defaults to `os.environ["OPENAI_ORG_ID"]` if not provided. |  `None`  
`project` |  `str | None` |  The OpenAI project to use. Defaults to `os.environ["OPENAI_PROJECT_ID"]` if not provided. |  `None`  
`endpoint` |  `str` |  The HTTP endpoint to which traces/spans are posted. |  `'https://api.openai.com/v1/traces/ingest'`  
`max_retries` |  `int` |  Maximum number of retries upon failures. |  `3`  
`base_delay` |  `float` |  Base delay (in seconds) for the first backoff. |  `1.0`  
`max_delay` |  `float` |  Maximum delay (in seconds) for backoff growth. |  `30.0`  
Source code in `src/agents/tracing/processors.py`
    
    
    31
    32
    33
    34
    35
    36
    37
    38
    39
    40
    41
    42
    43
    44
    45
    46
    47
    48
    49
    50
    51
    52
    53
    54
    55
    56
    57
    58
    59
    60
    61
    62
    63

| 
    
    
    def __init__(
        self,
        api_key: str | None = None,
        organization: str | None = None,
        project: str | None = None,
        endpoint: str = "https://api.openai.com/v1/traces/ingest",
        max_retries: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 30.0,
    ):
        """
        Args:
            api_key: The API key for the "Authorization" header. Defaults to
                `os.environ["OPENAI_API_KEY"]` if not provided.
            organization: The OpenAI organization to use. Defaults to
                `os.environ["OPENAI_ORG_ID"]` if not provided.
            project: The OpenAI project to use. Defaults to
                `os.environ["OPENAI_PROJECT_ID"]` if not provided.
            endpoint: The HTTP endpoint to which traces/spans are posted.
            max_retries: Maximum number of retries upon failures.
            base_delay: Base delay (in seconds) for the first backoff.
            max_delay: Maximum delay (in seconds) for backoff growth.
        """
        self._api_key = api_key
        self._organization = organization
        self._project = project
        self.endpoint = endpoint
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay
    
        # Keep a client open for connection pooling across multiple export calls
        self._client = httpx.Client(timeout=httpx.Timeout(timeout=60, connect=5.0))
      
  
---|---  
  
####  set_api_key
    
    
    set_api_key(api_key: str)
    

Set the OpenAI API key for the exporter.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`api_key` |  `str` |  The OpenAI API key to use. This is the same key used by the OpenAI Python client. |  _required_  
Source code in `src/agents/tracing/processors.py`
    
    
    65
    66
    67
    68
    69
    70
    71
    72
    73
    74

| 
    
    
    def set_api_key(self, api_key: str):
        """Set the OpenAI API key for the exporter.
    
        Args:
            api_key: The OpenAI API key to use. This is the same key used by the OpenAI Python
                client.
        """
        # We're specifically setting the underlying cached property as well
        self._api_key = api_key
        self.api_key = api_key
      
  
---|---  
  
####  close
    
    
    close()
    

Close the underlying HTTP client.

Source code in `src/agents/tracing/processors.py`
    
    
    149
    150
    151

| 
    
    
    def close(self):
        """Close the underlying HTTP client."""
        self._client.close()
      
  
---|---  
  
###  BatchTraceProcessor

Bases: `[TracingProcessor](../processor_interface/#agents.tracing.processor_interface.TracingProcessor "TracingProcessor \(agents.tracing.processor_interface.TracingProcessor\)")`

Some implementation notes: 1\. Using Queue, which is thread-safe. 2\. Using a background thread to export spans, to minimize any performance issues. 3\. Spans are stored in memory until they are exported.

Source code in `src/agents/tracing/processors.py`
    
    
    154
    155
    156
    157
    158
    159
    160
    161
    162
    163
    164
    165
    166
    167
    168
    169
    170
    171
    172
    173
    174
    175
    176
    177
    178
    179
    180
    181
    182
    183
    184
    185
    186
    187
    188
    189
    190
    191
    192
    193
    194
    195
    196
    197
    198
    199
    200
    201
    202
    203
    204
    205
    206
    207
    208
    209
    210
    211
    212
    213
    214
    215
    216
    217
    218
    219
    220
    221
    222
    223
    224
    225
    226
    227
    228
    229
    230
    231
    232
    233
    234
    235
    236
    237
    238
    239
    240
    241
    242
    243
    244
    245
    246
    247
    248
    249
    250
    251
    252
    253
    254
    255
    256
    257
    258
    259
    260
    261
    262
    263
    264
    265
    266
    267

| 
    
    
    class BatchTraceProcessor(TracingProcessor):
        """Some implementation notes:
        1. Using Queue, which is thread-safe.
        2. Using a background thread to export spans, to minimize any performance issues.
        3. Spans are stored in memory until they are exported.
        """
    
        def __init__(
            self,
            exporter: TracingExporter,
            max_queue_size: int = 8192,
            max_batch_size: int = 128,
            schedule_delay: float = 5.0,
            export_trigger_ratio: float = 0.7,
        ):
            """
            Args:
                exporter: The exporter to use.
                max_queue_size: The maximum number of spans to store in the queue. After this, we will
                    start dropping spans.
                max_batch_size: The maximum number of spans to export in a single batch.
                schedule_delay: The delay between checks for new spans to export.
                export_trigger_ratio: The ratio of the queue size at which we will trigger an export.
            """
            self._exporter = exporter
            self._queue: queue.Queue[Trace | Span[Any]] = queue.Queue(maxsize=max_queue_size)
            self._max_queue_size = max_queue_size
            self._max_batch_size = max_batch_size
            self._schedule_delay = schedule_delay
            self._shutdown_event = threading.Event()
    
            # The queue size threshold at which we export immediately.
            self._export_trigger_size = int(max_queue_size * export_trigger_ratio)
    
            # Track when we next *must* perform a scheduled export
            self._next_export_time = time.time() + self._schedule_delay
    
            self._worker_thread = threading.Thread(target=self._run, daemon=True)
            self._worker_thread.start()
    
        def on_trace_start(self, trace: Trace) -> None:
            try:
                self._queue.put_nowait(trace)
            except queue.Full:
                logger.warning("Queue is full, dropping trace.")
    
        def on_trace_end(self, trace: Trace) -> None:
            # We send traces via on_trace_start, so we don't need to do anything here.
            pass
    
        def on_span_start(self, span: Span[Any]) -> None:
            # We send spans via on_span_end, so we don't need to do anything here.
            pass
    
        def on_span_end(self, span: Span[Any]) -> None:
            try:
                self._queue.put_nowait(span)
            except queue.Full:
                logger.warning("Queue is full, dropping span.")
    
        def shutdown(self, timeout: float | None = None):
            """
            Called when the application stops. We signal our thread to stop, then join it.
            """
            self._shutdown_event.set()
            self._worker_thread.join(timeout=timeout)
    
        def force_flush(self):
            """
            Forces an immediate flush of all queued spans.
            """
            self._export_batches(force=True)
    
        def _run(self):
            while not self._shutdown_event.is_set():
                current_time = time.time()
                queue_size = self._queue.qsize()
    
                # If it's time for a scheduled flush or queue is above the trigger threshold
                if current_time >= self._next_export_time or queue_size >= self._export_trigger_size:
                    self._export_batches(force=False)
                    # Reset the next scheduled flush time
                    self._next_export_time = time.time() + self._schedule_delay
                else:
                    # Sleep a short interval so we don't busy-wait.
                    time.sleep(0.2)
    
            # Final drain after shutdown
            self._export_batches(force=True)
    
        def _export_batches(self, force: bool = False):
            """Drains the queue and exports in batches. If force=True, export everything.
            Otherwise, export up to `max_batch_size` repeatedly until the queue is empty or below a
            certain threshold.
            """
            while True:
                items_to_export: list[Span[Any] | Trace] = []
    
                # Gather a batch of spans up to max_batch_size
                while not self._queue.empty() and (
                    force or len(items_to_export) < self._max_batch_size
                ):
                    try:
                        items_to_export.append(self._queue.get_nowait())
                    except queue.Empty:
                        # Another thread might have emptied the queue between checks
                        break
    
                # If we collected nothing, we're done
                if not items_to_export:
                    break
    
                # Export the batch
                self._exporter.export(items_to_export)
      
  
---|---  
  
####  __init__
    
    
    __init__(
        exporter: [TracingExporter](../processor_interface/#agents.tracing.processor_interface.TracingExporter "TracingExporter \(agents.tracing.processor_interface.TracingExporter\)"),
        max_queue_size: int = 8192,
        max_batch_size: int = 128,
        schedule_delay: float = 5.0,
        export_trigger_ratio: float = 0.7,
    )
    

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`exporter` |  `[TracingExporter](../processor_interface/#agents.tracing.processor_interface.TracingExporter "TracingExporter \(agents.tracing.processor_interface.TracingExporter\)")` |  The exporter to use. |  _required_  
`max_queue_size` |  `int` |  The maximum number of spans to store in the queue. After this, we will start dropping spans. |  `8192`  
`max_batch_size` |  `int` |  The maximum number of spans to export in a single batch. |  `128`  
`schedule_delay` |  `float` |  The delay between checks for new spans to export. |  `5.0`  
`export_trigger_ratio` |  `float` |  The ratio of the queue size at which we will trigger an export. |  `0.7`  
Source code in `src/agents/tracing/processors.py`
    
    
    161
    162
    163
    164
    165
    166
    167
    168
    169
    170
    171
    172
    173
    174
    175
    176
    177
    178
    179
    180
    181
    182
    183
    184
    185
    186
    187
    188
    189
    190
    191
    192

| 
    
    
    def __init__(
        self,
        exporter: TracingExporter,
        max_queue_size: int = 8192,
        max_batch_size: int = 128,
        schedule_delay: float = 5.0,
        export_trigger_ratio: float = 0.7,
    ):
        """
        Args:
            exporter: The exporter to use.
            max_queue_size: The maximum number of spans to store in the queue. After this, we will
                start dropping spans.
            max_batch_size: The maximum number of spans to export in a single batch.
            schedule_delay: The delay between checks for new spans to export.
            export_trigger_ratio: The ratio of the queue size at which we will trigger an export.
        """
        self._exporter = exporter
        self._queue: queue.Queue[Trace | Span[Any]] = queue.Queue(maxsize=max_queue_size)
        self._max_queue_size = max_queue_size
        self._max_batch_size = max_batch_size
        self._schedule_delay = schedule_delay
        self._shutdown_event = threading.Event()
    
        # The queue size threshold at which we export immediately.
        self._export_trigger_size = int(max_queue_size * export_trigger_ratio)
    
        # Track when we next *must* perform a scheduled export
        self._next_export_time = time.time() + self._schedule_delay
    
        self._worker_thread = threading.Thread(target=self._run, daemon=True)
        self._worker_thread.start()
      
  
---|---  
  
####  shutdown
    
    
    shutdown(timeout: float | None = None)
    

Called when the application stops. We signal our thread to stop, then join it.

Source code in `src/agents/tracing/processors.py`
    
    
    214
    215
    216
    217
    218
    219

| 
    
    
    def shutdown(self, timeout: float | None = None):
        """
        Called when the application stops. We signal our thread to stop, then join it.
        """
        self._shutdown_event.set()
        self._worker_thread.join(timeout=timeout)
      
  
---|---  
  
####  force_flush
    
    
    force_flush()
    

Forces an immediate flush of all queued spans.

Source code in `src/agents/tracing/processors.py`
    
    
    221
    222
    223
    224
    225

| 
    
    
    def force_flush(self):
        """
        Forces an immediate flush of all queued spans.
        """
        self._export_batches(force=True)
      
  
---|---  
  
###  default_exporter
    
    
    default_exporter() -> BackendSpanExporter
    

The default exporter, which exports traces and spans to the backend in batches.

Source code in `src/agents/tracing/processors.py`
    
    
    275
    276
    277

| 
    
    
    def default_exporter() -> BackendSpanExporter:
        """The default exporter, which exports traces and spans to the backend in batches."""
        return _global_exporter
      
  
---|---  
  
###  default_processor
    
    
    default_processor() -> BatchTraceProcessor
    

The default processor, which exports traces and spans to the backend in batches.

Source code in `src/agents/tracing/processors.py`
    
    
    280
    281
    282

| 
    
    
    def default_processor() -> BatchTraceProcessor:
        """The default processor, which exports traces and spans to the backend in batches."""
        return _global_processor
      
  
---|---
