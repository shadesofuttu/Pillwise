import { IdentifyResponse, ExplainResponse } from '@/types/medicine';

const API_URL = "http://127.0.0.1:8000";

export async function identifyMedicine(imageBase64: string): Promise<IdentifyResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const res = await fetch(`${API_URL}/api/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Identify API error:', errorText);
      throw new Error(`Failed to identify medicine: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
}

export async function explainMedicine(
  identifiedData: IdentifyResponse,
  language: string = "English"
): Promise<ExplainResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const res = await fetch(`${API_URL}/api/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        medicineName: identifiedData.medicineName,
        rawText: identifiedData.rawText,
        language: language,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Explain API error:', errorText);
      throw new Error(`Failed to explain medicine: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
}