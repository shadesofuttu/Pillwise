export type AppState = "capture" | "loading" | "results";

export interface IdentifyRequest {
  imageBase64: string;
}

export interface IdentifyResponse {
  medicineName: string;
  rawText: string;
  isMedicine: boolean;
  strength?: string;
  activeIngredient?: string;
}

export interface ExplainRequest {
  medicineName: string;
  rawText: string;
  language?: string;
}

export interface ExplainResponse {
  purpose: string;
  dosageNote: string;
  precautions: string[];
  disclaimer: string;
}

export interface MedicineResult {
  medicineName: string;
  strength?: string;
  activeIngredient?: string;
  purpose: string;
  dosageNote: string;
  precautions: string[];
  disclaimer: string;
}