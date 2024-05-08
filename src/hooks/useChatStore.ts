import * as webllm from "@mlc-ai/web-llm";
import { create } from "zustand";
import { Model } from "../models";

interface State {
  // Model
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;

  // User input
  userInput: string;
  setUserInput: (input: string) => void;

  // Inference state
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  // Chat history
  chatHistory: webllm.ChatCompletionMessageParam[];
  setChatHistory: (
    fn: (
      chatHistory: webllm.ChatCompletionMessageParam[]
    ) => webllm.ChatCompletionMessageParam[]
  ) => void;

  // Disable button
  disableComponent:boolean;
  setDisableComponent:(disableComponent:boolean)=> void;
}

const useChatStore = create<State>((set) => ({
  // Model
  selectedModel: Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K,
  setSelectedModel: (model: Model) => set({ selectedModel: model }),

  // User input
  userInput: "",
  setUserInput: (input: string) => set({ userInput: input }),

  // Inference state
  isGenerating: false,
  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

  // Chat history
  chatHistory: [],
  setChatHistory: (fn) =>
    set((state) => ({
      chatHistory: fn(state.chatHistory),
    })),

    //Disable Component
    disableComponent:false,
    setDisableComponent:(disableComponent)=>set({disableComponent})
}));

export default useChatStore;
