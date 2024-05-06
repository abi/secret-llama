import { useState, useEffect } from "react";
import * as webllm from "@mlc-ai/web-llm";
import useChatStore, { Conversation } from './hooks/useChatStore';
import UserInput from "./components/UserInput";
import ResetChatButton from "./components/ResetChatButton";
import ShowSidebarButton from './components/ShowSidebarButton';  // Update path accordingly
import DebugUI from "./components/DebugUI";
import MessageList from "./components/MessageList";
import Sidebar from "./components/Sidebar";
import { FaHorseHead } from "react-icons/fa6";

const appConfig = webllm.prebuiltAppConfig;
appConfig.useIndexedDBCache = true;

if (appConfig.useIndexedDBCache) {
  console.log("Using IndexedDB Cache");
} else {
  console.log("Using Cache API");
}

function App() {
  const [engine, setEngine] = useState<webllm.EngineInterface | null>(null);
  const [progress, setProgress] = useState("Not loaded");

  // Store
  const userInput = useChatStore((state) => state.userInput);
  const setUserInput = useChatStore((state) => state.setUserInput);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setIsGenerating = useChatStore((state) => state.setIsGenerating);
  const chatHistory = useChatStore((state) => state.chatHistory);
  const setChatHistory = useChatStore((state) => state.setChatHistory);

  // Conversation
  const currentConversationId = useChatStore(state => state.currentConversationId);
  const conversations = useChatStore(state => state.conversations);
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const loadConversationsFromIndexedDB = useChatStore((state) => state.loadConversationsFromIndexedDB);
  const addConversation = useChatStore((state) => state.addConversation);

  useEffect(() => {
    const loadConversations = async () => {
      if (conversations.length === 0) { // Only load if there are no conversations
        console.log('loading conversations');
        try {
          const loadedConversations = await loadConversationsFromIndexedDB();
          loadedConversations.forEach((conversation: Conversation) => {
            if (!conversations.find(c => c.id === conversation.id)) {
              addConversation(conversation);
            }
          });
        } catch (error) {
          console.error("Error loading conversations:", error);
        }
      }
    };
  
    loadConversations();
  }, []); // Ensure this runs only once
  

  const systemPrompt = "You are a very helpful assistant.";
  // Respond in markdown.

  const initProgressCallback = (report: webllm.InitProgressReport) => {
    console.log(report);
    setProgress(report.text);
    setChatHistory((history) => [
      ...history.slice(0, -1),
      { role: "assistant", content: report.text },
    ]);
  };

  async function loadEngine() {
    console.log("Loading engine");

    setChatHistory((history) => [
      ...history.slice(0, -1),
      {
        role: "assistant",
        content: "Loading model... (this might take a bit)",
      },
    ]);
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

    // Add the user message to the chat history
    const userMessage: webllm.ChatCompletionMessageParam = {
      role: "user",
      content: userInput,
    };

    setChatHistory((history) => [
      ...history,
      userMessage,
      { role: "assistant", content: "" },
    ]);

    console.log('history', history);

    // Add the message to the current conversation
    useChatStore.getState().addMessageToCurrentConversation({
      role: "user",
      content: userInput,
    });

    setUserInput("");

    // Start up the engine first
    if (!loadedEngine) {
      console.log("Engine not loaded");

      try {
        loadedEngine = await loadEngine();
      } catch (e) {
        setIsGenerating(false);
        console.error(e);
        setChatHistory((history) => [
          ...history.slice(0, -1),
          {
            role: "assistant",
            content: "Could not load the model because " + e,
          },
        ]);
        return;
      }
    }

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

      // Add the message to the current conversation
      useChatStore.getState().addMessageToCurrentConversation({
        role: "assistant",
        content: assistantMessage,
      });

      console.log('testing');
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

  // Load the engine on first render
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
    setUserInput("");
    setChatHistory(() => []);
  }

  async function resetEngineAndChatHistory() {
    if (engine) {
      await engine.unload();
    }
    setEngine(null);
    setUserInput("");
    setChatHistory(() => []);
  }

  function onStop() {
    if (!engine) {
      console.error("Engine not loaded");
      return;
    }

    setIsGenerating(false);
    engine.interruptGenerate();
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} resetEngineAndChatHistory={resetEngineAndChatHistory} />

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col">
        <div className="fixed py-2 top-0 w-full flex justify-between items-center p-4 bg-white z-10">

          {/* Sidebar Toggle Button */}
          <ShowSidebarButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Display current conversation name or 'Temporary chat' */}
          <div>
            {currentConversation ? (
              <span className="text-lg font-medium">{currentConversation.name}</span>
            ) : (
              <span className="text-lg font-medium">Private Chat</span>
            )}
          </div>

          {/* Reset Chat Button */}
          <ResetChatButton resetChat={resetChat} />
        </div>

        <DebugUI loadEngine={loadEngine} progress={progress} />

        <div className="max-w-3xl w-full mt-12 mb-24 mx-auto flex-grow">
          {chatHistory.length === 0 ? (
            <div className="flex justify-center items-center h-full flex-col">
              <FaHorseHead className="text-4xl border p-1 rounded-full text-gray-500 mb-6" />
              <div className="max-w-2xl flex flex-col justify-center ">
                <h1 className="text-3xl font-medium  mb-8 leading-relaxed text-center">
                  Welcome to Secret Llama
                </h1>
                <h2 className="text-lg mb-4 prose">
                  Secret Llama is a free and fully private chatbot. Unlike
                  ChatGPT, the models available here run entirely within your
                  browser which means:
                  <ol>
                    <li>Your conversation data never leaves your computer.</li>
                    <li>
                      After the model is initially downloaded, you can disconnect
                      your WiFi. It will work offline.
                    </li>
                  </ol>
                  <p>
                    Note: the first message can take a while to process because
                    the model needs to be fully downloaded to your computer. But
                    on future visits to this website, the model will load quickly
                    from the local storage on your computer.
                  </p>
                  <p>
                    Supported browsers: Chrome, Edge (GPU required; Mobile not
                    recommended)
                  </p>
                </h2>
              </div>
            </div>
          ) : (
            <MessageList />
          )}
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* User Input */}
      <UserInput onSend={onSend} onStop={onStop} />
    </div>
  );

}

export default App;