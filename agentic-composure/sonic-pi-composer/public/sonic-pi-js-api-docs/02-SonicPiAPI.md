# Class: SonicPiAPI

## SonicPiAPI()

A class used to initiate, interface with, and shutdown the Sonic Pi server.

## Constructor

#### new SonicPiAPI()

Creates an instance of the `SonicPiAPI` Class

Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 22](sonic-pi-api.js.html#line22)

### Members

#### settings :Object

User settings

##### Type:

  * Object

##### Properties:

Name | Type | Description  
---|---|---  
`log_synths` |  boolean | Default: true  
`log_cues` |  boolean | Default: true  
`enable_external_synths` |  boolean | Default: false  
`enforce_timing_guarantees` |  boolean | Default: false  
`check_args` |  boolean | Default: false  
`default_midi_channel` |  number | Note that any number less than 0 corresponds to all channels. Must be an integer. Default: -1  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 102](sonic-pi-api.js.html#line102)

### Methods

#### buffer_new_line_and_indent(point_line, point_index, first_line, code,
file_name)

Buffer new line and indent

##### Parameters:

Name | Type | Description  
---|---|---  
`point_line` |  number |   
`point_index` |  number |   
`first_line` |  number |   
`code` |  string |   
`file_name` |  string |   
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 330](sonic-pi-api.js.html#line330)

#### (async) init(root) -> {Result}

Initialise the Sonic Pi server

##### Parameters:

Name | Type | Description  
---|---|---  
`root` |  string | Root path of Sonic Pi  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 379](sonic-pi-api.js.html#line379)

##### Returns:

The result of the initialisation process

Type

     Result

#### load_workspaces()

Load workspaces

Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 347](sonic-pi-api.js.html#line347)

#### run_code(code)

Run code

##### Parameters:

Name | Type | Description  
---|---|---  
`code` |  string | The code to run  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 317](sonic-pi-api.js.html#line317)

#### save_and_run_buffer(buffer, code)

Save and run buffer

##### Parameters:

Name | Type | Description  
---|---|---  
`buffer` |  string | Buffer identifier  
`code` |  string | The code to save and run  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 339](sonic-pi-api.js.html#line339)

#### save_workspaces(workspaces)

Save workspaces

##### Parameters:

Name | Type | Description  
---|---|---  
`workspaces` |  Array.<Object> | 

###### Properties

| Name | Type | Description  
---|---|---  
`n` |  string | The code to save in workspace `n`, where `n` is an integer in the range: 0 ≤ n < `max_workspaces`  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 358](sonic-pi-api.js.html#line358)

#### set_volume(vol, silentopt)

Set the main volume

##### Parameters:

Name | Type | Attributes | Default | Description  
---|---|---|---|---  
`vol` |  number |  |  | A number from 0 to 200 indicating the volume percentage  
`silent` |  number |  <optional>  
|  0  |   
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 190](sonic-pi-api.js.html#line190)

##### Throws:

Argument vol must be between 0 and 200 inclusive.

    

Type

     RangeError
    

#### shutdown()

Shuts down the Sonic Pi server

Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 123](sonic-pi-api.js.html#line123)

#### stop_all_jobs()

Stop all jobs

Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 369](sonic-pi-api.js.html#line369)

### Type Definitions

#### Result

##### Type:

  * Object

##### Properties:

Name | Type | Description  
---|---|---  
`success` |  boolean | Whether the operation was successful  
`error_message` |  string | An error message if something went wrong - only present if `success` is false  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 41](sonic-pi-api.js.html#line41)

### Events

#### received_ports

Emits the ports used for communicating with different parts of the server

##### Type:

  * object

##### Properties:

Name | Type | Description  
---|---|---  
`daemon` |  number | Port for sending commands to boot daemon  
`gui_listen_to_spider` |  number | Port for Spider (Ruby Server) to GUI communications  
`gui_send_to_spider` |  number | Port for GUI to Spider communications  
`scsynth` |  number | Port for sending commands to scsynth  
`tau_osc_cues` |  number | Port for receiving OSC cues  
`tau` |  number | Port for sending messages to Tau (Elixir Server)  
`phx_http` |  number | Port that the Tau webpage is served on  
  
Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 459](sonic-pi-api.js.html#line459)

#### shutdown_complete

Emitted when the shutdown process is complete (i.e. when the boot daemon has
exited)

Source:

    

  * [sonic-pi-api.js](sonic-pi-api.js.html), [line 172](sonic-pi-api.js.html#line172)

## [Home](index.html)

### Classes

  * [SonicPiAPI](SonicPiAPI.html)
  * [SonicPiOSCServer](SonicPiOSCServer.html)

### Events

  * [received_ports](SonicPiAPI.html#event:received_ports)
  * [shutdown_complete](SonicPiAPI.html#event:shutdown_complete)
  * [ack](SonicPiOSCServer.html#event:ack)
  * [error](SonicPiOSCServer.html#event:error)
  * [exited](SonicPiOSCServer.html#event:exited)
  * [log](SonicPiOSCServer.html#event:log)

  
Documentation generated by [JSDoc 4.0.2](https://github.com/jsdoc/jsdoc) on
Sun May 21 2023 23:59:22 GMT+0100 (British Summer Time)

