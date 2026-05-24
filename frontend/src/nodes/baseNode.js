import React from "react";
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
        style={style}
        className="base-node-handle"
      />
    );
  };

  return (
    <div className="base-node">
      {/* Node Header */}
      <div className="base-node-header">
        <div className="base-node-title-container">
          {icon && <span className="base-node-icon">{icon}</span>}
          <span className="base-node-title">
            {type}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="base-node-delete-btn"
            title="Delete Node"
          >
            ✕
          </button>
        )}
      </div>

      {/* Node Body */}
      <div className="base-node-body">
        {/* Standard Node Name Input */}
        <div className="base-node-input-container">
          <label className="base-node-label">
            Node Name
          </label>
          <input
            type="text"
            value={nodeName}
            onChange={onNodeNameChange}
            className="base-node-input"
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
