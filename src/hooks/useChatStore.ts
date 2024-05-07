import * as webllm from "@mlc-ai/web-llm";
import { create } from "zustand";
import { Model } from "../models";
import localforage from 'localforage'; // Import localforage for IndexedDB storage

// Configure localforage to use IndexedDB with longer expiration
localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'secret-llama',
  version: 1.0,
  size: 4980736,
  storeName: 'conversations',
})

export interface Conversation {
  id: string;
  name: string;
  messages: webllm.ChatCompletionMessageParam[];
}

interface State {
  // Model
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;

  // User input
  userInput: string;
  setUserInput: (input: string) => void;
  
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Inference state
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // Current conversation
  getCurrentConversation: () => Conversation | null;  // Add this line

  // Chat history
  chatHistory: webllm.ChatCompletionMessageParam[];
  setChatHistory: (
    fn: (
      chatHistory: webllm.ChatCompletionMessageParam[]
    ) => webllm.ChatCompletionMessageParam[]
  ) => void;

  // Conversations
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  setCurrentConversation: (messages: webllm.ChatCompletionMessageParam[]) => void;
  addMessageToCurrentConversation: (message: webllm.ChatCompletionMessageParam) => void;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;

  // Function to save conversations to IndexedDB
  saveConversationsToIndexedDB: (conversations: Conversation[]) => void;

  // Function to load conversations from IndexedDB
  loadConversationsFromIndexedDB: () => Promise<Conversation[]>;
}

const useChatStore = create<State>((set, get) => {
  // Function to load conversations from IndexedDB
  const loadConversationsFromIndexedDB = async () => {
    try {
      const conversations = await localforage.getItem<Conversation[]>('conversations');
      return conversations || [];
    } catch (error) {
      console.error("Error loading conversations from IndexedDB:", error);
      return [];
    }
  };

  return {
    // Model
    selectedModel: Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K,
    setSelectedModel: (model: Model) => set({ selectedModel: model }),

    // User input
    userInput: "",
    setUserInput: (input: string) => set({ userInput: input }),

    // Sidebar state
    sidebarOpen: false,
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    
    // Inference state
    isGenerating: false,
    setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

    // Chat history
    chatHistory: [],
    setChatHistory: (fn) =>
      set((state) => ({
        chatHistory: fn(state.chatHistory),
      })),

    // Conversations
    conversations: [], // Initialize conversations as an empty array
    setCurrentConversation: (messages: webllm.ChatCompletionMessageParam[]) => {
      set({ chatHistory: messages });
    },
    getCurrentConversation: () => {
      const currentId = get().currentConversationId;
      if (currentId === null) {
        return null;
      }
      return get().conversations.find(conversation => conversation.id === currentId) || null;
    },
    addMessageToCurrentConversation: (message: webllm.ChatCompletionMessageParam) => {
      const conversations = get().conversations.map((conversation) => {
        if (conversation.id === get().currentConversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, message],
          };
        }
        return conversation;
      });
      set({ conversations });
      get().saveConversationsToIndexedDB(conversations); // Save conversations to IndexedDB here
    },
    currentConversationId: null,
    setCurrentConversationId: (id: string | null) => set({ currentConversationId: id }),

    // Function to save conversations to IndexedDB
    saveConversationsToIndexedDB: async (conversations: Conversation[]) => {
      try {
        await localforage.setItem('conversations', conversations);
      } catch (error) {
        console.error("Error saving conversations to IndexedDB:", error);
      }
    },

    // Function to load conversations from IndexedDB
    loadConversationsFromIndexedDB,

    // Set conversations without saving to IndexedDB
    setConversations: (conversations: Conversation[]) => {
      set({ conversations });
    },

    // Add conversation without saving to IndexedDB
    addConversation: (conversation: Conversation) => {
      const existing = get().conversations.some(c => c.id === conversation.id);
      if (!existing) {
        const updatedConversations = [...get().conversations, conversation];
        set({ conversations: updatedConversations });
        // Save conversations to IndexedDB after adding to state
        get().saveConversationsToIndexedDB(updatedConversations);
      }
    },

  };
});

export default useChatStore;