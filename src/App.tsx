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

  const [chatHistory, setChatHistory] = useState<
    webllm.ChatCompletionMessageParam[]
  >([]);

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

    const userMessage: webllm.ChatCompletionMessageParam = {
      role: "user",
      content: userInput,
    };
    setChatHistory((history) => [...history, userMessage]);

    const reply0 = await loadedEngine.chat.completions.create({
      messages: [...chatHistory, userMessage],
    });

    const assistantMessage = reply0.choices[0].message;
    const response = reply0.choices[0].message.content;
    if (!response) {
      console.error("No response");
      return;
    }

    setChatHistory((history) => [...history, assistantMessage]);

    console.log(reply0);
    console.log(response);
    console.log(await loadedEngine.runtimeStatsText());
  }

  return (
    <>
      <div className="max-w-lg mx-auto">
        <div>{progress}</div>
        <button onClick={loadEngine}>Load model</button>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow ${
              message.role === "user" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-gray-700 ${
                message.role === "user" ? "text-right" : ""
              }`}
            >
              {typeof message.content === "string"
                ? message.content
                : "No content found"}
            </p>
          </div>
        ))}
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
