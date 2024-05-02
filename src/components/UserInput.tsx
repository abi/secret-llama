import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useChatStore from "../hooks/useChatStore";

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

  return (
    <div className="p-4">
      <div className="flex items-center p-2border rounded-xl shadow-sm">
        <Input
          className="flex-1 border-none shadow-none focus:ring-0 
              ring-0 focus:border-0 focus-visible:ring-0 text-base"
          placeholder={`Message ${selectedModel}`}
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />
        <Button className="p-2" variant="ghost" onClick={onSend}>
          <FaArrowUp className="h-5 w-5 text-gray-500" />
        </Button>
        <Button onClick={onStop}>Stop</Button>
      </div>
    </div>
  );
}

export default UserInput;
