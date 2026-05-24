import { DraggableNode } from "./draggableNode";
import { SubmitButton } from "./submit";
import {
  LogIn,
  Sparkles,
  LogOut,
  AlignLeft,
  Database,
  StarIcon,
  Globe,
  GitBranch,
  Bell,
} from "lucide-react";

const NODE_TYPES = [
  { type: "customInput", label: "Input", icon: LogIn },
  { type: "llm", label: "LLM", icon: Sparkles },
  { type: "customOutput", label: "Output", icon: LogOut },
  { type: "text", label: "Text", icon: AlignLeft },
  { type: "db", label: "Database", icon: Database },
  { type: "summarize", label: "Summarize", icon: StarIcon },
  { type: "api", label: "API Request", icon: Globe },
  { type: "notification", label: "Notification", icon: Bell },
  { type: "condition", label: "Condition", icon: GitBranch },
];

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <div className="pipeline-toolbar-nodes">
        {NODE_TYPES.map((node) => {
          const IconComponent = node.icon;
          return (
            <DraggableNode
              key={node.type}
              type={node.type}
              label={node.label}
              icon={<IconComponent size={20} />}
            />
          );
        })}
      </div>
      <div className="pipeline-toolbar-actions">
        <SubmitButton />
      </div>
    </div>
  );
};
