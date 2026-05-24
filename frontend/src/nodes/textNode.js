import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { AlignLeft } from "lucide-react";
import { HighlightedInput } from "../components/ui/HighlightedInput";
import { useStore } from "../store";

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.textName || id.replace("text-", "text_"),
  );
  const [variables, setVariables] = useState([]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "textName", val);
  };

  const handles = [
    ...variables.map((variable) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${variable}`,
    })),
    { type: "source", position: Position.Right, id: `${id}-output` },
  ];

  return (
    <BaseNode
      id={id}
      type="Text"
      icon={<AlignLeft size={16} />}
      handles={handles}
      nodeName={currName}
      onNodeNameChange={handleNameChange}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Text Template
        </label>
        <HighlightedInput
          value={data?.text || "{{input}}"}
          fieldName="text"
          placeholder="Enter text/template..."
          nodeId={id}
          onVariablesChange={setVariables}
        />
      </div>
    </BaseNode>
  );
};
