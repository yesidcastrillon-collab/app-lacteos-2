export enum Eslabon {
  FINCA = "Finca (Producción Primaria)",
  TRANSFORMACION = "Transformación (Plantas)",
  TRANSPORTE = "Transporte y Distribución",
  CONSUMO = "Consumo Final"
}

export interface Question {
  eslabon: Eslabon;
  imagenDescripcion: string;
  pregunta: string;
  opciones: {
    id: string;
    texto: string;
  }[];
  respuestaCorrecta: string; // ID of the correct option
  retroalimentacionExito: string;
  retroalimentacionFallo: string;
}

export interface QuizState {
  currentEslabon: Eslabon | null;
  currentQuestion: Question | null;
  score: number;
  totalAnswered: number;
  lastAnswer: {
    isCorrect: boolean;
    selectedId: string;
  } | null;
}
