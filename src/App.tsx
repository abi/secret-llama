import { useState } from "react";
import * as webllm from "@mlc-ai/web-llm";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";

const appConfig = webllm.prebuiltAppConfig;
// CHANGE THIS TO SEE EFFECTS OF BOTH, CODE BELOW DO NOT NEED TO CHANGE
appConfig.useIndexedDBCache = true;

if (appConfig.useIndexedDBCache) {
  console.log("Using IndexedDB Cache");
} else {
  console.log("Using Cache API");
}

function App() {
  const [engine, setEngine] = useState<webllm.EngineInterface | null>(null);
  const [progress, setProgress] = useState("Initializing...");
  const [userInput, setUserInput] = useState("Where's pittsburgh?");
  const [assistantMessage, setAssistantMessage] = useState("");

  const initProgressCallback = (report: webllm.InitProgressReport) => {
    setProgress(report.text);
  };
  const selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k";

  async function loadEngine() {
    const engine: webllm.EngineInterface = await webllm.CreateEngine(
      selectedModel,
      /*engineConfig=*/ { initProgressCallback: initProgressCallback }
    );
    setEngine(engine);
    return engine;
  }

  async function send() {
    let loadedEngine = engine;

    // Start up the engine first
    if (!loadedEngine) {
      console.log("Engine not loaded");
      loadedEngine = await loadEngine();
    }

    const reply0 = await loadedEngine.chat.completions.create({
      messages: [{ role: "user", content: userInput }],
    });
    const response = reply0.choices[0].message.content;
    if (!response) {
      console.error("No response");
      return;
    }

    setAssistantMessage(response);
    console.log(reply0);
    console.log(response);
    console.log(await loadedEngine.runtimeStatsText());
  }

  return (
    <>
      <div className="max-w-lg mx-auto">
        <div>{progress}</div>
        <button onClick={loadEngine}>Load model</button>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-gray-700">{assistantMessage}</p>
        </div>
        <Input
          placeholder="Enter message"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </>
  );
}

export default App;
