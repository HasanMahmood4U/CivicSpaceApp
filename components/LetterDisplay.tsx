import React from 'react';
import { Copy, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface LetterDisplayProps {
  content: string;
  onReset: () => void;
}

export const LetterDisplay: React.FC<LetterDisplayProps> = ({ content, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-civic-green overflow-hidden">
        <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-civic-green">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-bold">Draft Generated Successfully</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm font-semibold text-civic-green hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Text'}
              {!copied && <Copy size={14} />}
            </button>
          </div>
        </div>
        
        <div className="p-8 font-serif whitespace-pre-wrap text-gray-800 leading-relaxed max-h-[60vh] overflow-y-auto">
          {content}
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onReset} variant="secondary" className="flex-1">
          <ArrowLeft size={18} />
          Report Another Issue
        </Button>
        <a 
          href={`mailto:?subject=Civic Complaint&body=${encodeURIComponent(content)}`}
          className="flex-1"
        >
          <Button variant="success" className="w-full">
            Open in Email
          </Button>
        </a>
      </div>
    </div>
  );
};
