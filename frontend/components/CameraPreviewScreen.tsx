'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { stopCameraStream } from '@/lib/cameraCapture';

interface CameraPreviewScreenProps {
  onCapture: (imageBase64: string) => void;
  onCancel: () => void;
  onError: (msg: string) => void;
}

export const CameraPreviewScreen: React.FC<CameraPreviewScreenProps> = ({
  onCapture,
  onCancel,
  onError,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading]           = useState(true);
  const [cameraError, setCameraError]       = useState('');

  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const t = setTimeout(initializeCamera, 100);
    return () => {
      clearTimeout(t);
      if (streamRef.current) stopCameraStream(streamRef.current);
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera not supported');

      const stream = await navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .catch(() => navigator.mediaDevices.getUserMedia({ video: true }));

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsCameraActive(true);
            setIsLoading(false);
          } catch (e: any) {
            if (e.name !== 'AbortError') throw e;
            setTimeout(async () => {
              await videoRef.current?.play();
              setIsCameraActive(true);
              setIsLoading(false);
            }, 100);
          }
        };
      }
    } catch (error: any) {
      const msg = error.name === 'NotAllowedError'
        ? 'Camera permission was denied. Please allow camera access in your browser settings.'
        : 'Failed to start camera. Please try uploading an image instead.';
      setCameraError(msg);
      onError(msg);
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const image = canvas.toDataURL('image/jpeg', 0.85);
    if (streamRef.current) stopCameraStream(streamRef.current);
    onCapture(image);
  };

  const handleCancel = () => {
    if (streamRef.current) stopCameraStream(streamRef.current);
    onCancel();
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 animate-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-heading-2 text-ink">Camera</h2>
          <p className="text-sm text-ink-secondary mt-0.5">Position the medicine label clearly in frame</p>
        </div>
        <button
          onClick={handleCancel}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white hover:bg-[#F5F2EE] hover:border-accent-muted transition-all"
          aria-label="Close camera"
        >
          <X className="w-5 h-5 text-ink-secondary" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative w-full aspect-video bg-ink rounded-xl overflow-hidden border border-border shadow-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Corner guides */}
        {isCameraActive && !isLoading && !cameraError && (
          <>
            <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/70 rounded-tl-md" />
            <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/70 rounded-tr-md" />
            <span className="absolute bottom-20 left-3 w-6 h-6 border-b-2 border-l-2 border-white/70 rounded-bl-md" />
            <span className="absolute bottom-20 right-3 w-6 h-6 border-b-2 border-r-2 border-white/70 rounded-br-md" />
          </>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-ink/90 flex flex-col items-center justify-center text-white gap-4 z-20">
            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-sm font-medium">Starting camera…</p>
          </div>
        )}

        {/* Error overlay */}
        {cameraError && (
          <div className="absolute inset-0 bg-[#FAF9F7] flex flex-col items-center justify-center gap-4 z-20 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-xs">{cameraError}</p>
            <button
              onClick={initializeCamera}
              className="btn-primary text-sm px-5 min-h-[40px]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Capture button */}
        {!isLoading && !cameraError && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-5 pt-3 bg-gradient-to-t from-black/60 to-transparent z-10">
            <button
              onClick={handleCapture}
              disabled={!isCameraActive}
              className="w-16 h-16 rounded-full bg-white border-4 border-accent flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shadow-lg"
              aria-label="Capture photo"
            >
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Tips strip */}
      <div className="mt-4 flex items-center gap-3 bg-accent-light border border-accent-muted rounded-xl p-4">
        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-ink-secondary">
          <span className="font-medium text-ink">Tips: </span>
          Good lighting · Steady hand · Label text clearly visible
        </p>
      </div>
    </div>
  );
};
export default CameraPreviewScreen;
