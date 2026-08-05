/**
 * Camera capture utility for desktop webcam access
 */

type CameraCaptureResult = {
  success: boolean;
  imageBase64?: string;
  error?: string;
};

/**
 * Start camera stream for preview (returns video element and stream)
 */
export async function startCameraPreview(): Promise<{
  video: HTMLVideoElement;
  stream: MediaStream;
  error?: string;
}> {
  try {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      throw new Error('Browser does not support camera access');
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported in this browser');
    }

    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Prefer rear camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    // Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    
    // Wait for video to be ready
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve(true);
      };
    });

    return { video, stream };
    
  } catch (error: any) {
    console.error('Camera start error:', error);
    return {
      video: document.createElement('video'),
      stream: new MediaStream(),
      error: error.message || 'Unable to access camera. Please check permissions.'
    };
  }
}

/**
 * Capture photo from video stream
 */
export function capturePhotoFromVideo(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas context not available');
  }

  // Draw video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Convert to base64
  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Stop camera stream
 */
export function stopCameraStream(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
}

/**
 * Capture photo directly from webcam (auto-capture - old function)
 */
export async function captureFromWebcam(): Promise<CameraCaptureResult> {
  try {
    const { video, stream, error } = await startCameraPreview();
    
    if (error) {
      return { success: false, error };
    }

    // Wait a moment for camera to focus
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capture photo
    const base64Image = capturePhotoFromVideo(video);
    
    // Stop camera stream
    stopCameraStream(stream);
    
    return { 
      success: true, 
      imageBase64: base64Image 
    };
    
  } catch (error: any) {
    console.error('Camera capture error:', error);
    return {
      success: false,
      error: error.message || 'Unable to access camera. Please check permissions.'
    };
  }
}

/**
 * Check if camera is available and user has granted permission
 */
export async function checkCameraPermissions(): Promise<{
  supported: boolean;
  permissionGranted: boolean;
  message?: string;
}> {
  try {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { supported: false, permissionGranted: false, message: 'Browser not supported' };
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { supported: false, permissionGranted: false, message: 'Camera API not available' };
    }

    // Check permissions if available
    if (navigator.permissions && navigator.permissions.query) {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return {
        supported: true,
        permissionGranted: permission.state === 'granted',
        message: permission.state === 'granted' ? 'Camera access granted' : `Camera permission: ${permission.state}`
      };
    }

    // If permissions API not available, assume we can try
    return { supported: true, permissionGranted: false, message: 'Camera may require permission' };
  } catch (error) {
    return { 
      supported: false, 
      permissionGranted: false, 
      message: 'Unable to check camera permissions' 
    };
  }
}