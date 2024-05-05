import { Button } from "./ui/button";
import { FaBars, FaTimes } from "react-icons/fa";  // Import icons for menu and close

interface ShowSidebarButtonProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void; // Type definition for the state setter function
}

function ShowSidebarButton({ sidebarOpen, setSidebarOpen }: ShowSidebarButtonProps) {
  return (
    <Button onClick={() => setSidebarOpen(!sidebarOpen)} variant="outline" className="p-2">
      {sidebarOpen ? <FaTimes className="h-5 w-5 text-gray-800" /> : <FaBars className="h-5 w-5 text-gray-800" />}
    </Button>
  );
}

export default ShowSidebarButton;
