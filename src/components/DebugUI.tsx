import { Button } from "./ui/button";

function DebugUI({
  loadEngine,
  progress,
}: {
  loadEngine: () => void;
  progress: string;
}) {
  return (
    <>
      <Button onClick={loadEngine} variant="outline" className="hidden">
        Load
      </Button>
      <div className="p-2 text-xs max-w-[250px] hidden">{progress}</div>
    </>
  );
}

export default DebugUI;
