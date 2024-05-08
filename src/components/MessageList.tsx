import { useEffect, useRef, useState } from "react";
import useChatStore from "../hooks/useChatStore";
import Message from "./Message";

function MessageList() {
  const chatHistory = useChatStore((state) => state.chatHistory);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [enableAutoScroll, setEnableAutoScroll] = useState<boolean>(true);

  // Scroll to the bottom of the chat history when it changes, if at the bottom
  useEffect(() => {
    if (scrollRef.current && enableAutoScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, enableAutoScroll]);

  function onChatScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } =
      event.target as HTMLDivElement;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
    setEnableAutoScroll(isAtBottom);
  }

  return (
    <div
      className="flex-1 overflow-auto"
      ref={scrollRef}
      onScroll={onChatScroll}
    >
      <div className="max-w-3xl mx-auto text-base px-5">
        {chatHistory.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}

export default MessageList;