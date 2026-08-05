'use client';

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Camera, Upload, CheckCircle2, RefreshCw, Smartphone, Computer, Webcam, FileImage } from 'lucide-react';
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
  const [cameraStatus, setCameraStatus] = useState<string>('Checking camera...');
  const [captureMode, setCaptureMode] = useState<'webcam' | 'upload' | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect device and camera capabilities on client side
    setIsMobile(isLikelyMobile());
    setCameraInstruction(getCameraInstruction());
    
    // Check camera permissions
    checkCameraPermissions().then(({ supported, permissionGranted, message }) => {
      if (supported) {
        setCameraStatus(permissionGranted ? 'Camera ready' : message || 'Camera available');
      } else {
        setCameraStatus(message || 'Camera not supported');
      }
    });
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      onError('File is too large. Please select an image smaller than 10MB.');
      return;
    }

    // Validate file type
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

  const handleCancelCamera = () => {
    setScreenMode('selection');
  };

  const handleResetPhoto = () => {
    setSelectedImage(null);
    setFileName('');
    setCaptureMode(null);
    setScreenMode('selection');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartWebcam = () => {
    if (isMobile) {
      // On mobile, use the file input with capture attribute
      fileInputRef.current?.click();
    } else {
      // On desktop, open camera preview screen
      setScreenMode('camera-preview');
    }
  };

  // Render different screens based on mode
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
    <div className="w-full max-w-4xl mx-auto py-12">
      {/* Header Section */}
      <div className="max-w-2xl mb-12">
        <h1 className="font-serif text-heading-1 text-slate-900 mb-4">
          Identify Your Medicine
        </h1>
        <p className="text-body-lg text-slate-600 leading-relaxed">
          Take a clear photo of your medicine packaging or upload an existing image. We'll identify it and provide essential information in plain language.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-primary-600"></span>
          <span>For informational use only — not a substitute for professional medical advice</span>
        </div>
      </div>

            {screenMode === 'preview' && selectedImage ? (
        /* Image Preview & Confirm Controls */
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {captureMode === 'webcam' ? (
                  <Webcam className="w-4 h-4" />
                ) : (
                  <FileImage className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {captureMode === 'webcam' ? 'Webcam capture' : 'Uploaded image'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetPhoto}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-600 rounded-lg transition-colors min-h-[44px]"
                aria-label="Change photo"
              >
                <RefreshCw className="w-4 h-4" />
                Change
              </button>
            </div>
            
            <img
              src={selectedImage}
              alt="Preview of captured medicine label"
              className="w-full max-h-96 object-contain rounded-lg bg-slate-50"
            />
          </div>

          {/* Action Confirm Button */}
          <button
            type="button"
            onClick={() => selectedImage && onConfirm(selectedImage)}
            className="w-full min-h-[56px] bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            aria-label="Identify medicine from captured image"
          >
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            Identify This Medicine
          </button>
        </div>
            ) : (
        /* Capture Mode Selection */
        <div className="space-y-6">
          {/* Primary Capture Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Button */}
            <button
              type="button"
              onClick={handleStartWebcam}
              className="group relative flex flex-col items-start justify-between w-full min-h-[240px] p-8 bg-white border-2 border-slate-200 hover:border-primary-600 rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              aria-label={isMobile ? 'Open camera' : 'Open webcam preview'}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-50 mb-4">
                    {isMobile ? (
                      <Camera className="w-6 h-6 text-primary-600" aria-hidden="true" />
                    ) : (
                      <Webcam className="w-6 h-6 text-primary-600" aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-2">
                    {isMobile ? 'Take Photo' : 'Use Webcam'}
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {isMobile ? 'Open your camera to capture the medicine label' : 'Use your device webcam to capture'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:gap-3 transition-all">
                <span>Continue</span>
                <span aria-hidden="true">→</span>
              </div>
            </button>

            {/* File Upload Button */}
            <label
              htmlFor="file-input"
              className="group relative flex flex-col items-start justify-between w-full min-h-[240px] p-8 bg-white border-2 border-slate-200 hover:border-primary-600 rounded-lg cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-50 mb-4">
                    <Upload className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-2">
                    Upload Image
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Choose an existing photo from your device
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:gap-3 transition-all">
                <span>Select file</span>
                <span aria-hidden="true">→</span>
              </div>
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload medicine image"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
export default CaptureScreen;
