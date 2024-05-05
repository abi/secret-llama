import { useEffect, useRef } from "react";
import useChatStore from "../hooks/useChatStore";
import Message from "./Message";

function MessageList() {
  const chatHistory = useChatStore((state) => state.chatHistory);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat history when it changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex-1 overflow-auto"> {/* Added pb-16 for bottom padding */}
      <div className="max-w-3xl mx-auto text-base px-5">
        {chatHistory.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}

export default MessageList;
