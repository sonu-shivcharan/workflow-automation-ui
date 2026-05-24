// toolbar.js

import { DraggableNode } from "./draggableNode";
import {
  LogIn,
  Sparkles,
  LogOut,
  AlignLeft,
  Database,
  StarIcon,
} from "lucide-react";

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <div className="pipeline-toolbar-nodes">
        <DraggableNode
          type="customInput"
          label="Input"
          icon={<LogIn size={20} />}
        />
        <DraggableNode type="llm" label="LLM" icon={<Sparkles size={20} />} />
        <DraggableNode
          type="customOutput"
          label="Output"
          icon={<LogOut size={20} />}
        />
        <DraggableNode
          type="text"
          label="Text"
          icon={<AlignLeft size={20} />}
        />
        <DraggableNode
          type="db"
          label="Database"
          icon={<Database size={20} />}
        />
        <DraggableNode
          type="summarize"
          label="Summarize"
          icon={<StarIcon size={20} />}
        />
      </div>
    </div>
  );
};
