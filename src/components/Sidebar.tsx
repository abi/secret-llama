import Conversations from './Conversations';
import useChatStore from '../hooks/useChatStore';

const Sidebar = () => {
  
  const sidebarOpen = useChatStore(state => state.sidebarOpen);

  return (
    <div className={`fixed py-4 inset-y-0 left-0 z-20 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-100 shadow-xl overflow-hidden`}>
      {/* Sidebar content */}
      <div className="px-4 py-2 pb-32 flex flex-col overflow-y-auto h-full">
        <Conversations />
      </div>
    </div>
  );
};

export default Sidebar;