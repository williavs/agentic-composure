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
      * [ Quickstart  ](../../voice/quickstart/)
      * [ Pipelines and workflows  ](../../voice/pipeline/)
      * [ Tracing  ](../../voice/tracing/)
  * API Reference  API Reference 
    * Agents  Agents 
      * [ Agents module  ](../)
      * [ Agents  ](../agent/)
      * Runner  [ Runner  ](./) Table of contents 
        * run 
        * Runner 
          * run 
          * run_sync 
          * run_streamed 
        * RunConfig 
          * model 
          * model_provider 
          * model_settings 
          * handoff_input_filter 
          * input_guardrails 
          * output_guardrails 
          * tracing_disabled 
          * trace_include_sensitive_data 
          * workflow_name 
          * trace_id 
          * group_id 
          * trace_metadata 
      * [ Tools  ](../tool/)
      * [ Results  ](../result/)
      * [ Streaming events  ](../stream_events/)
      * [ Handoffs  ](../handoffs/)
      * [ Lifecycle  ](../lifecycle/)
      * [ Items  ](../items/)
      * [ Run context  ](../run_context/)
      * [ Usage  ](../usage/)
      * [ Exceptions  ](../exceptions/)
      * [ Guardrails  ](../guardrail/)
      * [ Model settings  ](../model_settings/)
      * [ Agent output  ](../agent_output/)
      * [ Function schema  ](../function_schema/)
      * [ Model interface  ](../models/interface/)
      * [ OpenAI Chat Completions model  ](../models/openai_chatcompletions/)
      * [ OpenAI Responses model  ](../models/openai_responses/)
      * [ MCP Servers  ](../mcp/server/)
      * [ MCP Util  ](../mcp/util/)
    * Tracing  Tracing 
      * [ Tracing module  ](../tracing/)
      * [ Creating traces/spans  ](../tracing/create/)
      * [ Traces  ](../tracing/traces/)
      * [ Spans  ](../tracing/spans/)
      * [ Processor interface  ](../tracing/processor_interface/)
      * [ Processors  ](../tracing/processors/)
      * [ Scope  ](../tracing/scope/)
      * [ Setup  ](../tracing/setup/)
      * [ Span data  ](../tracing/span_data/)
      * [ Util  ](../tracing/util/)
    * Voice  Voice 
      * [ Pipeline  ](../voice/pipeline/)
      * [ Workflow  ](../voice/workflow/)
      * [ Input  ](../voice/input/)
      * [ Result  ](../voice/result/)
      * [ Pipeline Config  ](../voice/pipeline_config/)
      * [ Events  ](../voice/events/)
      * [ Exceptions  ](../voice/exceptions/)
      * [ Model  ](../voice/model/)
      * [ Utils  ](../voice/utils/)
      * [ OpenAIVoiceModelProvider  ](../voice/models/openai_provider/)
      * [ OpenAI STT  ](../voice/models/openai_stt/)
      * [ OpenAI TTS  ](../voice/models/openai_tts/)
    * Extensions  Extensions 
      * [ Handoff filters  ](../extensions/handoff_filters/)
      * [ Handoff prompt  ](../extensions/handoff_prompt/)
      * [ LiteLLM Models  ](../extensions/litellm/)



Table of contents 

  * run 
  * Runner 
    * run 
    * run_sync 
    * run_streamed 
  * RunConfig 
    * model 
    * model_provider 
    * model_settings 
    * handoff_input_filter 
    * input_guardrails 
    * output_guardrails 
    * tracing_disabled 
    * trace_include_sensitive_data 
    * workflow_name 
    * trace_id 
    * group_id 
    * trace_metadata 



# `Runner`

###  Runner

Source code in `src/agents/run.py`
    
    
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
    152
    153
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
    268
    269
    270
    271
    272
    273
    274
    275
    276
    277
    278
    279
    280
    281
    282
    283
    284
    285
    286
    287
    288
    289
    290
    291
    292
    293
    294
    295
    296
    297
    298
    299
    300
    301
    302
    303
    304
    305
    306
    307
    308
    309
    310
    311
    312
    313
    314
    315
    316
    317
    318
    319
    320
    321
    322
    323
    324
    325
    326
    327
    328
    329
    330
    331
    332
    333
    334
    335
    336
    337
    338
    339
    340
    341
    342
    343
    344
    345
    346
    347
    348
    349
    350
    351
    352
    353
    354
    355
    356
    357
    358
    359
    360
    361
    362
    363
    364
    365
    366
    367
    368
    369
    370
    371
    372
    373
    374
    375
    376
    377
    378
    379
    380
    381
    382
    383
    384
    385
    386
    387
    388
    389
    390
    391
    392
    393
    394
    395
    396
    397
    398
    399
    400
    401
    402
    403
    404
    405
    406
    407
    408
    409
    410
    411
    412
    413
    414
    415
    416
    417
    418
    419
    420
    421
    422
    423
    424
    425
    426
    427
    428
    429
    430
    431
    432
    433
    434
    435
    436
    437
    438
    439
    440
    441
    442
    443
    444
    445
    446
    447
    448
    449
    450
    451
    452
    453
    454
    455
    456
    457
    458
    459
    460
    461
    462
    463
    464
    465
    466
    467
    468
    469
    470
    471
    472
    473
    474
    475
    476
    477
    478
    479
    480
    481
    482
    483
    484
    485
    486
    487
    488
    489
    490
    491
    492
    493
    494
    495
    496
    497
    498
    499
    500
    501
    502
    503
    504
    505
    506
    507
    508
    509
    510
    511
    512
    513
    514
    515
    516
    517
    518
    519
    520
    521
    522
    523
    524
    525
    526
    527
    528
    529
    530
    531
    532
    533
    534
    535
    536
    537
    538
    539
    540
    541
    542
    543
    544
    545
    546
    547
    548
    549
    550
    551
    552
    553
    554
    555
    556
    557
    558
    559
    560
    561
    562
    563
    564
    565
    566
    567
    568
    569
    570
    571
    572
    573
    574
    575
    576
    577
    578
    579
    580
    581
    582
    583
    584
    585
    586
    587
    588
    589
    590
    591
    592
    593
    594
    595
    596
    597
    598
    599
    600
    601
    602
    603
    604
    605
    606
    607
    608
    609
    610
    611
    612
    613
    614
    615
    616
    617
    618
    619
    620
    621
    622
    623
    624
    625
    626
    627
    628
    629
    630
    631
    632
    633
    634
    635
    636
    637
    638
    639
    640
    641
    642
    643
    644
    645
    646
    647
    648
    649
    650
    651
    652
    653
    654
    655
    656
    657
    658
    659
    660
    661
    662
    663
    664
    665
    666
    667
    668
    669
    670
    671
    672
    673
    674
    675
    676
    677
    678
    679
    680
    681
    682
    683
    684
    685
    686
    687
    688
    689
    690
    691
    692
    693
    694
    695
    696
    697
    698
    699
    700
    701
    702
    703
    704
    705
    706
    707
    708
    709
    710
    711
    712
    713
    714
    715
    716
    717
    718
    719
    720
    721
    722
    723
    724
    725
    726
    727
    728
    729
    730
    731
    732
    733
    734
    735
    736
    737
    738
    739
    740
    741
    742
    743
    744
    745
    746
    747
    748
    749
    750
    751
    752
    753
    754
    755
    756
    757
    758
    759
    760
    761
    762
    763
    764
    765
    766
    767
    768
    769
    770
    771
    772
    773
    774
    775
    776
    777
    778
    779
    780
    781
    782
    783
    784
    785
    786
    787
    788
    789
    790
    791
    792
    793
    794
    795
    796
    797
    798
    799
    800
    801
    802
    803
    804
    805
    806
    807
    808
    809
    810
    811
    812
    813
    814
    815
    816
    817
    818
    819
    820
    821
    822
    823
    824
    825
    826
    827
    828
    829
    830
    831
    832
    833
    834
    835
    836
    837
    838
    839
    840
    841
    842
    843
    844
    845
    846
    847
    848
    849
    850
    851
    852
    853
    854
    855
    856
    857
    858
    859
    860
    861
    862
    863
    864
    865
    866
    867
    868
    869
    870
    871
    872
    873
    874
    875
    876
    877
    878
    879
    880
    881
    882
    883
    884
    885
    886
    887
    888
    889
    890
    891
    892
    893
    894
    895
    896
    897
    898
    899
    900
    901
    902
    903
    904
    905
    906
    907
    908
    909
    910
    911
    912
    913
    914
    915
    916
    917
    918
    919
    920
    921
    922
    923
    924
    925
    926
    927
    928
    929
    930
    931
    932
    933
    934
    935
    936
    937
    938
    939
    940
    941
    942
    943
    944
    945
    946
    947
    948
    949
    950
    951
    952
    953
    954
    955
    956
    957
    958
    959
    960
    961
    962
    963
    964
    965
    966
    967
    968

