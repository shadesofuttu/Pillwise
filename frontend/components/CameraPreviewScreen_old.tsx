'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Circle, CheckCircle2, AlertCircle } from 'lucide-react';
import { startCameraPreview, capturePhotoFromVideo, stopCameraStream } from '@/lib/cameraCapture';

interface CameraPreviewScreenProps {
  onCapture: (imageBase64: string) => void;
  onCancel: () => void;
  onError: (msg: string) => void;
}

export const CameraPreviewScreen: React.FC<CameraPreviewScreenProps> = ({ 
  onCapture, 
  onCancel, 
  onError 
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeCamera();

    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      
      console.log('[CAMERA] Step 1: Requesting camera access...');
      
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Get camera stream with fallback constraints
      let stream: MediaStream;
      try {
        console.log('[CAMERA] Step 2: Trying with environment camera...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (err) {
        console.log('[CAMERA] Step 2b: Environment camera failed, trying default camera...');
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }
      
      console.log('[CAMERA] Step 3: Camera stream obtained successfully');
      streamRef.current = stream;
      
      // Wait for video element to be ready in the DOM
      let attempts = 0;
      while (!videoRef.current && attempts < 10) {
        console.log('[CAMERA] Step 4: Waiting for video element... attempt', attempts + 1);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!videoRef.current) {
        throw new Error('Video element not available after waiting');
      }
      
      console.log('[CAMERA] Step 5: Video element ready, setting source...');
      videoRef.current.srcObject = stream;
      
      // Force immediate play attempt
      console.log('[CAMERA] Step 6: Attempting to play video...');
      try {
        await videoRef.current.play();
        console.log('[CAMERA] Step 7: Video playing successfully!');
        setIsCameraActive(true);
        setIsLoading(false);
      } catch (playError) {
        console.log('[CAMERA] Step 7: Play failed, waiting for loadedmetadata event...');
        // If immediate play fails, wait for loadedmetadata
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject(new Error('Video element lost'));
          
          const timeoutId = setTimeout(() => {
            reject(new Error('Camera initialization timeout after 15 seconds'));
          }, 15000);
          
          videoRef.current.onloadedmetadata = async () => {
            console.log('[CAMERA] Step 8: Metadata loaded, playing...');
            try {
              await videoRef.current?.play();
              console.log('[CAMERA] Step 9: Video playing after metadata!');
              clearTimeout(timeoutId);
              setIsCameraActive(true);
              setIsLoading(false);
              resolve();
            } catch (err) {
              clearTimeout(timeoutId);
              reject(err);
            }
          };
          
          videoRef.current.onerror = (err) => {
            console.error('[CAMERA] Video element error:', err);
            clearTimeout(timeoutId);
            reject(new Error('Video element error'));
          };
        });
      }
      
    } catch (error: any) {
      console.error('[CAMERA] ERROR:', error);
      const errorMsg = error.name === 'NotAllowedError' 
        ? 'Camera permission denied. Please allow camera access and try again.'
        : error.name === 'NotFoundError'
        ? 'No camera found. Please connect a camera and try again.'
        : error.name === 'NotReadableError'
        ? 'Camera is already in use by another application.'
        : error.message || 'Failed to initialize camera';
      
      setCameraError(errorMsg);
      onError(errorMsg);
      setIsLoading(false);
      
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        streamRef.current = null;
      }
    }
  };

  const capturePhotoFromVideo = (video: HTMLVideoElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas not available');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !streamRef.current) {
      onError('Camera not ready');
      return;
    }

    console.log('Capturing photo...');
    
    try {
      const base64Image = capturePhotoFromVideo(videoRef.current);
      console.log('Photo captured');
      
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        streamRef.current = null;
      }
      
      onCapture(base64Image);
    } catch (error: any) {
      console.error('Capture error:', error);
      onError('Failed to capture: ' + error.message);
    }
  };

  const handleCancel = () => {
    // Stop camera stream
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
    onCancel();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6 text-center px-4 py-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Camera Preview
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          className="text-slate-600 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera Preview Area */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
            <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
            <p className="text-xl font-medium">Starting camera...</p>
            <p className="text-sm text-slate-400 mt-2">Please allow camera access</p>
          </div>
        ) : cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-red-700 text-lg font-medium">{cameraError}</p>
            <button
              type="button"
              onClick={initializeCamera}
              className="mt-4 px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/60 to-transparent">
              {/* Countdown Animation */}
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-white text-8xl font-black animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}
              
              {/* Camera Controls */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-full">
                  Position medicine label within frame
                </div>
                
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={countdown > 0 || !isCameraActive}
                  className="relative w-24 h-24 bg-white/90 hover:bg-white border-4 border-sky-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="Capture photo"
                >
                  <div className="w-20 h-20 bg-sky-600 rounded-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Outer ring animation when active */}
                  {isCameraActive && countdown === 0 && (
                    <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping" />
                  )}
                </button>
                
                <div className="text-white/90 text-base font-medium">
                  {isCameraActive ? 'Tap button to capture' : 'Initializing...'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-sky-900 text-base font-medium max-w-md">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
          <div className="text-left space-y-1">
            <p className="font-bold">Capture Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure good lighting</li>
              <li>Keep medicine label steady</li>
              <li>Position text clearly in frame</li>
              <li>Capture high-resolution image</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CameraPreviewScreen;