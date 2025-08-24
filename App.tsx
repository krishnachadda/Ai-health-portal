import React, { useState, useCallback } from 'react';
import type { SymptomData, AnalysisResult } from './types';
import { AppStep } from './types';
import ConsentScreen from './components/ConsentScreen';
import SymptomForm from './components/SymptomForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeSymptoms } from './services/geminiService';
import { LogoIcon, WaveIcon } from './components/icons';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.CONSENT);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsent = () => {
    setStep(AppStep.FORM);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setStep(AppStep.FORM);
  };

  const handleAnalyzeSymptoms = useCallback(async (symptomData: SymptomData) => {
    setStep(AppStep.LOADING);
    setError(null);
    try {
      const result = await analyzeSymptoms(symptomData);
      setAnalysisResult(result);
      setStep(AppStep.RESULTS);
    } catch (err) {
      console.error('Error analyzing symptoms:', err);
      setError('An error occurred during analysis. The AI provider may be busy, please try again later.');
      setStep(AppStep.FORM);
    }
  }, []);

  const renderStep = () => {
    switch (step) {
      case AppStep.CONSENT:
        return <ConsentScreen onConsent={handleConsent} />;
      case AppStep.FORM:
        return <SymptomForm onAnalyze={handleAnalyzeSymptoms} error={error} />;
      case AppStep.LOADING:
        return <LoadingSpinner />;
      case AppStep.RESULTS:
        return analysisResult ? <ResultsDisplay result={analysisResult} onNewAnalysis={handleNewAnalysis} /> : <div className="text-center p-8 text-slate-400">No results to display. Please start a new analysis.</div>;
      default:
        return <ConsentScreen onConsent={handleConsent} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 relative overflow-x-hidden">
       <div className="absolute top-0 left-0 right-0 h-[600px] w-full -z-10">
        <WaveIcon className="w-full h-full text-sky-500/20" />
      </div>
      <div className="relative z-10">
        <header className="bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-slate-900/50 sticky top-0 z-20 border-b border-slate-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <LogoIcon className="w-9 h-9 text-sky-400" />
            <div>
                <h1 className="text-xl font-bold text-slate-100">AI Symptom Checker</h1>
                <p className="text-xs text-slate-400">Your Personal AI Health Assistant</p>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {renderStep()}
        </main>
        <footer className="bg-transparent mt-12 py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
            <p>This tool is for informational purposes only and does not constitute medical advice. Consult a healthcare professional for any medical concerns.</p>
            <p className="mt-2">&copy; 2024 AI Healthcare Solutions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;