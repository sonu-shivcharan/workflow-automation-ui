import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { Send } from "lucide-react";
import { useStore } from "../store";

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "outputName", val);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setOutputType(val);
    updateNodeField(id, "outputType", val);
  };

  const handles = [
    { type: "target", position: Position.Left, id: `${id}-value` },
  ];

  return (
    <BaseNode
      id={id}
      type="Output"
      icon={<Send size={16} />}
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
          Type
        </label>
        <select
          value={outputType}
          onChange={handleTypeChange}
          style={{
            width: "100%",
            padding: "6px 10px",
            fontSize: "12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            outline: "none",
            background: "#fff",
            boxSizing: "border-box",
          }}
          
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
