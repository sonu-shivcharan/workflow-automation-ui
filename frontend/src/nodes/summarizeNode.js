import React, { useState } from "react";
import BaseNode from "./baseNode";
import { Position } from "reactflow";
import { useStore } from "../store";
import { StarIcon } from "lucide-react";
import { HighlightedInput } from "../components/ui/HighlightedInput";
export function SummarizeNode({ id, data }) {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.llmName || id.replace("llm-", "llm_"),
  );

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "sumarizeName", val);
  };

  const [variables, setVariables] = useState([]);
  const handles = [
    ...variables.map((v) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${v}`,
    })),
    { type: "source", position: Position.Right, id: `${id}-response` },
  ];

  return (
    <BaseNode
      title="Summarize"
      onNodeNameChange={handleNameChange}
      nodeName={currName}
      icon={<StarIcon />}
      id={id}
      data={data}
      handles={handles}
    >
      <HighlightedInput
        nodeId={id}
        value={data?.text || "{{input}}"}
        fieldName="text"
        placeholder="Enter text/template..."
        onVariablesChange={setVariables}
      />
    </BaseNode>
  );
}
