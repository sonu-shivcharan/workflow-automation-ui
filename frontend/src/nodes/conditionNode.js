import React, { useState } from "react";
import BaseNode from "./baseNode";
import { Position } from "reactflow";
import { useStore } from "../store";
import { GitBranch } from "lucide-react";
import { HighlightedInput } from "../components/ui/HighlightedInput";

export function ConditionNode({ id, data }) {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.conditionName || id.replace("condition-", "condition_"),
  );

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "conditionName", val);
  };

  const [variables, setVariables] = useState([]);

  const handles = [
    ...variables.map((v) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${v}`,
    })),
    { type: "source", position: Position.Right, id: `${id}-true`, style: { top: "33%" } },
    { type: "source", position: Position.Right, id: `${id}-false`, style: { top: "66%" } },
  ];

  return (
    <BaseNode
      type="Condition"
      onNodeNameChange={handleNameChange}
      nodeName={currName}
      icon={<GitBranch size={16} />}
      id={id}
      data={data}
      handles={handles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>If Statement</label>
        <HighlightedInput
          nodeId={id}
          value={data?.condition || "{{value}} > 50"}
          fieldName="condition"
          placeholder="Condition..."
          onVariablesChange={setVariables}
        />
      </div>
    </BaseNode>
  );
}