| 
    
    
    class Runner:
        @classmethod
        async def run(
            cls,
            starting_agent: Agent[TContext],
            input: str | list[TResponseInputItem],
            *,
            context: TContext | None = None,
            max_turns: int = DEFAULT_MAX_TURNS,
            hooks: RunHooks[TContext] | None = None,
            run_config: RunConfig | None = None,
            previous_response_id: str | None = None,
        ) -> RunResult:
            """Run a workflow starting at the given agent. The agent will run in a loop until a final
            output is generated. The loop runs like so:
            1. The agent is invoked with the given input.
            2. If there is a final output (i.e. the agent produces something of type
                `agent.output_type`, the loop terminates.
            3. If there's a handoff, we run the loop again, with the new agent.
            4. Else, we run tool calls (if any), and re-run the loop.
    
            In two cases, the agent may raise an exception:
            1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.
            2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.
    
            Note that only the first agent's input guardrails are run.
    
            Args:
                starting_agent: The starting agent to run.
                input: The initial input to the agent. You can pass a single string for a user message,
                    or a list of input items.
                context: The context to run the agent with.
                max_turns: The maximum number of turns to run the agent for. A turn is defined as one
                    AI invocation (including any tool calls that might occur).
                hooks: An object that receives callbacks on various lifecycle events.
                run_config: Global settings for the entire agent run.
                previous_response_id: The ID of the previous response, if using OpenAI models via the
                    Responses API, this allows you to skip passing in input from the previous turn.
    
            Returns:
                A run result containing all the inputs, guardrail results and the output of the last
                agent. Agents may perform handoffs, so we don't know the specific type of the output.
            """
            if hooks is None:
                hooks = RunHooks[Any]()
            if run_config is None:
                run_config = RunConfig()
    
            tool_use_tracker = AgentToolUseTracker()
    
            with TraceCtxManager(
                workflow_name=run_config.workflow_name,
                trace_id=run_config.trace_id,
                group_id=run_config.group_id,
                metadata=run_config.trace_metadata,
                disabled=run_config.tracing_disabled,
            ):
                current_turn = 0
                original_input: str | list[TResponseInputItem] = copy.deepcopy(input)
                generated_items: list[RunItem] = []
                model_responses: list[ModelResponse] = []
    
                context_wrapper: RunContextWrapper[TContext] = RunContextWrapper(
                    context=context,  # type: ignore
                )
    
                input_guardrail_results: list[InputGuardrailResult] = []
    
                current_span: Span[AgentSpanData] | None = None
                current_agent = starting_agent
                should_run_agent_start_hooks = True
    
                try:
                    while True:
                        # Start an agent span if we don't have one. This span is ended if the current
                        # agent changes, or if the agent loop ends.
                        if current_span is None:
                            handoff_names = [h.agent_name for h in cls._get_handoffs(current_agent)]
                            if output_schema := cls._get_output_schema(current_agent):
                                output_type_name = output_schema.name()
                            else:
                                output_type_name = "str"
    
                            current_span = agent_span(
                                name=current_agent.name,
                                handoffs=handoff_names,
                                output_type=output_type_name,
                            )
                            current_span.start(mark_as_current=True)
    
                            all_tools = await cls._get_all_tools(current_agent)
                            current_span.span_data.tools = [t.name for t in all_tools]
    
                        current_turn += 1
                        if current_turn > max_turns:
                            _error_tracing.attach_error_to_span(
                                current_span,
                                SpanError(
                                    message="Max turns exceeded",
                                    data={"max_turns": max_turns},
                                ),
                            )
                            raise MaxTurnsExceeded(f"Max turns ({max_turns}) exceeded")
    
                        logger.debug(
                            f"Running agent {current_agent.name} (turn {current_turn})",
                        )
    
                        if current_turn == 1:
                            input_guardrail_results, turn_result = await asyncio.gather(
                                cls._run_input_guardrails(
                                    starting_agent,
                                    starting_agent.input_guardrails
                                    + (run_config.input_guardrails or []),
                                    copy.deepcopy(input),
                                    context_wrapper,
                                ),
                                cls._run_single_turn(
                                    agent=current_agent,
                                    all_tools=all_tools,
                                    original_input=original_input,
                                    generated_items=generated_items,
                                    hooks=hooks,
                                    context_wrapper=context_wrapper,
                                    run_config=run_config,
                                    should_run_agent_start_hooks=should_run_agent_start_hooks,
                                    tool_use_tracker=tool_use_tracker,
                                    previous_response_id=previous_response_id,
                                ),
                            )
                        else:
                            turn_result = await cls._run_single_turn(
                                agent=current_agent,
                                all_tools=all_tools,
                                original_input=original_input,
                                generated_items=generated_items,
                                hooks=hooks,
                                context_wrapper=context_wrapper,
                                run_config=run_config,
                                should_run_agent_start_hooks=should_run_agent_start_hooks,
                                tool_use_tracker=tool_use_tracker,
                                previous_response_id=previous_response_id,
                            )
                        should_run_agent_start_hooks = False
    
                        model_responses.append(turn_result.model_response)
                        original_input = turn_result.original_input
                        generated_items = turn_result.generated_items
    
                        if isinstance(turn_result.next_step, NextStepFinalOutput):
                            output_guardrail_results = await cls._run_output_guardrails(
                                current_agent.output_guardrails + (run_config.output_guardrails or []),
                                current_agent,
                                turn_result.next_step.output,
                                context_wrapper,
                            )
                            return RunResult(
                                input=original_input,
                                new_items=generated_items,
                                raw_responses=model_responses,
                                final_output=turn_result.next_step.output,
                                _last_agent=current_agent,
                                input_guardrail_results=input_guardrail_results,
                                output_guardrail_results=output_guardrail_results,
                                context_wrapper=context_wrapper,
                            )
                        elif isinstance(turn_result.next_step, NextStepHandoff):
                            current_agent = cast(Agent[TContext], turn_result.next_step.new_agent)
                            current_span.finish(reset_current=True)
                            current_span = None
                            should_run_agent_start_hooks = True
                        elif isinstance(turn_result.next_step, NextStepRunAgain):
                            pass
                        else:
                            raise AgentsException(
                                f"Unknown next step type: {type(turn_result.next_step)}"
                            )
                finally:
                    if current_span:
                        current_span.finish(reset_current=True)
    
        @classmethod
        def run_sync(
            cls,
            starting_agent: Agent[TContext],
            input: str | list[TResponseInputItem],
            *,
            context: TContext | None = None,
            max_turns: int = DEFAULT_MAX_TURNS,
            hooks: RunHooks[TContext] | None = None,
            run_config: RunConfig | None = None,
            previous_response_id: str | None = None,
        ) -> RunResult:
            """Run a workflow synchronously, starting at the given agent. Note that this just wraps the
            `run` method, so it will not work if there's already an event loop (e.g. inside an async
            function, or in a Jupyter notebook or async context like FastAPI). For those cases, use
            the `run` method instead.
    
            The agent will run in a loop until a final output is generated. The loop runs like so:
            1. The agent is invoked with the given input.
            2. If there is a final output (i.e. the agent produces something of type
                `agent.output_type`, the loop terminates.
            3. If there's a handoff, we run the loop again, with the new agent.
            4. Else, we run tool calls (if any), and re-run the loop.
    
            In two cases, the agent may raise an exception:
            1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.
            2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.
    
            Note that only the first agent's input guardrails are run.
    
            Args:
                starting_agent: The starting agent to run.
                input: The initial input to the agent. You can pass a single string for a user message,
                    or a list of input items.
                context: The context to run the agent with.
                max_turns: The maximum number of turns to run the agent for. A turn is defined as one
                    AI invocation (including any tool calls that might occur).
                hooks: An object that receives callbacks on various lifecycle events.
                run_config: Global settings for the entire agent run.
                previous_response_id: The ID of the previous response, if using OpenAI models via the
                    Responses API, this allows you to skip passing in input from the previous turn.
    
            Returns:
                A run result containing all the inputs, guardrail results and the output of the last
                agent. Agents may perform handoffs, so we don't know the specific type of the output.
            """
            return asyncio.get_event_loop().run_until_complete(
                cls.run(
                    starting_agent,
                    input,
                    context=context,
                    max_turns=max_turns,
                    hooks=hooks,
                    run_config=run_config,
                    previous_response_id=previous_response_id,
                )
            )
    
        @classmethod
        def run_streamed(
            cls,
            starting_agent: Agent[TContext],
            input: str | list[TResponseInputItem],
            context: TContext | None = None,
            max_turns: int = DEFAULT_MAX_TURNS,
            hooks: RunHooks[TContext] | None = None,
            run_config: RunConfig | None = None,
            previous_response_id: str | None = None,
        ) -> RunResultStreaming:
            """Run a workflow starting at the given agent in streaming mode. The returned result object
            contains a method you can use to stream semantic events as they are generated.
    
            The agent will run in a loop until a final output is generated. The loop runs like so:
            1. The agent is invoked with the given input.
            2. If there is a final output (i.e. the agent produces something of type
                `agent.output_type`, the loop terminates.
            3. If there's a handoff, we run the loop again, with the new agent.
            4. Else, we run tool calls (if any), and re-run the loop.
    
            In two cases, the agent may raise an exception:
            1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.
            2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.
    
            Note that only the first agent's input guardrails are run.
    
            Args:
                starting_agent: The starting agent to run.
                input: The initial input to the agent. You can pass a single string for a user message,
                    or a list of input items.
                context: The context to run the agent with.
                max_turns: The maximum number of turns to run the agent for. A turn is defined as one
                    AI invocation (including any tool calls that might occur).
                hooks: An object that receives callbacks on various lifecycle events.
                run_config: Global settings for the entire agent run.
                previous_response_id: The ID of the previous response, if using OpenAI models via the
                    Responses API, this allows you to skip passing in input from the previous turn.
            Returns:
                A result object that contains data about the run, as well as a method to stream events.
            """
            if hooks is None:
                hooks = RunHooks[Any]()
            if run_config is None:
                run_config = RunConfig()
    
            # If there's already a trace, we don't create a new one. In addition, we can't end the
            # trace here, because the actual work is done in `stream_events` and this method ends
            # before that.
            new_trace = (
                None
                if get_current_trace()
                else trace(
                    workflow_name=run_config.workflow_name,
                    trace_id=run_config.trace_id,
                    group_id=run_config.group_id,
                    metadata=run_config.trace_metadata,
                    disabled=run_config.tracing_disabled,
                )
            )
    
            output_schema = cls._get_output_schema(starting_agent)
            context_wrapper: RunContextWrapper[TContext] = RunContextWrapper(
                context=context  # type: ignore
            )
    
            streamed_result = RunResultStreaming(
                input=copy.deepcopy(input),
                new_items=[],
                current_agent=starting_agent,
                raw_responses=[],
                final_output=None,
                is_complete=False,
                current_turn=0,
                max_turns=max_turns,
                input_guardrail_results=[],
                output_guardrail_results=[],
                _current_agent_output_schema=output_schema,
                trace=new_trace,
                context_wrapper=context_wrapper,
            )
    
            # Kick off the actual agent loop in the background and return the streamed result object.
            streamed_result._run_impl_task = asyncio.create_task(
                cls._run_streamed_impl(
                    starting_input=input,
                    streamed_result=streamed_result,
                    starting_agent=starting_agent,
                    max_turns=max_turns,
                    hooks=hooks,
                    context_wrapper=context_wrapper,
                    run_config=run_config,
                    previous_response_id=previous_response_id,
                )
            )
            return streamed_result
    
        @classmethod
        async def _run_input_guardrails_with_queue(
            cls,
            agent: Agent[Any],
            guardrails: list[InputGuardrail[TContext]],
            input: str | list[TResponseInputItem],
            context: RunContextWrapper[TContext],
            streamed_result: RunResultStreaming,
            parent_span: Span[Any],
        ):
            queue = streamed_result._input_guardrail_queue
    
            # We'll run the guardrails and push them onto the queue as they complete
            guardrail_tasks = [
                asyncio.create_task(
                    RunImpl.run_single_input_guardrail(agent, guardrail, input, context)
                )
                for guardrail in guardrails
            ]
            guardrail_results = []
            try:
                for done in asyncio.as_completed(guardrail_tasks):
                    result = await done
                    if result.output.tripwire_triggered:
                        _error_tracing.attach_error_to_span(
                            parent_span,
                            SpanError(
                                message="Guardrail tripwire triggered",
                                data={
                                    "guardrail": result.guardrail.get_name(),
                                    "type": "input_guardrail",
                                },
                            ),
                        )
                    queue.put_nowait(result)
                    guardrail_results.append(result)
            except Exception:
                for t in guardrail_tasks:
                    t.cancel()
                raise
    
            streamed_result.input_guardrail_results = guardrail_results
    
        @classmethod
        async def _run_streamed_impl(
            cls,
            starting_input: str | list[TResponseInputItem],
            streamed_result: RunResultStreaming,
            starting_agent: Agent[TContext],
            max_turns: int,
            hooks: RunHooks[TContext],
            context_wrapper: RunContextWrapper[TContext],
            run_config: RunConfig,
            previous_response_id: str | None,
        ):
            if streamed_result.trace:
                streamed_result.trace.start(mark_as_current=True)
    
            current_span: Span[AgentSpanData] | None = None
            current_agent = starting_agent
            current_turn = 0
            should_run_agent_start_hooks = True
            tool_use_tracker = AgentToolUseTracker()
    
            streamed_result._event_queue.put_nowait(AgentUpdatedStreamEvent(new_agent=current_agent))
    
            try:
                while True:
                    if streamed_result.is_complete:
                        break
    
                    # Start an agent span if we don't have one. This span is ended if the current
                    # agent changes, or if the agent loop ends.
                    if current_span is None:
                        handoff_names = [h.agent_name for h in cls._get_handoffs(current_agent)]
                        if output_schema := cls._get_output_schema(current_agent):
                            output_type_name = output_schema.name()
                        else:
                            output_type_name = "str"
    
                        current_span = agent_span(
                            name=current_agent.name,
                            handoffs=handoff_names,
                            output_type=output_type_name,
                        )
                        current_span.start(mark_as_current=True)
    
                        all_tools = await cls._get_all_tools(current_agent)
                        tool_names = [t.name for t in all_tools]
                        current_span.span_data.tools = tool_names
                    current_turn += 1
                    streamed_result.current_turn = current_turn
    
                    if current_turn > max_turns:
                        _error_tracing.attach_error_to_span(
                            current_span,
                            SpanError(
                                message="Max turns exceeded",
                                data={"max_turns": max_turns},
                            ),
                        )
                        streamed_result._event_queue.put_nowait(QueueCompleteSentinel())
                        break
    
                    if current_turn == 1:
                        # Run the input guardrails in the background and put the results on the queue
                        streamed_result._input_guardrails_task = asyncio.create_task(
                            cls._run_input_guardrails_with_queue(
                                starting_agent,
                                starting_agent.input_guardrails + (run_config.input_guardrails or []),
                                copy.deepcopy(ItemHelpers.input_to_new_input_list(starting_input)),
                                context_wrapper,
                                streamed_result,
                                current_span,
                            )
                        )
                    try:
                        turn_result = await cls._run_single_turn_streamed(
                            streamed_result,
                            current_agent,
                            hooks,
                            context_wrapper,
                            run_config,
                            should_run_agent_start_hooks,
                            tool_use_tracker,
                            all_tools,
                            previous_response_id,
                        )
                        should_run_agent_start_hooks = False
    
                        streamed_result.raw_responses = streamed_result.raw_responses + [
                            turn_result.model_response
                        ]
                        streamed_result.input = turn_result.original_input
                        streamed_result.new_items = turn_result.generated_items
    
                        if isinstance(turn_result.next_step, NextStepHandoff):
                            current_agent = turn_result.next_step.new_agent
                            current_span.finish(reset_current=True)
                            current_span = None
                            should_run_agent_start_hooks = True
                            streamed_result._event_queue.put_nowait(
                                AgentUpdatedStreamEvent(new_agent=current_agent)
                            )
                        elif isinstance(turn_result.next_step, NextStepFinalOutput):
                            streamed_result._output_guardrails_task = asyncio.create_task(
                                cls._run_output_guardrails(
                                    current_agent.output_guardrails
                                    + (run_config.output_guardrails or []),
                                    current_agent,
                                    turn_result.next_step.output,
                                    context_wrapper,
                                )
                            )
    
                            try:
                                output_guardrail_results = await streamed_result._output_guardrails_task
                            except Exception:
                                # Exceptions will be checked in the stream_events loop
                                output_guardrail_results = []
    
                            streamed_result.output_guardrail_results = output_guardrail_results
                            streamed_result.final_output = turn_result.next_step.output
                            streamed_result.is_complete = True
                            streamed_result._event_queue.put_nowait(QueueCompleteSentinel())
                        elif isinstance(turn_result.next_step, NextStepRunAgain):
                            pass
                    except Exception as e:
                        if current_span:
                            _error_tracing.attach_error_to_span(
                                current_span,
                                SpanError(
                                    message="Error in agent run",
                                    data={"error": str(e)},
                                ),
                            )
                        streamed_result.is_complete = True
                        streamed_result._event_queue.put_nowait(QueueCompleteSentinel())
                        raise
    
                streamed_result.is_complete = True
            finally:
                if current_span:
                    current_span.finish(reset_current=True)
                if streamed_result.trace:
                    streamed_result.trace.finish(reset_current=True)
    
        @classmethod
        async def _run_single_turn_streamed(
            cls,
            streamed_result: RunResultStreaming,
            agent: Agent[TContext],
            hooks: RunHooks[TContext],
            context_wrapper: RunContextWrapper[TContext],
            run_config: RunConfig,
            should_run_agent_start_hooks: bool,
            tool_use_tracker: AgentToolUseTracker,
            all_tools: list[Tool],
            previous_response_id: str | None,
        ) -> SingleStepResult:
            if should_run_agent_start_hooks:
                await asyncio.gather(
                    hooks.on_agent_start(context_wrapper, agent),
                    (
                        agent.hooks.on_start(context_wrapper, agent)
                        if agent.hooks
                        else _coro.noop_coroutine()
                    ),
                )
    
            output_schema = cls._get_output_schema(agent)
    
            streamed_result.current_agent = agent
            streamed_result._current_agent_output_schema = output_schema
    
            system_prompt = await agent.get_system_prompt(context_wrapper)
    
            handoffs = cls._get_handoffs(agent)
            model = cls._get_model(agent, run_config)
            model_settings = agent.model_settings.resolve(run_config.model_settings)
            model_settings = RunImpl.maybe_reset_tool_choice(agent, tool_use_tracker, model_settings)
    
            final_response: ModelResponse | None = None
    
            input = ItemHelpers.input_to_new_input_list(streamed_result.input)
            input.extend([item.to_input_item() for item in streamed_result.new_items])
    
            # 1. Stream the output events
            async for event in model.stream_response(
                system_prompt,
                input,
                model_settings,
                all_tools,
                output_schema,
                handoffs,
                get_model_tracing_impl(
                    run_config.tracing_disabled, run_config.trace_include_sensitive_data
                ),
                previous_response_id=previous_response_id,
            ):
                if isinstance(event, ResponseCompletedEvent):
                    usage = (
                        Usage(
                            requests=1,
                            input_tokens=event.response.usage.input_tokens,
                            output_tokens=event.response.usage.output_tokens,
                            total_tokens=event.response.usage.total_tokens,
                        )
                        if event.response.usage
                        else Usage()
                    )
                    final_response = ModelResponse(
                        output=event.response.output,
                        usage=usage,
                        response_id=event.response.id,
                    )
                    context_wrapper.usage.add(usage)
    
                streamed_result._event_queue.put_nowait(RawResponsesStreamEvent(data=event))
    
            # 2. At this point, the streaming is complete for this turn of the agent loop.
            if not final_response:
                raise ModelBehaviorError("Model did not produce a final response!")
    
            # 3. Now, we can process the turn as we do in the non-streaming case
            single_step_result = await cls._get_single_step_result_from_response(
                agent=agent,
                original_input=streamed_result.input,
                pre_step_items=streamed_result.new_items,
                new_response=final_response,
                output_schema=output_schema,
                all_tools=all_tools,
                handoffs=handoffs,
                hooks=hooks,
                context_wrapper=context_wrapper,
                run_config=run_config,
                tool_use_tracker=tool_use_tracker,
            )
    
            RunImpl.stream_step_result_to_queue(single_step_result, streamed_result._event_queue)
            return single_step_result
    
        @classmethod
        async def _run_single_turn(
            cls,
            *,
            agent: Agent[TContext],
            all_tools: list[Tool],
            original_input: str | list[TResponseInputItem],
            generated_items: list[RunItem],
            hooks: RunHooks[TContext],
            context_wrapper: RunContextWrapper[TContext],
            run_config: RunConfig,
            should_run_agent_start_hooks: bool,
            tool_use_tracker: AgentToolUseTracker,
            previous_response_id: str | None,
        ) -> SingleStepResult:
            # Ensure we run the hooks before anything else
            if should_run_agent_start_hooks:
                await asyncio.gather(
                    hooks.on_agent_start(context_wrapper, agent),
                    (
                        agent.hooks.on_start(context_wrapper, agent)
                        if agent.hooks
                        else _coro.noop_coroutine()
                    ),
                )
    
            system_prompt = await agent.get_system_prompt(context_wrapper)
    
            output_schema = cls._get_output_schema(agent)
            handoffs = cls._get_handoffs(agent)
            input = ItemHelpers.input_to_new_input_list(original_input)
            input.extend([generated_item.to_input_item() for generated_item in generated_items])
    
            new_response = await cls._get_new_response(
                agent,
                system_prompt,
                input,
                output_schema,
                all_tools,
                handoffs,
                context_wrapper,
                run_config,
                tool_use_tracker,
                previous_response_id,
            )
    
            return await cls._get_single_step_result_from_response(
                agent=agent,
                original_input=original_input,
                pre_step_items=generated_items,
                new_response=new_response,
                output_schema=output_schema,
                all_tools=all_tools,
                handoffs=handoffs,
                hooks=hooks,
                context_wrapper=context_wrapper,
                run_config=run_config,
                tool_use_tracker=tool_use_tracker,
            )
    
        @classmethod
        async def _get_single_step_result_from_response(
            cls,
            *,
            agent: Agent[TContext],
            all_tools: list[Tool],
            original_input: str | list[TResponseInputItem],
            pre_step_items: list[RunItem],
            new_response: ModelResponse,
            output_schema: AgentOutputSchemaBase | None,
            handoffs: list[Handoff],
            hooks: RunHooks[TContext],
            context_wrapper: RunContextWrapper[TContext],
            run_config: RunConfig,
            tool_use_tracker: AgentToolUseTracker,
        ) -> SingleStepResult:
            processed_response = RunImpl.process_model_response(
                agent=agent,
                all_tools=all_tools,
                response=new_response,
                output_schema=output_schema,
                handoffs=handoffs,
            )
    
            tool_use_tracker.add_tool_use(agent, processed_response.tools_used)
    
            return await RunImpl.execute_tools_and_side_effects(
                agent=agent,
                original_input=original_input,
                pre_step_items=pre_step_items,
                new_response=new_response,
                processed_response=processed_response,
                output_schema=output_schema,
                hooks=hooks,
                context_wrapper=context_wrapper,
                run_config=run_config,
            )
    
        @classmethod
        async def _run_input_guardrails(
            cls,
            agent: Agent[Any],
            guardrails: list[InputGuardrail[TContext]],
            input: str | list[TResponseInputItem],
            context: RunContextWrapper[TContext],
        ) -> list[InputGuardrailResult]:
            if not guardrails:
                return []
    
            guardrail_tasks = [
                asyncio.create_task(
                    RunImpl.run_single_input_guardrail(agent, guardrail, input, context)
                )
                for guardrail in guardrails
            ]
    
            guardrail_results = []
    
            for done in asyncio.as_completed(guardrail_tasks):
                result = await done
                if result.output.tripwire_triggered:
                    # Cancel all guardrail tasks if a tripwire is triggered.
                    for t in guardrail_tasks:
                        t.cancel()
                    _error_tracing.attach_error_to_current_span(
                        SpanError(
                            message="Guardrail tripwire triggered",
                            data={"guardrail": result.guardrail.get_name()},
                        )
                    )
                    raise InputGuardrailTripwireTriggered(result)
                else:
                    guardrail_results.append(result)
    
            return guardrail_results
    
        @classmethod
        async def _run_output_guardrails(
            cls,
            guardrails: list[OutputGuardrail[TContext]],
            agent: Agent[TContext],
            agent_output: Any,
            context: RunContextWrapper[TContext],
        ) -> list[OutputGuardrailResult]:
            if not guardrails:
                return []
    
            guardrail_tasks = [
                asyncio.create_task(
                    RunImpl.run_single_output_guardrail(guardrail, agent, agent_output, context)
                )
                for guardrail in guardrails
            ]
    
            guardrail_results = []
    
            for done in asyncio.as_completed(guardrail_tasks):
                result = await done
                if result.output.tripwire_triggered:
                    # Cancel all guardrail tasks if a tripwire is triggered.
                    for t in guardrail_tasks:
                        t.cancel()
                    _error_tracing.attach_error_to_current_span(
                        SpanError(
                            message="Guardrail tripwire triggered",
                            data={"guardrail": result.guardrail.get_name()},
                        )
                    )
                    raise OutputGuardrailTripwireTriggered(result)
                else:
                    guardrail_results.append(result)
    
            return guardrail_results
    
        @classmethod
        async def _get_new_response(
            cls,
            agent: Agent[TContext],
            system_prompt: str | None,
            input: list[TResponseInputItem],
            output_schema: AgentOutputSchemaBase | None,
            all_tools: list[Tool],
            handoffs: list[Handoff],
            context_wrapper: RunContextWrapper[TContext],
            run_config: RunConfig,
            tool_use_tracker: AgentToolUseTracker,
            previous_response_id: str | None,
        ) -> ModelResponse:
            model = cls._get_model(agent, run_config)
            model_settings = agent.model_settings.resolve(run_config.model_settings)
            model_settings = RunImpl.maybe_reset_tool_choice(agent, tool_use_tracker, model_settings)
    
            new_response = await model.get_response(
                system_instructions=system_prompt,
                input=input,
                model_settings=model_settings,
                tools=all_tools,
                output_schema=output_schema,
                handoffs=handoffs,
                tracing=get_model_tracing_impl(
                    run_config.tracing_disabled, run_config.trace_include_sensitive_data
                ),
                previous_response_id=previous_response_id,
            )
    
            context_wrapper.usage.add(new_response.usage)
    
            return new_response
    
        @classmethod
        def _get_output_schema(cls, agent: Agent[Any]) -> AgentOutputSchemaBase | None:
            if agent.output_type is None or agent.output_type is str:
                return None
            elif isinstance(agent.output_type, AgentOutputSchemaBase):
                return agent.output_type
    
            return AgentOutputSchema(agent.output_type)
    
        @classmethod
        def _get_handoffs(cls, agent: Agent[Any]) -> list[Handoff]:
            handoffs = []
            for handoff_item in agent.handoffs:
                if isinstance(handoff_item, Handoff):
                    handoffs.append(handoff_item)
                elif isinstance(handoff_item, Agent):
                    handoffs.append(handoff(handoff_item))
            return handoffs
    
        @classmethod
        async def _get_all_tools(cls, agent: Agent[Any]) -> list[Tool]:
            return await agent.get_all_tools()
    
        @classmethod
        def _get_model(cls, agent: Agent[Any], run_config: RunConfig) -> Model:
            if isinstance(run_config.model, Model):
                return run_config.model
            elif isinstance(run_config.model, str):
                return run_config.model_provider.get_model(run_config.model)
            elif isinstance(agent.model, Model):
                return agent.model
    
            return run_config.model_provider.get_model(agent.model)
      
  
