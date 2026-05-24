import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { Sparkles } from "lucide-react";
import { useStore } from "../store";

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.llmName || id.replace("llm-", "llm_")
  );

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "llmName", val);
  };

  const handles = [
    {
      type: "target",
      position: Position.Left,
      id: `${id}-system`,
      style: { top: `${100 / 3}%` },
    },
    {
      type: "target",
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: `${200 / 3}%` },
    },
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
      <div style={{ fontSize: "12px", color: "#64748b" }}>
        This is an LLM node that processes system instructions and prompts.
      </div>
    </BaseNode>
  );
};
