import { useEffect, useRef, useState } from "react";
import * as webllm from "@mlc-ai/web-llm";
import { FaHorseHead, FaPerson } from "react-icons/fa6";
import Markdown from "react-markdown";
import UserInput from "./components/UserInput";
import useChatStore from "./hooks/useChatStore";
import ResetChatButton from "./components/ResetChatButton";
import DebugUI from "./components/DebugUI";
import ModelsDropdown from "./components/ModelsDropdown";

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
  const [progress, setProgress] = useState("Not loaded");
  const [chatHistory, setChatHistory] = useState<
    webllm.ChatCompletionMessageParam[]
  >([]);

  // Store
  const userInput = useChatStore((state) => state.userInput);
  const setUserInput = useChatStore((state) => state.setUserInput);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setIsGenerating = useChatStore((state) => state.setIsGenerating);

  const systemPrompt = "You are a very helpful assistant.";

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

  async function loadEngine() {
    console.log("Loading engine");

    const engine: webllm.EngineInterface = await webllm.CreateWebWorkerEngine(
      new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
      selectedModel,
      /*engineConfig=*/ {
        initProgressCallback: initProgressCallback,
        appConfig: appConfig,
      }
    );
    setEngine(engine);
    return engine;
  }

  async function onSend() {
    setIsGenerating(true);

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
        temperature: 0.5,
        max_gen_len: 1024,
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

      setIsGenerating(false);

      console.log(await loadedEngine.runtimeStatsText());
    } catch (e) {
      setIsGenerating(false);
      console.error("EXCEPTION");
      console.error(e);
      setChatHistory((history) => [
        ...history,
        { role: "assistant", content: "Error. Try again." },
      ]);
      return;
    }
  }

  // useEffect(() => {
  //   if (!engine) {
  //     loadEngine();
  //   }
  // }, []);

  async function resetChat() {
    if (!engine) {
      console.error("Engine not loaded");
      return;
    }
    await engine.resetChat();
    // setUserInput("");
    setChatHistory([]);
    console.log("reset complete");
  }

  function onStop() {
    if (!engine) {
      console.error("Engine not loaded");
      return;
    }

    setIsGenerating(false);
    engine.interruptGenerate();
  }

  return (
    <div className="px-4 w-full">
      <div className="absolute top-0 left-0 p-4 flex flex-col gap-2">
        <div>
          <ResetChatButton resetChat={resetChat} />
        </div>
        <DebugUI loadEngine={loadEngine} progress={progress} />
        <ModelsDropdown />
      </div>

      <div className="max-w-3xl mx-auto flex flex-col h-screen">
        {/* MessageList */}
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
                <Markdown className="text-gray-700 pl-8 mt-2 leading-[1.75] prose">
                  {typeof message.content === "string"
                    ? message.content
                    : "Non-string content found"}
                </Markdown>
              </div>
            ))}
          </div>
        </div>

        {/* User input footer */}
        <UserInput onSend={onSend} onStop={onStop} />
      </div>
    </div>
  );
}

export default App;
