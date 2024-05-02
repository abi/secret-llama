import * as webllm from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";

const MODELS = [
  "Mistral-7B-Instruct-v0.2-q4f16_1",
  "Llama-3-8B-Instruct-q4f16_1",
  "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
  "Phi1.5-q4f16_1-1k",
];

// Should be shared with global

const appConfig = webllm.prebuiltAppConfig;
// CHANGE THIS TO SEE EFFECTS OF BOTH, CODE BELOW DO NOT NEED TO CHANGE
appConfig.useIndexedDBCache = true;

if (appConfig.useIndexedDBCache) {
  console.log("Using IndexedDB Cache");
} else {
  console.log("Using Cache API");
}

function ModelsDropdown() {
  const [modelsState, setModelsState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const IS_MODEL_STATUS_CHECK_ENABLED = false;

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
    if (IS_MODEL_STATUS_CHECK_ENABLED) {
      updateModelStatus();
    }
  }, []);

  return (
    <div className="p-2 text-xs text-center font-bold hidden">
      {MODELS.map((model, index) => (
        <div key={index}>
          <div>{model}</div>
          <span
            className={`ml-2 ${
              modelsState[model] ? "text-green-500" : "text-red-500"
            }`}
          >
            {modelsState[model] ? "Cached" : "Not Cached"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ModelsDropdown;
