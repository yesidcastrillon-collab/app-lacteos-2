/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Milk, 
  Truck, 
  Factory, 
  ShoppingBasket, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight,
  ShieldCheck,
  Info,
  Loader2
} from 'lucide-react';
import { Eslabon, Question, QuizState } from './types';
import { generateQuestion } from './services/gemini';

export default function App() {
  const [state, setState] = useState<QuizState>({
    currentEslabon: null,
    currentQuestion: null,
    score: 0,
    totalAnswered: 0,
    lastAnswer: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (eslabon: Eslabon) => {
    setLoading(true);
    setError(null);
    try {
      const question = await generateQuestion(eslabon);
      setState(prev => ({
        ...prev,
        currentEslabon: eslabon,
        currentQuestion: question,
        lastAnswer: null
      }));
    } catch (err) {
      setError("Error al generar la pregunta. Por favor intente de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionId: string) => {
    if (!state.currentQuestion || state.lastAnswer) return;

    const isCorrect = optionId === state.currentQuestion.respuestaCorrecta;
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalAnswered: prev.totalAnswered + 1,
      lastAnswer: {
        isCorrect,
        selectedId: optionId
      }
    }));
  };

  const nextStep = () => {
    if (state.currentEslabon) {
      startQuiz(state.currentEslabon);
    }
  };

  const resetToMenu = () => {
    setState({
      currentEslabon: null,
      currentQuestion: null,
      score: 0,
      totalAnswered: 0,
      lastAnswer: null,
    });
  };

  const renderMenu = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-700" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-sans tracking-tight">
          LacteoExpert: Normatividad Colombiana
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Sistema Experto de evaluación y enseñanza sobre la trazabilidad de la leche, 
          basado exclusivamente en el Decreto 616 de 2006.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: Eslabon.FINCA, icon: Milk, color: "bg-blue-50 text-blue-700 border-blue-100", desc: "Producción primaria y buenas prácticas de ordeño." },
          { id: Eslabon.TRANSFORMACION, icon: Factory, color: "bg-purple-50 text-purple-700 border-purple-100", desc: "Requisitos para plantas de procesamiento y laboratorios." },
          { id: Eslabon.TRANSPORTE, icon: Truck, color: "bg-orange-50 text-orange-700 border-orange-100", desc: "Condiciones de transporte, enfriamiento y distribución." },
          { id: Eslabon.CONSUMO, icon: ShoppingBasket, color: "bg-rose-50 text-rose-700 border-rose-100", desc: "Envases, rotulado y comercialización final." },
        ].map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => startQuiz(item.id as Eslabon)}
            className={`flex items-start p-6 rounded-2xl border text-left transition-all hover:shadow-lg hover:-translate-y-1 group ${item.color}`}
          >
            <div className="p-3 rounded-xl bg-white shadow-sm mr-4">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 flex items-center">
                {item.id}
                <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm opacity-80">{item.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Nota Técnica
        </h4>
        <p className="text-sm text-slate-600">
          Esta herramienta evalúa el conocimiento técnico riguroso exigido por las autoridades sanitarias colombianas. 
          Cada respuesta está respaldada por los artículos vigentes del Decreto 616 de 2006.
        </p>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (!state.currentQuestion) return null;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={resetToMenu}
            className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Volver al Menú
          </button>
          <div className="px-4 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider">
            {state.currentEslabon}
          </div>
        </div>

        <motion.div 
          key={state.currentQuestion.pregunta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Visual Component Description */}
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#ffffff_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            </div>
            <div className="relative z-10">
              <p className="text-emerald-400 text-xs font-mono mb-2 uppercase tracking-[0.2em]">Referencia Visual</p>
              <p className="text-white text-lg italic font-serif opacity-90">
                "{state.currentQuestion.imagenDescripcion}"
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
              {state.currentQuestion.pregunta}
            </h2>

            <div className="space-y-4">
              {state.currentQuestion.opciones.map((opcion) => {
                const isSelected = state.lastAnswer?.selectedId === opcion.id;
                const isCorrect = state.currentQuestion?.respuestaCorrecta === opcion.id;
                const showResult = !!state.lastAnswer;

                let buttonClass = "w-full flex items-center p-5 rounded-2xl border-2 text-left transition-all ";
                if (!showResult) {
                  buttonClass += "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700";
                } else {
                  if (isCorrect) {
                    buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
                  } else if (isSelected) {
                    buttonClass += "border-rose-500 bg-rose-50 text-rose-900";
                  } else {
                    buttonClass += "border-slate-50 bg-slate-50 text-slate-400 opacity-50";
                  }
                }

                return (
                  <button
                    key={opcion.id}
                    disabled={showResult}
                    onClick={() => handleAnswer(opcion.id)}
                    className={buttonClass}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold ${
                      showResult && isCorrect ? 'bg-emerald-500 text-white' : 
                      showResult && isSelected ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {opcion.id}
                    </span>
                    <span className="flex-1 font-medium">{opcion.texto}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 ml-2" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500 ml-2" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {state.lastAnswer && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-8 p-6 rounded-2xl border ${
                    state.lastAnswer.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
                  }`}
                >
                  <div className="flex items-start">
                    {state.lastAnswer.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600 mr-3 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${
                        state.lastAnswer.isCorrect ? 'text-emerald-900' : 'text-rose-900'
                      }`}>
                        {state.lastAnswer.isCorrect ? '¡Correcto!' : 'Incorrecto'}
                      </h4>
                      <p className={`text-sm leading-relaxed ${
                        state.lastAnswer.isCorrect ? 'text-emerald-800' : 'text-rose-800'
                      }`}>
                        {state.lastAnswer.isCorrect 
                          ? state.currentQuestion.retroalimentacionExito 
                          : state.currentQuestion.retroalimentacionFallo}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      Continuar al siguiente paso
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button
                      onClick={resetToMenu}
                      className="flex-1 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      Saltar a otro eslabón
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Puntaje</p>
            <p className="text-2xl font-mono font-bold text-slate-800">{state.score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Respondidas</p>
            <p className="text-2xl font-mono font-bold text-slate-800">{state.totalAnswered}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={resetToMenu}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Milk className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">LacteoExpert</span>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Decreto 616 de 2006</span>
            <span className="mx-2">•</span>
            <span>Inocuidad Alimentaria</span>
          </div>
        </div>
      </nav>

      <main>
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Consultando normatividad técnica...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-rose-100 text-center">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Error de Conexión</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={resetToMenu}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : state.currentEslabon ? (
          renderQuiz()
        ) : (
          renderMenu()
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>© 2026 LacteoExpert - Autoridad Sanitaria Educativa</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-600 cursor-pointer">Términos Técnicos</span>
            <span className="hover:text-slate-600 cursor-pointer">Guía de BPH</span>
            <span className="hover:text-slate-600 cursor-pointer">Contacto ICA/INVIMA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
