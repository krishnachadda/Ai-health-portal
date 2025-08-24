import React, { useState, useEffect } from 'react';
import type { AnalysisResult, Condition, RiskFactor, CarePlanItem, TimelineItem } from '../types';
import { StethoscopeIcon, DownloadIcon, ShareIcon, CalendarIcon, CheckCircleIcon, ExclamationCircleIcon, PulseIcon, BrainIcon, WarningIcon, HeartIcon, ClockIcon, MagnifyingGlassIcon, CalendarDaysIcon, ClipboardCheckIcon } from './icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

type Tab = 'Conditions' | 'Analysis' | 'Care Plan' | 'Timeline';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

const ResultsHeader: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const urgencyThemes = {
      Low: { text: 'text-green-400', bg: 'bg-green-900/40', border: 'border-green-500/30' },
      Medium: { text: 'text-yellow-400', bg: 'bg-yellow-900/40', border: 'border-yellow-500/30' },
      High: { text: 'text-orange-400', bg: 'bg-orange-900/40', border: 'border-orange-500/30' },
      Critical: { text: 'text-red-400', bg: 'bg-red-900/40', border: 'border-red-500/30' },
  };
  const urgencyTheme = urgencyThemes[result.urgency_level] || urgencyThemes.Medium;
  
  const InfoCard: React.FC<{ title: string; value: string | number; theme: 'blue' | 'purple' | 'green' | 'urgency'; icon: React.ReactNode }> = ({ title, value, theme, icon }) => {
    const themes = {
      blue: { text: 'text-sky-400', bg: 'bg-sky-900/40', border: 'border-sky-500/30' },
      purple: { text: 'text-violet-400', bg: 'bg-violet-900/40', border: 'border-violet-500/30' },
      green: { text: 'text-emerald-400', bg: 'bg-emerald-900/40', border: 'border-emerald-500/30' },
      urgency: urgencyTheme
    };
    const currentTheme = themes[theme];

    return (
      <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${currentTheme.bg} ${currentTheme.border}`}>
        <div className={`mb-2 ${currentTheme.text}`}>{icon}</div>
        <div className={`text-3xl font-bold ${currentTheme.text}`}>{value}</div>
        <div className="text-sm font-medium text-slate-300">{title}</div>
      </div>
    );
  };
  
  return (
    <div className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl shadow-slate-900/50 border border-slate-700 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3">
          <StethoscopeIcon className="w-8 h-8 text-sky-400" />
          <div>
            <h2 className="text-xl font-bold text-slate-100">AI Diagnosis Analysis</h2>
            <p className="text-sm text-slate-400">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button className="px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors border border-slate-600">
            <DownloadIcon className="w-4 h-4" /> Export PDF
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors border border-slate-600">
            <ShareIcon className="w-4 h-4" /> Share Results
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <InfoCard title="AI Confidence" value={`${result.ai_confidence}%`} theme="blue" icon={<PulseIcon className="w-8 h-8"/>} />
         <InfoCard title="Conditions Analyzed" value={result.conditions_analyzed} theme="purple" icon={<BrainIcon className="w-8 h-8"/>} />
         <InfoCard title="Urgency Level" value={result.urgency_level} theme="urgency" icon={<WarningIcon className="w-8 h-8"/>} />
         <InfoCard title="Recommendations" value={result.recommendations} theme="green" icon={<HeartIcon className="w-8 h-8"/>} />
      </div>
    </div>
  );
};

const DonutChart: React.FC<{ probability: number; color: string; className?: string }> = ({ probability, color, className }) => {
  const [offset, setOffset] = useState(2 * Math.PI * 45);
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progress = probability / 100;
    const newOffset = circumference * (1 - progress);
    // Set a timeout to trigger the animation shortly after the component mounts
    const timer = setTimeout(() => setOffset(newOffset), 100);
    return () => clearTimeout(timer);
  }, [probability, circumference]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-slate-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>
          {probability}%
        </span>
      </div>
    </div>
  );
};


const ConditionsTab: React.FC<{ conditions: Condition[] }> = ({ conditions }) => {
  const COLORS = ['#38BDF8', '#34D399', '#A78BFA', '#FBBF24'];

  return (
      <div className="bg-slate-800/80 p-6 rounded-xl shadow-lg border border-slate-700">
          <h3 className="font-bold text-lg mb-6 text-slate-100">Condition Analysis</h3>
          <div className="space-y-4">
              {conditions.map((condition, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 flex flex-col sm:flex-row items-center gap-6 transition-all hover:border-slate-600 hover:bg-slate-900">
                      <DonutChart probability={condition.probability} color={COLORS[index % COLORS.length]} />
                      <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-semibold text-lg text-slate-100">{condition.name}</h4>
                          <p className="text-sm text-slate-400 mt-1">{condition.description}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};


interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 p-3 rounded-lg shadow-lg">
        <p className="text-slate-300 font-semibold">{label}</p>
        <p className="text-sky-400">{`Risk Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AnalysisTab: React.FC<{ riskAssessment: RiskFactor[], symptomAnalysis: AnalysisResult['symptom_analysis'] }> = ({ riskAssessment, symptomAnalysis }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-xl shadow-lg border border-slate-700">
                 <h3 className="font-bold text-lg mb-4 text-slate-100">Risk Assessment</h3>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={riskAssessment} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#818CF8" stopOpacity={0.5}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="factor" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}/>
                            <Bar dataKey="value" fill="url(#barGradient)" name="Risk Score" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-xl shadow-lg border border-slate-700 space-y-4">
                 <h3 className="font-bold text-lg mb-4 text-slate-100">Symptom Analysis</h3>
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                     <span className="font-semibold text-slate-300">Symptom Severity</span>
                     <span className="font-bold text-sky-300 bg-sky-500/20 px-3 py-1 rounded-full text-sm border border-sky-500/30">{symptomAnalysis.severity}</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                     <span className="font-semibold text-slate-300">Duration Pattern</span>
                     <span className="font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full text-sm border border-emerald-500/30">{symptomAnalysis.duration_pattern}</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                     <span className="font-semibold text-slate-300">Progression</span>
                     <span className="font-bold text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full text-sm border border-violet-500/30">{symptomAnalysis.progression}</span>
                 </div>
            </div>
        </div>
    );
};

const CarePlanTab: React.FC<{ carePlan: CarePlanItem[] }> = ({ carePlan }) => {
    const itemStyles = {
        recommendation: {
            border: 'border-l-4 border-emerald-500',
            icon: <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
        },
        caution: {
            border: 'border-l-4 border-orange-500',
            icon: <ExclamationCircleIcon className="w-6 h-6 text-orange-400" />
        }
    };

    return (
        <div className="bg-slate-800/80 p-6 rounded-xl shadow-lg border border-slate-700 space-y-6">
            <h3 className="font-bold text-lg text-slate-100">Personalized Care Plan</h3>
            {carePlan.map((item, index) => {
                const style = itemStyles[item.type];
                return (
                    <div key={index} className={`p-4 rounded-r-lg flex gap-4 bg-slate-900/50 border border-slate-700 ${style.border}`}>
                        <div className="flex-shrink-0 mt-1">{style.icon}</div>
                        <div>
                            <h4 className="font-semibold text-slate-100">{item.title}</h4>
                            <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const TimelineTab: React.FC<{ timeline: TimelineItem[] }> = ({ timeline }) => {
  const colorNames = ['blue', 'yellow', 'green', 'purple'];
  const icons = [<ClockIcon className="w-5 h-5"/>, <MagnifyingGlassIcon className="w-5 h-5"/>, <CalendarDaysIcon className="w-5 h-5"/>, <ClipboardCheckIcon className="w-5 h-5"/>];
  const colorClasses = {
      blue: { text: 'text-sky-400', border: 'border-sky-500/50', iconBg: 'bg-sky-900/80' },
      yellow: { text: 'text-amber-400', border: 'border-amber-500/50', iconBg: 'bg-amber-900/80' },
      green: { text: 'text-emerald-400', border: 'border-emerald-500/50', iconBg: 'bg-emerald-900/80' },
      purple: { text: 'text-violet-400', border: 'border-violet-500/50', iconBg: 'bg-violet-900/80' }
  };

  return (
    <div className="bg-slate-800/80 p-6 rounded-xl shadow-lg border border-slate-700">
      <h3 className="font-bold text-lg mb-6 text-slate-100">Follow-up Timeline</h3>
      <div className="relative pl-6">
        <div className="absolute left-[34px] top-3 bottom-3 w-0.5 bg-slate-700" aria-hidden="true"></div>
        {timeline.map((item, index) => {
          const color = colorNames[index % colorNames.length] as keyof typeof colorClasses;
          const style = colorClasses[color];
          return (
            <div key={index} className="relative mb-6">
              <div className={`absolute -left-2 top-0.5 flex-shrink-0 w-10 h-10 rounded-full ${style.iconBg} ${style.border} flex items-center justify-center ${style.text}`}>
                {icons[index % icons.length]}
              </div>
              <div className="ml-12 pl-4 py-2 rounded-r-lg">
                <p className={`font-bold ${style.text}`}>{item.time} - {item.title}</p>
                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Conditions');
  const tabs: Tab[] = ['Conditions', 'Analysis', 'Care Plan', 'Timeline'];

  return (
    <div className="max-w-5xl mx-auto">
      <ResultsHeader result={result} />

      <div className="mb-6">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-sky-400 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none relative`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 blur-sm"></div>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'Conditions' && <ConditionsTab conditions={result.conditions} />}
        {activeTab === 'Analysis' && <AnalysisTab riskAssessment={result.risk_assessment} symptomAnalysis={result.symptom_analysis} />}
        {activeTab === 'Care Plan' && <CarePlanTab carePlan={result.care_plan} />}
        {activeTab === 'Timeline' && <TimelineTab timeline={result.timeline} />}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onNewAnalysis}
          className="w-full sm:w-auto flex-1 px-6 py-3 border border-slate-600 text-base font-medium rounded-lg text-slate-200 bg-slate-700/50 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-colors"
        >
          New Analysis
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;