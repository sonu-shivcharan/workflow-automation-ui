import React, { useState } from "react";
import { Handle, Position } from "reactflow";

function BaseNode({
  type = "Node",
  icon,
  handles = [],
  children,
  onDelete,
  nodeName = "",
  onNodeNameChange,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const leftHandles = handles.filter((h) => h.position === Position.Left);
  const rightHandles = handles.filter((h) => h.position === Position.Right);
  const topHandles = handles.filter((h) => h.position === Position.Top);
  const bottomHandles = handles.filter((h) => h.position === Position.Bottom);

  const renderHandle = (h, idx, totalCount) => {
    let style = { ...h.style };
    if (
      !style.top &&
      !style.bottom &&
      (h.position === Position.Left || h.position === Position.Right)
    ) {
      style.top = `${((idx + 1) * 100) / (totalCount + 1)}%`;
    }
    if (
      !style.left &&
      !style.right &&
      (h.position === Position.Top || h.position === Position.Bottom)
    ) {
      style.left = `${((idx + 1) * 100) / (totalCount + 1)}%`;
    }
    return (
      <Handle
        key={h.id}
        type={h.type}
        position={h.position}
        id={h.id}
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "#3b82f6",
          border: "2px solid #ffffff",
          borderRadius: "50%",
          transition: "transform 0.15s ease, background-color 0.15s ease",
          zIndex: 10,
          ...style,
        }}
        className="node-handle"
      />
    );
  };

  return (
    <div
      className="base-node"
      style={{
        position: "relative",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.05)",
        minWidth: "200px",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Node Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderBottom: "1px solid #e2e8f0",
          borderTopLeftRadius: "7px",
          borderTopRightRadius: "7px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon && <span style={{ color: "#4f46e5", display: "flex" }}>{icon}</span>}
          <span style={{ fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>
            {type}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "13px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            title="Delete Node"
          >
            ✕
          </button>
        )}
      </div>

      {/* Node Body */}
      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Standard Node Name Input */}
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
            Node Name
          </label>
          <input
            type="text"
            value={nodeName}
            onChange={onNodeNameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: "100%",
              padding: "6px 10px",
              fontSize: "12px",
              borderRadius: "6px",
              border: isFocused ? "1px solid #4f46e5" : "1px solid #cbd5e1",
              boxShadow: isFocused ? "0 0 0 2px rgba(79, 70, 229, 0.1)" : "none",
              outline: "none",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Custom Node Content */}
        {children}
      </div>

      {/* Handles */}
      {leftHandles.map((h, i) => renderHandle(h, i, leftHandles.length))}
      {rightHandles.map((h, i) => renderHandle(h, i, rightHandles.length))}
      {topHandles.map((h, i) => renderHandle(h, i, topHandles.length))}
      {bottomHandles.map((h, i) => renderHandle(h, i, bottomHandles.length))}
    </div>
  );
}

export default BaseNode;
