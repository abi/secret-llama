import * as webllm from "@mlc-ai/web-llm";
import { FaHorseHead, FaPerson } from "react-icons/fa6";
import Markdown from "react-markdown";
import useChatStore from "../hooks/useChatStore";
import { MODEL_DESCRIPTIONS } from "../models";

function Message({ message }: { message: webllm.ChatCompletionMessageParam }) {
  const selectedModel = useChatStore((state) => state.selectedModel);

  return (
    <div className="p-4 rounded-lg mt-2">
      <div className="flex items-center gap-x-2">
        <div className="border p-1 rounded-full text-gray-500">
          {message.role === "assistant" ? <FaHorseHead /> : <FaPerson />}
        </div>
        <div className="font-bold">
          {message.role === "assistant"
            ? MODEL_DESCRIPTIONS[selectedModel].displayName
            : "You"}
        </div>
      </div>
      <Markdown className="text-gray-700 pl-8 mt-2 leading-[1.75] prose">
        {typeof message.content === "string"
          ? message.content
          : "Non-string content found"}
      </Markdown>
    </div>
  );
}

export default Message;
