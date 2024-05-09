import { useEffect, useState } from "react";

const useColorMode = () => {
  const [colorMode, setColorMode] = useState(getColorMode());

  function getColorMode() {
    return localStorage.getItem("colorMode") || "light";
  }

  function toggleDarkMode() {
    const newColorMode = colorMode === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", newColorMode === "dark");
    setColorMode(newColorMode);
    localStorage.setItem("colorMode", newColorMode);
  }

  useEffect(() => {
    const initialColorMode = getColorMode();
    setColorMode(initialColorMode);
    document.documentElement.classList.toggle(
      "dark",
      initialColorMode === "dark"
    );
  }, []);

  return { colorMode, toggleDarkMode };
};

export default useColorMode;
