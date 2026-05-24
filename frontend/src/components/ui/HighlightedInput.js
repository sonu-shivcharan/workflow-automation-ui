import React, { useState, useRef, useEffect, useMemo } from "react";
import Editor from "react-simple-code-editor";
import { useStore } from "../../store";
import {
  getNodeName,
  canNodeBeVariable,
  getSourceHandleId,
} from "../../nodeConfig";
import { useUpdateNodeInternals } from "reactflow";
import { AutocompleteMenu } from "./AutocompleteMenu";

export const HighlightedInput = ({
  value = "{{input}}",
  fieldName = "text",
  placeholder = "",
  style = {},
  nodeId,
  onVariablesChange,
}) => {
  const [currText, setCurrText] = useState(value);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onConnect = useStore((state) => state.onConnect);
  const updateNodeInternals = useUpdateNodeInternals();

  // Dynamically extract all node names to be used as autocomplete variables
  // Only include nodes that have source handles (they can output data)
  const availableVariables = nodes.filter(canNodeBeVariable).map(getNodeName);

  // Extract variables dynamically from the current text value
  const matches = useMemo(() => {
    const regex = /\{\{([a-zA-Z0-9_$]+)\}\}/g;
    return [...currText.matchAll(regex)];
  }, [currText]);

  const extractedVariables = useMemo(() => {
    return [...new Set(matches.map((m) => m[1]))];
  }, [matches]);

  const variablesStr = extractedVariables.join(",");

  useEffect(() => {
    if (onVariablesChange) {
      onVariablesChange(extractedVariables);
    }
  }, [variablesStr, extractedVariables, onVariablesChange]);

  useEffect(() => {
    if (nodeId) {
      // Delay to allow parent component to render new handles
      const timer = setTimeout(() => {
        updateNodeInternals(nodeId);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [variablesStr, nodeId, updateNodeInternals]);

  useEffect(() => {
    if (!nodeId) return;
    extractedVariables.forEach((variable) => {
      const matchedNode = nodes.find((node) => {
        if (!canNodeBeVariable(node)) return false;
        return getNodeName(node) === variable;
      });
      if (matchedNode) {
        const sourceHandle = getSourceHandleId(matchedNode);
        const targetHandle = `${nodeId}-${variable}`;
        if (sourceHandle) {
          const edgeExists = edges.some(
            (e) =>
              e.source === matchedNode.id &&
              e.sourceHandle === sourceHandle &&
              e.target === nodeId &&
              e.targetHandle === targetHandle,
          );
          if (!edgeExists) {
            console.log("Auto-connecting", {
              source: matchedNode.id,
              sourceHandle: sourceHandle,
              target: nodeId,
              targetHandle: targetHandle,
            });
            setTimeout(() => {
              onConnect({
                source: matchedNode.id,
                sourceHandle: sourceHandle,
                target: nodeId,
                targetHandle: targetHandle,
              });
            }, 100);
          }
        }
      }
    });
  }, [currText, nodes, edges, nodeId, onConnect, extractedVariables]);

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
      const filtered = availableVariables.filter((v) =>
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

  const handleTextChange = (val) => {
    setCurrText(val);
    if (nodeId) {
      updateNodeField(nodeId, fieldName, val);
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
  }, [currText]);

  const insertVariable = (variable) => {
    if (!containerRef.current || activeTriggerIndex === -1) return;
    const textarea = containerRef.current.querySelector("textarea");
    if (!textarea) return;

    const selectionEnd = textarea.selectionEnd;
    const beforeText = currText.substring(0, activeTriggerIndex + 2); // Keep "{{"
    const afterText = currText.substring(selectionEnd);

    const newText = beforeText + variable + "}}" + afterText;
    const newCursorPos = activeTriggerIndex + 4 + variable.length;

    handleTextChange(newText);
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
      className={`highlighted-input-container ${isFocused ? "focused" : ""}`}
      style={style}
    >
      <div className="highlighted-input-wrapper">
        <Editor
          value={currText}
          onValueChange={handleTextChange}
          highlight={highlightCode}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          padding={8}
          placeholder={placeholder}
          className="highlighted-input-editor"
        />
      </div>

      {showMenu && (
        <AutocompleteMenu
          position={menuPosition}
          variables={filteredVariables}
          selectedIndex={selectedIndex}
          onSelectVariable={insertVariable}
          onHoverVariable={setSelectedIndex}
        />
      )}
    </div>
  );
};
