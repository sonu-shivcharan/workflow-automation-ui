import { useState } from "react";
import { Position } from "reactflow";
import BaseNode from "./baseNode";
import { Database } from "lucide-react";
import { useStore } from "../store";

export const DbNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(
    data?.dbName || id.replace("db-", "db_"),
  );
  const [query, setQuery] = useState(data?.query || "SELECT * FROM users");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, "dbName", val);
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    updateNodeField(id, "query", val);
  };

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-data` },
  ];

  return (
    <BaseNode
      id={id}
      type="Database"
      icon={<Database size={16} />}
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
          SQL Query
        </label>
        <textarea
          value={query}
          onChange={handleQueryChange}
          style={{
            width: "100%",
            minHeight: "60px",
            padding: "6px 10px",
            fontSize: "12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            outline: "none",
            resize: "vertical",
            fontFamily: "monospace",
            boxSizing: "border-box",
          }}
        />
      </div>
    </BaseNode>
  );
};
