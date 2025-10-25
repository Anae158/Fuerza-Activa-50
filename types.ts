
export interface Ejercicio {
  nombre: string;
  duracion: string;
  descripcion: string;
}

export interface Bloque {
  titulo: string;
  frase_motivadora: string;
  ejercicios: Ejercicio[];
}

export interface Plan {
  bloques: Bloque[];
}

export type Nivel = 'Nivel 1: Iniciación' | 'Nivel 2: Medio' | 'Nivel 3: Avanzado';

export interface HistoryEntry {
  date: string; // YYYY-MM-DD
  level: Nivel;
}
