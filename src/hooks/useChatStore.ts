import { create } from "zustand";

interface State {
  // Model
  selectedModel: string;

  // User input
  userInput: string;
  setUserInput: (input: string) => void;

  // Inference state
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const useChatStore = create<State>((set) => ({
  // Model
  // selectedModel: "Mistral-7B-Instruct-v0.2-q4f16_1",
  selectedModel: "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
  //selectedModel: "Phi1.5-q4f16_1-1k",

  // User input
  userInput: "",
  setUserInput: (input: string) => set({ userInput: input }),

  // Inference state
  isGenerating: false,
  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
}));

export default useChatStore;
