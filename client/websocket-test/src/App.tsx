import { useEffect, useRef, useState } from "react";
import "./index.css";
import useMCPClient from "@/features/mcp/useMCPClient";
import { Button } from "@/components/ui/button";
import { add, getTestList } from "./features/bridge/bridge";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";

function App() {
  useMCPClient();

  const [tests, setTests] = useState<{ Id: number; Name: string }[]>([]);
  const [addResult, setAddResult] = useState<number | null>(null);

  const handleFetchTests = async () => {
    try {
      const testList = await getTestList();
      setTests(testList);
    } catch (error) {
      console.error("Error fetching test list:", error);
    }
  };

  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  const handleAdd = async () => {
    const aInput = parseFloat(inputARef.current?.value || "0");
    const bInput = parseFloat(inputBRef.current?.value || "0");
    try {
      const result = await add(aInput, bInput);
      setAddResult(result);
    } catch (error) {
      console.error("Error adding numbers:", error);
    }
  };

  return (
    <>
      <section className="flex flex-col min-h-screen bg-gray-100">
        <header className="p-4 mb-4 text-center">
          <h1 className="text-2xl font-bold">Hybrid UI WebSocket Test</h1>
        </header>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">Available Tests</h2>
                <Button onClick={handleFetchTests}>Fetch List</Button>
              </CardHeader>
              <CardContent>
                <ul>
                  {tests &&
                    tests.map(test => <li key={test.Id}>{test.Name}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Add</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Enter first number"
                    ref={inputARef}
                  />
                  <Input
                    type="text"
                    placeholder="Enter second number"
                    ref={inputBRef}
                  />
                  <Button onClick={handleAdd}>Add</Button>
                </div>
                <div>
                  Result: <span className="font-semibold">{addResult}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
