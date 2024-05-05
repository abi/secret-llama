// File: src/components/Sidebar.tsx

import React from "react";
import ModelsDropdown from "./ModelsDropdown";
import Conversations from "./Conversations";

interface SidebarProps {
  sidebarOpen: boolean;
  resetEngineAndChatHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, resetEngineAndChatHistory }) => {
  return (
    <div className={`fixed py-4 inset-y-0 left-0 z-20 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-100 shadow-xl overflow-hidden`}>
      {/* Sidebar content */}
      <div className="px-4">
        <ModelsDropdown resetEngineAndChatHistory={resetEngineAndChatHistory} />
      </div>
      <div className="px-4 py-2 pb-32 flex flex-col overflow-y-auto h-full">
        <Conversations />
      </div>
    </div>
  );
};

export default Sidebar;
