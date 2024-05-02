import { create } from "zustand";

interface State {
  userInput: string;
  setUserInput: (input: string) => void;
}

const useChatStore = create<State>((set) => ({
  userInput: "",
  setUserInput: (input: string) => set({ userInput: input }),
}));

export default useChatStore;
