import { FaPenToSquare } from "react-icons/fa6";
import { Button } from "./ui/button";

function ResetChatButton({ resetChat }: { resetChat: () => void }) {
  return (
    <Button onClick={resetChat} variant="outline" className="p-2">
      <FaPenToSquare className="h-5 w-5 text-gray-800 dark:text-muted-foreground" />
    </Button>
  );
}

export default ResetChatButton;
