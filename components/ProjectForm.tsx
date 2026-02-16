import React, { useState } from 'react';
import { CampoFormativo, GradoSecundaria, Metodologia, ProjectData } from '../types';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';

interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProjectData>({
    docente: '',
    campoFormativo: '',
    disciplina: '',
    grado: '',
    metodologia: '',
    nombreProyecto: '',
    problematizacion: '',
    productoFinal: '',
    numSesiones: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numSesiones' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = Object.values(formData).every((val) => val !== '' && val !== 0);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Input
          label="Nombre del Docente"
          name="docente"
          value={formData.docente}
          onChange={handleChange}
          placeholder="Ej. Prof. Juan Pérez"
          required
        />
        
        <Select
          label="Campo Formativo"
          name="campoFormativo"
          value={formData.campoFormativo}
          onChange={handleChange}
          options={Object.values(CampoFormativo).map(c => ({ value: c, label: c }))}
          required
        />

        <Input
          label="Disciplina"
          name="disciplina"
          value={formData.disciplina}
          onChange={handleChange}
          placeholder="Ej. Biología, Historia, Matemáticas"
          required
        />

        <Select
          label="Grado"
          name="grado"
          value={formData.grado}
          onChange={handleChange}
          options={Object.values(GradoSecundaria).map(g => ({ value: g, label: g }))}
          required
        />

        <Select
          label="Metodología"
          name="metodologia"
          value={formData.metodologia}
          onChange={handleChange}
          options={Object.values(Metodologia).map(m => ({ value: m, label: m }))}
          required
        />

        <Input
          label="Nombre del Proyecto"
          name="nombreProyecto"
          value={formData.nombreProyecto}
          onChange={handleChange}
          placeholder="Ej. Cuidando nuestro entorno"
          required
        />

        <Input
          label="Número de Sesiones"
          name="numSesiones"
          type="number"
          min="1"
          max="30"
          value={formData.numSesiones}
          onChange={handleChange}
          required
        />

        <Input
          label="Producto Final Esperado"
          name="productoFinal"
          value={formData.productoFinal}
          onChange={handleChange}
          placeholder="Ej. Feria de ciencias, Periódico mural"
          required
        />
      </div>

      <Textarea
        label="Problematización (Contexto del problema)"
        name="problematizacion"
        value={formData.problematizacion}
        onChange={handleChange}
        placeholder="Describa brevemente el problema de la comunidad o contexto escolar que se busca atender..."
        className="mt-2"
        required
      />

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center min-w-[200px]
            ${isFormValid && !isLoading 
              ? 'bg-primary hover:bg-teal-800 hover:shadow-lg active:scale-95' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando Planeación...
            </>
          ) : (
            'Generar Planeación'
          )}
        </button>
      </div>
    </form>
  );
};
