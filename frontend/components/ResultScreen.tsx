'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Info, Pill, Clock, ShieldAlert, AlertCircle } from 'lucide-react';
import { MedicineResult } from '@/types/medicine';
import { speakText, stopSpeech } from '@/lib/speech';

interface ResultScreenProps {
  result: MedicineResult;
  onScanAnother: () => void;
  language?: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onScanAnother, language = 'English' }) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const getSpeechString = () => {
    return `${result.medicineName}. ${result.strength ? result.strength + '.' : ''} Purpose: ${result.purpose}. Dosage: ${result.dosageNote}. Disclaimer: ${result.disclaimer}`;
  };

    const [speechError, setSpeechError] = useState<string | null>(null);

  const handleSpeak = () => {
    setIsSpeaking(true);
    setSpeechError(null);
    const speechText = getSpeechString();
    
    try {
      speakText(
        speechText,
        language,
        () => setIsSpeaking(false),
        (error: string) => {
          setIsSpeaking(false);
          setSpeechError(error || 'Unable to read text aloud. Speech synthesis may not be supported.');
        }
      );
    } catch (err: any) {
      setIsSpeaking(false);
      setSpeechError('Speech synthesis failed. Please check your browser settings.');
      console.error('Speech error:', err);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  // Automatically read aloud on mount
  useEffect(() => {
    handleSpeak();

    return () => {
      stopSpeech();
    };
  }, [result]);

  const handleScanAnotherClick = () => {
    stopSpeech();
    onScanAnother();
  };

    return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8 animate-slide-up">
      {/* Medicine Name Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium mb-3">
              <div className="w-2 h-2 rounded-full bg-primary-600"></div>
              <span>Medicine identified</span>
            </div>
            <h1 className="font-serif text-heading-1 text-slate-900 mb-2">
              {result.medicineName}
            </h1>
            {result.strength && (
              <p className="text-xl text-slate-600 font-medium">
                {result.strength}
              </p>
            )}
            {result.activeIngredient && (
              <p className="text-base text-slate-500 mt-2">
                Active ingredient: {result.activeIngredient}
              </p>
            )}
          </div>
        </div>
      </header>

            {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isSpeaking ? (
          <button
            type="button"
            onClick={handleSpeak}
            className="flex-1 min-h-[56px] bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            aria-label="Read medicine details aloud"
          >
            <Volume2 className="w-5 h-5" aria-hidden="true" />
            <span>Read Aloud</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="flex-1 min-h-[56px] bg-slate-600 hover:bg-slate-700 active:bg-slate-800 text-white text-lg font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
            aria-label="Stop speech playback"
          >
            <VolumeX className="w-5 h-5" aria-hidden="true" />
            <span>Stop Reading</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleScanAnotherClick}
          className="flex-1 sm:flex-initial min-h-[56px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-semibold rounded-lg border border-slate-200 transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
          aria-label="Scan another medicine"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          <span>New Scan</span>
        </button>
      </div>

            {/* Speech Error Display */}
      {speechError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-400 text-slate-800 flex items-start gap-4 animate-fade-in"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-base leading-relaxed text-slate-700">
              {speechError}
            </p>
          </div>
        </div>
      )}

      {/* Main Medicine Information */}
      <main className="space-y-6">
        {/* Purpose Section */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-heading-3 text-slate-900 mb-3">What it's for</h2>
              <p className="text-body-lg text-slate-700 leading-relaxed">{result.purpose}</p>
            </div>
          </div>
        </section>

        {/* Dosage Section */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-heading-3 text-slate-900 mb-3">General usage</h2>
              <p className="text-body-lg text-slate-700 leading-relaxed">{result.dosageNote}</p>
            </div>
          </div>
        </section>

        {/* Precautions Section */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-heading-3 text-slate-900 mb-4">Important precautions</h2>
              <ul className="space-y-3">
                {result.precautions.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-body-lg text-slate-700">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2.5" aria-hidden="true" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Pill className="w-5 h-5 text-primary-600 mt-0.5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-base text-slate-700 leading-relaxed font-medium">{result.disclaimer}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ResultScreen;
