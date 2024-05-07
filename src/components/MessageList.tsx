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
    <div className="flex-1 w-full overflow-y-auto h-full" ref={scrollRef}>
      <div className="mx-auto max-w-2xl items-center p-2 shadow-sm">
        {chatHistory.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}

export default MessageList;
