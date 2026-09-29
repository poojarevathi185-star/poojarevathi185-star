import React from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  const [copiedBlock, setCopiedBlock] = React.useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(idx);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  // Parse lines into structured blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let isNumberedList = false;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let blockKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${blockKey++}`} className="list-decimal pl-6 space-y-1.5 my-3 text-slate-700 leading-relaxed">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${blockKey++}`} className="list-disc pl-6 space-y-1.5 my-3 text-slate-700 leading-relaxed">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono font-medium border border-indigo-100/80">$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // flush code block
        const fullCode = codeBuffer.join('\n');
        const currentIdx = blockKey++;
        elements.push(
          <div key={`code-${currentIdx}`} className="my-4 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 text-xs font-mono text-slate-300 border-b border-slate-700/60">
              <span>{codeLang || 'code'}</span>
              <button
                onClick={() => copyCode(fullCode, currentIdx)}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition"
              >
                {copiedBlock === currentIdx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${blockKey++}`} className="text-xl sm:text-2xl font-bold text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200">
          {line.replace('# ', '')}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${blockKey++}`} className="text-lg sm:text-xl font-bold text-indigo-950 mt-5 mb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-indigo-600 rounded-full inline-block"></span>
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${blockKey++}`} className="text-base sm:text-lg font-semibold text-slate-800 mt-4 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Unordered List
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (isNumberedList) flushList();
      isNumberedList = false;
      currentList.push(line.trim().replace(/^[-*]\s+/, ''));
      continue;
    }

    // Numbered list (e.g. "1. ")
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!isNumberedList && currentList.length > 0) flushList();
      isNumberedList = true;
      currentList.push(numMatch[2]);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${blockKey++}`} className="border-l-4 border-indigo-500 pl-4 py-1.5 my-3 text-slate-600 italic bg-indigo-50/40 rounded-r-lg">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace('> ', '')) }} />
        </blockquote>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Normal paragraph
    flushList();
    elements.push(
      <p
        key={`p-${blockKey++}`}
        className="my-2.5 text-slate-700 leading-relaxed text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  }

  flushList();

  return <div className={`space-y-1 text-slate-800 ${className}`}>{elements}</div>;
};
