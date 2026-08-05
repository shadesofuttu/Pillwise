'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { stopCameraStream } from '@/lib/cameraCapture';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      initializeCamera();
    }, 100);

    return () => {
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      
      console.log('[CAMERA] Initializing...');
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported');
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      }).catch(() => 
        navigator.mediaDevices.getUserMedia({ video: true })
      );
      
      console.log('[CAMERA] Stream obtained');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load metadata before playing
        videoRef.current.onloadedmetadata = async () => {
          try {
            if (videoRef.current) {
              await videoRef.current.play();
              console.log('[CAMERA] Video playing!');
              setIsCameraActive(true);
              setIsLoading(false);
            }
          } catch (playError: any) {
            if (playError.name !== 'AbortError') {
              console.error('[CAMERA] Play error:', playError);
              throw playError;
            }
            // Ignore AbortError, retry play
            console.log('[CAMERA] Play interrupted, retrying...');
            setTimeout(async () => {
              try {
                await videoRef.current?.play();
                setIsCameraActive(true);
                setIsLoading(false);
              } catch (e) {
                console.error('[CAMERA] Retry failed:', e);
              }
            }, 100);
          }
        };
      }
      
    } catch (error: any) {
      console.error('[CAMERA] Error:', error);
      const msg = error.name === 'NotAllowedError' 
        ? 'Camera permission denied'
        : 'Failed to start camera';
      setCameraError(msg);
      onError(msg);
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const image = canvas.toDataURL('image/jpeg', 0.8);
    
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
    }
    
    onCapture(image);
  };

  const handleCancel = () => {
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
    }
    onCancel();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6 px-4 py-6">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl font-bold">Camera Preview</h2>
        <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
        {/* Video - Always in DOM */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-20">
            <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
            <p className="text-xl">Starting camera...</p>
          </div>
        )}
        
        {/* Error Overlay */}
        {cameraError && (
          <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center z-20">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-red-700 mb-4">{cameraError}</p>
            <button onClick={initializeCamera} className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl">
              Try Again
            </button>
          </div>
        )}
        
        {/* Capture Button */}
        {!isLoading && !cameraError && (
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-4 z-10">
            <div className="bg-black/50 text-white px-4 py-2 rounded-full">
              Position medicine label in frame
            </div>
            <button
              onClick={handleCapture}
              disabled={!isCameraActive}
              className="w-20 h-20 bg-white border-4 border-sky-500 rounded-full flex items-center justify-center hover:scale-110 transition disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4">
        <CheckCircle2 className="w-5 h-5 text-sky-600 inline mr-2" />
        <span className="font-bold">Tips:</span> Good lighting, steady hand, clear text
      </div>
    </div>
  );
};
export default CameraPreviewScreen;