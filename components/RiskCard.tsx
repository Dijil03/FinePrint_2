import React, { useState } from 'react';
import { AnalysisItem, RiskSeverity } from '../types';
import { AlertTriangle, ShieldCheck, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface RiskCardProps {
  item: AnalysisItem;
}

const RiskCard: React.FC<RiskCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const getSeverityConfig = (severity: RiskSeverity) => {
    switch (severity) {
      case RiskSeverity.HIGH:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          iconColor: 'text-red-600',
          icon: <AlertTriangle className="w-5 h-5" />,
          label: 'Red Flag'
        };
      case RiskSeverity.MEDIUM:
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-900',
          iconColor: 'text-orange-600',
          icon: <Info className="w-5 h-5" />,
          label: 'Caution'
        };
      case RiskSeverity.SAFE:
      case RiskSeverity.LOW:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          iconColor: 'text-green-600',
          icon: <ShieldCheck className="w-5 h-5" />,
          label: 'Good Stuff'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          iconColor: 'text-gray-600',
          icon: <Info className="w-5 h-5" />,
          label: 'Note'
        };
    }
  };

  const config = getSeverityConfig(item.severity);

  return (
    <div 
      className={`border rounded-xl p-4 transition-all duration-200 ${config.bg} ${config.border} hover:shadow-md cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${config.iconColor} border ${config.border} px-2 py-0.5 rounded-full bg-white bg-opacity-50`}>
              {config.label}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-2">{item.category}</span>
          </div>
          
          <h3 className={`font-semibold text-lg leading-tight mb-2 ${config.text}`}>
            {item.simplifiedTranslation}
          </h3>

          <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-3 text-sm">
                <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-black/5">
                    <p className="font-semibold text-slate-500 text-xs mb-1 uppercase">Original Legalese</p>
                    <p className="italic text-slate-700 font-serif">"{item.originalText}"</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-500 text-xs mb-1 uppercase">Why it matters</p>
                    <p className="text-slate-800">{item.explanation}</p>
                </div>
            </div>
          </div>
        </div>
        <div className="text-slate-400 mt-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
};

export default RiskCard;