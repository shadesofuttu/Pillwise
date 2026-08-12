'use client';

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Camera, Upload, CheckCircle2, RefreshCw, Webcam, FileImage, ImageIcon, Lightbulb } from 'lucide-react';
import { imageToBase64 } from '@/lib/imageToBase64';
import { isLikelyMobile, getCameraInstruction } from '@/lib/deviceDetection';
import { checkCameraPermissions } from '@/lib/cameraCapture';
import CameraPreviewScreen from './CameraPreviewScreen';

interface CaptureScreenProps {
  onConfirm: (base64Image: string) => void;
  onError: (msg: string) => void;
}

type ScreenMode = 'selection' | 'camera-preview' | 'preview';

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onConfirm, onError }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [screenMode, setScreenMode] = useState<ScreenMode>('selection');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [cameraInstruction, setCameraInstruction] = useState<string>('');
  const [captureMode, setCaptureMode] = useState<'webcam' | 'upload' | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobile(isLikelyMobile());
    setCameraInstruction(getCameraInstruction());
    checkCameraPermissions();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      onError('File is too large. Please select an image smaller than 10MB.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      onError('Invalid file type. Please select a JPEG, PNG, or WebP image.');
      return;
    }

    try {
      setIsUploading(true);
      setFileName(file.name);
      const base64 = await imageToBase64(file);
      setSelectedImage(base64);
      setCaptureMode('upload');
      setScreenMode('preview');
    } catch (err) {
      console.error('File processing error:', err);
      onError('Unable to process the selected photo. The file might be corrupted or unsupported.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = (imageBase64: string) => {
    setSelectedImage(imageBase64);
    setFileName('Webcam Capture');
    setCaptureMode('webcam');
    setScreenMode('preview');
  };

  const handleCancelCamera = () => setScreenMode('selection');

  const handleResetPhoto = () => {
    setSelectedImage(null);
    setFileName('');
    setCaptureMode(null);
    setScreenMode('selection');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartWebcam = () => {
    if (isMobile) {
      fileInputRef.current?.click();
    } else {
      setScreenMode('camera-preview');
    }
  };

  if (screenMode === 'camera-preview') {
    return (
      <CameraPreviewScreen
        onCapture={handleCameraCapture}
        onCancel={handleCancelCamera}
        onError={(msg) => {
          onError(msg);
          setScreenMode('selection');
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in">

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-accent-light border border-accent-muted text-accent text-sm font-medium px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          AI-powered identification
        </div>
        <h1 className="font-serif text-heading-1 text-ink mb-3">
          Identify Your Medicine
        </h1>
        <p className="text-body-lg text-ink-secondary leading-relaxed max-w-xl">
          Take or upload a clear photo of your medicine label. We'll identify it and explain what you need to know — in plain language.
        </p>
      </div>

      {screenMode === 'preview' && selectedImage ? (
        /* ── Preview State ── */
        <div className="space-y-5 animate-slide-up">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-ink-secondary font-medium">
                {captureMode === 'webcam' ? (
                  <Webcam className="w-4 h-4 text-accent" />
                ) : (
                  <FileImage className="w-4 h-4 text-accent" />
                )}
                <span>{captureMode === 'webcam' ? 'Webcam capture' : fileName || 'Uploaded image'}</span>
              </div>
              <button
                type="button"
                onClick={handleResetPhoto}
                className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink font-medium py-1.5 px-3 rounded-md border border-border hover:border-accent-muted hover:bg-accent-light transition-all min-h-[36px]"
                aria-label="Change photo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change
              </button>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-[#F5F2EE]">
              <img
                src={selectedImage}
                alt="Preview of captured medicine label"
                className="w-full max-h-[420px] object-contain"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-ink px-2.5 py-1 rounded-full border border-border shadow-sm">
                Ready to identify
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => selectedImage && onConfirm(selectedImage)}
            className="btn-primary w-full text-lg"
            aria-label="Identify medicine from captured image"
          >
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            Identify This Medicine
          </button>

          <p className="text-center text-caption text-ink-muted">
            Make sure the label text is clearly visible and well-lit
          </p>
        </div>

      ) : (
        /* ── Selection State ── */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Camera Card */}
            <button
              type="button"
              onClick={handleStartWebcam}
              className="group flex flex-col items-start w-full p-6 bg-white border-2 border-border hover:border-accent rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-left"
              aria-label={isMobile ? 'Open camera' : 'Open webcam preview'}
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                <Camera className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink mb-1.5">
                {isMobile ? 'Take a Photo' : 'Use Webcam'}
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-5">
                {isMobile
                  ? 'Open your camera and point it at the medicine label'
                  : 'Use your webcam to capture the medicine label live'}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:gap-3 transition-all duration-200">
                <span>Open camera</span>
                <span aria-hidden="true">→</span>
              </div>
            </button>

            {/* Upload Card */}
            <label
              htmlFor="file-input"
              className="group flex flex-col items-start w-full p-6 bg-white border-2 border-border hover:border-accent rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-accent" aria-hidden="true" />
                )}
              </div>
              <h2 className="font-serif text-xl font-semibold text-ink mb-1.5">
                Upload Image
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-5">
                Choose an existing photo from your device gallery or file system
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:gap-3 transition-all duration-200">
                <span>Select file</span>
                <span aria-hidden="true">→</span>
              </div>
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload medicine image"
              />
            </label>
          </div>

          {/* Tips strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-accent-light border border-accent-muted rounded-xl p-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-accent-muted flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-accent" aria-hidden="true" />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-secondary">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent inline-block" />Good lighting</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent inline-block" />Label fully in frame</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent inline-block" />Text in focus, not blurry</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent inline-block" />Avoid glare or shadows</span>
            </div>
          </div>

          {/* Formats note */}
          <p className="text-center text-caption text-ink-muted">
            Supports JPEG, PNG, WebP · Max 10 MB
          </p>
        </div>
      )}
    </div>
  );
};
export default CaptureScreen;
