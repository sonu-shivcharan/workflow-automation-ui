import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { FileInput } from "lucide-react";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "inputName", val);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setInputType(val);
    updateNodeField(id, "inputType", val);
  };

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-source` },
  ];

  return (
    <BaseNode
      id={id}
      type="Input"
      icon={<FileInput size={16} />}
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
          value={inputType}
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
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
