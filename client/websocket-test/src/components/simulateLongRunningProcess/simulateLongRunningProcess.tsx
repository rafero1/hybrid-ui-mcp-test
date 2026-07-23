import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

function SimulateLongRunningProcess() {
  const start = async () => {
    try {
      const response = await fetch("/api/start-long-running-process", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error starting long-running process:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Simulate Long-Running Process</h2>
        <Button onClick={start}>Start Process</Button>
      </CardHeader>
      <CardContent>
        <div>TODO</div>
      </CardContent>
    </Card>
  );
}

export default SimulateLongRunningProcess;
