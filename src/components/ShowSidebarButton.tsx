import { Button } from "./ui/button";
import { FaBars, FaTimes } from "react-icons/fa";  // Import icons for menu and close
import useChatStore from '../hooks/useChatStore';

function ShowSidebarButton() {
  
  const sidebarOpen = useChatStore(state => state.sidebarOpen);
  const setSidebarOpen = useChatStore(state => state.setSidebarOpen);

  return (
    <Button onClick={() => setSidebarOpen(!sidebarOpen)} variant="outline" className="p-2">
      {sidebarOpen ? <FaTimes className="h-5 w-5 text-gray-800" /> : <FaBars className="h-5 w-5 text-gray-800" />}
    </Button>
  );
}

export default ShowSidebarButton;
