import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { useStore } from "../../store";
import { getNodeName, canNodeBeVariable } from "../../nodeConfig";

export const HighlightedInput = ({
  value = "",
  onChange,
  placeholder = "",
  style = {},
}) => {
  const nodes = useStore((state) => state.nodes);

  // Dynamically extract all node names to be used as autocomplete variables
  // Only include nodes that have source handles (they can output data)
  const variables = nodes.filter(canNodeBeVariable).map(getNodeName);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 38, left: 0 });
  const [filteredVariables, setFilteredVariables] = useState([]);
  const [activeTriggerIndex, setActiveTriggerIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const highlightCode = (text) => {
    // Highlight {{variable}}
    return text.replace(/\{\{(.*?)\}\}/g, '<span class="variable">$1</span>');
  };

  const checkShowMenu = () => {
    if (!containerRef.current) return;
    const textarea = containerRef.current.querySelector("textarea");
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const beforeCursor = textarea.value.substring(0, cursor);

    // Find the last index of "{{" before the cursor
    const triggerIndex = beforeCursor.lastIndexOf("{{");
    if (triggerIndex === -1) {
      setShowMenu(false);
      return;
    }

    const queryText = beforeCursor.substring(triggerIndex + 2);

    // Validate query (no spaces, newlines, or braces)
    const isValidQuery =
      !queryText.includes("}") &&
      !queryText.includes("{") &&
      !/\s/.test(queryText);

    if (isValidQuery) {
      const filtered = variables.filter((v) =>
        v.toLowerCase().startsWith(queryText.toLowerCase()),
      );

      if (filtered.length > 0) {
        setShowMenu(true);
        setFilteredVariables(filtered);
        setActiveTriggerIndex(triggerIndex);

        // Keep selectedIndex within bounds
        setSelectedIndex((prev) => Math.min(prev, filtered.length - 1));

        const textUpToTrigger = beforeCursor.substring(0, triggerIndex);
        const lines = textUpToTrigger.split("\n");
        const currentLineIndex = lines.length - 1;
        const currentLineText = lines[currentLineIndex];

        // Measure text width using canvas
        const getTextWidth = (text, font) => {
          const canvas =
            getTextWidth.canvas ||
            (getTextWidth.canvas = document.createElement("canvas"));
          const context = canvas.getContext("2d");
          context.font = font;
          return context.measureText(text).width;
        };

        const textWidth = getTextWidth(
          currentLineText,
          "14px arial, sans-serif",
        );
        const lineHeight = 20;
        const padding = 8; // matches left padding of Editor

        setMenuPosition({
          top:
            padding + (currentLineIndex + 1) * lineHeight - textarea.scrollTop,
          left: Math.min(
            padding + textWidth - textarea.scrollLeft,
            textarea.clientWidth - 180,
          ),
        });
      } else {
        setShowMenu(false);
      }
    } else {
      setShowMenu(false);
    }
  };

  const handleChange = (val) => {
    if (onChange) {
      onChange(val);
    }
  };

  // Sync scroll, keyup, click events to update menu visibility/position
  useEffect(() => {
    if (!containerRef.current) return;
    const textarea = containerRef.current.querySelector("textarea");
    if (!textarea) return;

    const handleEvent = () => {
      setTimeout(checkShowMenu, 0);
    };

    textarea.addEventListener("scroll", handleEvent);
    textarea.addEventListener("click", handleEvent);
    textarea.addEventListener("keyup", handleEvent);

    return () => {
      textarea.removeEventListener("scroll", handleEvent);
      textarea.removeEventListener("click", handleEvent);
      textarea.removeEventListener("keyup", handleEvent);
    };
  }, [value]);

  const insertVariable = (variable) => {
    if (!containerRef.current || activeTriggerIndex === -1) return;
    const textarea = containerRef.current.querySelector("textarea");
    if (!textarea) return;

    const selectionEnd = textarea.selectionEnd;
    const beforeText = value.substring(0, activeTriggerIndex + 2); // Keep "{{"
    const afterText = value.substring(selectionEnd);

    const newText = beforeText + variable + "}}" + afterText;
    const newCursorPos = activeTriggerIndex + 4 + variable.length;

    if (onChange) {
      onChange(newText);
    }
    setShowMenu(false);

    // Refocus the textarea and set the selection range
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (showMenu) {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % filteredVariables.length);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredVariables.length) % filteredVariables.length,
        );
        e.preventDefault();
      } else if (e.key === "Enter") {
        insertVariable(filteredVariables[selectedIndex]);
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === "Escape") {
        setShowMenu(false);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  // Trigger checkShowMenu when editor gains focus
  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(checkShowMenu, 0);
  };

  // Delay blur to allow clicks on autocomplete menu items
  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowMenu(false);
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        border: isFocused ? "1px solid #3b82f6" : "1px solid #ccc",
        boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "none",
        borderRadius: 6,
        background: "#fff",
        boxSizing: "border-box",
        width: "100%",
        minHeight: 38,
        display: "flex",
        alignItems: "stretch",
        overflow: "visible",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          minHeight: "100%",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <Editor
          value={value}
          onValueChange={handleChange}
          highlight={highlightCode}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          padding={8}
          placeholder={placeholder}
          style={{
            fontFamily: "arial, sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
            width: "100%",
            minHeight: "100%",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {showMenu && (
        <div
          className="autocomplete-menu"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          {filteredVariables.map((variable, idx) => (
            <div
              key={variable}
              className={`autocomplete-item ${idx === selectedIndex ? "selected" : ""}`}
              onMouseDown={(e) => {
                // Prevent onBlur of textarea from hiding the menu before click event completes
                e.preventDefault();
                insertVariable(variable);
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              {variable}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
