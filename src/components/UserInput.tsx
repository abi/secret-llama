import { useRef } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import useChatStore from "../hooks/useChatStore";
import { MODEL_DESCRIPTIONS } from "../models";

function UserInput({
  onSend,
  onStop,
}: {
  onSend: () => Promise<void>;
  onStop: () => void;
}) {
  const userInput = useChatStore((state) => state.userInput);
  const setUserInput = useChatStore((state) => state.setUserInput);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const isGenerating = useChatStore((state) => state.isGenerating);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSend();
  };

  return (
    <div className="p-4 py-2">
      <div className="relative flex items-end p-2 border rounded-xl shadow-sm">
        <Textarea
          ref={textareaRef}
          autosize
          rows={1}
          className="flex-1 max-h-[320px] pb-[6px] border-none shadow-none focus:ring-0 
              ring-0 focus:border-0 focus-visible:ring-0 text-base
              resize-none"
          placeholder={`Message ${MODEL_DESCRIPTIONS[selectedModel].displayName}`}
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={handleKeyDown}
        />
        {!isGenerating && (
          <Button className="p-2" variant="ghost" onClick={onSend}>
            <FaArrowUp className="h-5 w-5 text-gray-500" />
          </Button>
        )}
        {isGenerating && <Button onClick={onStop}>Stop</Button>}
      </div>
      <a
        href="#"
        onClick={() =>
          alert(
            "WhimsyWorks, Inc. provides this open source software and website as-is and makes no representations or warranties of any kind concerning its accuracy, safety, or suitability. The user assumes full responsibility for any consequences resulting from its use. WhimsyWorks, Inc. expressly disclaims all liability for any direct, indirect, or consequential harm that may result."
          )
        }
        className="text-xs text-gray-400 hover:underline mt-2 text-right flex justify-end w-full"
      >
        Disclaimer
      </a>
    </div>
  );
}

export default UserInput;
