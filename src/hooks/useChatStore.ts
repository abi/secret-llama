import { create } from "zustand";

interface State {
  userInput: string;
  setUserInput: (input: string) => void;
  selectedModel: string;
}

const useChatStore = create<State>((set) => ({
  userInput: "",
  setUserInput: (input: string) => set({ userInput: input }),
  selectedModel: "Mistral-7B-Instruct-v0.2-q4f16_1",
  // const selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k";
  // const selectedModel = "Phi1.5-q4f16_1-1k";
}));

export default useChatStore;
