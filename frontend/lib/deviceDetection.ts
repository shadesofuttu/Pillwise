/**
 * Device detection utilities for camera and mobile capabilities
 */

/**
 * Check if the device is likely mobile
 */
export function isLikelyMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent);
}

/**
 * Check if the browser supports camera access via getUserMedia
 */
export async function supportsCameraAccess(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  // Check for mediaDevices API support
  if (!('mediaDevices' in navigator)) return false;
  if (!('getUserMedia' in navigator.mediaDevices)) return false;
  
  return true;
}

/**
 * Get appropriate camera instruction text based on device
 */
export function getCameraInstruction(): string {
  if (isLikelyMobile()) {
    return 'Tap to open camera';
  } else {
    return 'Click to open camera (uses webcam)';
  }
}

/**
 * Get camera mode preference - mobile uses capture attribute, desktop uses getUserMedia
 */
export function getCameraMode(): 'capture' | 'getusermedia' {
  return isLikelyMobile() ? 'capture' : 'getusermedia';
}
