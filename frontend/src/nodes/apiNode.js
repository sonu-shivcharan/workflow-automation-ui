import React, { useState } from "react";
import BaseNode from "./baseNode";
import { Position } from "reactflow";
import { useStore } from "../store";
import { Globe } from "lucide-react";
import { HighlightedInput } from "../components/ui/HighlightedInput";

export function ApiNode({ id, data }) {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.apiName || id.replace("api-", "api_"),
  );

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "apiName", val);
  };

  const [urlVariables, setUrlVariables] = useState([]);
  const [bodyVariables, setBodyVariables] = useState([]);

  const allVariables = [...new Set([...urlVariables, ...bodyVariables])];

  const handles = [
    ...allVariables.map((v) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${v}`,
    })),
    { type: "source", position: Position.Right, id: `${id}-response` },
  ];

  return (
    <BaseNode
      type="API Request"
      onNodeNameChange={handleNameChange}
      nodeName={currName}
      icon={<Globe size={16} />}
      id={id}
      data={data}
      handles={handles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>URL</label>
          <HighlightedInput
            nodeId={id}
            value={data?.url || "https://api.example.com/{{endpoint}}"}
            fieldName="url"
            placeholder="https://..."
            onVariablesChange={setUrlVariables}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Body (JSON)</label>
          <HighlightedInput
            nodeId={id}
            value={data?.body || '{ "data": "{{input}}" }'}
            fieldName="body"
            placeholder="{}"
            onVariablesChange={setBodyVariables}
          />
        </div>
      </div>
    </BaseNode>
  );
}
