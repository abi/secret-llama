import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "./ui/button";
import useTheme from "../hooks/useTheme";

function DarkThemeToggleButton() {
  const { isDark, toggleDarkTheme } = useTheme();

  const handleButtonClick = () => {
    toggleDarkTheme();
  };

  return (
    <Button onClick={handleButtonClick} variant="outline" className="p-2">
      {isDark ? <FaSun className="h-5 w-5 text-gray-800 dark:text-muted-foreground" /> : <FaMoon className="h-5 w-5 text-gray-800 dark:text-muted-foreground" />}
    </Button>
  );
}

export default DarkThemeToggleButton;