---|---  
  
####  run `async` `classmethod`
    
    
    run(
        starting_agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        input: str | list[[TResponseInputItem](../items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")],
        *,
        context: TContext | None = None,
        max_turns: int = DEFAULT_MAX_TURNS,
        hooks: [RunHooks](../lifecycle/#agents.lifecycle.RunHooks "RunHooks \(agents.lifecycle.RunHooks\)")[TContext] | None = None,
        run_config: RunConfig | None = None,
        previous_response_id: str | None = None,
    ) -> [RunResult](../result/#agents.result.RunResult "RunResult
    
    
      
          dataclass
       \(agents.result.RunResult\)")
    

Run a workflow starting at the given agent. The agent will run in a loop until a final output is generated. The loop runs like so: 1\. The agent is invoked with the given input. 2\. If there is a final output (i.e. the agent produces something of type `agent.output_type`, the loop terminates. 3\. If there's a handoff, we run the loop again, with the new agent. 4\. Else, we run tool calls (if any), and re-run the loop.

In two cases, the agent may raise an exception: 1\. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised. 2\. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.

Note that only the first agent's input guardrails are run.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`starting_agent` |  `[Agent](../agent/#agents.agent.Agent "Agent


  
      dataclass
   \(agents.agent.Agent\)")[TContext]` |  The starting agent to run. |  _required_  
`input` |  `str | list[[TResponseInputItem](../items/#agents.items.TResponseInputItem "TResponseInputItem


  
      module-attribute
   \(agents.items.TResponseInputItem\)")]` |  The initial input to the agent. You can pass a single string for a user message, or a list of input items. |  _required_  
`context` |  `TContext | None` |  The context to run the agent with. |  `None`  
`max_turns` |  `int` |  The maximum number of turns to run the agent for. A turn is defined as one AI invocation (including any tool calls that might occur). |  `DEFAULT_MAX_TURNS`  
`hooks` |  `[RunHooks](../lifecycle/#agents.lifecycle.RunHooks "RunHooks \(agents.lifecycle.RunHooks\)")[TContext] | None` |  An object that receives callbacks on various lifecycle events. |  `None`  
`run_config` |  `RunConfig | None` |  Global settings for the entire agent run. |  `None`  
`previous_response_id` |  `str | None` |  The ID of the previous response, if using OpenAI models via the Responses API, this allows you to skip passing in input from the previous turn. |  `None`  
  
Returns:

Type | Description  
---|---  
`[RunResult](../result/#agents.result.RunResult "RunResult


  
      dataclass
   \(agents.result.RunResult\)")` |  A run result containing all the inputs, guardrail results and the output of the last  
`[RunResult](../result/#agents.result.RunResult "RunResult


  
      dataclass
   \(agents.result.RunResult\)")` |  agent. Agents may perform handoffs, so we don't know the specific type of the output.  
Source code in `src/agents/run.py`
    
    
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
    152
    153
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
    268
    269
    270
    271
    272
    273
    274
    275
    276
    277
    278
    279
    280
    281
    282
    283
    284
    285
    286
    287
    288

| 
    
    
    @classmethod
    async def run(
        cls,
        starting_agent: Agent[TContext],
        input: str | list[TResponseInputItem],
        *,
        context: TContext | None = None,
        max_turns: int = DEFAULT_MAX_TURNS,
        hooks: RunHooks[TContext] | None = None,
        run_config: RunConfig | None = None,
        previous_response_id: str | None = None,
    ) -> RunResult:
        """Run a workflow starting at the given agent. The agent will run in a loop until a final
        output is generated. The loop runs like so:
        1. The agent is invoked with the given input.
        2. If there is a final output (i.e. the agent produces something of type
            `agent.output_type`, the loop terminates.
        3. If there's a handoff, we run the loop again, with the new agent.
        4. Else, we run tool calls (if any), and re-run the loop.
    
        In two cases, the agent may raise an exception:
        1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.
        2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.
    
        Note that only the first agent's input guardrails are run.
    
        Args:
            starting_agent: The starting agent to run.
            input: The initial input to the agent. You can pass a single string for a user message,
                or a list of input items.
            context: The context to run the agent with.
            max_turns: The maximum number of turns to run the agent for. A turn is defined as one
                AI invocation (including any tool calls that might occur).
            hooks: An object that receives callbacks on various lifecycle events.
            run_config: Global settings for the entire agent run.
            previous_response_id: The ID of the previous response, if using OpenAI models via the
                Responses API, this allows you to skip passing in input from the previous turn.
    
        Returns:
            A run result containing all the inputs, guardrail results and the output of the last
            agent. Agents may perform handoffs, so we don't know the specific type of the output.
        """
        if hooks is None:
            hooks = RunHooks[Any]()
        if run_config is None:
            run_config = RunConfig()
    
        tool_use_tracker = AgentToolUseTracker()
    
        with TraceCtxManager(
            workflow_name=run_config.workflow_name,
            trace_id=run_config.trace_id,
            group_id=run_config.group_id,
            metadata=run_config.trace_metadata,
            disabled=run_config.tracing_disabled,
        ):
            current_turn = 0
            original_input: str | list[TResponseInputItem] = copy.deepcopy(input)
            generated_items: list[RunItem] = []
            model_responses: list[ModelResponse] = []
    
            context_wrapper: RunContextWrapper[TContext] = RunContextWrapper(
                context=context,  # type: ignore
            )
    
            input_guardrail_results: list[InputGuardrailResult] = []
    
            current_span: Span[AgentSpanData] | None = None
            current_agent = starting_agent
            should_run_agent_start_hooks = True
    
            try:
                while True:
                    # Start an agent span if we don't have one. This span is ended if the current
                    # agent changes, or if the agent loop ends.
                    if current_span is None:
                        handoff_names = [h.agent_name for h in cls._get_handoffs(current_agent)]
                        if output_schema := cls._get_output_schema(current_agent):
                            output_type_name = output_schema.name()
                        else:
                            output_type_name = "str"
    
                        current_span = agent_span(
                            name=current_agent.name,
                            handoffs=handoff_names,
                            output_type=output_type_name,
                        )
                        current_span.start(mark_as_current=True)
    
                        all_tools = await cls._get_all_tools(current_agent)
                        current_span.span_data.tools = [t.name for t in all_tools]
    
                    current_turn += 1
                    if current_turn > max_turns:
                        _error_tracing.attach_error_to_span(
                            current_span,
                            SpanError(
                                message="Max turns exceeded",
                                data={"max_turns": max_turns},
                            ),
                        )
                        raise MaxTurnsExceeded(f"Max turns ({max_turns}) exceeded")
    
                    logger.debug(
                        f"Running agent {current_agent.name} (turn {current_turn})",
                    )
    
                    if current_turn == 1:
                        input_guardrail_results, turn_result = await asyncio.gather(
                            cls._run_input_guardrails(
                                starting_agent,
                                starting_agent.input_guardrails
                                + (run_config.input_guardrails or []),
                                copy.deepcopy(input),
                                context_wrapper,
                            ),
                            cls._run_single_turn(
                                agent=current_agent,
                                all_tools=all_tools,
                                original_input=original_input,
                                generated_items=generated_items,
                                hooks=hooks,
                                context_wrapper=context_wrapper,
                                run_config=run_config,
                                should_run_agent_start_hooks=should_run_agent_start_hooks,
                                tool_use_tracker=tool_use_tracker,
                                previous_response_id=previous_response_id,
                            ),
                        )
                    else:
                        turn_result = await cls._run_single_turn(
                            agent=current_agent,
                            all_tools=all_tools,
                            original_input=original_input,
                            generated_items=generated_items,
                            hooks=hooks,
                            context_wrapper=context_wrapper,
                            run_config=run_config,
                            should_run_agent_start_hooks=should_run_agent_start_hooks,
                            tool_use_tracker=tool_use_tracker,
                            previous_response_id=previous_response_id,
                        )
                    should_run_agent_start_hooks = False
    
                    model_responses.append(turn_result.model_response)
                    original_input = turn_result.original_input
                    generated_items = turn_result.generated_items
    
                    if isinstance(turn_result.next_step, NextStepFinalOutput):
                        output_guardrail_results = await cls._run_output_guardrails(
                            current_agent.output_guardrails + (run_config.output_guardrails or []),
                            current_agent,
                            turn_result.next_step.output,
                            context_wrapper,
                        )
                        return RunResult(
                            input=original_input,
                            new_items=generated_items,
                            raw_responses=model_responses,
                            final_output=turn_result.next_step.output,
                            _last_agent=current_agent,
                            input_guardrail_results=input_guardrail_results,
                            output_guardrail_results=output_guardrail_results,
                            context_wrapper=context_wrapper,
                        )
                    elif isinstance(turn_result.next_step, NextStepHandoff):
                        current_agent = cast(Agent[TContext], turn_result.next_step.new_agent)
                        current_span.finish(reset_current=True)
                        current_span = None
                        should_run_agent_start_hooks = True
                    elif isinstance(turn_result.next_step, NextStepRunAgain):
                        pass
                    else:
                        raise AgentsException(
                            f"Unknown next step type: {type(turn_result.next_step)}"
                        )
            finally:
                if current_span:
                    current_span.finish(reset_current=True)
      
  
---|---  
  
####  run_sync `classmethod`
    
    
    run_sync(
        starting_agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        input: str | list[[TResponseInputItem](../items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")],
        *,
        context: TContext | None = None,
        max_turns: int = DEFAULT_MAX_TURNS,
        hooks: [RunHooks](../lifecycle/#agents.lifecycle.RunHooks "RunHooks \(agents.lifecycle.RunHooks\)")[TContext] | None = None,
        run_config: RunConfig | None = None,
        previous_response_id: str | None = None,
    ) -> [RunResult](../result/#agents.result.RunResult "RunResult
    
    
      
          dataclass
       \(agents.result.RunResult\)")
    

Run a workflow synchronously, starting at the given agent. Note that this just wraps the `run` method, so it will not work if there's already an event loop (e.g. inside an async function, or in a Jupyter notebook or async context like FastAPI). For those cases, use the `run` method instead.

The agent will run in a loop until a final output is generated. The loop runs like so: 1\. The agent is invoked with the given input. 2\. If there is a final output (i.e. the agent produces something of type `agent.output_type`, the loop terminates. 3\. If there's a handoff, we run the loop again, with the new agent. 4\. Else, we run tool calls (if any), and re-run the loop.

In two cases, the agent may raise an exception: 1\. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised. 2\. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.

Note that only the first agent's input guardrails are run.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`starting_agent` |  `[Agent](../agent/#agents.agent.Agent "Agent


  
      dataclass
   \(agents.agent.Agent\)")[TContext]` |  The starting agent to run. |  _required_  
`input` |  `str | list[[TResponseInputItem](../items/#agents.items.TResponseInputItem "TResponseInputItem


  
      module-attribute
   \(agents.items.TResponseInputItem\)")]` |  The initial input to the agent. You can pass a single string for a user message, or a list of input items. |  _required_  
`context` |  `TContext | None` |  The context to run the agent with. |  `None`  
`max_turns` |  `int` |  The maximum number of turns to run the agent for. A turn is defined as one AI invocation (including any tool calls that might occur). |  `DEFAULT_MAX_TURNS`  
`hooks` |  `[RunHooks](../lifecycle/#agents.lifecycle.RunHooks "RunHooks \(agents.lifecycle.RunHooks\)")[TContext] | None` |  An object that receives callbacks on various lifecycle events. |  `None`  
`run_config` |  `RunConfig | None` |  Global settings for the entire agent run. |  `None`  
`previous_response_id` |  `str | None` |  The ID of the previous response, if using OpenAI models via the Responses API, this allows you to skip passing in input from the previous turn. |  `None`  
  
Returns:

Type | Description  
---|---  
`[RunResult](../result/#agents.result.RunResult "RunResult


  
      dataclass
   \(agents.result.RunResult\)")` |  A run result containing all the inputs, guardrail results and the output of the last  
`[RunResult](../result/#agents.result.RunResult "RunResult


  
      dataclass
   \(agents.result.RunResult\)")` |  agent. Agents may perform handoffs, so we don't know the specific type of the output.  
Source code in `src/agents/run.py`
    
    
    290
    291
    292
    293
    294
    295
    296
    297
    298
    299
    300
    301
    302
    303
    304
    305
    306
    307
    308
    309
    310
    311
    312
    313
    314
    315
    316
    317
    318
    319
    320
    321
    322
    323
    324
    325
    326
    327
    328
    329
    330
    331
    332
    333
    334
    335
    336
    337
    338
    339
    340
    341
    342
    343
    344
    345
    346

| 
    
    
    @classmethod
    def run_sync(
        cls,
        starting_agent: Agent[TContext],
        input: str | list[TResponseInputItem],
        *,
        context: TContext | None = None,
        max_turns: int = DEFAULT_MAX_TURNS,
        hooks: RunHooks[TContext] | None = None,
        run_config: RunConfig | None = None,
        previous_response_id: str | None = None,
    ) -> RunResult:
        """Run a workflow synchronously, starting at the given agent. Note that this just wraps the
        `run` method, so it will not work if there's already an event loop (e.g. inside an async
        function, or in a Jupyter notebook or async context like FastAPI). For those cases, use
        the `run` method instead.
    
        The agent will run in a loop until a final output is generated. The loop runs like so:
        1. The agent is invoked with the given input.
        2. If there is a final output (i.e. the agent produces something of type
            `agent.output_type`, the loop terminates.
        3. If there's a handoff, we run the loop again, with the new agent.
        4. Else, we run tool calls (if any), and re-run the loop.
    
        In two cases, the agent may raise an exception:
        1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.
        2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.
    
        Note that only the first agent's input guardrails are run.
    
        Args:
            starting_agent: The starting agent to run.
            input: The initial input to the agent. You can pass a single string for a user message,
                or a list of input items.
            context: The context to run the agent with.
            max_turns: The maximum number of turns to run the agent for. A turn is defined as one
                AI invocation (including any tool calls that might occur).
            hooks: An object that receives callbacks on various lifecycle events.
            run_config: Global settings for the entire agent run.
            previous_response_id: The ID of the previous response, if using OpenAI models via the
                Responses API, this allows you to skip passing in input from the previous turn.
    
        Returns:
            A run result containing all the inputs, guardrail results and the output of the last
            agent. Agents may perform handoffs, so we don't know the specific type of the output.
        """
        return asyncio.get_event_loop().run_until_complete(
            cls.run(
                starting_agent,
                input,
                context=context,
                max_turns=max_turns,
                hooks=hooks,
                run_config=run_config,
                previous_response_id=previous_response_id,
            )
        )
      
  
---|---  
  
####  run_streamed `classmethod`
    
    
    run_streamed(
        starting_agent: [Agent](../agent/#agents.agent.Agent "Agent
    
    
      
          dataclass
       \(agents.agent.Agent\)")[TContext],
        input: str | list[[TResponseInputItem](../items/#agents.items.TResponseInputItem "TResponseInputItem
    
    
      
          module-attribute
       \(agents.items.TResponseInputItem\)")],
        context: TContext | None = None,
        max_turns: int = DEFAULT_MAX_TURNS,
        hooks: [RunHooks](../lifecycle/#agents.lifecycle.RunHooks "RunHooks \(agents.lifecycle.RunHooks\)")[TContext] | None = None,
        run_config: RunConfig | None = None,
        previous_response_id: str | None = None,
    ) -> [RunResultStreaming](../result/#agents.result.RunResultStreaming "RunResultStreaming
    
    
      
          dataclass
       \(agents.result.RunResultStreaming\)")
    

Run a workflow starting at the given agent in streaming mode. The returned result object contains a method you can use to stream semantic events as they are generated.

The agent will run in a loop until a final output is generated. The loop runs like so: 1\. The agent is invoked with the given input. 2\. If there is a final output (i.e. the agent produces something of type `agent.output_type`, the loop terminates. 3\. If there's a handoff, we run the loop again, with the new agent. 4\. Else, we run tool calls (if any), and re-run the loop.

In two cases, the agent may raise an exception: 1\. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised. 2\. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.

Note that only the first agent's input guardrails are run.

Parameters:

Name | Type | Description | Default  
---|---|---|---  
`starting_agent` |  `[Agent](../agent/#agents.agent.Agent "Agent


  
      dataclass
   \(agents.agent.Agent\)")[TContext]` |  The starting agent to run. |  _required_  
`input` |  `str | list[[TResponseInputItem](../items/#agents.items.TResponseInputItem "TResponseInputItem


  
      module-attribute
   \(agents.items.TResponseInputItem\)")]` |  The initial input to the agent. You can pass a single string for a user message, or a list of input items. |  _required_  
`context` |  `TContext | None` |  The context to run the agent with. |  `None`  
`max_turns` |  `int` |  The maximum number of turns to run the agent for. A turn is defined as one AI invocation (including any tool calls that might occur). |  `DEFAULT_MAX_TURNS`  
`hooks` |  `[RunHooks](../lifecycle/#agents.lifecycle.RunHooks "RunHooks \(agents.lifecycle.RunHooks\)")[TContext] | None` |  An object that receives callbacks on various lifecycle events. |  `None`  
`run_config` |  `RunConfig | None` |  Global settings for the entire agent run. |  `None`  
`previous_response_id` |  `str | None` |  The ID of the previous response, if using OpenAI models via the Responses API, this allows you to skip passing in input from the previous turn. |  `None`  
  
Returns: A result object that contains data about the run, as well as a method to stream events.

Source code in `src/agents/run.py`
    
    
    348
    349
    350
    351
    352
    353
    354
    355
    356
    357
    358
    359
    360
    361
    362
    363
    364
    365
    366
    367
    368
    369
    370
    371
    372
    373
    374
    375
    376
    377
    378
    379
    380
    381
    382
    383
    384
    385
    386
    387
    388
    389
    390
    391
    392
    393
    394
    395
    396
    397
    398
    399
    400
    401
    402
    403
    404
    405
    406
    407
    408
    409
    410
    411
    412
    413
    414
    415
    416
    417
    418
    419
    420
    421
    422
    423
    424
    425
    426
    427
    428
    429
    430
    431
    432
    433
    434
    435
    436
    437
    438
    439
    440
    441
    442
    443

| 
    
    
    @classmethod
    def run_streamed(
        cls,
        starting_agent: Agent[TContext],
        input: str | list[TResponseInputItem],
        context: TContext | None = None,
        max_turns: int = DEFAULT_MAX_TURNS,
        hooks: RunHooks[TContext] | None = None,
        run_config: RunConfig | None = None,
        previous_response_id: str | None = None,
    ) -> RunResultStreaming:
        """Run a workflow starting at the given agent in streaming mode. The returned result object
        contains a method you can use to stream semantic events as they are generated.
    
        The agent will run in a loop until a final output is generated. The loop runs like so:
        1. The agent is invoked with the given input.
        2. If there is a final output (i.e. the agent produces something of type
            `agent.output_type`, the loop terminates.
        3. If there's a handoff, we run the loop again, with the new agent.
        4. Else, we run tool calls (if any), and re-run the loop.
    
        In two cases, the agent may raise an exception:
        1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.
        2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.
    
        Note that only the first agent's input guardrails are run.
    
        Args:
            starting_agent: The starting agent to run.
            input: The initial input to the agent. You can pass a single string for a user message,
                or a list of input items.
            context: The context to run the agent with.
            max_turns: The maximum number of turns to run the agent for. A turn is defined as one
                AI invocation (including any tool calls that might occur).
            hooks: An object that receives callbacks on various lifecycle events.
            run_config: Global settings for the entire agent run.
            previous_response_id: The ID of the previous response, if using OpenAI models via the
                Responses API, this allows you to skip passing in input from the previous turn.
        Returns:
            A result object that contains data about the run, as well as a method to stream events.
        """
        if hooks is None:
            hooks = RunHooks[Any]()
        if run_config is None:
            run_config = RunConfig()
    
        # If there's already a trace, we don't create a new one. In addition, we can't end the
        # trace here, because the actual work is done in `stream_events` and this method ends
        # before that.
        new_trace = (
            None
            if get_current_trace()
            else trace(
                workflow_name=run_config.workflow_name,
                trace_id=run_config.trace_id,
                group_id=run_config.group_id,
                metadata=run_config.trace_metadata,
                disabled=run_config.tracing_disabled,
            )
        )
    
        output_schema = cls._get_output_schema(starting_agent)
        context_wrapper: RunContextWrapper[TContext] = RunContextWrapper(
            context=context  # type: ignore
        )
    
        streamed_result = RunResultStreaming(
            input=copy.deepcopy(input),
            new_items=[],
            current_agent=starting_agent,
            raw_responses=[],
            final_output=None,
            is_complete=False,
            current_turn=0,
            max_turns=max_turns,
            input_guardrail_results=[],
            output_guardrail_results=[],
            _current_agent_output_schema=output_schema,
            trace=new_trace,
            context_wrapper=context_wrapper,
        )
    
        # Kick off the actual agent loop in the background and return the streamed result object.
        streamed_result._run_impl_task = asyncio.create_task(
            cls._run_streamed_impl(
                starting_input=input,
                streamed_result=streamed_result,
                starting_agent=starting_agent,
                max_turns=max_turns,
                hooks=hooks,
                context_wrapper=context_wrapper,
                run_config=run_config,
                previous_response_id=previous_response_id,
            )
        )
        return streamed_result
      
  
---|---  
  
###  RunConfig `dataclass`

Configures settings for the entire agent run.

Source code in `src/agents/run.py`
    
    
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

| 
    
    
    @dataclass
    class RunConfig:
        """Configures settings for the entire agent run."""
    
        model: str | Model | None = None
        """The model to use for the entire agent run. If set, will override the model set on every
        agent. The model_provider passed in below must be able to resolve this model name.
        """
    
        model_provider: ModelProvider = field(default_factory=MultiProvider)
        """The model provider to use when looking up string model names. Defaults to OpenAI."""
    
        model_settings: ModelSettings | None = None
        """Configure global model settings. Any non-null values will override the agent-specific model
        settings.
        """
    
        handoff_input_filter: HandoffInputFilter | None = None
        """A global input filter to apply to all handoffs. If `Handoff.input_filter` is set, then that
        will take precedence. The input filter allows you to edit the inputs that are sent to the new
        agent. See the documentation in `Handoff.input_filter` for more details.
        """
    
        input_guardrails: list[InputGuardrail[Any]] | None = None
        """A list of input guardrails to run on the initial run input."""
    
        output_guardrails: list[OutputGuardrail[Any]] | None = None
        """A list of output guardrails to run on the final output of the run."""
    
        tracing_disabled: bool = False
        """Whether tracing is disabled for the agent run. If disabled, we will not trace the agent run.
        """
    
        trace_include_sensitive_data: bool = True
        """Whether we include potentially sensitive data (for example: inputs/outputs of tool calls or
        LLM generations) in traces. If False, we'll still create spans for these events, but the
        sensitive data will not be included.
        """
    
        workflow_name: str = "Agent workflow"
        """The name of the run, used for tracing. Should be a logical name for the run, like
        "Code generation workflow" or "Customer support agent".
        """
    
        trace_id: str | None = None
        """A custom trace ID to use for tracing. If not provided, we will generate a new trace ID."""
    
        group_id: str | None = None
        """
        A grouping identifier to use for tracing, to link multiple traces from the same conversation
        or process. For example, you might use a chat thread ID.
        """
    
        trace_metadata: dict[str, Any] | None = None
        """
        An optional dictionary of additional metadata to include with the trace.
        """
      
  
---|---  
  
####  model `class-attribute` `instance-attribute`
    
    
    model: str | [Model](../models/interface/#agents.models.interface.Model "Model \(agents.models.interface.Model\)") | None = None
    

The model to use for the entire agent run. If set, will override the model set on every agent. The model_provider passed in below must be able to resolve this model name.

####  model_provider `class-attribute` `instance-attribute`
    
    
    model_provider: [ModelProvider](../models/interface/#agents.models.interface.ModelProvider "ModelProvider \(agents.models.interface.ModelProvider\)") = field(
        default_factory=MultiProvider
    )
    

The model provider to use when looking up string model names. Defaults to OpenAI.

####  model_settings `class-attribute` `instance-attribute`
    
    
    model_settings: [ModelSettings](../model_settings/#agents.model_settings.ModelSettings "ModelSettings
    
    
      
          dataclass
       \(agents.model_settings.ModelSettings\)") | None = None
    

Configure global model settings. Any non-null values will override the agent-specific model settings.

####  handoff_input_filter `class-attribute` `instance-attribute`
    
    
    handoff_input_filter: [HandoffInputFilter](../handoffs/#agents.handoffs.HandoffInputFilter "HandoffInputFilter
    
    
      
          module-attribute
       \(agents.handoffs.HandoffInputFilter\)") | None = None
    

A global input filter to apply to all handoffs. If `Handoff.input_filter` is set, then that will take precedence. The input filter allows you to edit the inputs that are sent to the new agent. See the documentation in `Handoff.input_filter` for more details.

####  input_guardrails `class-attribute` `instance-attribute`
    
    
    input_guardrails: list[[InputGuardrail](../guardrail/#agents.guardrail.InputGuardrail "InputGuardrail
    
    
      
          dataclass
       \(agents.guardrail.InputGuardrail\)")[Any]] | None = None
    

A list of input guardrails to run on the initial run input.

####  output_guardrails `class-attribute` `instance-attribute`
    
    
    output_guardrails: list[[OutputGuardrail](../guardrail/#agents.guardrail.OutputGuardrail "OutputGuardrail
    
    
      
          dataclass
       \(agents.guardrail.OutputGuardrail\)")[Any]] | None = None
    

A list of output guardrails to run on the final output of the run.

####  tracing_disabled `class-attribute` `instance-attribute`
    
    
    tracing_disabled: bool = False
    

Whether tracing is disabled for the agent run. If disabled, we will not trace the agent run.

####  trace_include_sensitive_data `class-attribute` `instance-attribute`
    
    
    trace_include_sensitive_data: bool = True
    

Whether we include potentially sensitive data (for example: inputs/outputs of tool calls or LLM generations) in traces. If False, we'll still create spans for these events, but the sensitive data will not be included.

####  workflow_name `class-attribute` `instance-attribute`
    
    
    workflow_name: str = 'Agent workflow'
    

The name of the run, used for tracing. Should be a logical name for the run, like "Code generation workflow" or "Customer support agent".

####  trace_id `class-attribute` `instance-attribute`
    
    
    trace_id: str | None = None
    

A custom trace ID to use for tracing. If not provided, we will generate a new trace ID.

####  group_id `class-attribute` `instance-attribute`
    
    
    group_id: str | None = None
    

A grouping identifier to use for tracing, to link multiple traces from the same conversation or process. For example, you might use a chat thread ID.

####  trace_metadata `class-attribute` `instance-attribute`
    
    
    trace_metadata: dict[str, Any] | None = None
    

An optional dictionary of additional metadata to include with the trace.
