import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { Sparkles } from "lucide-react";
import { useStore } from "../store";
import { HighlightedInput } from "../components/ui/HighlightedInput";

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.llmName || id.replace("llm-", "llm_"),
  );

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "llmName", val);
  };

  const [systemVariables, setSystemVariables] = useState([]);
  const [promptVariables, setPromptVariables] = useState([]);

  // Merge unique variables from both inputs
  const allVariables = [...new Set([...systemVariables, ...promptVariables])];

  const handles = [
    // Dynamically generate a target handle for each unique variable
    ...allVariables.map((v) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${v}`,
    })),
    // Output handle
    { type: "source", position: Position.Right, id: `${id}-response` },
  ];

  return (
    <BaseNode
      id={id}
      type="LLM"
      icon={<Sparkles size={16} />}
      handles={handles}
      nodeName={currName}
      onNodeNameChange={handleNameChange}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            System
          </label>
          <HighlightedInput
            nodeId={id}
            value={data?.system || "{{system}}"}
            fieldName="system"
            placeholder="System Prompt"
            onVariablesChange={setSystemVariables}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            Prompt
          </label>
          <HighlightedInput
            nodeId={id}
            value={data?.prompt || "{{prompt}}"}
            fieldName="prompt"
            placeholder="Prompt"
            onVariablesChange={setPromptVariables}
          />
        </div>
      </div>
    </BaseNode>
  );
};
