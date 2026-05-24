import React from "react";

export const AutocompleteMenu = ({
  position,
  variables = [],
  selectedIndex = 0,
  onSelectVariable,
  onHoverVariable,
}) => {
  if (!variables.length) return null;

  return (
    <div
      className="autocomplete-menu"
      style={{
        top: position?.top,
        left: position?.left,
      }}
    >
      {variables.map((variable, idx) => (
        <div
          key={variable}
          className={`autocomplete-item ${idx === selectedIndex ? "selected" : ""}`}
          onMouseDown={(e) => {
            // Prevent onBlur of textarea from hiding the menu before click event completes
            e.preventDefault();
            onSelectVariable(variable);
          }}
          onMouseEnter={() => onHoverVariable && onHoverVariable(idx)}
        >
          {variable}
        </div>
      ))}
    </div>
  );
};
