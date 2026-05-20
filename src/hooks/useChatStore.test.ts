import * as webllm from "@mlc-ai/web-llm";
import useChatStore from "./useChatStore";
import { Model } from "../models";

describe("useChatStore", () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useChatStore.setState({
      selectedModel: Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K,
      userInput: "",
      isGenerating: false,
      chatHistory: [],
    });
  });

  describe("initial state", () => {
    it("should initialize with default values", () => {
      const state = useChatStore.getState();
      
      expect(state.selectedModel).toBe(Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K);
      expect(state.userInput).toBe("");
      expect(state.isGenerating).toBe(false);
      expect(state.chatHistory).toEqual([]);
    });
  });

  describe("selectedModel", () => {
    it("should update selectedModel when setSelectedModel is called", () => {
      const newState = Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1;
      useChatStore.getState().setSelectedModel(newState);

      const currentState = useChatStore.getState();
      expect(currentState.selectedModel).toBe(newState);
    });
  });

  describe("userInput", () => {
    it("should update userInput when setUserInput is called with a string", () => {
      const newState = "Test user input";
      useChatStore.getState().setUserInput(newState);
      
      const currentState = useChatStore.getState();
      expect(currentState.userInput).toBe(newState);
    });
  });

  describe("isGenerating", () => {
    it("should update isGenerating when setIsGenerating is called with true", () => {
      useChatStore.getState().setIsGenerating(true);
      
      const currentState = useChatStore.getState();
      expect(currentState.isGenerating).toBe(true);
    });

    it("should update isGenerating when setIsGenerating is called with false", () => {
      useChatStore.getState().setIsGenerating(false);
      
      const currentState = useChatStore.getState();
      expect(currentState.isGenerating).toBe(false);
    });
  });

  describe("chatHistory", () => {
    it("should update chatHistory when setChatHistory is called with a function that appends a message", () => {
      const initialMessage: webllm.ChatCompletionMessageParam = {
        role: "user",
        content: "Hello"
      };
      
      useChatStore.getState().setChatHistory(prev => [...prev, initialMessage]);
      
      const currentState = useChatStore.getState();
      expect(currentState.chatHistory).toHaveLength(1);
      expect(currentState.chatHistory[0]).toEqual(initialMessage);
    });

    it("should update chatHistory when setChatHistory is called with a function that replaces the history", () => {
      const messages: webllm.ChatCompletionMessageParam[] = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" }
      ];
      
      useChatStore.getState().setChatHistory(() => messages);
      
      const currentState = useChatStore.getState();
      expect(currentState.chatHistory).toEqual(messages);
    });

    it("should allow clearing chatHistory with an empty array", () => {
      // First add some messages
      const messages: webllm.ChatCompletionMessageParam[] = [
        { role: "user", content: "Hello" }
      ];
      useChatStore.getState().setChatHistory(() => messages);
      
      // Then clear the history
      useChatStore.getState().setChatHistory(() => []);
      
      const currentState = useChatStore.getState();
      expect(currentState.chatHistory).toEqual([]);
    });

    it("should maintain previous chatHistory when setChatHistory function doesn't modify it", () => {
      const initialMessage: webllm.ChatCompletionMessageParam = {
        role: "user",
        content: "Hello"
      };
      
      // Add a message first
      useChatStore.getState().setChatHistory(prev => [...prev, initialMessage]);
      
      // Apply a function that doesn't change the array
      useChatStore.getState().setChatHistory(prev => prev);
      
      const currentState = useChatStore.getState();
      expect(currentState.chatHistory).toHaveLength(1);
      expect(currentState.chatHistory[0]).toEqual(initialMessage);
    });
  });

  describe("actions chain", () => {
    it("should be able to update multiple state properties in sequence", () => {
      const newModel = Model.LLAMA_3_8B_INSTRUCT_Q4F16_1;
      const newUserInput = "Test input";
      const newGeneratingState = true;
      const newMessage: webllm.ChatCompletionMessageParam = {
        role: "assistant",
        content: "Response"
      };

      // Chain updates
      useChatStore.getState().setSelectedModel(newModel);
      useChatStore.getState().setUserInput(newUserInput);
      useChatStore.getState().setIsGenerating(newGeneratingState);
      useChatStore.getState().setChatHistory(prev => [...prev, newMessage]);

      const currentState = useChatStore.getState();
      expect(currentState.selectedModel).toBe(newModel);
      expect(currentState.userInput).toBe(newUserInput);
      expect(currentState.isGenerating).toBe(newGeneratingState);
      expect(currentState.chatHistory).toContainEqual(newMessage);
    });
  });

  describe("state updates", () => {
    it("should maintain separate state between subscribers", () => {
      const state1 = useChatStore.getState();

      // Update state
      useChatStore.getState().setUserInput("updated input");

      // Get fresh state
      const state2 = useChatStore.getState();

      expect(state1.userInput).toBe("");
      expect(state2.userInput).toBe("updated input");
    });
  });
});