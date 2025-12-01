import React, { useState } from 'react';
import { FileText, Search, ClipboardPaste, ArrowRight, CheckSquare } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 50 && acceptedDisclaimer) {
      onAnalyze(text);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const sampleText = `WE MAY SELL YOUR DATA. By using this service, you agree that we grant ourselves a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such Content in any and all media or distribution methods (now known or later developed). You also agree to waive your right to a class action lawsuit and agree to binding arbitration. We may terminate your account at any time for any reason without notice.`;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Paste Terms of Service</h2>
              <p className="text-slate-500 text-sm">Paste the legal text below to scan for traps.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the fine print here..."
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder-slate-400 transition-all font-mono text-sm"
                disabled={isLoading}
              />
              {!text && (
                 <button 
                 type="button"
                 onClick={handlePaste}
                 className="absolute top-4 right-4 text-xs flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
               >
                 <ClipboardPaste className="w-3 h-3" /> Paste
               </button>
              )}
            </div>

            <div className="mb-6 flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
               <div className="flex h-5 items-center">
                 <input
                   id="disclaimer"
                   name="disclaimer"
                   type="checkbox"
                   checked={acceptedDisclaimer}
                   onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                   disabled={isLoading}
                   className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                 />
               </div>
               <div className="text-sm">
                 <label htmlFor="disclaimer" className="font-medium text-slate-700 cursor-pointer select-none">
                   I understand this is an AI analysis, not legal advice.
                 </label>
                 <p className="text-slate-500 text-xs mt-1">
                   This tool uses artificial intelligence to summarize text. It may make mistakes. Always consult a qualified attorney for professional legal advice.
                 </p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
               <button
                type="button"
                onClick={() => setText(sampleText)}
                className="text-sm text-slate-500 hover:text-blue-600 underline decoration-dotted underline-offset-4"
                disabled={isLoading}
              >
                Try a scary example
              </button>

              <button
                type="submit"
                disabled={isLoading || text.trim().length < 50 || !acceptedDisclaimer}
                className={`
                  flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all transform
                  ${isLoading || text.trim().length < 50 || !acceptedDisclaimer
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-slate-800 hover:scale-105 shadow-lg shadow-slate-900/20 active:scale-95'}
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Scan Fine Print
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-slate-100 border border-slate-200">
           <span className="block text-2xl mb-1">🕵️‍♂️</span>
           <p className="text-sm font-medium text-slate-700">Detects Hidden Traps</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-100 border border-slate-200">
           <span className="block text-2xl mb-1">🗣️</span>
           <p className="text-sm font-medium text-slate-700">Translates to English</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-100 border border-slate-200">
           <span className="block text-2xl mb-1">🛡️</span>
           <p className="text-sm font-medium text-slate-700">Rates Privacy Safety</p>
        </div>
      </div>
    </div>
  );
};

export default InputSection;