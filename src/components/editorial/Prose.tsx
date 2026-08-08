import type { ReactNode } from "react";

interface ProseProps {
  children: ReactNode;
  className?: string;
}

export default function Prose({ children, className = "" }: ProseProps) {
  return <div className={`prose-site ${className}`.trim()}>{children}</div>;
}
