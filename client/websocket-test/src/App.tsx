import { useState } from "react";
import "./index.css";
import useMCPClient from "@/features/mcp/useMCPClient";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  useMCPClient();

  return (
    <>
      <section id="center">
        <div>
          <h1 className="text-2xl font-bold">Hybrid UI WebSocket Test</h1>
        </div>
        <Button onClick={() => setCount(count => count + 1)}>
          Count is {count}
        </Button>
      </section>
    </>
  );
}

export default App;
