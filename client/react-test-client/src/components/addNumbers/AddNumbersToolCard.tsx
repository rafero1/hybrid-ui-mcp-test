import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { add } from "@/features/bridge/bridge";

function AddNumbersToolCard() {
  const [addResult, setAddResult] = useState<number | null>(null);

  const numberInputARef = useRef<HTMLInputElement>(null);
  const numberInputBRef = useRef<HTMLInputElement>(null);

  const filterNumbersOnly = (event: React.InputEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^0-9.]/g, "");
  };

  const handleAdd = async () => {
    const aValue = parseFloat(numberInputARef.current?.value || "0");
    const bValue = parseFloat(numberInputBRef.current?.value || "0");
    try {
      const result = await add(aValue, bValue);
      setAddResult(result);
    } catch (error) {
      console.error("Error adding numbers:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Add Numbers</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-2 mb-2">
          <Input
            type="text"
            placeholder="Enter first number"
            ref={numberInputARef}
            onInput={filterNumbersOnly}
          />
          <Input
            type="text"
            placeholder="Enter second number"
            ref={numberInputBRef}
            onInput={filterNumbersOnly}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
        <div>
          Result: <span className="font-semibold">{addResult}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddNumbersToolCard;
