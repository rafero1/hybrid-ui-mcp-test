import { simulateLongRunningProcess } from "@/features/bridge/bridge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useCallback, useState } from "react";
import { Progress, ProgressLabel, ProgressValue } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { TrashIcon } from "lucide-react";
import { TaskProgress } from "@/types/progress";

function SimulateLongRunningProcessToolCard() {
  const [processedItems, setProcessedItems] = useState<Array<string>>([]);
  const [progress, setProgress] = useState<TaskProgress>(
    TaskProgress.NotStarted,
  );

  const handleStart = useCallback(async () => {
    setProgress(TaskProgress.Started);
    setProcessedItems([]);
    try {
      await simulateLongRunningProcess(10, params => {
        setProcessedItems(old => [
          ...old,
          params.message ?? "Processed item " + params.progress.toString(),
        ]);
      });
    } catch (error) {
      console.error("Error calling simulateLongRunningProcess:", error);
    }
    setProgress(TaskProgress.Done);
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
          {progress === TaskProgress.Started && (
            <Button variant={"destructive"} onClick={handleCancel}>
              Cancel TODO <TrashIcon />
            </Button>
          )}
          <Button
            onClick={handleStart}
            disabled={progress === TaskProgress.Started}
          >
            {progress === TaskProgress.Started ? <Spinner /> : "Start"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={processedItems.length * 10} className="w-full">
          <ProgressLabel>
            {progress === TaskProgress.NotStarted && "Idle"}
            {progress === TaskProgress.Started && "Working..."}
            {progress === TaskProgress.Done && "Finished"}
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

export default SimulateLongRunningProcessToolCard;
