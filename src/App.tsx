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
  const [userInput, setUserInput] = useState("");

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
  }

  async function send() {
    if (!engine) {
      console.log("Engine not loaded");
      return;
    }

    const reply0 = await engine.chat.completions.create({
      messages: [{ role: "user", content: userInput }],
    });
    console.log(reply0);
    console.log(reply0.choices[0].message.content);
    console.log(await engine.runtimeStatsText());
  }

  return (
    <>
      <div className="max-w-lg mx-auto">
        <div>{progress}</div>
        <button onClick={loadEngine}>Load model</button>
        <Input
          placeholder="Enter message"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </>
  );
}

export default App;
