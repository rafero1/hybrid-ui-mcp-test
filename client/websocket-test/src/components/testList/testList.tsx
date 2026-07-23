import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTestList } from "@/features/bridge/bridge";

function TestListToolCard() {
  const [tests, setTests] = useState<{ Id: number; Name: string }[]>([]);

  const handleFetchTests = async () => {
    try {
      const testList = await getTestList();
      setTests(testList);
    } catch (error) {
      console.error("Error fetching test list:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Available Tests</h2>
        <Button onClick={handleFetchTests}>Fetch List</Button>
      </CardHeader>
      <CardContent>
        <ul>
          {tests && tests.map(test => <li key={test.Id}>{test.Name}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}

export default TestListToolCard;
