import { useEffect, useRef, useState } from "react";
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

const MODELS = [
  "Mistral-7B-Instruct-v0.2-q4f16_1",
  "Llama-3-8B-Instruct-q4f16_1",
  "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
  "Phi1.5-q4f16_1-1k",
];

function App() {
  const [engine, setEngine] = useState<webllm.EngineInterface | null>(null);
  const [progress, setProgress] = useState("Initializing...");
  const [userInput, setUserInput] = useState("Where's pittsburgh?");
  const [chatHistory, setChatHistory] = useState<
    webllm.ChatCompletionMessageParam[]
  >([]);

  const [modelsState, setModelsState] = useState<{ [key: string]: boolean }>(
    {}
  );
  const systemPrompt = "You act like Tom Hanks.";

  // Respond in markdown.

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const initProgressCallback = (report: webllm.InitProgressReport) => {
    // console.log(report);
    setProgress(report.text);
  };
  const selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k";
  // const selectedModel = "Phi1.5-q4f16_1-1k";
  // const selectedModel = "Mistral-7B-Instruct-v0.2-q4f16_1";

  async function loadEngine() {
    const engine: webllm.EngineInterface = await webllm.CreateEngine(
      selectedModel,
      /*engineConfig=*/ {
        initProgressCallback: initProgressCallback,
        appConfig: appConfig,
      }
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

    setChatHistory((history) => [
      ...history,
      { role: "assistant", content: "" },
    ]);

    try {
      const completion = await loadedEngine.chat.completions.create({
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          userMessage,
        ],
      });

      // Get each chunk from the stream
      let assistantMessage = "";
      for await (const chunk of completion) {
        const curDelta = chunk.choices[0].delta.content;
        if (curDelta) {
          assistantMessage += curDelta;
          // Update the last message
          setChatHistory((history) => [
            ...history.slice(0, -1),
            { role: "assistant", content: assistantMessage },
          ]);
        }
      }

      console.log(await loadedEngine.runtimeStatsText());
    } catch (e) {
      console.error("EXCEPTION");
      console.error(e);
      setChatHistory((history) => [
        ...history,
        { role: "assistant", content: "Error. Try again." },
      ]);
      return;
    }
  }

  useEffect(() => {
    if (!engine) {
      loadEngine();
    }
  }, []);

  async function updateModelStatus() {
    console.log("Checking model status");
    MODELS.forEach(async (model) => {
      const isInCache = await webllm.hasModelInCache(model, appConfig);
      console.log(`${model} in cache: ${isInCache}`);
      setModelsState((prev) => ({
        ...prev,
        [model]: isInCache,
      }));
    });
  }

  useEffect(() => {
    if (engine) {
      updateModelStatus();
    }
  }, [engine]);

  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col h-screen">
        <div className="p-2 text-xs">{progress}</div>

        <div className="p-2 text-xs text-center font-bold">
          {MODELS.map((model, index) => (
            <>
              <div key={index}>{model}</div>
              <span
                className={`ml-2 ${
                  modelsState[model] ? "text-green-500" : "text-red-500"
                }`}
              >
                {modelsState[model] ? "Cached" : "Not Cached"}
              </span>
            </>
          ))}
        </div>
        {/* List of messages */}
        <div className="flex-1 overflow-auto" ref={scrollRef}>
          <div className="max-w-3xl mx-auto text-base px-5">
            {chatHistory.map((message, index) => (
              <div key={index} className="p-4 rounded-lg mt-2">
                <div className="flex items-center gap-x-2">
                  <div className="border p-1 rounded-full text-gray-500">
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
        </div>

        {/* User input footer */}
        <div className="p-4 bg-white">
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
