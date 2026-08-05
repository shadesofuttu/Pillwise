'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppState, MedicineResult } from '@/types/medicine';
import { identifyMedicine, explainMedicine } from '@/lib/api';
import CaptureScreen from '@/components/CaptureScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ResultScreen from '@/components/ResultScreen';
import { Pill, AlertCircle, Languages, RotateCcw, Github, Linkedin } from 'lucide-react';

export default function Home() {
    const [appState, setAppState] = useState<AppState>('capture');
  const [medicineResult, setMedicineResult] = useState<MedicineResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successAnnouncement, setSuccessAnnouncement] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const announcementRef = useRef<HTMLDivElement>(null);

  // Announce results to screen readers when they load
  useEffect(() => {
    if (appState === 'results' && medicineResult) {
      const announcement = `Medicine identified successfully. ${medicineResult.medicineName} ${medicineResult.strength ? medicineResult.strength + '.' : ''}`;
      setSuccessAnnouncement(announcement);
      
      // Trigger screen reader announcement
      if (announcementRef.current) {
        announcementRef.current.textContent = announcement;
      }
    }
  }, [appState, medicineResult]);

  const handleConfirmCapture = async (base64Image: string) => {
    setErrorMessage(null);
    setSuccessAnnouncement('');
    setAppState('loading');

    try {
      // Step 1: POST image to /api/identify
      const identified = await identifyMedicine(base64Image);

      // Step 2: Immediately POST identified result to /api/explain
      const explained = await explainMedicine(identified, selectedLanguage);

      // Combine both results
      const combinedResult: MedicineResult = {
        medicineName: identified.medicineName,
        strength: identified.strength,
        activeIngredient: identified.activeIngredient,
        purpose: explained.purpose,
        dosageNote: explained.dosageNote,
        precautions: explained.precautions,
        disclaimer: explained.disclaimer,
      };

      setMedicineResult(combinedResult);
      setAppState('results');
    } catch (err: any) {
      console.error('Error during identification pipeline:', err);
      
      // Provide more specific error messages based on error type
      let errorMsg = 'We could not read the medicine label. Please ensure the label is clear and well lit.';
      
      if (err.message.includes('Failed to identify')) {
        errorMsg = 'Unable to identify medicine. The image might be unclear or the medicine label is not recognized.';
      } else if (err.message.includes('Failed to explain')) {
        errorMsg = 'Medicine identified but unable to fetch detailed information. Please try again.';
      } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
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

  const handleCaptureError = (msg: string) => {
    setErrorMessage(msg);
  };

    return (
      <div className="min-h-screen flex flex-col" style={{backgroundColor: '#FAF9F7'}}>
        {/* Header */}
        <header className="w-full bg-[#FAF9F7] border-b border-[#E8E4DE] py-4 px-6 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={handleResetToCapture}
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent rounded-md transition-all"
              aria-label="PillWise home"
            >
              <Pill className="w-5 h-5 text-accent" aria-hidden="true" />
              <span className="font-serif text-xl font-semibold text-ink tracking-tight">
                pillwise
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" aria-hidden="true" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-white border border-[#E8E4DE] text-ink text-sm py-2 pl-9 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[44px] cursor-pointer hover:border-ink-muted"
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
              </div>
              {appState !== 'capture' && (
                <button
                  onClick={handleResetToCapture}
                  className="inline-flex items-center gap-2 text-ink-secondary hover:text-ink font-medium py-2 px-4 rounded-md transition-colors border border-[#E8E4DE] bg-white hover:bg-[#F5F2EE] min-h-[44px] text-sm"
                  aria-label="New scan"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">New Scan</span>
                </button>
              )}
            </div>
          </div>
        </header>

            {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-6xl">
          {/* Hidden screen reader announcements */}
          <div 
            ref={announcementRef}
            role="status" 
            aria-live="assertive" 
            aria-atomic="true"
            className="sr-only"
          >
            {successAnnouncement}
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-400 text-slate-800 flex items-start gap-4 animate-fade-in"
            >
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Unable to Read Label
                </h2>
                <p className="text-base leading-relaxed text-slate-700">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Single Page State Router */}
          {appState === 'capture' && (
            <CaptureScreen
              onConfirm={handleConfirmCapture}
              onError={handleCaptureError}
            />
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

            {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Pill className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium">PillWise</span>
            </div>
            <p className="text-sm text-slate-500 text-center sm:text-right">
              For informational purposes only. Not medical advice. Always consult a healthcare professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
