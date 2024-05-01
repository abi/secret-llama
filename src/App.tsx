import { useEffect, useState } from "react";
import * as webllm from "@mlc-ai/web-llm";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import { FaArrowUp, FaHorseHead, FaPerson } from "react-icons/fa6";

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
    setUserInput("");

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

  useEffect(() => {
    loadEngine();
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="p-2 text-xs">{progress}</div>
        <div className="max-w-2xl mx-auto text-base">
          {chatHistory.map((message, index) => (
            <div key={index} className="p-4 rounded-lg mt-2">
              <div className="flex items-center gap-x-2">
                <div className="border p-1 rounded-full">
                  {message.role === "assistant" ? (
                    <FaHorseHead />
                  ) : (
                    <FaPerson />
                  )}
                </div>
                <div className="font-bold">
                  {message.role === "assistant" ? "Llama" : "You"}
                </div>
              </div>
              <p className="text-gray-700 pl-8 mt-2 leading-[1.75]">
                {typeof message.content === "string"
                  ? message.content
                  : "No content found"}
              </p>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white max-w-3xl mx-auto">
          <div className="flex items-center p-2 bg-white border rounded-xl shadow-sm">
            <Input
              className="flex-1 border-none shadow-none focus:ring-0 
              ring-0 focus:border-0 focus-visible:ring-0 text-base"
              placeholder="Message Llama"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  send();
                }
              }}
            />
            <Button className="p-2" variant="ghost" onClick={send}>
              <FaArrowUp className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
