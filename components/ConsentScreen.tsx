import React, { useState } from 'react';
import { ShieldIcon, LockIcon, EyeIcon, DocumentIcon, UserConsentIcon } from './icons';

interface ConsentScreenProps {
  onConsent: () => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}> = ({ icon, title, description, className = '' }) => (
  <div className={`p-5 rounded-xl border text-center transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-1 bg-slate-800/50 ${className}`}>
    <div className="flex justify-center mb-3">{icon}</div>
    <h3 className="font-semibold text-slate-100">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);

const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent }) => {
  const [medicalDisclaimer, setMedicalDisclaimer] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [ageVerification, setAgeVerification] = useState(false);

  const allConsented = medicalDisclaimer && privacyPolicy && ageVerification;

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Welcome to Your AI Health Assistant</h2>
        <p className="mt-4 text-lg text-slate-300">
          Securely check your symptoms and receive professional-grade analysis and recommendations.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          icon={<ShieldIcon className="w-9 h-9 text-green-400" />}
          title="HIPAA Compliant"
          description="Data Protection"
          className="border-green-500/30 hover:border-green-400"
        />
        <FeatureCard
          icon={<LockIcon className="w-9 h-9 text-blue-400" />}
          title="SSL Encrypted"
          description="Secure Connection"
          className="border-blue-500/30 hover:border-blue-400"
        />
        <FeatureCard
          icon={<EyeIcon className="w-9 h-9 text-purple-400" />}
          title="Privacy First"
          description="No Data Sharing"
          className="border-purple-500/30 hover:border-purple-400"
        />
        <FeatureCard
          icon={<DocumentIcon className="w-9 h-9 text-orange-400" />}
          title="Audit Ready"
          description="Compliance Logs"
          className="border-orange-500/30 hover:border-orange-400"
        />
      </div>

      <div className="bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl shadow-slate-900/50 border border-slate-700 space-y-6">
        <div className="flex items-center gap-4">
          <UserConsentIcon className="w-8 h-8 text-slate-400" />
          <h3 className="text-xl font-bold text-slate-100">User Consent & Verification</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-start p-4 rounded-lg border border-slate-700 cursor-pointer bg-slate-900/50 hover:bg-slate-700/50 transition-colors has-[:checked]:bg-sky-900/50 has-[:checked]:border-sky-500">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
              checked={medicalDisclaimer}
              onChange={() => setMedicalDisclaimer(!medicalDisclaimer)}
            />
            <span className="ml-3 text-sm">
              <strong className="font-semibold text-slate-100">Medical Disclaimer Agreement</strong><br />
              <span className="text-slate-300">I understand this is not a substitute for professional medical advice and will consult healthcare providers for medical concerns.</span>
            </span>
          </label>

          <label className="flex items-start p-4 rounded-lg border border-slate-700 cursor-pointer bg-slate-900/50 hover:bg-slate-700/50 transition-colors has-[:checked]:bg-sky-900/50 has-[:checked]:border-sky-500">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
              checked={privacyPolicy}
              onChange={() => setPrivacyPolicy(!privacyPolicy)}
            />
            <span className="ml-3 text-sm">
              <strong className="font-semibold text-slate-100">Data Privacy & HIPAA Compliance</strong><br />
              <span className="text-slate-300">I consent to the processing of my health information in accordance with HIPAA regulations and our privacy policy.</span>
            </span>
          </label>

          <label className="flex items-start p-4 rounded-lg border border-slate-700 cursor-pointer bg-slate-900/50 hover:bg-slate-700/50 transition-colors has-[:checked]:bg-sky-900/50 has-[:checked]:border-sky-500">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
              checked={ageVerification}
              onChange={() => setAgeVerification(!ageVerification)}
            />
            <span className="ml-3 text-sm">
              <strong className="font-semibold text-slate-100">Age Verification</strong><br />
              <span className="text-slate-300">I confirm that I am over 18 years of age or have parental consent to use this service.</span>
            </span>
          </label>
        </div>
        
        <button
          onClick={onConsent}
          disabled={!allConsented}
          className="w-full mt-4 py-3 px-4 rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:bg-none disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          Agree & Continue
        </button>
      </div>
    </div>
  );
};

export default ConsentScreen;