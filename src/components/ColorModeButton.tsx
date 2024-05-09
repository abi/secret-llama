import { FaMoon, FaSun } from "react-icons/fa6";
import { Button } from "./ui/button";

function ColorModeButton({
  toggleColorMode,
  colorMode,
}: {
  toggleColorMode: () => void;
  colorMode: "dark" | "light";
}) {
  return (
    <Button onClick={toggleColorMode} variant="outline" className="p-2">
      {colorMode === "dark" ? (
        <FaSun className="h-5 w-5 dark:text-zinc-300" />
      ) : (
        <FaMoon className="h-5 w-5 text-gray-800" />
      )}
    </Button>
  );
}

export default ColorModeButton;
