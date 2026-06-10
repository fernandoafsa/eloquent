'use client';

import React, { useState, useMemo } from 'react';
import { ELOQUENT_METHODS, runSimulation } from '../data/eloquentMethods';
import Sidebar from '../components/Sidebar';
import ControlPanel from '../components/ControlPanel';
import DatabaseVisualizer from '../components/DatabaseVisualizer';
import CodeTabs from '../components/CodeTabs';
import styles from './page.module.css';

export default function Home() {
  const [activeMethodId, setActiveMethodId] = useState<string>('find');
  
  // Track parameters for each method independently to preserve settings
  const [methodsParams, setMethodsParams] = useState<Record<string, Record<string, string | number | boolean>>>(() => {
    const initial: Record<string, Record<string, string | number | boolean>> = {};
    ELOQUENT_METHODS.forEach((m) => {
      const p: Record<string, string | number | boolean> = {};
      m.params.forEach((param) => {
        p[param.name] = param.defaultValue;
      });
      initial[m.id] = p;
    });
    return initial;
  });

  const activeMethod = useMemo(() => {
    return ELOQUENT_METHODS.find((m) => m.id === activeMethodId) || ELOQUENT_METHODS[0];
  }, [activeMethodId]);

  const currentParams = useMemo(() => {
    return methodsParams[activeMethodId] || {};
  }, [methodsParams, activeMethodId]);

  const handleParamChange = (name: string, value: string | number | boolean) => {
    setMethodsParams((prev) => ({
      ...prev,
      [activeMethodId]: {
        ...prev[activeMethodId],
        [name]: value,
      },
    }));
  };

  const simulationResult = useMemo(() => {
    return runSimulation(activeMethodId, currentParams);
  }, [activeMethodId, currentParams]);

  return (
    <div className={styles.container}>
      {/* Menu Lateral */}
      <Sidebar 
        activeMethodId={activeMethodId} 
        onSelectMethod={setActiveMethodId} 
      />

      {/* Workspace Principal */}
      <main className={styles.mainContent}>
        {/* Header Superior */}
        <header className={styles.topHeader}>
          <div>
            <h2 className={styles.title}>Modelos Laravel Eloquent Interactivos</h2>
            <p className={styles.subtitle}>
              Interactúa con los parámetros del modelo, observa el SQL generado y visualiza el comportamiento de la base de datos en tiempo real.
            </p>
          </div>
        </header>

        {/* Dashboard de Paneles */}
        <div className={styles.dashboardGrid}>
          {/* Columna Izquierda: Panel de Control del Método */}
          <div className={styles.leftColumn}>
            <ControlPanel 
              method={activeMethod} 
              params={currentParams} 
              onParamChange={handleParamChange} 
            />
          </div>

          {/* Columna Derecha: Simulación Visual de la Base de Datos */}
          <div className={styles.rightColumn}>
            <DatabaseVisualizer 
              methodId={activeMethodId} 
              simulationResult={simulationResult} 
            />
          </div>

          {/* Fila Inferior: Pestañas de Códigos y Documentación */}
          <div className={styles.bottomRow}>
            <CodeTabs 
              method={activeMethod} 
              params={currentParams} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
