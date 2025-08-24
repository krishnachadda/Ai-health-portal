import React, { useState, useEffect } from 'react';

const messages = [
  'Connecting to AI neural network...',
  'Analyzing complex symptom patterns...',
  'Cross-referencing global medical data...',
  'Synthesizing personalized insights...',
  'Compiling your diagnostic report...'
];

const LoadingSpinner: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % messages.length;
      setCurrentMessage(messages[index]);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-20 space-y-6 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/50 border border-slate-700">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-transparent border-l-transparent rounded-full animate-spin border-sky-400"></div>
        <div className="absolute inset-2 border-2 border-b-transparent border-r-transparent rounded-full animate-spin-slow border-indigo-400"></div>
      </div>
      <h2 className="text-xl font-semibold text-slate-100">Analyzing Your Symptoms...</h2>
      <p className="text-slate-400 text-center transition-opacity duration-500">{currentMessage}</p>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;