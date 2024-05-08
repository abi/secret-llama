import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  const disableComponent=useChatStore((state)=>state.disableComponent);
  return (
    <div className="p-4 py-2">
      <div className="flex items-center p-2 border rounded-xl shadow-sm">
        <Input
          className="flex-1 border-none shadow-none focus:ring-0 
              ring-0 focus:border-0 focus-visible:ring-0 text-base"
          placeholder={`Message ${MODEL_DESCRIPTIONS[selectedModel].displayName}`}
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          disabled={disableComponent}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("in")
              if(!userInput.trim()){
                console.error("Illegal input. Input can't be empty.")
                return 
              }
              onSend();
            }
          }}
        />
        {!isGenerating && (
          <Button className="p-2 shadow-md" variant="ghost" onClick={()=>{
            if(userInput.trim()){
              console.log("in")
              onSend()
            }}} disabled={disableComponent}>
            <FaArrowUp className="h-5 w-5 text-gray-500 text-semibold" />
          </Button>
        )}
        {isGenerating && <Button onClick={onStop} disabled={!disableComponent} >Stop</Button>}
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
