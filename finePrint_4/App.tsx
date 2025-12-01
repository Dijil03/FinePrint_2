import React, { useState } from 'react';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeTosText } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import { ScrollText, Github } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setStatus('analyzing');
    setError(null);
    try {
      const data = await analyzeTosText(text);
      setResult(data);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the text. The AI might be busy or the text format is invalid. Please try again.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <ScrollText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
              Fine<span className="text-blue-600">Print</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ml-2">Beta</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {status === 'idle' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Don't Click "Agree" Until You <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Know the Truth.</span>
              </h2>
              <p className="text-lg text-slate-600">
                We use AI to read the fine print so you don't have to. Identify data selling, hidden fees, and rights waivers in seconds.
              </p>
            </div>
            <InputSection onAnalyze={handleAnalyze} isLoading={false} />
          </div>
        )}

        {status === 'analyzing' && (
          <div className="w-full flex flex-col items-center">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Reading the Fine Print...</h2>
               <p className="text-slate-500">Our AI lawyer is scanning for traps.</p>
             </div>
             <InputSection onAnalyze={() => {}} isLoading={true} />
          </div>
        )}

        {status === 'error' && (
          <div className="w-full max-w-2xl text-center animate-in shake">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl mb-8">
               <p className="text-red-700 font-medium mb-4">{error}</p>
               <button 
                onClick={handleReset}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
               >
                 Try Again
               </button>
            </div>
          </div>
        )}

        {status === 'complete' && result && (
          <AnalysisDashboard result={result} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Not legal advice. Use "FinePrint" for informational purposes only. Always consult a real lawyer for serious matters.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Powered by Google Gemini
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;