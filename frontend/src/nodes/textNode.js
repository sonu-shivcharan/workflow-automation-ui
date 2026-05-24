import { useState, useEffect } from "react";
import { Position, useUpdateNodeInternals } from "reactflow";
import BaseNode from "./baseNode";
import { AlignLeft } from "lucide-react";
import { HighlightedInput } from "../components/ui/HighlightedInput";
import { useStore } from "../store";
import { getNodeName, getSourceHandleId, canNodeBeVariable } from "../nodeConfig";
export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onConnect = useStore((state) => state.onConnect);
  const updateNodeInternals = useUpdateNodeInternals();
  const [currName, setCurrName] = useState(
    data?.textName || id.replace("text-", "text_")
  );
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "textName", val);
  };
  const handleTextChange = (val) => {
    setCurrText(val);
    updateNodeField(id, "text", val);
  };
  // Extract variables dynamically from the text
  const regex = /\{\{([a-zA-Z0-9_$]+)\}\}/g;
  const matches = [...currText.matchAll(regex)];
  const variables = [...new Set(matches.map((m) => m[1]))];
  const variablesStr = variables.join(",");
  useEffect(() => {
    // recalculate handle positions only when variables actually change
    updateNodeInternals(id);  
  }, [variablesStr, id, updateNodeInternals]);
  useEffect(() => {
    variables.forEach((variable) => {
      // Find a node whose derived name matches the variable
      const matchedNode = nodes.find((node) => {
        if (!canNodeBeVariable(node)) return false;
        return getNodeName(node) === variable;
      });
      if (matchedNode) {
        // Determine the source handle of the matched node using the config
        const sourceHandle = getSourceHandleId(matchedNode);
        
        const targetHandle = `${id}-${variable}`;
        if (sourceHandle) {
          // Check if edge already exists
          const edgeExists = edges.some(
            (e) =>
              e.source === matchedNode.id &&
              e.sourceHandle === sourceHandle &&
              e.target === id &&
              e.targetHandle === targetHandle
          );
          if (!edgeExists) {
            console.log("Auto-connecting", {
              source: matchedNode.id,
              sourceHandle: sourceHandle,
              target: id,
              targetHandle: targetHandle,
            });
            // Delay the connection slightly to ensure the new handle is fully registered in React Flow's internal state
            setTimeout(() => {
              onConnect({
                source: matchedNode.id,
                sourceHandle: sourceHandle,
                target: id,
                targetHandle: targetHandle,
              });
            }, 50);
          }
        }
      }
    });
  }, [currText, nodes, edges, id, onConnect]);
  const handles = [
    // Dynamically generate a target handle for each unique variable
    ...variables.map((variable) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${variable}`,
    })),
    { type: "source", position: Position.Right, id: `${id}-output` }
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
          value={currText}
          onChange={handleTextChange}
          placeholder="Enter text/template..."
        />
      </div>
    </BaseNode>
  );
};
