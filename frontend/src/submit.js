import { Button } from "./components/ui/button";
import { useStore } from "./store";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("pipeline", JSON.stringify({ nodes, edges }));

      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(
        `Pipeline parsed successfully!\n\nNumber of Nodes: ${data.num_nodes}\nNumber of Edges: ${data.num_edges}\nIs DAG: ${data.is_dag}`,
      );
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      alert(
        "Error connecting to the backend. Please ensure the backend is running on http://localhost:8000.",
      );
    }
  };

  return (
    <Button variant="submit" onClick={handleSubmit}>
      Submit
    </Button>
  );
};
