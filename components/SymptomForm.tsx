import React, { useState } from 'react';
import type { SymptomData } from '../types';
import { StethoscopeIcon, CakeIcon, UsersIcon, SignalIcon, ClipboardListIcon, ClockIcon, DocumentTextIcon } from './icons';

interface SymptomFormProps {
  onAnalyze: (data: SymptomData) => void;
  error: string | null;
}

interface RadioPillProps {
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (name: string, value: string) => void;
}

const RadioPill: React.FC<RadioPillProps> = ({ name, options, selectedValue, onChange }) => {
  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
      {options.map(option => (
        <label
          key={option.value}
          className={`relative flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ease-in-out border
            ${selectedValue === option.value
              ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-md shadow-sky-500/20'
              : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
            }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(name, option.value)}
            className="absolute opacity-0 w-0 h-0"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};


const SymptomForm: React.FC<SymptomFormProps> = ({ onAnalyze, error }) => {
  const [formData, setFormData] = useState<SymptomData>({
    age: '',
    gender: '',
    severity: '',
    description: '',
    duration: '',
    history: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const isFormValid = formData.age && formData.gender && formData.severity && formData.description && formData.duration;

  const inputStyles = "mt-2 block w-full rounded-md border-slate-700 shadow-sm sm:text-sm bg-slate-800/70 text-slate-100 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 focus:shadow-lg focus:shadow-sky-500/20";
  const labelStyles = "flex items-center gap-2 text-sm font-medium text-slate-300";

  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50">Describe Your Symptoms</h2>
        <p className="mt-2 text-md text-slate-300">
          Provide detailed information about your symptoms for accurate AI analysis.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl shadow-slate-900/50 border border-slate-700 space-y-8">
        {error && <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg" role="alert">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-1">
                <label htmlFor="age" className={labelStyles}><CakeIcon className="w-4 h-4" /> Age</label>
                <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} placeholder="e.g., 35" className={inputStyles} />
            </div>
            <div className="md:col-span-4">
                <label className={labelStyles}><UsersIcon className="w-4 h-4" /> Gender</label>
                <RadioPill
                    name="gender"
                    selectedValue={formData.gender}
                    onChange={handleRadioChange}
                    options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                    ]}
                />
            </div>
        </div>

        <div>
            <label className={labelStyles}><SignalIcon className="w-4 h-4" /> Symptom Severity</label>
             <RadioPill
                name="severity"
                selectedValue={formData.severity}
                onChange={handleRadioChange}
                options={[
                    { value: 'Mild', label: 'Mild' },
                    { value: 'Moderate', label: 'Moderate' },
                    { value: 'Severe', label: 'Severe' },
                    { value: 'Very Severe', label: 'Very Severe' },
                ]}
            />
        </div>

        <div>
          <label htmlFor="description" className={labelStyles}><ClipboardListIcon className="w-4 h-4" /> Symptoms Description</label>
          <textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} className={inputStyles} placeholder="Describe your symptoms in detail... (e.g., headache, fever, cough, duration, when it started, what makes it better or worse)"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="duration" className={labelStyles}><ClockIcon className="w-4 h-4" /> Duration</label>
            <select id="duration" name="duration" value={formData.duration} onChange={handleChange} className={inputStyles}>
              <option value="" disabled>How long have you had these symptoms?</option>
              <option value="Less than a day">Less than a day</option>
              <option value="1-3 days">1-3 days</option>
              <option value="3-7 days">3-7 days</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="More than 2 weeks">More than 2 weeks</option>
            </select>
          </div>
          <div>
            <label htmlFor="history" className={labelStyles}><DocumentTextIcon className="w-4 h-4" /> Relevant Medical History (Optional)</label>
            <input type="text" name="history" id="history" value={formData.history} onChange={handleChange} placeholder="Any relevant conditions or medications" className={inputStyles} />
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-8">
          <button type="submit" disabled={!isFormValid} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:bg-none disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:transform-none">
            <StethoscopeIcon className="w-6 h-6" />
            Analyze Symptoms with AI
          </button>
        </div>
      </form>
    </div>
  );
};

export default SymptomForm;