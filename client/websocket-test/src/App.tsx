import useMCPClient from "@/features/mcp/useMCPClient";
import AddNumbersToolCard from "./components/addNumbers/addNumbers";
import TestListToolCard from "./components/testList/testList";
import "./index.css";

function App() {
  useMCPClient();

  return (
    <>
      <section className="flex flex-col min-h-screen bg-gray-100">
        <header className="p-4 mb-4 text-center">
          <h1 className="text-2xl font-bold">Hybrid UI Client Test</h1>
        </header>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col gap-4">
            <TestListToolCard />
            <AddNumbersToolCard />
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
