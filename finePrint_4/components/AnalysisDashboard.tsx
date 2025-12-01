import React from 'react';
import { AnalysisResult, RiskSeverity, AnalysisVerdict } from '../types';
import ScoreGauge from './ScoreGauge';
import RiskCard from './RiskCard';
import { RefreshCw, Shield, AlertOctagon, CheckCircle, AlertTriangle, XCircle, ThumbsUp } from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  const highRisks = result.items.filter(i => i.severity === RiskSeverity.HIGH);
  const mediumRisks = result.items.filter(i => i.severity === RiskSeverity.MEDIUM);
  const safeItems = result.items.filter(i => i.severity === RiskSeverity.SAFE || i.severity === RiskSeverity.LOW);

  const getVerdictStyles = (verdict: AnalysisVerdict) => {
    switch (verdict) {
      case AnalysisVerdict.RECOMMENDED:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          label: 'Safe to Use'
        };
      case AnalysisVerdict.ACCEPTABLE:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: <ThumbsUp className="w-8 h-8 text-blue-600" />,
          label: 'Acceptable'
        };
      case AnalysisVerdict.CAUTION:
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-800',
          border: 'border-orange-200',
          icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
          label: 'Use with Caution'
        };
      case AnalysisVerdict.AVOID:
        return {
          bg: 'bg-red-50',
          text: 'text-red-900',
          border: 'border-red-200',
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          label: 'DO NOT USE'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-800',
          border: 'border-slate-200',
          icon: <Shield className="w-8 h-8 text-slate-600" />,
          label: 'Unknown'
        };
    }
  };

  const verdictStyle = getVerdictStyles(result.verdict);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Score Section */}
          <div className="p-8 flex flex-col items-center justify-center bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Safety Score</h3>
            <ScoreGauge score={result.score} />
            {result.companyName && (
               <p className="text-sm font-medium text-slate-500 mt-2">analyzing {result.companyName}</p>
            )}
          </div>

          {/* Verdict & Summary Section */}
          <div className="p-8 md:col-span-2 flex flex-col justify-center">
             
             <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border ${verdictStyle.bg} ${verdictStyle.border} w-fit mb-4`}>
                {verdictStyle.icon}
                <span className={`text-2xl font-bold ${verdictStyle.text} uppercase tracking-tight`}>
                  {verdictStyle.label}
                </span>
             </div>

             <h2 className="text-xl font-bold text-slate-900 mb-2">
                {result.recommendation}
             </h2>

             <p className="text-lg text-slate-600 leading-relaxed">
               {result.summary}
             </p>
             
             <div className="mt-6 flex gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm font-medium text-slate-600">{highRisks.length} Red Flags</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                    <span className="text-sm font-medium text-slate-600">{mediumRisks.length} Cautions</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium text-slate-600">{safeItems.length} Good Signs</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dangerous Column */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-slate-800">Red Flags & Concerns</h3>
           </div>
           
           {highRisks.length === 0 && mediumRisks.length === 0 && (
             <div className="p-8 bg-green-50 rounded-2xl border border-green-100 text-center">
                <p className="text-green-700 font-medium">No major issues found! 🎉</p>
             </div>
           )}

           {highRisks.map(item => (
             <RiskCard key={item.id} item={item} />
           ))}
           {mediumRisks.map(item => (
             <RiskCard key={item.id} item={item} />
           ))}
        </div>

        {/* Good/Safe Column */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-slate-800">Good Stuff & Notes</h3>
           </div>

           {safeItems.length === 0 && (
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500">No specific positive clauses highlighted.</p>
             </div>
           )}

           {safeItems.map(item => (
             <RiskCard key={item.id} item={item} />
           ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors px-6 py-3 rounded-full hover:bg-slate-100 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Scan Another Document
        </button>
      </div>

    </div>
  );
};

export default AnalysisDashboard;