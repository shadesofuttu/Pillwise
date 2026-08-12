'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppState, MedicineResult } from '@/types/medicine';
import { identifyMedicine, explainMedicine } from '@/lib/api';
import CaptureScreen from '@/components/CaptureScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ResultScreen from '@/components/ResultScreen';
import { Pill, AlertCircle, Globe, RotateCcw } from 'lucide-react';

export default function Home() {
  const [appState, setAppState]           = useState<AppState>('capture');
  const [medicineResult, setMedicineResult] = useState<MedicineResult | null>(null);
  const [errorMessage, setErrorMessage]   = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [successAnnouncement, setSuccessAnnouncement] = useState<string>('');
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appState === 'results' && medicineResult) {
      const msg = `Medicine identified: ${medicineResult.medicineName}${medicineResult.strength ? ', ' + medicineResult.strength : ''}`;
      setSuccessAnnouncement(msg);
      if (announcementRef.current) announcementRef.current.textContent = msg;
    }
  }, [appState, medicineResult]);

  const handleConfirmCapture = async (base64Image: string) => {
    setErrorMessage(null);
    setSuccessAnnouncement('');
    setAppState('loading');

    try {
      const identified = await identifyMedicine(base64Image);
      const explained  = await explainMedicine(identified, selectedLanguage);

      const combinedResult: MedicineResult = {
        medicineName:    identified.medicineName,
        strength:        identified.strength,
        activeIngredient: identified.activeIngredient,
        purpose:         explained.purpose,
        dosageNote:      explained.dosageNote,
        precautions:     explained.precautions,
        disclaimer:      explained.disclaimer,
      };

      setMedicineResult(combinedResult);
      setAppState('results');
    } catch (err: any) {
      console.error('Error during identification pipeline:', err);
      let errorMsg = 'We could not read the medicine label. Please ensure the label is clear and well lit.';
      if (err.message?.includes('Failed to identify')) {
        errorMsg = 'Unable to identify medicine. The image might be unclear or the medicine label is not recognized.';
      } else if (err.message?.includes('Failed to explain')) {
        errorMsg = 'Medicine identified but unable to fetch detailed information. Please try again.';
      } else if (err.message?.includes('NetworkError') || err.message?.includes('fetch')) {
        errorMsg = 'Connection error. Please check your internet connection and try again.';
      }
      setErrorMessage(errorMsg);
      setAppState('capture');
    }
  };

  const handleResetToCapture = () => {
    setErrorMessage(null);
    setMedicineResult(null);
    setAppState('capture');
  };

  const handleCaptureError = (msg: string) => setErrorMessage(msg);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F7' }}>

      {/* ── Header ── */}
      <header className="w-full bg-[#FAF9F7]/95 backdrop-blur-sm border-b border-border py-3.5 px-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={handleResetToCapture}
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg transition-all"
            aria-label="PillWise home"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-serif text-xl font-semibold text-ink tracking-tight">
              pillwise
            </span>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center">
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" aria-hidden="true" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-white border border-border text-ink text-sm py-2 pl-8 pr-7 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[40px] cursor-pointer hover:border-accent-muted"
                aria-label="Select language"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Arabic">العربية</option>
                <option value="Chinese">中文</option>
                <option value="Japanese">日本語</option>
                <option value="Portuguese">Português</option>
                <option value="Russian">Русский</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted text-xs">▾</span>
            </div>

            {appState !== 'capture' && (
              <button
                onClick={handleResetToCapture}
                className="btn-secondary text-sm min-h-[40px] px-3 gap-1.5"
                aria-label="New scan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Scan</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4">
        <div className="w-full max-w-5xl">

          {/* sr-only announcements */}
          <div
            ref={announcementRef}
            role="status"
            aria-live="assertive"
            aria-atomic="true"
            className="sr-only"
          >
            {successAnnouncement}
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-amber-900 mb-0.5">Unable to Read Label</h2>
                <p className="text-sm text-amber-800 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* State router */}
          {appState === 'capture' && (
            <CaptureScreen onConfirm={handleConfirmCapture} onError={handleCaptureError} />
          )}
          {appState === 'loading' && <LoadingScreen />}
          {appState === 'results' && medicineResult && (
            <ResultScreen
              result={medicineResult}
              onScanAnother={handleResetToCapture}
              language={selectedLanguage}
            />
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink-muted">
            <Pill className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-sm font-medium">PillWise</span>
          </div>
          <p className="text-xs text-ink-muted text-center sm:text-right max-w-sm">
            For informational purposes only. Not medical advice. Always consult a healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
