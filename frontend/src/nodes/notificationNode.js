import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { Bell } from "lucide-react";
import { useStore } from "../store";
import { HighlightedInput } from "../components/ui/HighlightedInput";

export function NotificationNode({ id, data }) {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.notificationName || id.replace("notification-", "notification_"),
  );
  const [variables, setVariables] = useState([]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "notificationName", val);
  };

  const handles = [
    ...variables.map((v) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${v}`,
    })),
    { type: "source", position: Position.Right, id: `${id}-status` },
  ];

  return (
    <BaseNode
      id={id}
      type="Notification"
      icon={<Bell size={16} />}
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
            Message
          </label>
          <HighlightedInput
            nodeId={id}
            value={data?.message || "{{message}}"}
            fieldName="message"
            placeholder="Notification message..."
            onVariablesChange={setVariables}
          />
        </div>
      </div>
    </BaseNode>
  );
}
