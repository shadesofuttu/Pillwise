/**
 * Reads a File object and converts it into a base64 Data URL string.
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
