import React from 'react';
import { EloquentMethod } from '../data/eloquentMethods';
import styles from './styles/ControlPanel.module.css';

interface ControlPanelProps {
  method: EloquentMethod;
  params: Record<string, string | number | boolean>;
  onParamChange: (name: string, value: string | number | boolean) => void;
}

export default function ControlPanel({ method, params, onParamChange }: ControlPanelProps) {
  // Helper to generate the exact PHP line of code for the control panel display
  const generateEloquentCode = () => {
    switch (method.id) {
      case 'find':
        return params.fail 
          ? `User::findOrFail(${params.id || 1});` 
          : `User::find(${params.id || 1});`;
      case 'where':
        const opStr = params.operator === '=' ? '' : `, '${params.operator}'`;
        return `User::where('${params.column || 'status'}'${opStr}, '${params.value || ''}')->get();`;
      case 'firstOrCreate':
        return `User::firstOrCreate(
    ['email' => '${params.email || ''}'],
    ['name' => '${params.name || ''}']
);`;
      case 'updateOrCreate':
        return `User::updateOrCreate(
    ['email' => '${params.email || ''}'],
    ['status' => '${params.status || ''}']
);`;
      case 'with':
        return params.eager 
          ? `User::with('posts')->get(); // Optimizado (2 consultas)`
          : `User::all(); // N+1 Problem (1 consulta + N consultas en vista)\nforeach ($users as $user) {\n    $posts = $user->posts; // Carga diferida lenta\n}`;
      case 'whereHas':
        return `User::whereHas('posts', function ($query) {
    $query->where('likes', '>=', ${params.minLikes ?? 50});
})->get();`;
      case 'paginate':
        return `User::paginate(${params.perPage || 2}); // Página actual: ${params.page || 1}`;
      case 'chunk':
        return params.methodType === 'chunk'
          ? `User::chunk(2, function ($users) {
    foreach ($users as $user) {
        // Lote de 2 usuarios en memoria
    }
});`
          : `foreach (User::cursor() as $user) {
    // 1 usuario instanciado a la vez
}`;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.panel} glass`}>
      <div className={styles.header}>
        <div className={styles.methodBadge}>{method.category.toUpperCase()}</div>
        <h2 className={styles.methodName}>{method.name}</h2>
        <p className={styles.description}>{method.shortDescription}</p>
      </div>

      <div className={styles.sectionTitle}>CONFIGURA LOS PARÁMETROS</div>
      <div className={styles.controlsGrid}>
        {method.params.map((param) => {
          const val = params[param.name] ?? param.defaultValue;
          
          return (
            <div key={param.name} className={styles.controlGroup}>
              <label className={styles.label}>{param.label}</label>
              
              {param.type === 'select' && (
                <div className={styles.selectWrapper}>
                  <select
                    value={val as string}
                    onChange={(e) => onParamChange(param.name, e.target.value)}
                    className={styles.select}
                  >
                    {param.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {param.type === 'number' && (
                <div className={styles.numberInputWrapper}>
                  <input
                    type="range"
                    min={param.min ?? 1}
                    max={param.max ?? 10}
                    value={val as number}
                    onChange={(e) => onParamChange(param.name, Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                  <span className={styles.numberValue}>{val}</span>
                </div>
              )}

              {param.type === 'text' && (
                <input
                  type="text"
                  value={val as string}
                  onChange={(e) => onParamChange(param.name, e.target.value)}
                  className={styles.textInput}
                />
              )}

              {param.type === 'boolean' && (
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={val as boolean}
                    onChange={(e) => onParamChange(param.name, e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.codeOutputContainer}>
        <div className={styles.codeHeader}>
          <span className={styles.codeTitle}>Laravel Eloquent Executed</span>
          <span className={styles.phpBadge}>PHP</span>
        </div>
        <pre className={styles.codeContent}>
          <code>{generateEloquentCode()}</code>
        </pre>
      </div>
    </div>
  );
}
