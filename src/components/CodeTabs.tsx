import React, { useState } from 'react';
import { EloquentMethod } from '../data/eloquentMethods';
import styles from './styles/CodeTabs.module.css';

interface CodeTabsProps {
  method: EloquentMethod;
  params: Record<string, string | number | boolean>;
}

type TabType = 'controller' | 'livewire' | 'explanation';

export default function CodeTabs({ method, params }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('controller');
  const [livewireSubTab, setLivewireSubTab] = useState<'class' | 'view'>('class');

  const controllerCode = method.controllerExample(params);
  const livewireClass = method.livewireExample(params);
  const livewireView = method.livewireViewExample ? method.livewireViewExample(params) : '';

  return (
    <div className={`${styles.container} glass`}>
      {/* Tab Navigation */}
      <div className={styles.tabHeader}>
        <div className={styles.tabsList}>
          <button
            onClick={() => setActiveTab('controller')}
            className={`${styles.tabButton} ${activeTab === 'controller' ? styles.activeTab : ''}`}
          >
            Controller
          </button>
          <button
            onClick={() => setActiveTab('livewire')}
            className={`${styles.tabButton} ${activeTab === 'livewire' ? styles.activeTab : ''}`}
          >
            Componente Livewire
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`${styles.tabButton} ${activeTab === 'explanation' ? styles.activeTab : ''}`}
          >
            Explicación y Buenas Prácticas
          </button>
        </div>
        
        {/* Conditional Sub-tabs for Livewire */}
        {activeTab === 'livewire' && livewireView && (
          <div className={styles.subTabsList}>
            <button
              onClick={() => setLivewireSubTab('class')}
              className={`${styles.subTabButton} ${livewireSubTab === 'class' ? styles.activeSubTab : ''}`}
            >
              Clase Componente (.php)
            </button>
            <button
              onClick={() => setLivewireSubTab('view')}
              className={`${styles.subTabButton} ${livewireSubTab === 'view' ? styles.activeSubTab : ''}`}
            >
              Vista Blade (.blade.php)
            </button>
          </div>
        )}
      </div>

      {/* Tab Content Panels */}
      <div className={styles.tabContent}>
        {activeTab === 'controller' && (
          <div className={styles.codeWrapper}>
            <div className={styles.fileHeader}>
              <span className={styles.fileName}>app/Http/Controllers/UserController.php</span>
              <span className={styles.langTag}>PHP</span>
            </div>
            <pre className={styles.codeBlock}>
              <code>{controllerCode}</code>
            </pre>
          </div>
        )}

        {activeTab === 'livewire' && (
          <div className={styles.codeWrapper}>
            {livewireSubTab === 'class' ? (
              <>
                <div className={styles.fileHeader}>
                  <span className={styles.fileName}>app/Livewire/UserProfile.php</span>
                  <span className={styles.langTag}>PHP</span>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{livewireClass}</code>
                </pre>
              </>
            ) : (
              <>
                <div className={styles.fileHeader}>
                  <span className={styles.fileName}>resources/views/livewire/user-profile.blade.php</span>
                  <span className={styles.langTag}>BLADE</span>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{livewireView}</code>
                </pre>
              </>
            )}
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className={styles.explanationContent}>
            <h3 className={styles.explanationTitle}>¿Para qué sirve?</h3>
            <p className={styles.explanationText}>{method.explanation}</p>
            
            <div className={styles.tipsSection}>
              <h4 className={styles.tipsTitle}>
                <svg className={styles.tipsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Consejos de Rendimiento e Implementación
              </h4>
              <ul className={styles.tipsList}>
                {method.id === 'with' && (
                  <>
                    <li>Utiliza siempre eager loading (`with`) en vistas que iteren sobre relaciones.</li>
                    <li>Si la carga es condicional, puedes usar el método `load()` diferido en el controlador.</li>
                    <li>Para optimizar el uso de RAM, puedes especificar qué columnas traer de la relación: `User::with(&#39;posts:id,user_id,title&#39;)-&gt;get()`.</li>
                  </>
                )}
                {method.id === 'whereHas' && (
                  <>
                    <li>`whereHas` utiliza consultas `EXISTS` en SQL, que son eficientes en la mayoría de motores relacionales.</li>
                    <li>Si solo te interesa comprobar si hay alguna relación sin filtros adicionales, utiliza `has(&#39;posts&#39;)` para un mejor rendimiento.</li>
                    <li>En tablas de relaciones extremadamente grandes, asegúrate de tener índices en las claves foráneas (ej. `posts.user_id`).</li>
                  </>
                )}
                {method.id === 'find' && (
                  <>
                    <li>Evita usar `find` en bucles; en su lugar, utiliza `whereIn(&#39;id&#39;, $ids)-&gt;get()` para traer los registros en una sola consulta.</li>
                    <li>El método `findOrFail` lanza una excepción HTTP 404 automática si se captura mediante el manejador global de Laravel.</li>
                  </>
                )}
                {method.id === 'where' && (
                  <>
                    <li>Asegúrate de agregar índices en tu archivo de migración para columnas que filtres con frecuencia mediante `where` (ej. `status`).</li>
                    <li>Puedes encadenar múltiples métodos `where` secuenciales, lo que se traducirá como operadores `AND` en la consulta SQL final.</li>
                    <li>Utiliza `orWhere` con precaución, y prefiérelo agrupado en clausuras lógicas para evitar romper prioridades lógicas de tu query.</li>
                  </>
                )}
                {method.id === 'firstOrCreate' && (
                  <>
                    <li>Es seguro contra condiciones de carrera simples, pero ante alta concurrencia de inserciones simultáneas puede fallar a menos que configures un índice único de base de datos.</li>
                    <li>El atributo `$model-&gt;wasRecentlyCreated` retornará `true` si el modelo se insertó, y `false` si ya existía.</li>
                  </>
                )}
                {method.id === 'updateOrCreate' && (
                  <>
                    <li>Muy útil para APIs de sincronización donde los datos se actualizan periódicamente.</li>
                    <li>Al igual que `firstOrCreate`, realiza un select y luego un insert o update condicional.</li>
                  </>
                )}
                {method.id === 'paginate' && (
                  <>
                    <li>`paginate()` realiza una consulta `COUNT(*)` adicional. En tablas con millones de registros, esto puede ser lento.</li>
                    <li>Considera usar `simplePaginate()` si no requieres mostrar el número total de páginas; es más rápido ya que solo consulta un registro extra para saber si existe una página siguiente sin contar el total.</li>
                  </>
                )}
                {method.id === 'chunk' && (
                  <>
                    <li>Utiliza `chunk()` cuando proceses miles de registros que requieran escritura o envío de emails para no saturar el buffer de RAM.</li>
                    <li>Si actualizas registros dentro del callback de `chunk` que alteran la misma condición de filtrado, utiliza `chunkById` para evitar omitir registros accidentalmente debido al desfase del OFFSET.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
