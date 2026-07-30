import { simulateLongRunningProcess } from "@/features/bridge/bridge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useCallback, useState } from "react";
import { Progress, ProgressLabel, ProgressValue } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { TrashIcon } from "lucide-react";

const ProgressState = {
  NotStarted: 0,
  Started: 1,
  Done: 2,
  Cancelled: 3,
} as const;

type ProgressState = (typeof ProgressState)[keyof typeof ProgressState];

function SimulateLongRunningProcess() {
  const [processedItems, setProcessedItems] = useState<Array<string>>([]);
  const [progress, setProgress] = useState<ProgressState>(
    ProgressState.NotStarted,
  );

  const handleStart = useCallback(async () => {
    try {
      setProgress(ProgressState.Started);
      setProcessedItems([]);
      const response = await simulateLongRunningProcess(10, params => {
        setProcessedItems(old => [
          ...old,
          params.message ?? "Processed item " + params.progress.toString(),
        ]);
      });
      console.log("simulateLongRunningProcess response:", response);
      setProgress(ProgressState.Done);
    } catch (error) {
      console.error("Error calling simulateLongRunningProcess:", error);
    }
  }, []);

  const handleCancel = () => {
    console.log("TODO");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">
          Long-Running Process w/ Updates
        </h2>
        <div className="gap-1 flex flex-items-center">
          <Button
            onClick={handleStart}
            disabled={progress === ProgressState.Started}
          >
            {progress === ProgressState.Started ? <Spinner /> : "Start"}
          </Button>
          {progress === ProgressState.Started && (
            <Button variant={"destructive"} onClick={handleCancel}>
              Cancel TODO <TrashIcon />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={processedItems.length * 10} className="w-full">
          <ProgressLabel>
            {progress === ProgressState.NotStarted && "Idle"}
            {progress === ProgressState.Started && "Working..."}
            {progress === ProgressState.Done && "Finished"}
          </ProgressLabel>
          <ProgressValue />
        </Progress>
        {processedItems && (
          <ul>
            {processedItems.map((item, i) => (
              <li key={i} className="my-1">
                {item}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default SimulateLongRunningProcess;
