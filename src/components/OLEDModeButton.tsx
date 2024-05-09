import { Button } from "./ui/button";

function OLEDModeButton({
  toggleOLEDMode,
  oledMode,
}: {
  toggleOLEDMode: () => void;
  oledMode: boolean;
}) {
  return (
    <>
      {!oledMode ? (
        <Button onClick={toggleOLEDMode} variant="outline" className="p-2">
          OLED
        </Button>
      ) : (
        <Button onClick={toggleOLEDMode} className="p-2 text-white">
          OLED
        </Button>
      )}
    </>
  );
}

export default OLEDModeButton;
