import * as webllm from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useChatStore from "../hooks/useChatStore";
import { MODEL_DESCRIPTIONS, Model } from "../models";
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
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);

  const [modelsState, setModelsState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const IS_MODEL_STATUS_CHECK_ENABLED = false;

  async function updateModelStatus() {
    console.log("Checking model status");
    Object.values(Model).forEach(async (model) => {
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
    <div className="p-2 text-xs text-center font-bold">
      <div className="hidden">
        {Object.values(Model).map((model, index) => (
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
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="w-[200px]">
          <SelectValue></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.values(Model).map((model) => (
              <SelectItem key={model} value={model}>
                {MODEL_DESCRIPTIONS[model].icon}{" "}
                {MODEL_DESCRIPTIONS[model].displayName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default ModelsDropdown;
