// Mock implementation for @mlc-ai/web-llm
export class Engine {
  constructor() {
    // Mock engine constructor
    console.log("Mock Engine created");
  }
}

export class EngineWorkerHandler {
  onmessage: jest.Mock;

  constructor(_engine: Engine) {
    // Mock handler constructor
    this.onmessage = jest.fn((msg: MessageEvent) => {
      // Mock implementation of onmessage - do nothing
      console.log("Mock EngineWorkerHandler onmessage called with:", msg);
    });
  }
}

// Export other necessary types/interfaces if needed
export type { EngineConfig, AppConfig, GenerationConfig } from "@mlc-ai/web-llm";