import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none
      prose-headings:text-white
      prose-p:text-zinc-200
      prose-strong:text-white
      prose-code:text-cyan-400
      prose-pre:bg-zinc-950
      prose-pre:border
      prose-pre:border-zinc-800
      prose-li:text-zinc-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}