export const NodeConfigs = {
  customInput: {
    nameField: "inputName",
    defaultPrefix: "input_",
    sourceHandle: "source",
    canBeVariable: true,
  },
  text: {
    nameField: "textName",
    defaultPrefix: "text_",
    sourceHandle: "output",
    canBeVariable: true,
  },
  llm: {
    nameField: "llmName",
    defaultPrefix: "llm_",
    sourceHandle: "response",
    canBeVariable: true,
  },
  customOutput: {
    nameField: "outputName",
    defaultPrefix: "output_",
    canBeVariable: false,
  },
  db: {
    nameField: "dbName",
    defaultPrefix: "db_",
    sourceHandle: "data",
    canBeVariable: true,
  },
};

// Helper function to dynamically derive a node's display name
export const getNodeName = (node) => {
  const config = NodeConfigs[node.type];
  if (!config) return node.id;
  
  return node.data?.[config.nameField] || node.id.replace(`${node.type}-`, config.defaultPrefix);
};

// Helper function to get the correct source handle ID for a given node type
export const getSourceHandleId = (node) => {
  const config = NodeConfigs[node.type];
  if (!config || !config.sourceHandle) return null;
  
  return `${node.id}-${config.sourceHandle}`;
};

// Helper function to check if a node type can be used as a source variable
export const canNodeBeVariable = (node) => {
  const config = NodeConfigs[node.type];
  return config ? config.canBeVariable : false;
};
