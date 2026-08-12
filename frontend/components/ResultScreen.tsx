'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Info, Pill, Clock, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MedicineResult } from '@/types/medicine';
import { speakText, stopSpeech } from '@/lib/speech';

interface ResultScreenProps {
  result: MedicineResult;
  onScanAnother: () => void;
  language?: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onScanAnother, language = 'English' }) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const getSpeechString = () =>
    `${result.medicineName}. ${result.strength ? result.strength + '.' : ''} Purpose: ${result.purpose}. Dosage: ${result.dosageNote}. Disclaimer: ${result.disclaimer}`;

  const handleSpeak = () => {
    setIsSpeaking(true);
    setSpeechError(null);
    try {
      speakText(
        getSpeechString(),
        language,
        () => setIsSpeaking(false),
        (error: unknown) => {
          setIsSpeaking(false);
          const msg = error instanceof SpeechSynthesisErrorEvent ? error.error : typeof error === "string" ? error : null;
          setSpeechError(msg || 'Unable to read text aloud. Speech synthesis may not be supported.');
        }
      );
    } catch (err: any) {
      setIsSpeaking(false);
      setSpeechError('Speech synthesis failed. Please check your browser settings.');
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  useEffect(() => {
    handleSpeak();
    return () => { stopSpeech(); };
  }, [result]);

  const handleScanAnotherClick = () => {
    stopSpeech();
    onScanAnother();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-8 animate-slide-up">

      {/* ── Medicine Identity Card ── */}
      <div className="card border-l-4 border-l-accent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              Medicine identified
            </div>
            <h1 className="font-serif text-heading-1 text-ink mb-1 break-words">
              {result.medicineName}
            </h1>
            {result.strength && (
              <p className="text-lg text-ink-secondary font-medium">{result.strength}</p>
            )}
            {result.activeIngredient && (
              <p className="text-sm text-ink-muted mt-1">
                Active ingredient: <span className="text-ink-secondary font-medium">{result.activeIngredient}</span>
              </p>
            )}
          </div>
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-accent-light flex items-center justify-center">
            <Pill className="w-7 h-7 text-accent" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isSpeaking ? (
          <button
            type="button"
            onClick={handleSpeak}
            className="btn-primary flex-1"
            aria-label="Read medicine details aloud"
          >
            <Volume2 className="w-5 h-5" aria-hidden="true" />
            Read Aloud
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[52px] bg-ink text-white font-semibold text-base rounded-btn px-6 py-3 transition-all hover:bg-ink-secondary"
            aria-label="Stop speech playback"
          >
            <VolumeX className="w-5 h-5" aria-hidden="true" />
            Stop Reading
          </button>
        )}
        <button
          type="button"
          onClick={handleScanAnotherClick}
          className="btn-secondary flex-1 sm:flex-initial"
          aria-label="Scan another medicine"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          New Scan
        </button>
      </div>

      {/* ── Speech Error ── */}
      {speechError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-800 leading-relaxed">{speechError}</p>
        </div>
      )}

      {/* ── Info Sections ── */}
      <div className="space-y-4">

        {/* Purpose */}
        <section className="card group hover:shadow-card-hover transition-shadow duration-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Info className="w-5 h-5 text-accent" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-heading-3 text-ink mb-2">What it's for</h2>
              <p className="text-body-lg text-ink-secondary leading-relaxed">{result.purpose}</p>
            </div>
          </div>
        </section>

        {/* Dosage */}
        <section className="card group hover:shadow-card-hover transition-shadow duration-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Clock className="w-5 h-5 text-accent" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-heading-3 text-ink mb-2">General usage</h2>
              <p className="text-body-lg text-ink-secondary leading-relaxed">{result.dosageNote}</p>
            </div>
          </div>
        </section>

        {/* Precautions */}
        <section className="card group hover:shadow-card-hover transition-shadow duration-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="w-5 h-5 text-amber-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-heading-3 text-ink mb-3">Important precautions</h2>
              <ul className="space-y-2.5">
                {result.precautions.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-body-lg text-ink-secondary animate-step-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-5 bg-accent-light border border-accent-muted rounded-xl">
          <Pill className="w-4 h-4 text-accent flex-shrink-0 mt-1" aria-hidden="true" />
          <p className="text-sm text-ink-secondary leading-relaxed">{result.disclaimer}</p>
        </section>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="pt-2 pb-4">
        <button
          type="button"
          onClick={handleScanAnotherClick}
          className="btn-primary w-full"
          aria-label="Scan another medicine"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Scan Another Medicine
        </button>
      </div>
    </div>
  );
};
export default ResultScreen;
