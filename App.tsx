import React, { useState } from 'react';
import { ProjectForm } from './components/ProjectForm';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ProjectData } from './types';
import { generateEducationalPlan } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async (data: ProjectData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Small artificial delay to ensure smooth UI transition and reassure the user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const generatedContent = await generateEducationalPlan(data);
      setResult(generatedContent);
      
      // Scroll to top of results smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al generar la planeación.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-nem-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Maravilla ProfeIA</h1>
              <p className="text-xs text-primary-100 font-medium">Asistente de Planeación NEM Secundaria</p>
            </div>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors font-medium"
            >
              Nueva Planeación
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Dynamic Layout based on state */}
        <div className={`transition-all duration-500 ease-in-out ${result ? 'hidden' : 'block'}`}>
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido(a) a tu motor pedagógico</h2>
            <p className="text-gray-600">
              Completa los datos de tu proyecto y Maravilla ProfeIA generará una planeación estructurada, 
              evaluaciones y actividades alineadas al Plan de Estudios 2022 de la Nueva Escuela Mexicana.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
             <ProjectForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
        </div>

        {/* Loading Overlay State (when generating but not hiding form entirely yet if we didn't want to, but we hide it) */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold text-primary">Estructurando conocimientos...</h3>
            <p className="text-gray-500 mt-2">Construyendo tablas, diseñando rúbricas y actividades lúdicas.</p>
          </div>
        )}

        {/* Result Display */}
        {result && !isLoading && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-10 animate-fade-in-up">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-secondary flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Planeación Generada con Éxito
              </h2>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert("¡Planeación copiada al portapapeles!");
                }}
                className="flex items-center text-sm font-medium text-primary hover:text-teal-800 bg-teal-50 px-3 py-2 rounded-md transition-colors border border-teal-100"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copiar Markdown
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <MarkdownRenderer content={result} />
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Maravilla ProfeIA. Herramienta de apoyo docente alineada a la NEM.</p>
        <p className="mt-1 text-xs opacity-75">Los resultados generados por IA deben ser revisados y adaptados por el docente titular.</p>
      </footer>
    </div>
  );
};

export default App;