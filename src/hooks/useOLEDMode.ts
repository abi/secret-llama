import { useEffect, useState } from "react";

const useOLEDMode = () => {
  const [oledMode, setOLEDMode] = useState(() => {
    const colorMode = localStorage.getItem("colorMode");
    return colorMode === "dark" && localStorage.getItem("oledMode") === "true";
  });

  const toggleOLEDMode = () => {
    let newOLEDMode = !oledMode;
    const colorMode = localStorage.getItem("colorMode");
    if (colorMode === "dark") {
      document.documentElement.classList.toggle("oled", newOLEDMode);
    } else {
      document.documentElement.classList.remove("oled");
      newOLEDMode = false;
    }
    setOLEDMode(newOLEDMode);
    localStorage.setItem("oledMode", newOLEDMode.toString());
  };

  useEffect(() => {
    const colorMode = localStorage.getItem("colorMode");
    if (colorMode === "dark") {
      document.documentElement.classList.toggle("oled", oledMode);
    } else {
      document.documentElement.classList.remove("oled");
      setOLEDMode(false);
      localStorage.setItem("oledMode", "false");
    }
  }, [oledMode]);

  return { oledMode, toggleOLEDMode };
};

export default useOLEDMode;
