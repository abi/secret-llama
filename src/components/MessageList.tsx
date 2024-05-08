import { useEffect, useRef, useState } from "react";
import useChatStore from "../hooks/useChatStore";
import Message from "./Message";

function MessageList() {
  const chatHistory = useChatStore((state) => state.chatHistory);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Scroll to the bottom of the chat when chat history changes,
  // but only if we're at the bottom
  useEffect(() => {
    if (scrollRef.current && isAutoScrollEnabled) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isAutoScrollEnabled]);

  function onScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } =
      event.target as HTMLDivElement;

    // scrollHeight - scrollable content's total height
    // scrollTop - number of pixels that are hidden from view above the scrollable area
    //             (i.e. scrolled distance from the top)
    // clientHeight - height of the scrollable area
    const isAtBottom = scrollHeight - scrollTop === clientHeight;

    setIsAutoScrollEnabled(isAtBottom);
  }

  return (
    <div className="flex-1 overflow-auto" ref={scrollRef} onScroll={onScroll}>
      <div className="max-w-3xl mx-auto text-base px-5">
        {chatHistory.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}

export default MessageList;
