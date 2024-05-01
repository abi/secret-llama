import { useState } from "react";
import * as webllm from "@mlc-ai/web-llm";

const appConfig = webllm.prebuiltAppConfig;
// CHANGE THIS TO SEE EFFECTS OF BOTH, CODE BELOW DO NOT NEED TO CHANGE
appConfig.useIndexedDBCache = true;

if (appConfig.useIndexedDBCache) {
  console.log("Using IndexedDB Cache");
} else {
  console.log("Using Cache API");
}

function App() {
  const [progress, setProgress] = useState("Initializing...");

  const initProgressCallback = (report: webllm.InitProgressReport) => {
    setProgress(report.text);
  };
  const selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k";

  async function loadEngine() {
    const engine: webllm.EngineInterface = await webllm.CreateEngine(
      selectedModel,
      /*engineConfig=*/ { initProgressCallback: initProgressCallback }
    );
    const reply0 = await engine.chat.completions.create({
      messages: [{ role: "user", content: "Tell me about Pittsburgh." }],
    });
    console.log(reply0);
    console.log(reply0.choices[0].message.content);
    console.log(await engine.runtimeStatsText());
  }

  return (
    <>
      <div>{progress}</div>
      <div className="border">
        <button onClick={loadEngine}>Load model</button>
      </div>
    </>
  );
}

export default App;
