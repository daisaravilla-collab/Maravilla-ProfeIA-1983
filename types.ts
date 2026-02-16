export enum CampoFormativo {
  LENGUAJES = 'Lenguajes',
  SABERES = 'Saberes y Pensamiento Científico',
  ETICA = 'Ética, Naturaleza y Sociedades',
  HUMANO = 'De lo Humano y lo Comunitario',
}

export enum GradoSecundaria {
  PRIMERO = '1er Grado',
  SEGUNDO = '2do Grado',
  TERCERO = '3er Grado',
}

export enum Metodologia {
  ABP = 'Aprendizaje Basado en Proyectos Comunitarios',
  STEAM = 'STEAM como enfoque',
  AS = 'Aprendizaje de Servicio',
  ABProblemas = 'Aprendizaje Basado en Problemas',
}

export interface ProjectData {
  docente: string;
  campoFormativo: CampoFormativo | '';
  disciplina: string;
  grado: GradoSecundaria | '';
  metodologia: Metodologia | '';
  nombreProyecto: string;
  problematizacion: string;
  productoFinal: string;
  numSesiones: number;
}
