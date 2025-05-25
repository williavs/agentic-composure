"use client";

import { useState, useTransition } from "react";

export default function MinimalTestHarnessClient() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [generationStatus, setGenerationStatus] = useState("");
  const [playStatus, setPlayStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  // Use fetch to call the API route for AI code generation
  async function handleGenerate() {
    setGenerationStatus("Generating...");
    setPlayStatus("");
    startTransition(async () => {
      try {
        const result = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }).then((res) => res.json());
        if (result.success) {
          setGeneratedCode(result.code);
          setGenerationStatus("✅ Code generated!");
        } else {
          setGeneratedCode("");
          setGenerationStatus(result.error || "❌ Generation failed");
        }
      } catch (err) {
        setGeneratedCode("");
        setGenerationStatus("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    });
  }

  // Use fetch to call the API route for Sonic Pi playback
  async function handlePlay() {
    setPlayStatus("Playing...");
    startTransition(async () => {
      try {
        const result = await fetch("/api/play", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: generatedCode }),
        }).then((res) => res.json());
        if (result.success) {
          setPlayStatus("✅ Playback started!");
        } else {
          setPlayStatus(result.message || "❌ Playback failed");
        }
      } catch (err) {
        setPlayStatus("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    });
  }

  // Use fetch to call the API route for stopping Sonic Pi playback
  async function handleStop() {
    setPlayStatus("Stopping...");
    startTransition(async () => {
      try {
        const result = await fetch("/api/play", {
          method: "DELETE",
        }).then((res) => res.json());
        if (result.success) {
          setPlayStatus("🛑 Playback stopped");
        } else {
          setPlayStatus(result.message || "❌ Stop failed");
        }
      } catch (err) {
        setPlayStatus("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    });
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="prompt" className="block font-medium mb-1">
          Describe your music:
        </label>
        <textarea
          id="prompt"
          className="w-full border rounded p-2 mb-2"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Chill lofi beat with piano"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleGenerate}
          disabled={isPending || !prompt.trim()}
        >
          Generate Code
        </button>
        <div className="mt-2 text-sm text-gray-700 min-h-[1.5em]">{generationStatus}</div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Generated Sonic Pi Code:</label>
        <textarea
          className="w-full border rounded p-2 font-mono text-sm"
          rows={10}
          value={generatedCode}
          onChange={(e) => setGeneratedCode(e.target.value)}
          placeholder="Generated code will appear here..."
        />
      </div>

      <div className="mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handlePlay}
          disabled={isPending || !generatedCode.trim()}
        >
          Play in Sonic Pi
        </button>
        <button
          className="ml-2 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleStop}
          disabled={isPending}
        >
          Stop Playback
        </button>
        <div className="mt-2 text-sm text-gray-700 min-h-[1.5em]">{playStatus}</div>
      </div>
    </div>
  );
} 