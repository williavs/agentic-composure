import warnings
from typing import Any
from automcp.adapters.openai import create_openai_adapter
from pydantic import BaseModel
from mcp.server.fastmcp import FastMCP

# Create MCP server
mcp = FastMCP("MCP Server")

# Suppress warnings that might interfere with STDIO transport
warnings.filterwarnings("ignore")

# Replace this import with your actual OpenAI agent class
from your_module import YourOpenAIAgent # e.g., from my_openai_agent import MyAgent

# Define the input schema for your agent
class InputSchema(BaseModel):
    # Replace these with your actual input parameters
    query: str # Example parameter
    # Add more parameters as needed, e.g., user_id: str

# Set your agent details
name = "<YOUR_AGENT_NAME>"  # Replace with your agent's name
description = "<YOUR_AGENT_DESCRIPTION>" # Replace with a description of what your agent does

# Create an adapter for your OpenAI agent
mcp_openai_agent = create_openai_adapter(
    agent_instance=YourOpenAIAgent(),  # Replace with an instance of your actual OpenAI agent class
    name=name,
    description=description,
    input_schema=InputSchema,
)
    

mcp.add_tool(
    mcp_openai_agent,
    name=name, # This name should match the one provided to the adapter
    description=description # This description should match the one provided to the adapter
)

# Server entrypoints
def serve_sse():
    mcp.run(transport="sse")

def serve_stdio():
    # Redirect stderr to suppress warnings that bypass the filters
    import os
    import sys

    class NullWriter:
        def write(self, *args, **kwargs):
            pass
        def flush(self, *args, **kwargs):
            pass

    # Save the original stderr
    original_stderr = sys.stderr

    # Replace stderr with our null writer to prevent warnings from corrupting STDIO
    sys.stderr = NullWriter()

    # Set environment variable to ignore Python warnings
    os.environ["PYTHONWARNINGS"] = "ignore"

    try:
        mcp.run(transport="stdio")
    finally:
        # Restore stderr for normal operation
        sys.stderr = original_stderr

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "sse":
        serve_sse()
    else:
        serve_stdio()