import useMCPClient from "@/features/mcp/useMCPClient";
import AddNumbersToolCard from "./components/addNumbers/AddNumbersToolCard";
import TestListToolCard from "./components/testList/TestListToolCard";
import "./index.css";
import SimulateLongRunningProcessToolCard from "./components/simulateLongRunningProcess/SimulateLongRunningProcessToolCard";
import AiChatCard from "./components/aiChat/aiChatCard";
import { Toaster } from "./components/ui/toast";

function App() {
  useMCPClient();

  return (
    <>
      <section className="flex flex-col min-h-screen bg-gray-100">
        <header className="p-4 mb-4 text-center">
          <h1 className="text-2xl font-bold">Hybrid UI MCP Test Client</h1>
        </header>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col gap-4">
            <TestListToolCard />
            <AddNumbersToolCard />
            <SimulateLongRunningProcessToolCard />
            <AiChatCard />
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
}

export default App;
